from pydantic import BaseModel


class SongSummary(BaseModel):
    id: str
    title: str
    artist: str


class SongSearchResponse(BaseModel):
    query: str
    count: int
    items: list[SongSummary]