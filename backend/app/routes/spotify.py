from fastapi import (
    APIRouter,
    HTTPException,
)

from app.config import get_settings

from app.services.spotify_service import (
    SpotifyAuthenticationError,
    SpotifyConfigurationError,
    get_spotify_access_token,
)


router = APIRouter(
    prefix="/spotify",
    tags=["Spotify"],
)


@router.get("/status")
async def spotify_status():
    settings = get_settings()

    if not settings.spotify_configured:
        return {
            "configured": False,
            "authenticated": False,
            "message": (
                "Credenciais do Spotify "
                "não configuradas."
            ),
        }

    try:
        await get_spotify_access_token()

    except SpotifyConfigurationError as error:
        return {
            "configured": False,
            "authenticated": False,
            "message": str(error),
        }

    except SpotifyAuthenticationError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error

    return {
        "configured": True,
        "authenticated": True,
        "message": (
            "Spotify conectado "
            "com sucesso."
        ),
    }