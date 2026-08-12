import { useState } from 'react'

import LessonPlayer from './components/LessonPlayer/LessonPlayer'
import PracticeMode from './components/PracticeMode/PracticeMode'

import { firstLesson } from './data/lessons'

type AppMode =
  | 'lesson'
  | 'practice'

function App() {
  const [mode, setMode] =
    useState<AppMode>('lesson')

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
          <span>
            {' '}
            as músicas que você ama.
          </span>
        </h1>

        <p className="description">
          O GuitAI transforma músicas
          em aulas simples e visuais,
          mostrando exatamente onde
          colocar os dedos, quais
          cordas tocar e como fazer
          cada acorde.
        </p>
      </section>

      <div className="mode-selector">
        <button
          type="button"
          className={
            mode === 'lesson'
              ? 'mode-button active'
              : 'mode-button'
          }
          onClick={() =>
            setMode('lesson')
          }
        >
          📚 Aula
        </button>

        <button
          type="button"
          className={
            mode === 'practice'
              ? 'mode-button active'
              : 'mode-button'
          }
          onClick={() =>
            setMode('practice')
          }
        >
          🎸 Prática
        </button>
      </div>

      {mode === 'lesson' ? (
        <LessonPlayer
          lesson={firstLesson}
        />
      ) : (
        <PracticeMode
          lesson={firstLesson}
        />
      )}

      <footer>
        GuitAI • Aprenda acorde por acorde.
      </footer>
    </main>
  )
}

export default App