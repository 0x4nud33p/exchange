use actix_web::{web, HttpResponse};
use diesel::prelude::*;
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use crate::db::{DbPool, models::{User, NewUser}, schema::users::dsl::*};
use bcrypt::{hash, verify};
use jsonwebtoken::{encode, decode, Header, EncodingKey, DecodingKey, Validation, errors::Error as JwtError};
use std::env;

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

#[derive(Serialize, Deserialize)]
struct Claims {
    pub sub: Uuid,
    pub exp: usize,
}

fn create_jwt(user_id: Uuid) -> Result<String, JwtError> {
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims { sub: user_id, exp: expiration };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
}

fn verify_jwt(token: &str) -> Result<Claims, JwtError> {
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());
    decode::<Claims>(token, &DecodingKey::from_secret(secret.as_ref()), &Validation::default())
        .map(|data| data.claims)
}

async fn register(pool: web::Data<DbPool>, req: web::Json<RegisterRequest>) -> HttpResponse {
    let conn = match pool.get() {
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
        .get_result(&conn);

    match inserted {
        Ok(user) => {
            let token = create_jwt(user.id).unwrap_or_default();
            HttpResponse::Ok().json(AuthResponse { user_id: user.id, token })
        },
        Err(diesel::result::Error::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _)) => {
            HttpResponse::Conflict().body("User already exists")
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

async fn login(pool: web::Data<DbPool>, req: web::Json<RegisterRequest>) -> HttpResponse {
    let conn = match pool.get() {
        Ok(c) => c,
        Err(_) => return HttpResponse::InternalServerError().body("DB connection error"),
    };

    let user = users.filter(username.eq(&req.username))
        .first::<User>(&conn);

    match user {
        Ok(u) => {
            if verify(&req.password, &u.password_hash).unwrap_or(false) {
                let token = create_jwt(u.id).unwrap_or_default();
                HttpResponse::Ok().json(AuthResponse { user_id: u.id, token })
            } else {
                HttpResponse::Unauthorized().body("Invalid credentials")
            }
        },
        Err(_) => HttpResponse::Unauthorized().body("Invalid credentials"),
    }
}

async fn me(req: actix_web::HttpRequest) -> HttpResponse {
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    let token = auth_header.unwrap().to_str().unwrap_or("").replace("Bearer ", "");
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
