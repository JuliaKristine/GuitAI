import { useState } from "react";

import LessonPlayer from "./components/LessonPlayer/LessonPlayer";
import PracticeMode from "./components/PracticeMode/PracticeMode";
import SongSearch from "./components/SongSearch/SongSearch";

import { songService } from "./services/songService";

type AppMode = "lesson" | "practice";

const availableSongs = songService.getAllSongs();

function App() {
  const [mode, setMode] = useState<AppMode>("lesson");

  const [selectedSongId, setSelectedSongId] = useState(
    availableSongs[0]?.id ?? "",
  );

  const selectedSong =
    songService.getSongById(selectedSongId) ?? availableSongs[0];

  if (!selectedSong) {
    return (
      <main className="app">
        <p>Nenhuma música disponível no momento.</p>
      </main>
    );
  }

  function selectSong(songId: string) {
    const song = songService.getSongById(songId);

    /*
     * Não altera o estado caso
     * a música não exista.
     */
    if (!song) {
      return;
    }

    setSelectedSongId(song.id);

    /*
     * Quando uma nova música
     * é selecionada, iniciamos
     * novamente pela aula.
     */
    setMode("lesson");
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
        {/* Busca */}

        <SongSearch
          selectedSongId={selectedSong.id}
          onSelectSong={selectSong}
        />

        {/* Música selecionada */}

        <section className="selected-song">
          <span className="selected-song-label">🎵 MÚSICA SELECIONADA</span>

          <div className="selected-song-info">
            <span className="selected-song-emoji">{selectedSong.emoji}</span>

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

        {/* Aula / Prática */}

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

        {/* Conteúdo */}

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
      </main>

      <footer className="footer">
        <strong>GuitAI</strong>

        <span>Sua música vira aula. 🎸</span>
      </footer>
    </div>
  );
}

export default App;
