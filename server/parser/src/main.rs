use std::env;
use tonic::transport::Server;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

mod service;

pub mod parser_proto {
    tonic::include_proto!("archlens.parser");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    let port = env::var("GRPC_PORT").unwrap_or_else(|_| "50051".to_string());
    let addr = format!("0.0.0.0:{}", port).parse()?;

    let parser_service = service::ParserServiceImpl::new();

    info!("ArchLens Parser Service starting on {}", addr);

    Server::builder()
        .add_service(parser_proto::parser_service_server::ParserServiceServer::new(parser_service))
        .serve(addr)
        .await?;

    Ok(())
}
