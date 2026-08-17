import librosa
import numpy as np

from app.providers.music_analysis_base import (
    MusicAnalysisProvider,
)

from app.schemas.music_analysis import (
    ChordEvent,
    MusicAnalysisResult,
    MusicAnalysisStatus,
)

from app.services.audio_asset_service import (
    get_audio_file_path,
)


HOP_LENGTH = 512

TARGET_SAMPLE_RATE = 22050

MIN_CHORD_CONFIDENCE = 0.45

MAX_CHORD_EVENTS = 64


PITCH_CLASSES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
]


MAJOR_KEY_PROFILE = np.array(
    [
        6.35,
        2.23,
        3.48,
        2.33,
        4.38,
        4.09,
        2.52,
        5.19,
        2.39,
        3.66,
        2.29,
        2.88,
    ],
    dtype=float,
)


MINOR_KEY_PROFILE = np.array(
    [
        6.33,
        2.68,
        3.52,
        5.38,
        2.60,
        3.53,
        2.54,
        4.75,
        3.98,
        2.69,
        3.34,
        3.17,
    ],
    dtype=float,
)


def normalize_vector(
    vector: np.ndarray,
) -> np.ndarray:
    norm = float(
        np.linalg.norm(
            vector
        )
    )

    if norm <= 0:
        return np.zeros_like(
            vector,
            dtype=float,
        )

    return (
        vector.astype(float)
        / norm
    )


def make_chord_template(
    root: int,
    intervals: list[int],
) -> np.ndarray:
    template = np.zeros(
        12,
        dtype=float,
    )

    weights = [
        1.0,
        0.8,
        0.8,
    ]

    for interval, weight in zip(
        intervals,
        weights,
    ):
        note_index = (
            root + interval
        ) % 12

        template[
            note_index
        ] = weight

    return normalize_vector(
        template
    )


def build_chord_templates(
) -> dict[str, np.ndarray]:
    templates: dict[
        str,
        np.ndarray,
    ] = {}

    for (
        root_index,
        root_name,
    ) in enumerate(
        PITCH_CLASSES
    ):
        templates[
            root_name
        ] = make_chord_template(
            root=root_index,
            intervals=[
                0,
                4,
                7,
            ],
        )

        templates[
            f"{root_name}m"
        ] = make_chord_template(
            root=root_index,
            intervals=[
                0,
                3,
                7,
            ],
        )

    return templates


CHORD_TEMPLATES = (
    build_chord_templates()
)


def classify_chord(
    chroma_vector: np.ndarray,
) -> tuple[
    str,
    float,
]:
    normalized = normalize_vector(
        chroma_vector
    )

    if not np.any(
        normalized
    ):
        return (
            "N",
            0.0,
        )

    best_chord = "N"
    best_score = 0.0

    for (
        chord,
        template,
    ) in CHORD_TEMPLATES.items():
        score = float(
            np.dot(
                normalized,
                template,
            )
        )

        if score > best_score:
            best_score = score
            best_chord = chord

    best_score = max(
        0.0,
        min(
            best_score,
            1.0,
        ),
    )

    return (
        best_chord,
        best_score,
    )


def safe_correlation(
    first: np.ndarray,
    second: np.ndarray,
) -> float:
    if (
        np.std(first) == 0
        or np.std(second) == 0
    ):
        return 0.0

    correlation = float(
        np.corrcoef(
            first,
            second,
        )[0, 1]
    )

    if np.isnan(
        correlation
    ):
        return 0.0

    return correlation


