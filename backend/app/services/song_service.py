import unicodedata

from app.data.songs import SONGS
from app.schemas.song import SongSummary


def normalize_text(value: str) -> str:
    normalized = unicodedata.normalize(
        "NFD",
        value,
    )

    without_accents = "".join(
        character
        for character in normalized
        if unicodedata.category(character) != "Mn"
    )

    return (
        without_accents
        .strip()
        .lower()
    )


def get_all_songs() -> list[SongSummary]:
    return [
        SongSummary(**song)
        for song in SONGS
    ]


def get_song_by_id(
    song_id: str,
) -> SongSummary | None:
    for song in SONGS:
        if song["id"] == song_id:
            return SongSummary(**song)

    return None


def search_songs(
    query: str,
) -> list[SongSummary]:
    normalized_query = normalize_text(
        query
    )

    if not normalized_query:
        return get_all_songs()

    results = []

    for song in SONGS:
        normalized_title = normalize_text(
            song["title"]
        )

        normalized_artist = normalize_text(
            song["artist"]
        )

        if (
            normalized_query
            in normalized_title
            or normalized_query
            in normalized_artist
        ):
            results.append(
                SongSummary(**song)
            )

    return results