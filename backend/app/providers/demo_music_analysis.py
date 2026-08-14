from app.data.demo_music_analysis import (
    DEMO_MUSIC_ANALYSES,
)

from app.providers.music_analysis_base import (
    MusicAnalysisProvider,
)

from app.schemas.music_analysis import (
    ChordEvent,
    MusicAnalysisResult,
    MusicAnalysisStatus,
)


class DemoMusicAnalysisProvider(
    MusicAnalysisProvider
):
    @property
    def name(self) -> str:
        return "demo"

    @property
    def available(self) -> bool:
        return True

    async def analyze(
        self,
        song_id: str,
    ) -> MusicAnalysisResult:
        analysis_data = (
            DEMO_MUSIC_ANALYSES.get(
                song_id
            )
        )

        if not analysis_data:
            return MusicAnalysisResult(
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
                    "O provider demo só possui "
                    "dados para músicas fictícias "
                    "do GuitAI."
                ),
            )

        chord_events = [
            ChordEvent(
                chord=event["chord"],
                measure=event["measure"],
                beat=event["beat"],
            )
            for event
            in analysis_data[
                "chord_events"
            ]
        ]

        return MusicAnalysisResult(
            song_id=song_id,
            provider=self.name,
            status=(
                MusicAnalysisStatus.ready
            ),
            tempo_bpm=(
                analysis_data[
                    "tempo_bpm"
                ]
            ),
            key=(
                analysis_data["key"]
            ),
            time_signature=(
                analysis_data[
                    "time_signature"
                ]
            ),
            chords=(
                analysis_data[
                    "chords"
                ]
            ),
            chord_events=chord_events,
            confidence=1.0,
            message=(
                "Análise demo carregada "
                "com dados controlados "
                "de desenvolvimento."
            ),
        )