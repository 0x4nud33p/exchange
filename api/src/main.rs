use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use tracing_subscriber;
use db::establish_pool;

mod routes;

async fn health() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({ "status": "ok" }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = establish_pool();

    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();

    let addr = "127.0.0.1:3000";
    tracing::info!("🚀 API running at http://{}", addr);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/health", web::get().to(health))
            .configure(routes::init)
    })
    .bind(addr)?
    .run()
    .await
}
