from enum import Enum

from pydantic import (
    BaseModel,
    Field,
)


class MusicAnalysisStatus(
    str,
    Enum,
):
    ready = "ready"

    experimental = (
        "experimental"
    )

    unavailable = (
        "unavailable"
    )

    failed = "failed"


class ChordEvent(BaseModel):
    chord: str

    measure: int | None = Field(
        default=None,
        ge=1,
    )

    beat: float | None = Field(
        default=None,
        ge=1,
    )

    time_seconds: float | None = Field(
        default=None,
        ge=0,
    )

    confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )


class MusicAnalysisResult(BaseModel):
    song_id: str

    provider: str

    status: MusicAnalysisStatus

    tempo_bpm: float | None = None

    key: str | None = None

    time_signature: str | None = None

    chords: list[str] = Field(
        default_factory=list
    )

    chord_events: list[
        ChordEvent
    ] = Field(
        default_factory=list
    )

    confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    message: str | None = None