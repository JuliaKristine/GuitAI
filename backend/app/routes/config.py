from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
)

from app.config import (
    Settings,
    get_settings,
)


router = APIRouter(
    prefix="/config",
    tags=["Config"],
)


@router.get("/status")
def config_status(
    settings: Annotated[
        Settings,
        Depends(get_settings),
    ],
):
    return {
        "app_name": settings.app_name,
        "environment": settings.app_env,
        "spotify_configured": (
            settings.spotify_configured
        ),
    }