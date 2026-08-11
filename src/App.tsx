import LessonPlayer from './components/LessonPlayer/LessonPlayer'

import { firstLesson } from './data/lessons'

function App() {
  return (
    <main className="app">
      <section className="hero">
        <div className="logo">
          Guit<span>AI</span>
        </div>

        <p className="tagline">
          Sua música vira aula.
        </p>

        <h1>
          Aprenda guitarra tocando
          <span> as músicas que você ama.</span>
        </h1>

        <p className="description">
          O GuitAI transforma músicas em aulas simples e
          visuais, mostrando exatamente onde colocar os
          dedos, quais cordas tocar e como fazer cada acorde.
        </p>
      </section>

      <LessonPlayer lesson={firstLesson} />

      <footer>
        GuitAI • Aprenda acorde por acorde.
      </footer>
    </main>
  )
}

export default App