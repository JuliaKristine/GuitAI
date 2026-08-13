from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.config import get_settings
from app.routes.config import (
    router as config_router,
)
from app.routes.health import (
    router as health_router,
)
from app.routes.songs import (
    router as songs_router,
)


settings = get_settings()


app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        settings.cors_origin_list
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "status": "online",
        "environment": settings.app_env,
        "docs": "/docs",
    }


app.include_router(
    health_router
)

app.include_router(
    songs_router
)

app.include_router(
    config_router
)