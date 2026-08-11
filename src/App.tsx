import { useState } from "react";
import ChordDiagram from "./components/ChordDiagram/ChordDiagram";
import { chords } from "./data/chords";

function App() {
  const [selectedChord, setSelectedChord] = useState("G");

  return (
    <main className="app">
      <section className="hero">
        <div className="logo">
          Guit<span>AI</span>
        </div>

        <p className="tagline">Sua música vira aula.</p>

        <h1>
          Aprenda guitarra tocando
          <span> as músicas que você ama.</span>
        </h1>

        <p className="description">
          O GuitAI transforma músicas em aulas simples e visuais, mostrando
          exatamente onde colocar os dedos, quais cordas tocar e como fazer cada
          acorde.
        </p>
      </section>

      <section className="lesson-card">
        <div className="lesson-header">
          <div>
            <span className="lesson-label">PRIMEIRA AULA</span>

            <h2>Vamos aprender um acorde?</h2>
          </div>

          <span className="level">🌱 Iniciante</span>
        </div>

        <div className="chord-selector">
          <p>Escolha um acorde:</p>

          <div className="chord-buttons">
            {Object.keys(chords).map((chord) => (
              <button
                key={chord}
                type="button"
                className={selectedChord === chord ? "active" : ""}
                onClick={() => setSelectedChord(chord)}
              >
                {chord}
              </button>
            ))}
          </div>
        </div>

        <div className="chord-area">
          <ChordDiagram chord={selectedChord} />
        </div>

        <div className="instructions">
          <p>👆 Vamos mostrar onde colocar cada dedo.</p>

          <p>🎵 Você verá exatamente quais cordas tocar.</p>

          <p>🐢 Tudo será ensinado passo a passo.</p>
        </div>

        <button type="button" className="start-button">
          Começar a aprender
          <span>→</span>
        </button>
      </section>

      <footer>GuitAI • Aprenda acorde por acorde.</footer>
    </main>
  );
}

export default App;