def estimate_key(
    chroma: np.ndarray,
) -> tuple[
    str | None,
    float | None,
]:
    if (
        chroma.size == 0
        or chroma.shape[0] != 12
    ):
        return (
            None,
            None,
        )

    mean_chroma = np.mean(
        chroma,
        axis=1,
    )

    if not np.any(
        mean_chroma
    ):
        return (
            None,
            None,
        )

    best_key: str | None = None

    best_score = -1.0

    for (
        tonic_index,
        tonic,
    ) in enumerate(
        PITCH_CLASSES
    ):
        major_profile = np.roll(
            MAJOR_KEY_PROFILE,
            tonic_index,
        )

        major_score = (
            safe_correlation(
                mean_chroma,
                major_profile,
            )
        )

        if (
            major_score
            > best_score
        ):
            best_score = (
                major_score
            )

            best_key = tonic

        minor_profile = np.roll(
            MINOR_KEY_PROFILE,
            tonic_index,
        )

        minor_score = (
            safe_correlation(
                mean_chroma,
                minor_profile,
            )
        )

        if (
            minor_score
            > best_score
        ):
            best_score = (
                minor_score
            )

            best_key = (
                f"{tonic}m"
            )

    normalized_score = (
        best_score + 1
    ) / 2

    normalized_score = max(
        0.0,
        min(
            normalized_score,
            1.0,
        ),
    )

    return (
        best_key,
        round(
            normalized_score,
            3,
        ),
    )


def get_tempo(
    audio: np.ndarray,
    sample_rate: int,
) -> tuple[
    float | None,
    np.ndarray,
]:
    (
        tempo_raw,
        beat_frames,
    ) = librosa.beat.beat_track(
        y=audio,
        sr=sample_rate,
        hop_length=HOP_LENGTH,
        units="frames",
    )

    tempo_array = np.asarray(
        tempo_raw
    ).reshape(-1)

    if tempo_array.size == 0:
        tempo = None

    else:
        tempo_value = float(
            tempo_array[0]
        )

        if tempo_value > 0:
            tempo = round(
                tempo_value,
                2,
            )

        else:
            tempo = None

    return (
        tempo,
        np.asarray(
            beat_frames,
            dtype=int,
        ),
    )


def build_chord_events(
    chroma: np.ndarray,
    beat_frames: np.ndarray,
    sample_rate: int,
) -> list[ChordEvent]:
    frame_count = (
        chroma.shape[1]
    )

    if frame_count == 0:
        return []

    valid_beats = sorted(
        {
            int(frame)
            for frame
            in beat_frames
            if (
                0
                <= int(frame)
                < frame_count
            )
        }
    )

    if (
        not valid_beats
        or valid_beats[0] != 0
    ):
        valid_beats.insert(
            0,
            0,
        )

    starts = valid_beats

    ends = (
        valid_beats[1:]
        + [
            frame_count
        ]
    )

    events: list[
        ChordEvent
    ] = []

    for (
        start,
        end,
    ) in zip(
        starts,
        ends,
    ):
        if end <= start:
            continue

        segment = chroma[
            :,
            start:end,
        ]

        if segment.size == 0:
            continue

        chord_vector = np.median(
            segment,
            axis=1,
        )

        (
            chord,
            confidence,
        ) = classify_chord(
            chord_vector
        )

        if (
            chord == "N"
            or confidence
            < MIN_CHORD_CONFIDENCE
        ):
            continue

        time_seconds = float(
            librosa.frames_to_time(
                start,
                sr=sample_rate,
                hop_length=HOP_LENGTH,
            )
        )

        new_event = ChordEvent(
            chord=chord,
            measure=None,
            beat=None,
            time_seconds=round(
                time_seconds,
                3,
            ),
            confidence=round(
                confidence,
                3,
            ),
        )

        if (
            events
            and events[-1].chord
            == new_event.chord
        ):
            continue

        events.append(
            new_event
        )

        if (
            len(events)
            >= MAX_CHORD_EVENTS
        ):
            break

    return events


def unique_chords(
    events: list[ChordEvent],
) -> list[str]:
    result: list[str] = []

    for event in events:
        if (
            event.chord
            not in result
        ):
            result.append(
                event.chord
            )

    return result


