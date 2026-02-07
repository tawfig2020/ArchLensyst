FROM rust:1.76-slim AS builder
RUN apt-get update && apt-get install -y pkg-config libssl-dev cmake protobuf-compiler && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
RUN useradd -m -r appuser
COPY --from=builder /app/target/release/archlens-parser /usr/local/bin/archlens-parser
USER appuser
EXPOSE 50051
ENTRYPOINT ["archlens-parser"]
