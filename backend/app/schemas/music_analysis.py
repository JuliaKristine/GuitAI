from enum import Enum

from pydantic import BaseModel, Field


class MusicAnalysisStatus(
    str,
    Enum,
):
    ready = "ready"
    unavailable = "unavailable"
    failed = "failed"


class ChordEvent(BaseModel):
    chord: str

    measure: int = Field(
        ge=1,
    )

    beat: float = Field(
        ge=1,
    )


class MusicAnalysisResult(BaseModel):
    song_id: str

    provider: str

    status: MusicAnalysisStatus

    tempo_bpm: float | None = None

    key: str | None = None

    time_signature: str | None = None

    chords: list[str] = []

    chord_events: list[
        ChordEvent
    ] = []

    confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    message: str | None = None