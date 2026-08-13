import time

import httpx

from app.config import get_settings


SPOTIFY_TOKEN_URL = (
    "https://accounts.spotify.com/api/token"
)


class SpotifyConfigurationError(Exception):
    pass


class SpotifyAuthenticationError(Exception):
    pass


_access_token: str | None = None
_token_expires_at: float = 0


async def get_spotify_access_token() -> str:
    global _access_token
    global _token_expires_at

    settings = get_settings()

    client_id = settings.spotify_client_id
    client_secret = settings.spotify_client_secret

    if not client_id or not client_secret:
        raise SpotifyConfigurationError(
            "As credenciais do Spotify "
            "não estão configuradas."
        )

    current_time = time.time()

    if (
        _access_token
        and current_time
        < _token_expires_at - 30
    ):
        return _access_token

    try:
        async with httpx.AsyncClient(
            timeout=10.0
        ) as client:
            response = await client.post(
                SPOTIFY_TOKEN_URL,
                data={
                    "grant_type":
                        "client_credentials",
                },
                auth=(
                    client_id,
                    client_secret,
                ),
            )

    except httpx.HTTPError as error:
        raise SpotifyAuthenticationError(
            "Não foi possível conectar "
            "ao Spotify."
        ) from error

    if response.status_code != 200:
        raise SpotifyAuthenticationError(
            "O Spotify recusou "
            "as credenciais."
        )

    data = response.json()

    access_token = data.get(
        "access_token"
    )

    expires_in = data.get(
        "expires_in",
        3600,
    )

    if not access_token:
        raise SpotifyAuthenticationError(
            "O Spotify não retornou "
            "um access token."
        )

    _access_token = access_token

    _token_expires_at = (
        current_time
        + int(expires_in)
    )

    return access_token