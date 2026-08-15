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

from app.services.pedagogical_lesson_builder import (
    build_pedagogical_lesson,
)

from app.services.song_service import (
    get_song_by_id,
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


def get_song_title(
    song_id: str,
) -> str:
    song = get_song_by_id(
        song_id
    )

    if not song:
        return "Sua música"

    if isinstance(
        song,
        dict,
    ):
        return str(
            song.get(
                "title",
                "Sua música",
            )
        )

    title = getattr(
        song,
        "title",
        None,
    )

    if title:
        return str(title)

    return "Sua música"


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

    if (
        generation.status
        == LessonGenerationStatus
        .completed
    ):
        return generation

    if (
        generation.status
        == LessonGenerationStatus
        .failed
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
                        "Processando análise, "
                        "simplificação e aula."
                    ),

                "error":
                    None,
            }
        )
    )

    save_generation(
        processing_generation
    )

    # =====================================
    # 1. ANÁLISE MUSICAL
    # =====================================

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
        == MusicAnalysisStatus
        .unavailable
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

                    "lesson":
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

                    "lesson":
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
                        "Análise musical pronta."
                    ),

                "error":
                    None,
            }
        )
    )

    save_generation(
        analysis_ready_generation
    )

    # =====================================
    # 2. SIMPLIFICAÇÃO
    # =====================================

    try:
        simplification = (
            analysis_ready_generation
            .simplification
        )

        if simplification is None:
            simplification = (
                simplify_chords(
                    chords=(
                        analysis.chords
                    ),

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
                        "Simplificação "
                        "pedagógica pronta."
                    ),

                "error":
                    None,
            }
        )
    )

    save_generation(
        simplification_ready_generation
    )

    # =====================================
    # 3. CONSTRUÇÃO DA AULA
    # =====================================

    try:
        song_title = (
            get_song_title(
                generation.song_id
            )
        )

        lesson = (
            build_pedagogical_lesson(
                generation_id=(
                    generation.id
                ),

                song_id=(
                    generation.song_id
                ),

                song_title=(
                    song_title
                ),

                difficulty=(
                    generation
                    .difficulty
                    .value
                ),

                analysis=analysis,

                simplification=(
                    simplification
                ),
            )
        )

    except Exception as error:
        failed_generation = (
            simplification_ready_generation
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
                            "montar a aula."
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

    completed_generation = (
        simplification_ready_generation
        .model_copy(
            update={
                "status":
                    LessonGenerationStatus
                    .completed,

                "updated_at":
                    utc_now(),

                "lesson":
                    lesson,

                "message":
                    (
                        "Aula gerada "
                        "com sucesso."
                    ),

                "error":
                    None,
            }
        )
    )

    save_generation(
        completed_generation
    )

    return completed_generation