from fastapi import (
    APIRouter,
    Query,
)

from app.schemas.guitai_song import (
    GuitAISongResponse,
    SpotifyTrackInput,
)

from app.schemas.song import (
    SongSearchResponse,
)

from app.services.guitai_song_service import (
    prepare_spotify_song,
)

from app.services.song_service import (
    search_songs,
)


router = APIRouter(
    prefix="/songs",
    tags=["Songs"],
)


@router.get(
    "/search",
    response_model=SongSearchResponse,
)
def search(
    q: str = Query(
        default="",
        max_length=100,
    ),
):
    results = search_songs(q)

    return SongSearchResponse(
        query=q,
        count=len(results),
        items=results,
    )


@router.post(
    "/prepare",
    response_model=GuitAISongResponse,
)
def prepare_song(
    track: SpotifyTrackInput,
):
    return prepare_spotify_song(
        track
    )