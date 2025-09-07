use actix_web::web;

pub mod auth;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api/v1").configure(auth::init));
}
