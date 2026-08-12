from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.songs import router as songs_router


app = FastAPI(
    title="GuitAI API",
    description="Backend da plataforma GuitAI.",
    version="0.1.0",
)


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


@app.get("/")
def root():
    return {
        "name": "GuitAI API",
        "status": "online",
        "docs": "/docs",
    }


app.include_router(
    health_router
)

app.include_router(
    songs_router
)