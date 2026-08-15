import { useState } from "react";

import LessonGeneration from "./components/LessonGeneration/LessonGeneration";
import LessonPlayer from "./components/LessonPlayer/LessonPlayer";
import PracticeMode from "./components/PracticeMode/PracticeMode";
import SongSearch from "./components/SongSearch/SongSearch";

import { guitaiSongService } from "./services/guitaiSongService";

import { songService } from "./services/songService";

import type { Lesson } from "./data/lessons";

import type { SpotifyTrack } from "./services/spotifyService";

import type { GuitAISong } from "./types/guitaiSong";

type AppMode = "lesson" | "practice";

const availableSongs = songService.getAllSongs();

function App() {
  const [mode, setMode] = useState<AppMode>("lesson");

  const [selectedSongId, setSelectedSongId] = useState(
    availableSongs[0]?.id ?? "",
  );

  const [spotifySong, setSpotifySong] = useState<GuitAISong | null>(null);

  const [generatedLesson, setGeneratedLesson] = useState<Lesson | null>(null);

  const selectedSong =
    songService.getSongById(selectedSongId) ?? availableSongs[0];

  function selectDemoSong(songId: string) {
    const song = songService.getSongById(songId);

    if (!song) {
      return;
    }

    setSpotifySong(null);

    setGeneratedLesson(null);

    setSelectedSongId(song.id);

    setMode("lesson");
  }

  async function learnSpotifyTrack(track: SpotifyTrack) {
    const preparedSong = await guitaiSongService.prepareSpotifyTrack(track);

    setSpotifySong(preparedSong);

    setGeneratedLesson(null);

    setMode("lesson");
  }

  function handleGeneratedLessonReady(lesson: Lesson) {
    setGeneratedLesson(lesson);

    setMode("lesson");
  }

  function restoreOriginalLesson() {
    setGeneratedLesson(null);

    setMode("lesson");
  }

  function returnToDemo() {
    setSpotifySong(null);

    setGeneratedLesson(null);

    setMode("lesson");
  }

  function formatDuration(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function renderLearningWorkspace(lesson: Lesson, keyPrefix: string) {
    return (
      <>
        <div className="mode-selector">
          <button
            type="button"
            className={mode === "lesson" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("lesson")}
          >
            📚 Aula
          </button>

          <button
            type="button"
            className={
              mode === "practice" ? "mode-button active" : "mode-button"
            }
            onClick={() => setMode("practice")}
          >
            🎸 Prática
          </button>
        </div>

        {mode === "lesson" ? (
          <LessonPlayer
            key={`lesson-${keyPrefix}-${lesson.id}`}
            lesson={lesson}
          />
        ) : (
          <PracticeMode
            key={`practice-${keyPrefix}-${lesson.id}`}
            lesson={lesson}
          />
        )}
      </>
    );
  }

  if (!selectedSong) {
    return (
      <main className="app">
        <p>Nenhuma música disponível no momento.</p>
      </main>
    );
  }

  const activeDemoLesson = generatedLesson ?? selectedSong.lesson;

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <div className="logo">
            Guit
            <span>AI</span>
          </div>

          <span className="hero-tag">Sua música vira aula.</span>

          <h1>Aprenda guitarra tocando as músicas que você ama.</h1>

          <p>
            Procure uma música, aprenda os acordes passo a passo e pratique no
            seu ritmo.
          </p>
        </div>
      </header>

      <main className="main-content">
        <SongSearch
          selectedSongId={selectedSong.id}
          onSelectSong={selectDemoSong}
          onLearnSpotifyTrack={learnSpotifyTrack}
        />

        {spotifySong ? (
          <>
            <section className="prepared-song">
              <span className="prepared-song-label">🎸 MÚSICA PREPARADA</span>

              <div className="prepared-song-main">
                {spotifySong.image_url ? (
                  <img
                    className="prepared-song-cover"
                    src={spotifySong.image_url}
                    alt={`Capa de ${spotifySong.album}`}
                  />
                ) : (
                  <div className="prepared-song-cover prepared-song-cover-placeholder">
                    🎵
                  </div>
                )}

                <div className="prepared-song-info">
                  <h2>{spotifySong.title}</h2>

                  <strong>{spotifySong.artist}</strong>

                  <p>{spotifySong.album}</p>

                  <div className="prepared-song-meta">
                    <span>⏱ {formatDuration(spotifySong.duration_ms)}</span>

                    <span>🟢 Spotify</span>

                    {spotifySong.explicit && <span>E Explícito</span>}
                  </div>
                </div>
              </div>

              <div className="lesson-preparation-status">
                <div className="lesson-preparation-icon">🧠</div>

                <div>
                  <span>MOTOR EDUCACIONAL</span>

                  <h3>Preparar a aula desta música</h3>

                  <p>
                    A faixa está pronta para entrar no pipeline de análise
                    musical, simplificação e geração de aula.
                  </p>
                </div>
              </div>

              <LessonGeneration
                key={`spotify-generator-${spotifySong.id}`}
                songId={spotifySong.id}
                onLessonReady={handleGeneratedLessonReady}
              />

              <div className="prepared-song-actions">
                {spotifySong.source_url && (
                  <a
                    href={spotifySong.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="prepared-spotify-button"
                  >
                    🟢 Abrir no Spotify
                  </a>
                )}

                <button
                  type="button"
                  className="prepared-back-button"
                  onClick={returnToDemo}
                >
                  ← Voltar para demos
                </button>
              </div>
            </section>

            {generatedLesson && (
              <>
                <div className="generated-lesson-active">
                  <div>
                    <span>✅</span>

                    <div>
                      <strong>Aula gerada ativa</strong>

                      <p>
                        Esta aula veio diretamente do motor pedagógico do
                        backend.
                      </p>
                    </div>
                  </div>
                </div>

                {renderLearningWorkspace(
                  generatedLesson,
                  `spotify-${spotifySong.id}`,
                )}
              </>
            )}
          </>
        ) : (
          <>
            <section className="selected-song">
              <span className="selected-song-label">🎵 MÚSICA SELECIONADA</span>

              <div className="selected-song-info">
                <span className="selected-song-emoji">
                  {selectedSong.emoji}
                </span>

                <div>
                  <h2>{selectedSong.title}</h2>

                  <p>{selectedSong.artist}</p>
                </div>
              </div>

              <div className="selected-song-progression">
                {selectedSong.progression.map((chord, index) => (
                  <span key={`${chord}-${index}`}>{chord}</span>
                ))}
              </div>
            </section>

            <LessonGeneration
              key={`demo-generator-${selectedSong.id}`}
              songId={selectedSong.id}
              onLessonReady={handleGeneratedLessonReady}
            />

            {generatedLesson && (
              <div className="generated-lesson-active">
                <div>
                  <span>✅</span>

                  <div>
                    <strong>Aula gerada ativa</strong>

                    <p>
                      LessonPlayer e PracticeMode agora usam a aula criada pelo
                      backend.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="generated-lesson-reset-button"
                  onClick={restoreOriginalLesson}
                >
                  ↩ Usar aula original
                </button>
              </div>
            )}

            {renderLearningWorkspace(
              activeDemoLesson,
              generatedLesson
                ? `generated-${selectedSong.id}`
                : `original-${selectedSong.id}`,
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <strong>GuitAI</strong>

        <span>Sua música vira aula. 🎸</span>
      </footer>
    </div>
  );
}

export default App;
