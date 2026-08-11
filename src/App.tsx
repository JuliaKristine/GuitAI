import './App.css'

function App() {
  return (
    <main className="app">
      <header className="hero">
        <div className="brand">
          Guit<span>AI</span>
        </div>

        <p className="tagline">Sua música vira aula.</p>

        <h1>
          Aprenda guitarra tocando
          <strong> as músicas que você ama.</strong>
        </h1>

        <p className="description">
          O guitAI transforma músicas em aulas simples e visuais,
          mostrando acordes, dedos, cordas e cada passo necessário
          para você começar a tocar.
        </p>
      </header>

      <section className="lesson-card">
        <div className="lesson-header">
          <div>
            <span className="label">PRIMEIRA AULA</span>
            <h2>Vamos aprender um acorde?</h2>
          </div>

          <span className="level">🌱 Iniciante</span>
        </div>

        <div className="chord-preview">
          <div className="chord-name">G</div>

          <div className="chord-placeholder">
            🎸
            <span>Diagrama do acorde</span>
          </div>
        </div>

        <div className="instructions">
          <p>👆 Vamos mostrar onde colocar cada dedo.</p>
          <p>🎵 Você também verá quais cordas deve tocar.</p>
          <p>🐢 Tudo explicado passo a passo.</p>
        </div>

        <button className="start-button">
          Começar a aprender
          <span>→</span>
        </button>
      </section>

      <footer>
        <p>guitAI • Aprenda acorde por acorde.</p>
      </footer>
    </main>
  )
}

export default App