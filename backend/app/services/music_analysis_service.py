from app.config import (
    get_settings,
)

from app.providers.demo_music_analysis import (
    DemoMusicAnalysisProvider,
)

from app.providers.music_analysis_base import (
    MusicAnalysisProvider,
)

from app.providers.unavailable_music_analysis import (
    UnavailableMusicAnalysisProvider,
)

from app.schemas.music_analysis import (
    MusicAnalysisResult,
)


_demo_provider = (
    DemoMusicAnalysisProvider()
)

_unavailable_provider = (
    UnavailableMusicAnalysisProvider()
)


def get_music_analysis_provider(
) -> MusicAnalysisProvider:
    settings = get_settings()

    if (
        settings.music_analysis_provider
        == "demo"
    ):
        return _demo_provider

    return _unavailable_provider


async def analyze_song(
    song_id: str,
) -> MusicAnalysisResult:
    provider = (
        get_music_analysis_provider()
    )

    return await provider.analyze(
        song_id
    )