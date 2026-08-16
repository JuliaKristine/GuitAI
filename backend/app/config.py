from functools import lru_cache
from pathlib import Path

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


BACKEND_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

ENV_FILE = (
    BACKEND_DIR
    / ".env"
)


class Settings(BaseSettings):
    app_name: str = "GuitAI API"

    app_description: str = (
        "Backend da plataforma GuitAI."
    )

    app_version: str = "0.1.0"

    app_env: str = "development"

    cors_origins: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )

    spotify_client_id: str | None = None

    spotify_client_secret: str | None = None

    spotify_market: str = "BR"

    music_analysis_provider: str = (
        "demo"
    )

    audio_max_upload_mb: int = 50

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(
        self,
    ) -> list[str]:
        return [
            origin
            .strip()
            .rstrip("/")
            for origin
            in self.cors_origins.split(",")
            if origin.strip()
        ]

    @property
    def spotify_configured(
        self,
    ) -> bool:
        return bool(
            self.spotify_client_id
            and self.spotify_client_secret
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()