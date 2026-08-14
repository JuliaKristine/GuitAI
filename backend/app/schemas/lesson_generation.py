from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class LessonGenerationStatus(
    str,
    Enum,
):
    pending = "pending"
    processing = "processing"
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

    lesson: (
        GeneratedLesson
        | None
    ) = None

    error: str | None = None