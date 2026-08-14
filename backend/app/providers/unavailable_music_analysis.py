from app.providers.music_analysis_base import (
    MusicAnalysisProvider,
)

from app.schemas.music_analysis import (
    MusicAnalysisResult,
    MusicAnalysisStatus,
)


class UnavailableMusicAnalysisProvider(
    MusicAnalysisProvider
):
    @property
    def name(self) -> str:
        return "unavailable"

    @property
    def available(self) -> bool:
        return False

    async def analyze(
        self,
        song_id: str,
    ) -> MusicAnalysisResult:
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
                "Nenhum provedor de análise "
                "musical está conectado."
            ),
        )