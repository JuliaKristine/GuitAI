import { useState } from "react";

import LessonPlayer from "./components/LessonPlayer/LessonPlayer";
import PracticeMode from "./components/PracticeMode/PracticeMode";
import SongSearch from "./components/SongSearch/SongSearch";

import { guitaiSongService } from "./services/guitaiSongService";

import { songService } from "./services/songService";

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

  const selectedSong =
    songService.getSongById(selectedSongId) ?? availableSongs[0];

  function selectDemoSong(songId: string) {
    const song = songService.getSongById(songId);

    if (!song) {
      return;
    }

    setSpotifySong(null);

    setSelectedSongId(song.id);

    setMode("lesson");
  }

  async function learnSpotifyTrack(track: SpotifyTrack) {
    const preparedSong = await guitaiSongService.prepareSpotifyTrack(track);

    setSpotifySong(preparedSong);
  }

  function returnToDemo() {
    setSpotifySong(null);
    setMode("lesson");
  }

  function formatDuration(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  if (!selectedSong) {
    return (
      <main className="app">
        <p>Nenhuma música disponível no momento.</p>
      </main>
    );
  }

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
        {/* BUSCA */}

        <SongSearch
          selectedSongId={selectedSong.id}
          onSelectSong={selectDemoSong}
          onLearnSpotifyTrack={learnSpotifyTrack}
        />

        {/* MÚSICA REAL DO SPOTIFY */}

        {spotifySong ? (
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
                <span>PRÓXIMA ETAPA</span>

                <h3>Preparar a aula desta música</h3>

                <p>
                  A faixa já foi transformada em uma música interna do GuitAI.
                  Ainda não geramos acordes ou instruções, portanto nenhuma
                  cifra está sendo inventada.
                </p>
              </div>
            </div>

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
                ← Voltar para aula demo
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* DEMO SELECIONADA */}

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

            {/* AULA / PRÁTICA */}

            <div className="mode-selector">
              <button
                type="button"
                className={
                  mode === "lesson" ? "mode-button active" : "mode-button"
                }
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
                key={`lesson-${selectedSong.id}`}
                lesson={selectedSong.lesson}
              />
            ) : (
              <PracticeMode
                key={`practice-${selectedSong.id}`}
                lesson={selectedSong.lesson}
              />
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
