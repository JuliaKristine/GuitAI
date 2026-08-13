from typing import Literal

from pydantic import BaseModel


class SpotifyTrackInput(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    image_url: str | None = None
    spotify_url: str | None = None
    duration_ms: int
    explicit: bool


class GuitAISongResponse(BaseModel):
    id: str

    source: Literal["spotify"]

    source_id: str

    title: str
    artist: str
    album: str

    image_url: str | None = None

    source_url: str | None = None

    duration_ms: int

    explicit: bool

    status: Literal[
        "waiting_for_lesson"
    ]

    lesson_available: bool