from fastapi import (
    APIRouter,
    HTTPException,
    status,
)

from app.schemas.lesson_generation import (
    LessonGenerationRequest,
    LessonGenerationResponse,
)

from app.services.lesson_generation_service import (
    create_generation,
    get_generation,
    start_generation,
)


router = APIRouter(
    prefix="/lesson-generations",
    tags=["Lesson Generation"],
)


@router.post(
    "",
    response_model=(
        LessonGenerationResponse
    ),
    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_lesson_generation(
    request:
        LessonGenerationRequest,
):
    return create_generation(
        request
    )


@router.get(
    "/{generation_id}",
    response_model=(
        LessonGenerationResponse
    ),
)
def read_lesson_generation(
    generation_id: str,
):
    generation = (
        get_generation(
            generation_id
        )
    )

    if not generation:
        raise HTTPException(
            status_code=404,
            detail=(
                "Processo de geração "
                "não encontrado."
            ),
        )

    return generation


@router.post(
    "/{generation_id}/start",
    response_model=(
        LessonGenerationResponse
    ),
)
def start_lesson_generation(
    generation_id: str,
):
    generation = (
        start_generation(
            generation_id
        )
    )

    if not generation:
        raise HTTPException(
            status_code=404,
            detail=(
                "Processo de geração "
                "não encontrado."
            ),
        )

    return generation