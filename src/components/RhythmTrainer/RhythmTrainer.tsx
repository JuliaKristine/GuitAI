import { useEffect, useState } from 'react'

import type { RhythmPattern } from '../../data/lessons'

type RhythmTrainerProps = {
  rhythm: RhythmPattern
}

function RhythmTrainer({
  rhythm,
}: RhythmTrainerProps) {
  const [bpm, setBpm] = useState(rhythm.bpm)

  const [isPlaying, setIsPlaying] =
    useState(false)

  const [activeBeat, setActiveBeat] =
    useState(-1)

  useEffect(() => {
    if (!isPlaying) {
      setActiveBeat(-1)
      return
    }

    setActiveBeat(0)

    const intervalTime = 60000 / bpm

    const interval = window.setInterval(() => {
      setActiveBeat((currentBeat) => {
        return (
          (currentBeat + 1) %
          rhythm.beats.length
        )
      })
    }, intervalTime)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    isPlaying,
    bpm,
    rhythm.beats.length,
  ])

  function togglePractice() {
    setIsPlaying((playing) => !playing)
  }

  return (
    <section className="rhythm-trainer">
      <div className="rhythm-header">
        <div>
          <span className="rhythm-label">
            🥁 RITMO
          </span>

          <h4>{rhythm.name}</h4>
        </div>

        <div className="bpm-display">
          <strong>{bpm}</strong>
          <span>BPM</span>
        </div>
      </div>

      <p className="rhythm-description">
        Passe a mão pelas cordas seguindo as
        setas no tempo indicado.
      </p>

      <div className="beat-count">
        {rhythm.beats.map((_, index) => (
          <span key={index}>
            {index + 1}
          </span>
        ))}
      </div>

      <div className="rhythm-beats">
        {rhythm.beats.map(
          (direction, index) => (
            <div
              key={index}
              className={
                activeBeat === index
                  ? 'rhythm-beat active'
                  : 'rhythm-beat'
              }
            >
              <span className="strum-arrow">
                {direction === 'down'
                  ? '↓'
                  : '↑'}
              </span>

              <small>
                {direction === 'down'
                  ? 'baixo'
                  : 'cima'}
              </small>
            </div>
          )
        )}
      </div>

      <div className="tempo-control">
        <div className="tempo-title">
          <span>🐢 Lento</span>
          <span>🐇 Rápido</span>
        </div>

        <input
          type="range"
          min="40"
          max="120"
          step="5"
          value={bpm}
          onChange={(event) =>
            setBpm(Number(event.target.value))
          }
          aria-label="Velocidade do ritmo"
        />
      </div>

      <button
        type="button"
        className={
          isPlaying
            ? 'rhythm-button playing'
            : 'rhythm-button'
        }
        onClick={togglePractice}
        aria-pressed={isPlaying}
      >
        {isPlaying
          ? '■ Parar'
          : '▶ Praticar ritmo'}
      </button>

      <p className="rhythm-tip">
        💡 Comece devagar. O objetivo agora é
        manter todas as batidas no mesmo tempo.
      </p>
    </section>
  )
}

export default RhythmTrainer