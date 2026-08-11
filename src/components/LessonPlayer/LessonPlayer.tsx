import { useState } from 'react'

import ChordDiagram from '../ChordDiagram/ChordDiagram'

import type { Lesson } from '../../data/lessons'

type LessonPlayerProps = {
  lesson: Lesson
}

function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const step = lesson.steps[currentStep]

  const progress =
    ((currentStep + 1) / lesson.steps.length) * 100

  function nextStep() {
    const isLastStep =
      currentStep === lesson.steps.length - 1

    if (isLastStep) {
      setCompleted(true)
      return
    }

    setCurrentStep((step) => step + 1)
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }

  function restartLesson() {
    setCurrentStep(0)
    setCompleted(false)
  }

  if (completed) {
    return (
      <section className="lesson-player lesson-completed">
        <span className="lesson-complete-icon">
          ⭐
        </span>

        <span className="lesson-label">
          AULA CONCLUÍDA
        </span>

        <h2>Muito bem!</h2>

        <p>
          Você passou pelos quatro primeiros acordes
          do GuitAI.
        </p>

        <div className="completed-chords">
          {lesson.steps.map((lessonStep) => (
            <span key={lessonStep.chord}>
              {lessonStep.chord}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="start-button"
          onClick={restartLesson}
        >
          ↻ Fazer aula novamente
        </button>
      </section>
    )
  }

  return (
    <section className="lesson-player">
      <div className="lesson-player-header">
        <div>
          <span className="lesson-label">
            PRIMEIRA AULA
          </span>

          <h2>{lesson.title}</h2>

          <p>{lesson.description}</p>
        </div>

        <span className="level">
          🌱 Iniciante
        </span>
      </div>

      <div className="lesson-progress">
        <div className="progress-info">
          <span>
            Passo {currentStep + 1} de {lesson.steps.length}
          </span>

          <strong>
            {Math.round(progress)}%
          </strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="lesson-step-text">
        <span className="step-badge">
          {currentStep + 1}
        </span>

        <div>
          <h3>{step.title}</h3>
          <p>{step.instruction}</p>
        </div>
      </div>

      <div className="lesson-chord">
        <ChordDiagram chord={step.chord} />
      </div>

      <div className="teacher-tip">
        <span>💡</span>

        <div>
          <strong>Dica do GuitAI</strong>
          <p>{step.tip}</p>
        </div>
      </div>

      <div className="lesson-navigation">
        <button
          type="button"
          className="previous-button"
          onClick={previousStep}
          disabled={currentStep === 0}
        >
          ← Anterior
        </button>

        <button
          type="button"
          className="next-button"
          onClick={nextStep}
        >
          {currentStep === lesson.steps.length - 1
            ? 'Finalizar aula ⭐'
            : 'Próximo acorde →'}
        </button>
      </div>
    </section>
  )
}

export default LessonPlayer