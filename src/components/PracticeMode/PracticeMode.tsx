import { useEffect, useRef, useState } from "react";

import ChordDiagram from "../ChordDiagram/ChordDiagram";

import type { Lesson } from "../../data/lessons";

type PracticeModeProps = {
  lesson: Lesson;
};

type CountInValue = 3 | 2 | 1 | "go" | null;

function PracticeMode({ lesson }: PracticeModeProps) {
  const [bpm, setBpm] = useState(lesson.rhythm.bpm);

  const [isPlaying, setIsPlaying] = useState(false);

  const [activeBeat, setActiveBeat] = useState(-1);

  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const [countIn, setCountIn] = useState<CountInValue>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  const currentChord = lesson.steps[currentChordIndex].chord;

  const nextChord =
    lesson.steps[(currentChordIndex + 1) % lesson.steps.length].chord;

  const lastBeatIndex = lesson.rhythm.beats.length - 1;

  const transitionCountdown =
    isPlaying && activeBeat >= 1
      ? lesson.rhythm.beats.length - activeBeat
      : null;

  async function prepareAudio() {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  }

  // Contagem inicial: 3 → 2 → 1 → VAI!
  useEffect(() => {
    if (countIn === null) {
      return;
    }

    if (countIn === "go") {
      const goTimer = window.setTimeout(() => {
        setCountIn(null);
      }, 600);

      return () => {
        window.clearTimeout(goTimer);
      };
    }

    const timer = window.setTimeout(() => {
      if (countIn === 3) {
        setCountIn(2);
        return;
      }

      if (countIn === 2) {
        setCountIn(1);
        return;
      }

      setCountIn("go");
      setIsPlaying(true);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [countIn]);

  // Metrônomo + troca automática de acordes
  useEffect(() => {
    if (!isPlaying) {
      setActiveBeat(-1);
      return;
    }

    const audioContext = audioContextRef.current;

    if (!audioContext) {
      return;
    }

    const beatsPerChord = lesson.rhythm.beats.length;

    const intervalTime = 60000 / bpm;

    let beatIndex = 0;

    function playClick(currentBeat: number, context: AudioContext) {
      const oscillator = context.createOscillator();

      const gain = context.createGain();

      oscillator.frequency.value = currentBeat === 0 ? 1200 : 850;

      gain.gain.setValueAtTime(0.18, context.currentTime);

      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.06);

      oscillator.connect(gain);

      gain.connect(context.destination);

      oscillator.start();

      oscillator.stop(context.currentTime + 0.06);
    }

    setActiveBeat(0);

    playClick(0, audioContext);

    const interval = window.setInterval(() => {
      beatIndex = (beatIndex + 1) % beatsPerChord;

      setActiveBeat(beatIndex);

      if (beatIndex === 0) {
        setCurrentChordIndex(
          (currentIndex) => (currentIndex + 1) % lesson.steps.length,
        );
      }

      playClick(beatIndex, audioContext);
    }, intervalTime);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPlaying, bpm, lesson.rhythm.beats.length, lesson.steps.length]);

  // Fecha o sistema de áudio ao sair do componente
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  async function startPractice() {
    setIsPlaying(false);
    setCurrentChordIndex(0);
    setActiveBeat(-1);

    await prepareAudio();

    setCountIn(3);
  }

  function stopPractice() {
    setIsPlaying(false);
    setActiveBeat(-1);
    setCountIn(null);
  }

  return (
    <section className="practice-mode">
      <div className="practice-header">
        <div>
          <span className="lesson-label">🎸 MODO PRÁTICA</span>

          <h2>Pratique a progressão</h2>

          <p>Toque quatro batidas e troque para o próximo acorde.</p>
        </div>

        <div className="bpm-display">
          <strong>{bpm}</strong>
          <span>BPM</span>
        </div>
      </div>

      <div className="practice-progression">
        {lesson.steps.map((step, index) => (
          <div
            key={step.chord}
            className={
              currentChordIndex === index
                ? "practice-chord active"
                : "practice-chord"
            }
          >
            {step.chord}
          </div>
        ))}
      </div>

      <div className="practice-current">
        <span>TOQUE AGORA</span>

        <strong>{currentChord}</strong>

        <p>
          Próximo acorde: <b>{nextChord}</b>
        </p>
      </div>

      {countIn !== null && (
        <div className="count-in-card" aria-live="assertive">
          <span className="count-in-label">PREPARE-SE 🎸</span>

          <strong key={countIn} className="count-in-number">
            {countIn === "go" ? "VAI!" : countIn}
          </strong>

          <p>
            {countIn === "go"
              ? `Comece tocando ${currentChord}!`
              : `Posicione os dedos no acorde ${currentChord}.`}
          </p>
        </div>
      )}

      {transitionCountdown !== null && countIn === null && (
        <div className="chord-warning">
          <span className="warning-icon">⚠️</span>

          <div className="warning-content">
            <span className="warning-label">PREPARE O PRÓXIMO ACORDE</span>

            <strong>{nextChord}</strong>

            <p>
              Troca em
              <span className="countdown-number">{transitionCountdown}</span>
            </p>
          </div>
        </div>
      )}

      <div className="practice-diagram">
        <ChordDiagram chord={currentChord} />
      </div>

      <div className="practice-beats">
        {lesson.rhythm.beats.map((direction, index) => (
          <div
            key={index}
            className={
              activeBeat === index ? "practice-beat active" : "practice-beat"
            }
          >
            <small>{index + 1}</small>

            <strong>{direction === "down" ? "↓" : "↑"}</strong>
          </div>
        ))}
      </div>

      <div className="practice-message">
        {countIn !== null && <>🎸 Prepare sua mão antes de começar.</>}

        {!isPlaying && countIn === null && (
          <>🐢 Comece devagar e tente manter todas as batidas iguais.</>
        )}

        {isPlaying && countIn === null && activeBeat < lastBeatIndex && (
          <>
            🎵 Toque <strong>{currentChord}</strong> acompanhando o metrônomo.
          </>
        )}

        {isPlaying && countIn === null && activeBeat === lastBeatIndex && (
          <>
            ⚠️ Prepare os dedos para <strong>{nextChord}</strong>!
          </>
        )}
      </div>

      <div className="tempo-control">
        <div className="tempo-title">
          <span>🐢 Lento</span>

          <span>{bpm} BPM</span>

          <span>🐇 Rápido</span>
        </div>

        <input
          type="range"
          min="40"
          max="120"
          step="5"
          value={bpm}
          onChange={(event) => setBpm(Number(event.target.value))}
          aria-label="Velocidade da prática"
        />
      </div>

      {!isPlaying && countIn === null ? (
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
          {countIn !== null && !isPlaying
            ? "■ Cancelar contagem"
            : "■ Parar prática"}
        </button>
      )}
    </section>
  );
}

export default PracticeMode;
