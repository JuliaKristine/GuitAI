from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.music_analysis import (
    MusicAnalysisResult,
)


class LessonGenerationStatus(
    str,
    Enum,
):
    pending = "pending"

    processing = "processing"

    waiting_for_analysis = (
        "waiting_for_analysis"
    )

    analysis_ready = (
        "analysis_ready"
    )

    completed = "completed"

    failed = "failed"


class LessonDifficulty(
    str,
    Enum,
):
    absolute_beginner = (
        "absolute-beginner"
    )

    beginner = "beginner"

    developing = "developing"


class LessonGenerationRequest(
    BaseModel
):
    song_id: str

    difficulty: LessonDifficulty = (
        LessonDifficulty.absolute_beginner
    )


class GeneratedChord(
    BaseModel
):
    chord: str

    simplified_from: str | None = None


class GeneratedRhythm(
    BaseModel
):
    name: str

    bpm: int = Field(
        ge=30,
        le=240,
    )

    beats: list[str]


class GeneratedLessonStep(
    BaseModel
):
    chord: str

    title: str

    instruction: str

    tip: str


class GeneratedLesson(
    BaseModel
):
    title: str

    description: str

    chords: list[
        GeneratedChord
    ]

    rhythm: GeneratedRhythm

    steps: list[
        GeneratedLessonStep
    ]

    simplification_notes: list[str]


class LessonGenerationResponse(
    BaseModel
):
    id: str

    song_id: str

    difficulty: LessonDifficulty

    status: LessonGenerationStatus

    created_at: datetime

    updated_at: datetime

    analysis: (
        MusicAnalysisResult
        | None
    ) = None

    lesson: (
        GeneratedLesson
        | None
    ) = None

    message: str | None = None

    error: str | None = None