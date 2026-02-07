FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir . 2>/dev/null || pip install --no-cache-dir fastapi uvicorn[standard] google-generativeai redis elasticsearch[async] kafka-python-ng pydantic pydantic-settings opentelemetry-api opentelemetry-sdk prometheus-fastapi-instrumentator structlog httpx numpy
COPY . .
RUN useradd -m -r appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8100
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8100"]