def overall_confidence(
    events: list[ChordEvent],
    key_confidence:
        float | None,
) -> float | None:
    scores = [
        event.confidence
        for event
        in events
        if (
            event.confidence
            is not None
        )
    ]

    if (
        key_confidence
        is not None
    ):
        scores.append(
            key_confidence
        )

    if not scores:
        return None

    return round(
        float(
            np.mean(
                scores
            )
        ),
        3,
    )


class LocalAudioMusicAnalysisProvider(
    MusicAnalysisProvider
):
    @property
    def name(self) -> str:
        return "local-audio"

    @property
    def available(self) -> bool:
        return True

    async def analyze(
        self,
        song_id: str,
    ) -> MusicAnalysisResult:
        audio_path = (
            get_audio_file_path(
                song_id
            )
        )

        if not audio_path:
            return (
                MusicAnalysisResult(
                    song_id=song_id,

                    provider=self.name,

                    status=(
                        MusicAnalysisStatus
                        .unavailable
                    ),

                    tempo_bpm=None,

                    key=None,

                    time_signature=None,

                    chords=[],

                    chord_events=[],

                    confidence=None,

                    message=(
                        "Nenhum arquivo de áudio "
                        "foi enviado para esta "
                        "música."
                    ),
                )
            )

        try:
            (
                audio,
                sample_rate,
            ) = librosa.load(
                audio_path,
                sr=TARGET_SAMPLE_RATE,
                mono=True,
            )

            if (
                audio.size
                < sample_rate
            ):
                return (
                    MusicAnalysisResult(
                        song_id=song_id,

                        provider=self.name,

                        status=(
                            MusicAnalysisStatus
                            .failed
                        ),

                        tempo_bpm=None,

                        key=None,

                        time_signature=None,

                        chords=[],

                        chord_events=[],

                        confidence=None,

                        message=(
                            "O arquivo é curto "
                            "demais para a análise "
                            "experimental."
                        ),
                    )
                )

            harmonic_audio = (
                librosa.effects.harmonic(
                    audio
                )
            )

            (
                tempo_bpm,
                beat_frames,
            ) = get_tempo(
                audio=audio,
                sample_rate=sample_rate,
            )

            chroma = (
                librosa.feature
                .chroma_cqt(
                    y=harmonic_audio,
                    sr=sample_rate,
                    hop_length=HOP_LENGTH,
                )
            )

            (
                key,
                key_confidence,
            ) = estimate_key(
                chroma
            )

            chord_events = (
                build_chord_events(
                    chroma=chroma,
                    beat_frames=(
                        beat_frames
                    ),
                    sample_rate=(
                        sample_rate
                    ),
                )
            )

            chords = unique_chords(
                chord_events
            )

            confidence = (
                overall_confidence(
                    events=(
                        chord_events
                    ),
                    key_confidence=(
                        key_confidence
                    ),
                )
            )

        except Exception as error:
            return (
                MusicAnalysisResult(
                    song_id=song_id,

                    provider=self.name,

                    status=(
                        MusicAnalysisStatus
                        .failed
                    ),

                    tempo_bpm=None,

                    key=None,

                    time_signature=None,

                    chords=[],

                    chord_events=[],

                    confidence=None,

                    message=(
                        "Não foi possível "
                        "analisar o arquivo "
                        "de áudio: "
                        f"{error}"
                    ),
                )
            )

        return MusicAnalysisResult(
            song_id=song_id,

            provider=self.name,

            status=(
                MusicAnalysisStatus
                .experimental
            ),

            tempo_bpm=tempo_bpm,

            key=key,

            time_signature=None,

            chords=chords,

            chord_events=(
                chord_events
            ),

            confidence=confidence,

            message=(
                "Análise automática "
                "experimental. BPM, "
                "tonalidade e acordes "
                "são candidatos e precisam "
                "ser validados antes da "
                "geração de uma aula."
            ),
        )