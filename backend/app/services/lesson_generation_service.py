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

from app.schemas.music_analysis import (
    MusicAnalysisStatus,
)

from app.services.chord_simplifier import (
    simplify_chords,
)

from app.services.music_analysis_service import (
    analyze_song,
)


_generations: dict[
    str,
    LessonGenerationResponse,
] = {}


def utc_now() -> datetime:
    return datetime.now(
        timezone.utc
    )


def save_generation(
    generation:
        LessonGenerationResponse,
):
    _generations[
        generation.id
    ] = generation


def create_generation(
    request:
        LessonGenerationRequest,
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

            analysis=None,

            simplification=None,

            lesson=None,

            message=(
                "Geração criada e "
                "aguardando processamento."
            ),

            error=None,
        )
    )

    save_generation(
        generation
    )

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


async def start_generation(
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

    allowed_statuses = {
        LessonGenerationStatus.pending,
        LessonGenerationStatus.waiting_for_analysis,
        LessonGenerationStatus.analysis_ready,
    }

    if (
        generation.status
        not in allowed_statuses
    ):
        return generation

    processing_generation = (
        generation.model_copy(
            update={
                "status":
                    LessonGenerationStatus
                    .processing,

                "updated_at":
                    utc_now(),

                "message":
                    (
                        "Processando dados "
                        "musicais e pedagógicos."
                    ),

                "error":
                    None,
            }
        )
    )

    save_generation(
        processing_generation
    )

    try:
        analysis = (
            processing_generation
            .analysis
        )

        if (
            analysis is None
            or analysis.status
            != MusicAnalysisStatus.ready
        ):
            analysis = await analyze_song(
                processing_generation
                .song_id
            )

    except Exception as error:
        failed_generation = (
            processing_generation
            .model_copy(
                update={
                    "status":
                        LessonGenerationStatus
                        .failed,

                    "updated_at":
                        utc_now(),

                    "message":
                        (
                            "A análise musical "
                            "falhou."
                        ),

                    "error":
                        str(error),
                }
            )
        )

        save_generation(
            failed_generation
        )

        return failed_generation

    if (
        analysis.status
        == MusicAnalysisStatus.unavailable
    ):
        waiting_generation = (
            processing_generation
            .model_copy(
                update={
                    "status":
                        LessonGenerationStatus
                        .waiting_for_analysis,

                    "updated_at":
                        utc_now(),

                    "analysis":
                        analysis,

                    "simplification":
                        None,

                    "message":
                        (
                            analysis.message
                            or
                            "Aguardando uma fonte "
                            "de análise musical."
                        ),

                    "error":
                        None,
                }
            )
        )

        save_generation(
            waiting_generation
        )

        return waiting_generation

    if (
        analysis.status
        == MusicAnalysisStatus.failed
    ):
        failed_generation = (
            processing_generation
            .model_copy(
                update={
                    "status":
                        LessonGenerationStatus
                        .failed,

                    "updated_at":
                        utc_now(),

                    "analysis":
                        analysis,

                    "simplification":
                        None,

                    "message":
                        (
                            "O provedor não conseguiu "
                            "analisar esta música."
                        ),

                    "error":
                        analysis.message,
                }
            )
        )

        save_generation(
            failed_generation
        )

        return failed_generation

    analysis_ready_generation = (
        processing_generation
        .model_copy(
            update={
                "status":
                    LessonGenerationStatus
                    .analysis_ready,

                "updated_at":
                    utc_now(),

                "analysis":
                    analysis,

                "message":
                    (
                        "Análise musical pronta. "
                        "Iniciando simplificação "
                        "pedagógica."
                    ),

                "error":
                    None,
            }
        )
    )

    save_generation(
        analysis_ready_generation
    )

    try:
        simplification = (
            simplify_chords(
                chords=analysis.chords,

                difficulty=(
                    generation
                    .difficulty
                    .value
                ),
            )
        )

    except Exception as error:
        failed_generation = (
            analysis_ready_generation
            .model_copy(
                update={
                    "status":
                        LessonGenerationStatus
                        .failed,

                    "updated_at":
                        utc_now(),

                    "message":
                        (
                            "Não foi possível "
                            "simplificar os acordes."
                        ),

                    "error":
                        str(error),
                }
            )
        )

        save_generation(
            failed_generation
        )

        return failed_generation

    simplification_ready_generation = (
        analysis_ready_generation
        .model_copy(
            update={
                "status":
                    LessonGenerationStatus
                    .simplification_ready,

                "updated_at":
                    utc_now(),

                "simplification":
                    simplification,

                "message":
                    (
                        "Simplificação pedagógica "
                        "pronta. Aguardando geração "
                        "da aula."
                    ),

                "error":
                    None,
            }
        )
    )

    save_generation(
        simplification_ready_generation
    )

    return (
        simplification_ready_generation
    )