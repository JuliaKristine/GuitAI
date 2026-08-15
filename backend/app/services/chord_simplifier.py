from app.schemas.chord_simplification import (
    ChordDecision,
    ChordSimplificationResult,
)


CHORD_DIFFICULTY: dict[
    str,
    int,
] = {
    "G": 1,
    "Em": 1,
    "Am": 1,
    "C": 2,
    "D": 2,
}


DIFFICULTY_POLICIES = {
    "absolute-beginner": {
        "max_score": 1,
        "max_chords": 2,
        "recommended_bpm": 40,
    },

    "beginner": {
        "max_score": 2,
        "max_chords": 4,
        "recommended_bpm": 60,
    },

    "developing": {
        "max_score": 3,
        "max_chords": 6,
        "recommended_bpm": 80,
    },
}


def unique_preserving_order(
    chords: list[str],
) -> list[str]:
    result: list[str] = []

    for chord in chords:
        if chord not in result:
            result.append(
                chord
            )

    return result


def simplify_chords(
    chords: list[str],
    difficulty: str,
) -> ChordSimplificationResult:
    policy = (
        DIFFICULTY_POLICIES.get(
            difficulty,
            DIFFICULTY_POLICIES[
                "absolute-beginner"
            ],
        )
    )

    original_chords = (
        unique_preserving_order(
            chords
        )
    )

    practice_chords: list[str] = []

    deferred_chords: list[str] = []

    review_chords: list[str] = []

    decisions: list[
        ChordDecision
    ] = []

    max_score = int(
        policy["max_score"]
    )

    max_chords = int(
        policy["max_chords"]
    )

    recommended_bpm = int(
        policy["recommended_bpm"]
    )

    for chord in original_chords:
        score = (
            CHORD_DIFFICULTY.get(
                chord
            )
        )

        if score is None:
            review_chords.append(
                chord
            )

            decisions.append(
                ChordDecision(
                    chord=chord,
                    action="review",
                    difficulty_score=None,
                    reason=(
                        "Este acorde ainda não "
                        "existe na biblioteca "
                        "pedagógica do GuitAI."
                    ),
                )
            )

            continue

        if score > max_score:
            deferred_chords.append(
                chord
            )

            decisions.append(
                ChordDecision(
                    chord=chord,
                    action="defer",
                    difficulty_score=score,
                    reason=(
                        "O acorde é suportado, "
                        "mas está acima da "
                        "dificuldade recomendada "
                        "para este nível."
                    ),
                )
            )

            continue

        if (
            len(practice_chords)
            >= max_chords
        ):
            deferred_chords.append(
                chord
            )

            decisions.append(
                ChordDecision(
                    chord=chord,
                    action="defer",
                    difficulty_score=score,
                    reason=(
                        "O limite de acordes "
                        "desta sessão já foi "
                        "atingido."
                    ),
                )
            )

            continue

        practice_chords.append(
            chord
        )

        decisions.append(
            ChordDecision(
                chord=chord,
                action="practice",
                difficulty_score=score,
                reason=(
                    "Acorde adequado para "
                    "este nível."
                ),
            )
        )

    notes: list[str] = [
        (
            "Os acordes originais são "
            "preservados separadamente."
        ),
        (
            "A lista de prática representa "
            "o conteúdo recomendado para "
            "esta sessão e não substitui "
            "silenciosamente a harmonia "
            "original da música."
        ),
    ]

    if deferred_chords:
        notes.append(
            (
                "Alguns acordes foram "
                "adiados para uma etapa "
                "posterior do aprendizado."
            )
        )

    if review_chords:
        notes.append(
            (
                "Existem acordes que ainda "
                "precisam de revisão antes "
                "de uma simplificação segura."
            )
        )

    return ChordSimplificationResult(
        difficulty=difficulty,
        original_chords=(
            original_chords
        ),
        practice_chords=(
            practice_chords
        ),
        deferred_chords=(
            deferred_chords
        ),
        review_chords=(
            review_chords
        ),
        decisions=decisions,
        recommended_bpm=(
            recommended_bpm
        ),
        max_chords_per_session=(
            max_chords
        ),
        manual_review_required=(
            len(review_chords) > 0
        ),
        notes=notes,
    )