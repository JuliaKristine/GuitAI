from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.chord_simplification import (
    ChordSimplificationResult,
)
from app.schemas.music_analysis import (
    MusicAnalysisResult,
)


class LessonGenerationStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    waiting_for_analysis = "waiting_for_analysis"
    waiting_for_validation = "waiting_for_validation"
    analysis_ready = "analysis_ready"
    simplification_ready = "simplification_ready"
    completed = "completed"
    failed = "failed"


class LessonDifficulty(str, Enum):
    absolute_beginner = "absolute-beginner"
    beginner = "beginner"
    developing = "developing"


class LessonGenerationRequest(BaseModel):
    song_id: str
    difficulty: LessonDifficulty = LessonDifficulty.absolute_beginner


StrumDirection = Literal["down", "up"]


class GeneratedChordTransition(BaseModel):
    from_chord: str = Field(
        serialization_alias="from",
    )
    to: str
    instructions: list[str]


class GeneratedRhythm(BaseModel):
    name: str
    bpm: int = Field(
        ge=30,
        le=240,
    )
    beats: list[StrumDirection]


class GeneratedLessonStep(BaseModel):
    chord: str
    title: str
    instruction: str
    tip: str
    transition: GeneratedChordTransition | None = None


class GeneratedLesson(BaseModel):
    id: str
    title: str
    description: str
    rhythm: GeneratedRhythm
    steps: list[GeneratedLessonStep]
    original_chords: list[str]
    practice_chords: list[str]
    simplification_notes: list[str]


class LessonGenerationResponse(BaseModel):
    id: str
    song_id: str
    difficulty: LessonDifficulty
    status: LessonGenerationStatus
    created_at: datetime
    updated_at: datetime
    analysis: MusicAnalysisResult | None = None
    simplification: ChordSimplificationResult | None = None
    lesson: GeneratedLesson | None = None
    message: str | None = None
    error: str | None = None