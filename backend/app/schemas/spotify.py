from pydantic import BaseModel


class SpotifyTrackSummary(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    image_url: str | None = None
    spotify_url: str | None = None
    duration_ms: int
    explicit: bool


class SpotifyTrackSearchResponse(BaseModel):
    query: str
    count: int
    items: list[SpotifyTrackSummary]