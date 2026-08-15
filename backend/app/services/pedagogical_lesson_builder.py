from app.schemas.chord_simplification import (
    ChordSimplificationResult,
)

from app.schemas.lesson_generation import (
    GeneratedChordTransition,
    GeneratedLesson,
    GeneratedLessonStep,
    GeneratedRhythm,
)

from app.schemas.music_analysis import (
    MusicAnalysisResult,
)


CHORD_TEACHING = {
    "G": {
        "display_name": "Sol maior",
        "instruction": (
            "Monte o acorde de Sol maior "
            "devagar e toque as cordas "
            "uma por uma."
        ),
        "tip": (
            "Mantenha os dedos curvados "
            "para não encostar nas cordas "
            "vizinhas."
        ),
    },

    "Em": {
        "display_name": "Mi menor",
        "instruction": (
            "Coloque os dois dedos no "
            "segundo traste e toque "
            "todas as cordas."
        ),
        "tip": (
            "Este é um ótimo acorde para "
            "relaxar a mão e treinar "
            "um som limpo."
        ),
    },

    "Am": {
        "display_name": "Lá menor",
        "instruction": (
            "Monte o Lá menor com calma "
            "e toque a partir da quinta "
            "corda."
        ),
        "tip": (
            "Confira se cada nota soa "
            "separadamente antes de fazer "
            "a batida completa."
        ),
    },

    "C": {
        "display_name": "Dó maior",
        "instruction": (
            "Monte o Dó maior devagar "
            "e toque a partir da quinta "
            "corda."
        ),
        "tip": (
            "Evite tocar a sexta corda "
            "e mantenha o primeiro dedo "
            "bem próximo do traste."
        ),
    },

    "D": {
        "display_name": "Ré maior",
        "instruction": (
            "Monte o Ré maior e toque "
            "somente a partir da quarta "
            "corda."
        ),
        "tip": (
            "Faça um pequeno triângulo "
            "com os dedos e confira se "
            "a primeira corda está limpa."
        ),
    },
}


RHYTHM_BY_DIFFICULTY = {
    "absolute-beginner": {
        "name": "Batida fácil",
        "beats": [
            "down",
            "down",
            "down",
            "down",
        ],
    },

    "beginner": {
        "name": "Batida iniciante",
        "beats": [
            "down",
            "down",
            "up",
            "up",
        ],
    },

    "developing": {
        "name": "Batida alternada",
        "beats": [
            "down",
            "up",
            "down",
            "up",
        ],
    },
}


def get_chord_teaching(
    chord: str,
) -> dict[str, str]:
    teaching = (
        CHORD_TEACHING.get(
            chord
        )
    )

    if teaching:
        return teaching

    return {
        "display_name": chord,

        "instruction": (
            f"Monte o acorde {chord} "
            "lentamente e confira se "
            "todas as notas necessárias "
            "estão soando."
        ),

        "tip": (
            "Pratique este acorde "
            "separadamente antes de "
            "tentar uma troca rápida."
        ),
    }


def build_transition(
    from_chord: str,
    to_chord: str,
) -> GeneratedChordTransition:
    return GeneratedChordTransition(
        from_chord=from_chord,

        to=to_chord,

        instructions=[
            (
                f"Toque {from_chord} "
                "lentamente."
            ),
            (
                f"Visualize o formato "
                f"de {to_chord} antes "
                "de mover a mão."
            ),
            (
                "Mova os dedos juntos, "
                "sem tentar acelerar."
            ),
            (
                f"Toque {to_chord} "
                "e confira se o som "
                "está limpo."
            ),
        ],
    )


def build_steps(
    practice_chords: list[str],
) -> list[GeneratedLessonStep]:
    steps: list[
        GeneratedLessonStep
    ] = []

    for index, chord in enumerate(
        practice_chords
    ):
        teaching = (
            get_chord_teaching(
                chord
            )
        )

        transition = None

        has_next_chord = (
            index
            < len(practice_chords) - 1
        )

        if has_next_chord:
            next_chord = (
                practice_chords[
                    index + 1
                ]
            )

            transition = (
                build_transition(
                    from_chord=chord,
                    to_chord=next_chord,
                )
            )

        steps.append(
            GeneratedLessonStep(
                chord=chord,

                title=(
                    "Aprenda "
                    f"{teaching['display_name']}"
                ),

                instruction=(
                    teaching[
                        "instruction"
                    ]
                ),

                tip=(
                    teaching["tip"]
                ),

                transition=transition,
            )
        )

    return steps


def build_rhythm(
    difficulty: str,
    recommended_bpm: int,
) -> GeneratedRhythm:
    rhythm_config = (
        RHYTHM_BY_DIFFICULTY.get(
            difficulty,
            RHYTHM_BY_DIFFICULTY[
                "absolute-beginner"
            ],
        )
    )

    return GeneratedRhythm(
        name=(
            rhythm_config["name"]
        ),

        bpm=recommended_bpm,

        beats=(
            rhythm_config["beats"]
        ),
    )


def build_pedagogical_lesson(
    generation_id: str,
    song_id: str,
    song_title: str,
    difficulty: str,
    analysis: MusicAnalysisResult,
    simplification:
        ChordSimplificationResult,
) -> GeneratedLesson:
    practice_chords = (
        simplification
        .practice_chords
    )

    if not practice_chords:
        raise ValueError(
            "Nenhum acorde adequado "
            "foi encontrado para montar "
            "esta aula."
        )

    rhythm = build_rhythm(
        difficulty=difficulty,

        recommended_bpm=(
            simplification
            .recommended_bpm
        ),
    )

    steps = build_steps(
        practice_chords
    )

    notes = list(
        simplification.notes
    )

    if analysis.tempo_bpm:
        notes.append(
            (
                "O andamento original "
                "informado pela análise é "
                f"{analysis.tempo_bpm:g} BPM."
            )
        )

    notes.append(
        (
            "A velocidade da aula foi "
            "escolhida pelo perfil "
            "pedagógico do aluno."
        )
    )

    if (
        simplification
        .deferred_chords
    ):
        deferred = ", ".join(
            simplification
            .deferred_chords
        )

        notes.append(
            (
                "Acordes deixados para "
                "uma etapa posterior: "
                f"{deferred}."
            )
        )

    return GeneratedLesson(
        id=(
            f"lesson-{generation_id}"
        ),

        title=(
            f"{song_title} — "
            "aula simplificada"
        ),

        description=(
            "Uma aula criada pelo GuitAI "
            "a partir da análise musical "
            "e do nível selecionado."
        ),

        rhythm=rhythm,

        steps=steps,

        original_chords=(
            simplification
            .original_chords
        ),

        practice_chords=(
            practice_chords
        ),

        simplification_notes=notes,
    )