from datetime import (
    datetime,
    timezone,
)
from uuid import uuid4

from app.schemas.lesson_generation import (
    LessonGenerationRequest,
    LessonGenerationResponse,
    LessonGenerationStatus,
)


_generations: dict[
    str,
    LessonGenerationResponse,
] = {}


def utc_now() -> datetime:
    return datetime.now(
        timezone.utc
    )


def create_generation(
    request: LessonGenerationRequest,
) -> LessonGenerationResponse:
    generation_id = str(
        uuid4()
    )

    now = utc_now()

    generation = (
        LessonGenerationResponse(
            id=generation_id,
            song_id=request.song_id,
            difficulty=(
                request.difficulty
            ),
            status=(
                LessonGenerationStatus
                .pending
            ),
            created_at=now,
            updated_at=now,
            lesson=None,
            error=None,
        )
    )

    _generations[
        generation_id
    ] = generation

    return generation


def get_generation(
    generation_id: str,
) -> (
    LessonGenerationResponse
    | None
):
    return _generations.get(
        generation_id
    )


def start_generation(
    generation_id: str,
) -> (
    LessonGenerationResponse
    | None
):
    generation = (
        get_generation(
            generation_id
        )
    )

    if not generation:
        return None

    if (
        generation.status
        != LessonGenerationStatus.pending
    ):
        return generation

    updated = generation.model_copy(
        update={
            "status":
                LessonGenerationStatus
                .processing,

            "updated_at":
                utc_now(),
        }
    )

    _generations[
        generation_id
    ] = updated

    return updated