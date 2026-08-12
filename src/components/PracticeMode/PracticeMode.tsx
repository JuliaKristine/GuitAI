import { useEffect, useRef, useState } from 'react'

import ChordDiagram from '../ChordDiagram/ChordDiagram'

import type { Lesson } from '../../data/lessons'

type PracticeModeProps = {
  lesson: Lesson
}

function PracticeMode({
  lesson,
}: PracticeModeProps) {
  const [bpm, setBpm] = useState(
    lesson.rhythm.bpm
  )

  const [isPlaying, setIsPlaying] =
    useState(false)

  const [activeBeat, setActiveBeat] =
    useState(-1)

  const [currentChordIndex, setCurrentChordIndex] =
    useState(0)

  const audioContextRef =
    useRef<AudioContext | null>(null)

  const currentChord =
    lesson.steps[currentChordIndex].chord

  const nextChord =
    lesson.steps[
      (currentChordIndex + 1) %
        lesson.steps.length
    ].chord

  async function prepareAudio() {
    if (!audioContextRef.current) {
      audioContextRef.current =
        new AudioContext()
    }

    if (
      audioContextRef.current.state ===
      'suspended'
    ) {
      await audioContextRef.current.resume()
    }
  }

  useEffect(() => {
    if (!isPlaying) {
      setActiveBeat(-1)
      return
    }

    const audioContext =
      audioContextRef.current

    if (!audioContext) {
      return
    }

    const beatsPerChord =
      lesson.rhythm.beats.length

    const intervalTime =
      60000 / bpm

    let beatIndex = 0

    function playClick(
      currentBeat: number
    ) {
      const oscillator =
        audioContext.createOscillator()

      const gain =
        audioContext.createGain()

      oscillator.frequency.value =
        currentBeat === 0
          ? 1200
          : 850

      gain.gain.setValueAtTime(
        0.18,
        audioContext.currentTime
      )

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.06
      )

      oscillator.connect(gain)

      gain.connect(
        audioContext.destination
      )

      oscillator.start()

      oscillator.stop(
        audioContext.currentTime + 0.06
      )
    }

    setActiveBeat(0)

    playClick(0)

    const interval =
      window.setInterval(() => {
        beatIndex =
          (beatIndex + 1) %
          beatsPerChord

        setActiveBeat(beatIndex)

        if (beatIndex === 0) {
          setCurrentChordIndex(
            (currentIndex) =>
              (currentIndex + 1) %
              lesson.steps.length
          )
        }

        playClick(beatIndex)
      }, intervalTime)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    isPlaying,
    bpm,
    lesson.rhythm.beats.length,
    lesson.steps.length,
  ])

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close()
      }
    }
  }, [])

  async function startPractice() {
    setCurrentChordIndex(0)

    await prepareAudio()

    setIsPlaying(true)
  }

  function stopPractice() {
    setIsPlaying(false)
  }

  return (
    <section className="practice-mode">
      <div className="practice-header">
        <div>
          <span className="lesson-label">
            🎸 MODO PRÁTICA
          </span>

          <h2>
            Pratique a progressão
          </h2>

          <p>
            Toque quatro batidas e troque
            para o próximo acorde.
          </p>
        </div>

        <div className="bpm-display">
          <strong>{bpm}</strong>
          <span>BPM</span>
        </div>
      </div>

      <div className="practice-progression">
        {lesson.steps.map(
          (step, index) => (
            <div
              key={step.chord}
              className={
                currentChordIndex === index
                  ? 'practice-chord active'
                  : 'practice-chord'
              }
            >
              {step.chord}
            </div>
          )
        )}
      </div>

      <div className="practice-current">
        <span>TOQUE AGORA</span>

        <strong>
          {currentChord}
        </strong>

        <p>
          Próximo acorde:
          {' '}
          <b>{nextChord}</b>
        </p>
      </div>

      <div className="practice-diagram">
        <ChordDiagram
          chord={currentChord}
        />
      </div>

      <div className="practice-beats">
        {lesson.rhythm.beats.map(
          (direction, index) => (
            <div
              key={index}
              className={
                activeBeat === index
                  ? 'practice-beat active'
                  : 'practice-beat'
              }
            >
              <small>
                {index + 1}
              </small>

              <strong>
                {direction === 'down'
                  ? '↓'
                  : '↑'}
              </strong>
            </div>
          )
        )}
      </div>

      <div className="practice-message">
        {isPlaying ? (
          <>
            🎵 Toque
            {' '}
            <strong>
              {currentChord}
            </strong>
            {' '}
            acompanhando o metrônomo.
          </>
        ) : (
          <>
            🐢 Comece devagar e tente
            manter todas as batidas iguais.
          </>
        )}
      </div>

      <div className="tempo-control">
        <div className="tempo-title">
          <span>🐢 Lento</span>

          <span>
            {bpm} BPM
          </span>

          <span>🐇 Rápido</span>
        </div>

        <input
          type="range"
          min="40"
          max="120"
          step="5"
          value={bpm}
          onChange={(event) =>
            setBpm(
              Number(event.target.value)
            )
          }
          aria-label="Velocidade da prática"
        />
      </div>

      {!isPlaying ? (
        <button
          type="button"
          className="practice-start-button"
          onClick={startPractice}
        >
          ▶ Começar prática
        </button>
      ) : (
        <button
          type="button"
          className="practice-stop-button"
          onClick={stopPractice}
        >
          ■ Parar prática
        </button>
      )}
    </section>
  )
}

export default PracticeMode