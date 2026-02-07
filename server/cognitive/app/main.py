from contextlib import asynccontextmanager
from datetime import datetime, timezone

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.routers import analysis, embeddings, health

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("cognitive_service_starting", env=settings.app_env)
    # TODO: init Redis, Elasticsearch, Gemini client connections
    yield
    logger.info("cognitive_service_shutting_down")


app = FastAPI(
    title="ArchLens Cognitive Service",
    description="AI-powered architectural analysis using Gemini 2.0",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)

app.include_router(health.router)
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(embeddings.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "service": "archlens-cognitive",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
