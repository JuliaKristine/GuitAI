from abc import (
    ABC,
    abstractmethod,
)

from app.schemas.music_analysis import (
    MusicAnalysisResult,
)


class MusicAnalysisProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def available(self) -> bool:
        pass

    @abstractmethod
    async def analyze(
        self,
        song_id: str,
    ) -> MusicAnalysisResult:
        pass