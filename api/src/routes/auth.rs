use crate::utils::jwt::{create_jwt, verify_jwt};
use actix_web::{HttpResponse, web};
use bcrypt::{hash, verify};
use db::DbPool;
use db::models::{NewUser, User};
use db::schema::users::dsl::*;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use tracing::{error, info, warn};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub user_id: Uuid,
    pub token: String,
}

async fn register(pool: web::Data<DbPool>, req: web::Json<RegisterRequest>) -> HttpResponse {
    info!("Register attempt for username: {}", req.username);
    let mut conn = match pool.get() {
        Ok(c) => c,
        Err(_) => return HttpResponse::InternalServerError().body("DB connection error"),
    };

    let hashed = hash(&req.password, 12).unwrap();

    let new_user = NewUser {
        username: req.username.clone(),
        password_hash: hashed,
    };

    let inserted: Result<User, _> = diesel::insert_into(users)
        .values(&new_user)
        .get_result(&mut conn);

    match inserted {
        Ok(user) => {
            info!("✅ User registered: {}", user.username);
            let token = create_jwt(user.id).unwrap_or_default();
            HttpResponse::Ok().json(AuthResponse {
                user_id: user.id,
                token,
            })
        }
        Err(diesel::result::Error::DatabaseError(
            diesel::result::DatabaseErrorKind::UniqueViolation,
            _,
        )) => {
            warn!("User registration failed: {}", req.username);
            HttpResponse::Conflict().body("User already exists")
        }
        Err(_) => {
            error!("User registration failed: {}", req.username);
            HttpResponse::InternalServerError().finish()
        }
    }
}

async fn login(pool: web::Data<DbPool>, req: web::Json<RegisterRequest>) -> HttpResponse {
    info!("Login attempt for username: {}", req.username);
    let mut conn = match pool.get() {
        Ok(c) => c,
        Err(_) => return HttpResponse::InternalServerError().body("DB connection error"),
    };

    let user = users
        .filter(username.eq(&req.username))
        .first::<User>(&mut conn);

    match user {
        Ok(u) => {
            if verify(&req.password, &u.password_hash).unwrap_or(false) {
                info!("✅ User logged in: {}", u.username);
                let token = create_jwt(u.id).unwrap_or_default();
                HttpResponse::Ok().json(AuthResponse {
                    user_id: u.id,
                    token,
                })
            } else {
                warn!("User login failed: {}", req.username);
                HttpResponse::Unauthorized().body("Invalid credentials")
            }
        }
        Err(_) => HttpResponse::Unauthorized().body("Invalid credentials"),
    }
}

async fn me(req: actix_web::HttpRequest) -> HttpResponse {
    info!("Me request received");
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let token = auth_header
        .unwrap()
        .to_str()
        .unwrap_or("")
        .replace("Bearer ", "");
    match verify_jwt(&token) {
        Ok(claims) => HttpResponse::Ok().json(serde_json::json!({ "user_id": claims.sub })),
        Err(_) => HttpResponse::Unauthorized().finish(),
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/register", web::post().to(register))
            .route("/login", web::post().to(login))
            .route("/me", web::get().to(me)),
    );
}
