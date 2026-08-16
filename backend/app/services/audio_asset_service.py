import hashlib
import json

from datetime import (
    datetime,
    timezone,
)

from pathlib import Path

from fastapi import UploadFile

from app.config import (
    BACKEND_DIR,
    get_settings,
)

from app.schemas.audio_asset import (
    AudioAssetResponse,
)


AUDIO_DATA_DIR = (
    BACKEND_DIR
    / ".data"
    / "audio"
)


ALLOWED_EXTENSIONS = {
    ".wav",
    ".mp3",
    ".flac",
    ".ogg",
}


class AudioAssetError(
    Exception
):
    pass


def utc_now() -> datetime:
    return datetime.now(
        timezone.utc
    )


def get_asset_key(
    song_id: str,
) -> str:
    return hashlib.sha256(
        song_id.encode(
            "utf-8"
        )
    ).hexdigest()[:24]


def get_metadata_path(
    song_id: str,
) -> Path:
    asset_key = get_asset_key(
        song_id
    )

    return (
        AUDIO_DATA_DIR
        / f"{asset_key}.json"
    )


def remove_previous_audio(
    song_id: str,
):
    if not AUDIO_DATA_DIR.exists():
        return

    asset_key = get_asset_key(
        song_id
    )

    for path in (
        AUDIO_DATA_DIR
        .glob(
            f"{asset_key}.*"
        )
    ):
        if (
            path.suffix
            == ".json"
        ):
            continue

        if path.is_file():
            path.unlink(
                missing_ok=True
            )


async def save_audio_asset(
    song_id: str,
    upload: UploadFile,
) -> AudioAssetResponse:
    settings = get_settings()

    original_filename = (
        upload.filename
        or "audio"
    )

    extension = (
        Path(
            original_filename
        )
        .suffix
        .lower()
    )

    if (
        extension
        not in ALLOWED_EXTENSIONS
    ):
        raise AudioAssetError(
            (
                "Formato não suportado. "
                "Use WAV, MP3, FLAC "
                "ou OGG."
            )
        )

    max_bytes = (
        settings
        .audio_max_upload_mb
        * 1024
        * 1024
    )

    AUDIO_DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    remove_previous_audio(
        song_id
    )

    asset_key = get_asset_key(
        song_id
    )

    final_path = (
        AUDIO_DATA_DIR
        / (
            asset_key
            + extension
        )
    )

    temporary_path = (
        AUDIO_DATA_DIR
        / (
            asset_key
            + ".uploading"
        )
    )

    total_size = 0

    try:
        with temporary_path.open(
            "wb"
        ) as destination:
            while True:
                chunk = await upload.read(
                    1024 * 1024
                )

                if not chunk:
                    break

                total_size += len(
                    chunk
                )

                if (
                    total_size
                    > max_bytes
                ):
                    raise AudioAssetError(
                        (
                            "O arquivo excede "
                            f"o limite de "
                            f"{settings.audio_max_upload_mb} MB."
                        )
                    )

                destination.write(
                    chunk
                )

        if total_size == 0:
            raise AudioAssetError(
                "O arquivo enviado está vazio."
            )

        temporary_path.replace(
            final_path
        )

    except Exception:
        temporary_path.unlink(
            missing_ok=True
        )

        raise

    finally:
        await upload.close()

    stored_at = utc_now()

    response = (
        AudioAssetResponse(
            song_id=song_id,

            filename=(
                original_filename
            ),

            content_type=(
                upload.content_type
            ),

            extension=extension,

            size_bytes=(
                total_size
            ),

            stored_at=(
                stored_at
            ),

            status="stored",
        )
    )

    metadata_path = (
        get_metadata_path(
            song_id
        )
    )

    metadata_path.write_text(
        json.dumps(
            response.model_dump(
                mode="json"
            ),
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    return response


def get_audio_asset(
    song_id: str,
) -> (
    AudioAssetResponse
    | None
):
    metadata_path = (
        get_metadata_path(
            song_id
        )
    )

    if (
        not metadata_path.exists()
    ):
        return None

    try:
        data = json.loads(
            metadata_path.read_text(
                encoding="utf-8"
            )
        )

        return (
            AudioAssetResponse
            .model_validate(
                data
            )
        )

    except (
        json.JSONDecodeError,
        ValueError,
    ):
        return None


def get_audio_file_path(
    song_id: str,
) -> Path | None:
    asset = get_audio_asset(
        song_id
    )

    if not asset:
        return None

    asset_key = get_asset_key(
        song_id
    )

    path = (
        AUDIO_DATA_DIR
        / (
            asset_key
            + asset.extension
        )
    )

    if not path.exists():
        return None

    return path


def has_audio_asset(
    song_id: str,
) -> bool:
    return (
        get_audio_file_path(
            song_id
        )
        is not None
    )