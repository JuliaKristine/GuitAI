from fastapi import (
    APIRouter,
    HTTPException,
    Query,
)

from app.config import (
    get_settings,
)

from app.schemas.spotify import (
    SpotifyTrackSearchResponse,
)

from app.services.spotify_service import (
    SpotifyApiError,
    SpotifyAuthenticationError,
    SpotifyConfigurationError,
    get_spotify_access_token,
    search_spotify_tracks,
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


@router.get(
    "/search",
    response_model=(
        SpotifyTrackSearchResponse
    ),
)
async def spotify_search(
    q: str = Query(
        min_length=1,
        max_length=100,
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=10,
    ),
):
    settings = get_settings()

    try:
        results = (
            await search_spotify_tracks(
                query=q,
                market=(
                    settings.spotify_market
                ),
                limit=limit,
            )
        )

    except SpotifyConfigurationError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error

    except SpotifyAuthenticationError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error

    except SpotifyApiError as error:
        raise HTTPException(
            status_code=(
                error.status_code
            ),
            detail=str(error),
        ) from error

    return SpotifyTrackSearchResponse(
        query=q,
        count=len(results),
        items=results,
    )