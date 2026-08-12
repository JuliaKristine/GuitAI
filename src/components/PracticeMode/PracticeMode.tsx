import { useEffect, useRef, useState } from "react";

import ChordDiagram from "../ChordDiagram/ChordDiagram";

import type { Lesson } from "../../data/lessons";

type PracticeModeProps = {
  lesson: Lesson;
};

type CountInValue = 3 | 2 | 1 | "go" | null;

type SpeedLevelId = "very-slow" | "learning" | "normal" | "challenge";

type SpeedLevel = {
  id: SpeedLevelId;
  emoji: string;
  name: string;
  bpm: number;
};

const speedLevels: SpeedLevel[] = [
  {
    id: "very-slow",
    emoji: "🐢",
    name: "Bem devagar",
    bpm: 40,
  },
  {
    id: "learning",
    emoji: "🌱",
    name: "Aprendendo",
    bpm: 60,
  },
  {
    id: "normal",
    emoji: "🎸",
    name: "Normal",
    bpm: 80,
  },
  {
    id: "challenge",
    emoji: "🚀",
    name: "Desafio",
    bpm: 100,
  },
];

const defaultSpeed: SpeedLevel = {
  id: "learning",
  emoji: "🌱",
  name: "Aprendendo",
  bpm: 60,
};

function PracticeMode({ lesson }: PracticeModeProps) {
  const [speedLevel, setSpeedLevel] = useState<SpeedLevelId>("learning");

  const [isPlaying, setIsPlaying] = useState(false);

  const [activeBeat, setActiveBeat] = useState(-1);

  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const [countIn, setCountIn] = useState<CountInValue>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  const selectedSpeed =
    speedLevels.find((level) => level.id === speedLevel) ?? defaultSpeed;

  const bpm = selectedSpeed.bpm;

  const currentStep = lesson.steps[currentChordIndex];

  const nextStep = lesson.steps[(currentChordIndex + 1) % lesson.steps.length];

  if (!currentStep || !nextStep) {
    return (
      <section className="practice-mode">
        <p>Não foi possível carregar os acordes da aula.</p>
      </section>
    );
  }

  const currentChord = currentStep.chord;

  const nextChord = nextStep.chord;

  const lastBeatIndex = lesson.rhythm.beats.length - 1;

  const transitionCountdown =
    isPlaying && activeBeat >= 1
      ? lesson.rhythm.beats.length - activeBeat
      : null;

  async function prepareAudio() {
    if (
      !audioContextRef.current ||
      audioContextRef.current.state === "closed"
    ) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  }

  /*
   * Contagem inicial
   *
   * 3 → 2 → 1 → VAI!
   */
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

  /*
   * Metrônomo
   *
   * Também controla a troca automática
   * entre os acordes.
   */
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

    if (beatsPerChord === 0) {
      return;
    }

    const intervalTime = 60000 / bpm;

    let beatIndex = 0;

    function playClick(currentBeat: number, context: AudioContext) {
      const oscillator = context.createOscillator();

      const gain = context.createGain();

      /*
       * Primeiro tempo:
       * som mais agudo.
       *
       * Outros tempos:
       * som mais grave.
       */
      oscillator.frequency.value = currentBeat === 0 ? 1200 : 850;

      gain.gain.setValueAtTime(0.18, context.currentTime);

      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.06);

      oscillator.connect(gain);

      gain.connect(context.destination);

      oscillator.start();

      oscillator.stop(context.currentTime + 0.06);
    }

    /*
     * Primeira batida.
     */
    setActiveBeat(0);

    playClick(0, audioContext);

    /*
     * Próximas batidas.
     */
    const interval = window.setInterval(() => {
      beatIndex = (beatIndex + 1) % beatsPerChord;

      setActiveBeat(beatIndex);

      /*
       * Quando volta para a
       * primeira batida, troca
       * automaticamente o acorde.
       */
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

  /*
   * Fecha o AudioContext quando
   * o componente sai da tela.
   */
  useEffect(() => {
    return () => {
      const audioContext = audioContextRef.current;

      if (audioContext && audioContext.state !== "closed") {
        void audioContext.close();
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

      {/* Progressão */}

      <div className="practice-progression">
        {lesson.steps.map((step, index) => (
          <div
            key={`${step.chord}-${index}`}
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

      {/* Acorde atual */}

      <div className="practice-current">
        <span>TOQUE AGORA</span>

        <strong>{currentChord}</strong>

        <p>
          Próximo acorde: <b>{nextChord}</b>
        </p>
      </div>

      {/* Contagem inicial */}

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

      {/* Aviso de próxima troca */}

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

      {/* Diagrama */}

      <div className="practice-diagram">
        <ChordDiagram chord={currentChord} />
      </div>

      {/* Batidas */}

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

      {/* Mensagem do professor */}

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

      {/* Níveis de velocidade */}

      <div className="speed-selector">
        <div className="speed-selector-header">
          <div>
            <span className="speed-label">VELOCIDADE</span>

            <h3>Como você quer praticar?</h3>
          </div>

          <span className="speed-bpm">{bpm} BPM</span>
        </div>

        <div className="speed-options">
          {speedLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              className={
                speedLevel === level.id ? "speed-option active" : "speed-option"
              }
              onClick={() => setSpeedLevel(level.id)}
              disabled={isPlaying || countIn !== null}
            >
              <span className="speed-emoji">{level.emoji}</span>

              <strong>{level.name}</strong>

              <small>{level.bpm} BPM</small>
            </button>
          ))}
        </div>

        <p className="speed-help">
          {speedLevel === "very-slow" && "Ótimo para aprender uma troca nova."}

          {speedLevel === "learning" &&
            "Uma velocidade confortável para começar."}

          {speedLevel === "normal" &&
            "Agora estamos chegando ao ritmo natural."}

          {speedLevel === "challenge" &&
            "Só tente quando as trocas já estiverem fáceis."}
        </p>
      </div>

      {/* Iniciar / Parar */}

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
