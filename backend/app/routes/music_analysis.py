from fastapi import (
    APIRouter,
)

from app.schemas.music_analysis import (
    MusicAnalysisResult,
)

from app.services.music_analysis_service import (
    analyze_song,
    get_music_analysis_provider,
)


router = APIRouter(
    prefix="/music-analysis",
    tags=["Music Analysis"],
)


@router.get("/status")
def music_analysis_status():
    provider = (
        get_music_analysis_provider()
    )

    return {
        "provider": provider.name,
        "available": (
            provider.available
        ),
    }


@router.post(
    "/{song_id}",
    response_model=(
        MusicAnalysisResult
    ),
)
async def analyze(
    song_id: str,
):
    return await analyze_song(
        song_id
    )