import unicodedata

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(
    title="GuitAI API",
    description="Backend da plataforma GuitAI.",
    version="0.1.0",
)


# Permite que o frontend React
# converse com o backend durante
# o desenvolvimento local.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SongSummary(BaseModel):
    id: str
    title: str
    artist: str


class SongSearchResponse(BaseModel):
    query: str
    count: int
    items: list[SongSummary]


songs = [
    SongSummary(
        id="primeiros-passos",
        title="Primeiros Passos",
        artist="GuitAI Demo",
    ),
    SongSummary(
        id="estrada-aberta",
        title="Estrada Aberta",
        artist="The Purple Strings",
    ),
    SongSummary(
        id="noite-eletrica",
        title="Noite Elétrica",
        artist="Neon Chords",
    ),
]


def normalize_text(value: str) -> str:
    normalized = unicodedata.normalize(
        "NFD",
        value,
    )

    without_accents = "".join(
        character
        for character in normalized
        if unicodedata.category(character)
        != "Mn"
    )

    return (
        without_accents
        .strip()
        .lower()
    )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "guitai-api",
    }


@app.get(
    "/songs/search",
    response_model=SongSearchResponse,
)
def search_songs(
    q: str = Query(
        default="",
        max_length=100,
    ),
):
    normalized_query = normalize_text(q)

    if not normalized_query:
        results = songs
    else:
        results = [
            song
            for song in songs
            if (
                normalized_query
                in normalize_text(song.title)
                or normalized_query
                in normalize_text(song.artist)
            )
        ]

    return SongSearchResponse(
        query=q,
        count=len(results),
        items=results,
    )