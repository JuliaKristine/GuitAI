from typing import Literal

from pydantic import BaseModel


DifficultyId = Literal[
    "absolute-beginner",
    "beginner",
    "developing",
]


ChordDecisionAction = Literal[
    "practice",
    "defer",
    "review",
]


class ChordDecision(BaseModel):
    chord: str

    action: ChordDecisionAction

    difficulty_score: int | None = None

    reason: str


class ChordSimplificationResult(BaseModel):
    difficulty: DifficultyId

    original_chords: list[str]

    practice_chords: list[str]

    deferred_chords: list[str]

    review_chords: list[str]

    decisions: list[ChordDecision]

    recommended_bpm: int

    max_chords_per_session: int

    manual_review_required: bool

    notes: list[str]