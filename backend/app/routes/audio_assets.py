from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.schemas.audio_asset import (
    AudioAssetResponse,
)

from app.services.audio_asset_service import (
    AudioAssetError,
    get_audio_asset,
    save_audio_asset,
)


router = APIRouter(
    prefix="/audio-assets",
    tags=["Audio Assets"],
)


@router.post(
    "/{song_id}",
    response_model=(
        AudioAssetResponse
    ),
    status_code=(
        status.HTTP_201_CREATED
    ),
)
async def upload_audio(
    song_id: str,
    file: UploadFile = File(
        ...
    ),
):
    try:
        return await save_audio_asset(
            song_id=song_id,
            upload=file,
        )

    except AudioAssetError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error


@router.get(
    "/{song_id}",
    response_model=(
        AudioAssetResponse
    ),
)
def read_audio_asset(
    song_id: str,
):
    asset = get_audio_asset(
        song_id
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail=(
                "Nenhum áudio foi "
                "enviado para esta música."
            ),
        )

    return asset