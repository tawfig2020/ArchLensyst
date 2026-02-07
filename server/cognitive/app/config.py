from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "development"
    app_port: int = 8100
    redis_addr: str = "localhost:6379"
    google_ai_key: str = ""
    elasticsearch_url: str = "http://localhost:9200"
    otel_exporter_otlp_endpoint: str = "localhost:4317"

    model_config = {"env_prefix": "", "case_sensitive": False}


settings = Settings()
