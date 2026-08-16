from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class AudioAssetResponse(BaseModel):
    song_id: str

    filename: str

    content_type: str | None

    extension: str

    size_bytes: int

    stored_at: datetime

    status: Literal["stored"]