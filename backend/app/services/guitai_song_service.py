from app.schemas.guitai_song import (
    GuitAISongResponse,
    SpotifyTrackInput,
)


def prepare_spotify_song(
    track: SpotifyTrackInput,
) -> GuitAISongResponse:
    return GuitAISongResponse(
        id=f"spotify-{track.id}",
        source="spotify",
        source_id=track.id,
        title=track.title,
        artist=track.artist,
        album=track.album,
        image_url=track.image_url,
        source_url=track.spotify_url,
        duration_ms=track.duration_ms,
        explicit=track.explicit,
        status="waiting_for_lesson",
        lesson_available=False,
    )