import time

import httpx

from app.config import get_settings
from app.schemas.spotify import (
    SpotifyTrackSummary,
)


SPOTIFY_TOKEN_URL = (
    "https://accounts.spotify.com/api/token"
)

SPOTIFY_SEARCH_URL = (
    "https://api.spotify.com/v1/search"
)


class SpotifyConfigurationError(
    Exception
):
    pass


class SpotifyAuthenticationError(
    Exception
):
    pass


class SpotifyApiError(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 502,
    ):
        super().__init__(message)
        self.status_code = status_code


_access_token: str | None = None
_token_expires_at: float = 0


def clear_cached_token():
    global _access_token
    global _token_expires_at

    _access_token = None
    _token_expires_at = 0


async def get_spotify_access_token() -> str:
    global _access_token
    global _token_expires_at

    settings = get_settings()

    client_id = (
        settings.spotify_client_id
    )

    client_secret = (
        settings.spotify_client_secret
    )

    if (
        not client_id
        or not client_secret
    ):
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
            "ao serviço de autenticação "
            "do Spotify."
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


async def request_spotify_search(
    query: str,
    token: str,
    market: str,
    limit: int,
) -> httpx.Response:
    try:
        async with httpx.AsyncClient(
            timeout=10.0
        ) as client:
            return await client.get(
                SPOTIFY_SEARCH_URL,
                headers={
                    "Authorization":
                        f"Bearer {token}",
                },
                params={
                    "q": query,
                    "type": "track",
                    "market": market,
                    "limit": limit,
                },
            )

    except httpx.HTTPError as error:
        raise SpotifyApiError(
            "Não foi possível conectar "
            "à busca do Spotify."
        ) from error


async def search_spotify_tracks(
    query: str,
    market: str,
    limit: int = 10,
) -> list[SpotifyTrackSummary]:
    clean_query = query.strip()

    if not clean_query:
        return []

    token = (
        await get_spotify_access_token()
    )

    response = (
        await request_spotify_search(
            query=clean_query,
            token=token,
            market=market,
            limit=limit,
        )
    )

    # Se o token expirou ou foi invalidado,
    # buscamos um token novo e tentamos
    # somente mais uma vez.
    if response.status_code == 401:
        clear_cached_token()

        token = (
            await get_spotify_access_token()
        )

        response = (
            await request_spotify_search(
                query=clean_query,
                token=token,
                market=market,
                limit=limit,
            )
        )

    if response.status_code == 429:
        retry_after = (
            response.headers.get(
                "Retry-After",
                "alguns segundos",
            )
        )

        raise SpotifyApiError(
            (
                "O Spotify limitou "
                "temporariamente as buscas. "
                f"Tente novamente em "
                f"{retry_after} segundos."
            ),
            status_code=429,
        )

    if response.status_code == 401:
        raise SpotifyAuthenticationError(
            "O Spotify não aceitou "
            "o access token."
        )

    if response.status_code == 403:
        raise SpotifyApiError(
            "O Spotify recusou acesso "
            "a essa operação."
        )

    if response.status_code != 200:
        raise SpotifyApiError(
            (
                "A busca do Spotify "
                "retornou o status "
                f"{response.status_code}."
            )
        )

    data = response.json()

    tracks_data = (
        data
        .get("tracks", {})
        .get("items", [])
    )

    results: list[
        SpotifyTrackSummary
    ] = []

    for track in tracks_data:
        track_id = track.get("id")

        track_name = track.get(
            "name"
        )

        if (
            not track_id
            or not track_name
        ):
            continue

        artists = (
            track.get("artists")
            or []
        )

        artist_names = [
            artist.get("name")
            for artist in artists
            if artist.get("name")
        ]

        artist_name = (
            ", ".join(
                artist_names
            )
            or "Artista desconhecido"
        )

        album = (
            track.get("album")
            or {}
        )

        album_name = (
            album.get("name")
            or "Álbum desconhecido"
        )

        images = (
            album.get("images")
            or []
        )

        image_url = None

        if images:
            image_url = (
                images[0].get(
                    "url"
                )
            )

        external_urls = (
            track.get(
                "external_urls"
            )
            or {}
        )

        spotify_url = (
            external_urls.get(
                "spotify"
            )
        )

        results.append(
            SpotifyTrackSummary(
                id=track_id,
                title=track_name,
                artist=artist_name,
                album=album_name,
                image_url=image_url,
                spotify_url=spotify_url,
                duration_ms=int(
                    track.get(
                        "duration_ms",
                        0,
                    )
                    or 0
                ),
                explicit=bool(
                    track.get(
                        "explicit",
                        False,
                    )
                ),
            )
        )

    return results
