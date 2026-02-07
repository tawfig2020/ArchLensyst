use std::pin::Pin;
use std::time::Instant;

use tokio_stream::Stream;
use tonic::{Request, Response, Status, Streaming};
use tracing::info;
use uuid::Uuid;

use crate::parser_proto::*;

pub struct ParserServiceImpl;

impl ParserServiceImpl {
    pub fn new() -> Self {
        Self
    }

    fn get_supported_languages_list() -> Vec<LanguageInfo> {
        vec![
            LanguageInfo {
                name: "TypeScript".into(),
                extensions: vec![".ts".into(), ".tsx".into()],
                parser_version: "0.20.0".into(),
            },
            LanguageInfo {
                name: "JavaScript".into(),
                extensions: vec![".js".into(), ".jsx".into(), ".mjs".into()],
                parser_version: "0.20.0".into(),
            },
            LanguageInfo {
                name: "Python".into(),
                extensions: vec![".py".into(), ".pyi".into()],
                parser_version: "0.20.0".into(),
            },
            LanguageInfo {
                name: "Rust".into(),
                extensions: vec![".rs".into()],
                parser_version: "0.20.0".into(),
            },
            LanguageInfo {
                name: "Go".into(),
                extensions: vec![".go".into()],
                parser_version: "0.20.0".into(),
            },
            LanguageInfo {
                name: "Java".into(),
                extensions: vec![".java".into()],
                parser_version: "0.20.0".into(),
            },
        ]
    }
}

#[tonic::async_trait]
impl parser_service_server::ParserService for ParserServiceImpl {
    async fn parse_file(
        &self,
        request: Request<ParseRequest>,
    ) -> Result<Response<ParseResponse>, Status> {
        let req = request.into_inner();
        let start = Instant::now();

        info!(
            file_id = %req.file_id,
            file_path = %req.file_path,
            language = %req.language,
            "parsing file"
        );

        // TODO: Use tree-sitter to parse the actual content
        // For now, return a placeholder response
        let lines: Vec<&str> = req.content.lines().collect();
        let total_lines = lines.len() as u32;
        let code_lines = lines.iter().filter(|l| !l.trim().is_empty() && !l.trim().starts_with("//")).count() as u32;
        let comment_lines = lines.iter().filter(|l| l.trim().starts_with("//") || l.trim().starts_with("/*")).count() as u32;
        let blank_lines = lines.iter().filter(|l| l.trim().is_empty()).count() as u32;

        let elapsed = start.elapsed().as_secs_f64() * 1000.0;

        let response = ParseResponse {
            file_id: req.file_id,
            file_path: req.file_path,
            language: req.language,
            root: Some(AstNode {
                kind: "program".into(),
                text: String::new(),
                start_line: 0,
                start_col: 0,
                end_line: total_lines,
                end_col: 0,
                children: vec![],
            }),
            dependencies: vec![],
            exports: vec![],
            metrics: Some(ParseMetrics {
                total_lines,
                code_lines,
                comment_lines,
                blank_lines,
                complexity: 0,
                parse_time_ms: elapsed,
            }),
            error: String::new(),
        };

        Ok(Response::new(response))
    }

    type ParseBatchStream = Pin<Box<dyn Stream<Item = Result<ParseResponse, Status>> + Send>>;

    async fn parse_batch(
        &self,
        request: Request<Streaming<ParseRequest>>,
    ) -> Result<Response<Self::ParseBatchStream>, Status> {
        let mut stream = request.into_inner();
        let (tx, rx) = tokio::sync::mpsc::channel(128);

        tokio::spawn(async move {
            while let Ok(Some(req)) = stream.message().await {
                info!(file_id = %req.file_id, "batch parsing file");

                let lines: Vec<&str> = req.content.lines().collect();
                let total_lines = lines.len() as u32;

                let response = ParseResponse {
                    file_id: req.file_id,
                    file_path: req.file_path,
                    language: req.language,
                    root: Some(AstNode {
                        kind: "program".into(),
                        text: String::new(),
                        start_line: 0,
                        start_col: 0,
                        end_line: total_lines,
                        end_col: 0,
                        children: vec![],
                    }),
                    dependencies: vec![],
                    exports: vec![],
                    metrics: Some(ParseMetrics {
                        total_lines,
                        code_lines: total_lines,
                        comment_lines: 0,
                        blank_lines: 0,
                        complexity: 0,
                        parse_time_ms: 0.0,
                    }),
                    error: String::new(),
                };

                if tx.send(Ok(response)).await.is_err() {
                    break;
                }
            }
        });

        let output = tokio_stream::wrappers::ReceiverStream::new(rx);
        Ok(Response::new(Box::pin(output)))
    }

    async fn extract_skeleton(
        &self,
        request: Request<ParseRequest>,
    ) -> Result<Response<SkeletonResponse>, Status> {
        let req = request.into_inner();
        info!(file_id = %req.file_id, "extracting skeleton");

        // TODO: extract public API surface using tree-sitter
        let response = SkeletonResponse {
            file_id: req.file_id,
            file_path: req.file_path,
            skeleton: "// Skeleton extraction pending tree-sitter integration".into(),
            public_api: vec![],
        };

        Ok(Response::new(response))
    }

    async fn get_supported_languages(
        &self,
        _request: Request<Empty>,
    ) -> Result<Response<LanguagesResponse>, Status> {
        Ok(Response::new(LanguagesResponse {
            languages: Self::get_supported_languages_list(),
        }))
    }
}
