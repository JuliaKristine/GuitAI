from app.config import (
    get_settings,
)

from app.providers.demo_music_analysis import (
    DemoMusicAnalysisProvider,
)

from app.providers.local_audio_music_analysis import (
    LocalAudioMusicAnalysisProvider,
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

_local_audio_provider = (
    LocalAudioMusicAnalysisProvider()
)

_unavailable_provider = (
    UnavailableMusicAnalysisProvider()
)


def get_music_analysis_provider(
) -> MusicAnalysisProvider:
    settings = get_settings()

    provider_name = (
        settings
        .music_analysis_provider
        .strip()
        .lower()
    )

    if provider_name == "demo":
        return _demo_provider

    if provider_name in {
        "local-audio",
        "local_audio",
    }:
        return (
            _local_audio_provider
        )

    return (
        _unavailable_provider
    )


async def analyze_song(
    song_id: str,
) -> MusicAnalysisResult:
    provider = (
        get_music_analysis_provider()
    )

    return await provider.analyze(
        song_id
    )