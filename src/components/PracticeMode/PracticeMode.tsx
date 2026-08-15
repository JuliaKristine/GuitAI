import { useEffect, useMemo, useRef, useState } from "react";

import ChordDiagram from "../ChordDiagram/ChordDiagram";
import DifficultySelector from "../DifficultySelector/DifficultySelector";

import {
  defaultDifficultyProfile,
  difficultyProfiles,
} from "../../data/difficulty";

import type { DifficultyId, SpeedLevelId } from "../../data/difficulty";

import { practiceRhythms } from "../../data/lessons";

import type { Lesson } from "../../data/lessons";

type PracticeModeProps = {
  lesson: Lesson;
};

type CountInValue = 3 | 2 | 1 | "go" | null;

type SpeedLevel = {
  id: SpeedLevelId;
  emoji: string;
  name: string;
  description: string;
  bpm: number;
};

const speedLevels: SpeedLevel[] = [
  {
    id: "very-slow",
    emoji: "🐢",
    name: "Bem devagar",
    description: "Para aprender os movimentos",
    bpm: 40,
  },

  {
    id: "learning",
    emoji: "🌱",
    name: "Aprendendo",
    description: "Velocidade confortável",
    bpm: 60,
  },

  {
    id: "normal",
    emoji: "🎸",
    name: "Normal",
    description: "Ritmo mais natural",
    bpm: 80,
  },

  {
    id: "challenge",
    emoji: "🚀",
    name: "Desafio",
    description: "Para treinar velocidade",
    bpm: 100,
  },
];

function PracticeMode({ lesson }: PracticeModeProps) {
  /*
   * ========================================
   * DIFICULDADE
   * ========================================
   */

  const initialDifficultyId = lesson.difficulty ?? defaultDifficultyProfile.id;

  const initialDifficulty =
    difficultyProfiles.find((profile) => profile.id === initialDifficultyId) ??
    defaultDifficultyProfile;

  const [difficultyId, setDifficultyId] = useState<DifficultyId>(
    initialDifficulty.id,
  );

  /*
   * Se a Lesson veio do backend com
   * difficulty, o nível foi definido
   * durante a geração da aula.
   */
  const isDifficultyLocked = lesson.difficulty !== undefined;

  const selectedDifficulty = useMemo(
    () =>
      difficultyProfiles.find((profile) => profile.id === difficultyId) ??
      defaultDifficultyProfile,

    [difficultyId],
  );

  /*
   * ========================================
   * VELOCIDADE E RITMO
   * ========================================
   */

  const [speedLevel, setSpeedLevel] = useState<SpeedLevelId>(
    initialDifficulty.speedLevel,
  );

  const [selectedRhythmId, setSelectedRhythmId] = useState(
    initialDifficulty.rhythmId,
  );

  const selectedSpeed =
    speedLevels.find((level) => level.id === speedLevel) ?? speedLevels[0];

  const selectedRhythm =
    practiceRhythms.find((rhythm) => rhythm.id === selectedRhythmId) ??
    practiceRhythms[0];

  /*
   * ========================================
   * ESTADOS DA PRÁTICA
   * ========================================
   */

  const [isPlaying, setIsPlaying] = useState(false);

  const [activeBeat, setActiveBeat] = useState(0);

  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const [countIn, setCountIn] = useState<CountInValue>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  /*
   * ========================================
   * PASSOS DA PRÁTICA
   * ========================================
   *
   * Aula gerada:
   *
   * Já foi simplificada pelo backend.
   * Portanto usamos TODOS os steps.
   *
   * Aula antiga/demo:
   *
   * Continua usando o filtro pelo nível
   * escolhido no PracticeMode.
   */

  const practiceSteps = isDifficultyLocked
    ? lesson.steps
    : lesson.steps.filter((step) =>
        selectedDifficulty.chords.includes(step.chord),
      );

  const currentStep =
    practiceSteps[currentChordIndex] ?? practiceSteps[0] ?? lesson.steps[0];

  const nextChordIndex =
    practiceSteps.length > 0
      ? (currentChordIndex + 1) % practiceSteps.length
      : 0;

  const nextStep = practiceSteps[nextChordIndex] ?? currentStep;

  /*
   * Se for uma aula gerada, usamos o BPM
   * produzido pelo backend como ponto
   * inicial/real da aula.
   *
   * Nas aulas antigas usamos o seletor
   * local de velocidade.
   */
  const bpm = isDifficultyLocked ? lesson.rhythm.bpm : selectedSpeed.bpm;

  /*
   * Mesma lógica para o ritmo.
   *
   * Aula gerada:
   * usa o ritmo que veio do backend.
   *
   * Aula antiga:
   * usa o seletor do PracticeMode.
   */
  const beats = isDifficultyLocked
    ? lesson.rhythm.beats
    : (selectedRhythm?.beats ?? lesson.rhythm.beats);

  const beatsRemaining = Math.max(beats.length - activeBeat, 1);

  const shouldWarnChange =
    isPlaying &&
    countIn === null &&
    practiceSteps.length > 1 &&
    beatsRemaining <= 2;

  /*
   * ========================================
   * SINCRONIZA A DIFICULDADE DA LESSON
   * ========================================
   */

  useEffect(() => {
    const newDifficultyId = lesson.difficulty ?? defaultDifficultyProfile.id;

    setDifficultyId(newDifficultyId);
  }, [lesson.id, lesson.difficulty]);

  /*
   * ========================================
   * DIFICULDADE → VELOCIDADE/RITMO
   * ========================================
   */

  useEffect(() => {
    setSpeedLevel(selectedDifficulty.speedLevel);

    setSelectedRhythmId(selectedDifficulty.rhythmId);

    setCurrentChordIndex(0);

    setActiveBeat(0);

    setIsPlaying(false);

    setCountIn(null);
  }, [selectedDifficulty]);

  /*
   * ========================================
   * GARANTE ÍNDICE VÁLIDO
   * ========================================
   */

  useEffect(() => {
    if (currentChordIndex < practiceSteps.length) {
      return;
    }

    setCurrentChordIndex(0);
  }, [currentChordIndex, practiceSteps.length]);

  /*
   * ========================================
   * AUDIO CONTEXT
   * ========================================
   */

  async function prepareAudio() {
    let context = audioContextRef.current;

    if (!context || context.state === "closed") {
      context = new AudioContext();

      audioContextRef.current = context;
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    return context;
  }

  function playClick(beatIndex: number, context: AudioContext) {
    const oscillator = context.createOscillator();

    const gain = context.createGain();

    oscillator.type = "sine";

    /*
     * Primeiro tempo mais agudo
     * para ajudar a perceber
     * o início do compasso.
     */
    oscillator.frequency.value = beatIndex === 0 ? 1200 : 850;

    gain.gain.setValueAtTime(0.18, context.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.06);

    oscillator.connect(gain);

    gain.connect(context.destination);

    oscillator.start();

    oscillator.stop(context.currentTime + 0.07);
  }

  /*
   * ========================================
   * CONTAGEM 3 → 2 → 1 → VAI
   * ========================================
   */

  useEffect(() => {
    if (!isPlaying || countIn === null) {
      return;
    }

    const context = audioContextRef.current;

    if (context && countIn !== "go") {
      playClick(0, context);
    }

    const delay = countIn === "go" ? 500 : 650;

    const timer = window.setTimeout(
      () => {
        if (countIn === 3) {
          setCountIn(2);

          return;
        }

        if (countIn === 2) {
          setCountIn(1);

          return;
        }

        if (countIn === 1) {
          setCountIn("go");

          return;
        }

        setCountIn(null);
      },

      delay,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [countIn, isPlaying]);

  /*
   * ========================================
   * METRÔNOMO + TROCA DE ACORDES
   * ========================================
   */

  useEffect(() => {
    if (
      !isPlaying ||
      countIn !== null ||
      beats.length === 0 ||
      practiceSteps.length === 0
    ) {
      return;
    }

    const context = audioContextRef.current;

    if (!context) {
      return;
    }

    let beatIndex = 0;

    setActiveBeat(beatIndex);

    playClick(beatIndex, context);

    const intervalDuration = 60000 / bpm;

    const interval = window.setInterval(
      () => {
        beatIndex = (beatIndex + 1) % beats.length;

        setActiveBeat(beatIndex);

        playClick(beatIndex, context);

        /*
         * Quando volta para o
         * primeiro tempo do compasso,
         * muda o acorde.
         */
        if (beatIndex === 0) {
          setCurrentChordIndex(
            (currentIndex) => (currentIndex + 1) % practiceSteps.length,
          );
        }
      },

      intervalDuration,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [isPlaying, countIn, bpm, beats, practiceSteps.length]);

  /*
   * ========================================
   * LIMPEZA DO AUDIO CONTEXT
   * ========================================
   */

  useEffect(() => {
    return () => {
      const context = audioContextRef.current;

      if (context && context.state !== "closed") {
        void context.close();
      }
    };
  }, []);

  /*
   * ========================================
   * CONTROLES
   * ========================================
   */

  async function startPractice() {
    if (practiceSteps.length === 0) {
      return;
    }

    await prepareAudio();

    setCurrentChordIndex(0);

    setActiveBeat(0);

    setCountIn(3);

    setIsPlaying(true);
  }

  function stopPractice() {
    setIsPlaying(false);

    setCountIn(null);

    setActiveBeat(0);

    setCurrentChordIndex(0);
  }

  /*
   * ========================================
   * SEM ACORDES
   * ========================================
   */

  if (practiceSteps.length === 0 || !currentStep) {
    return (
      <section className="practice-mode">
        <div className="practice-empty">
          <span>🎸</span>

          <h2>Nenhum acorde disponível</h2>

          <p>Não encontramos acordes adequados para este nível.</p>
        </div>
      </section>
    );
  }

  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <section className="practice-mode">
      <div className="practice-header">
        <span className="practice-label">🎸 MODO PRÁTICA</span>

        <h2>Treine a progressão</h2>

        <p>
          Toque junto com o metrônomo e prepare a mão para o próximo acorde.
        </p>
      </div>

      {/* ==================================
          DIFICULDADE
      ================================== */}

      <div className="practice-section">
        <div className="practice-section-title">
          <span>🎯</span>

          <div>
            <strong>Seu nível</strong>

            <p>A prática se adapta ao seu momento.</p>
          </div>
        </div>

        <DifficultySelector
          selectedDifficulty={difficultyId}
          disabled={isPlaying || isDifficultyLocked}
          onChange={setDifficultyId}
        />

        {isDifficultyLocked && (
          <div className="practice-locked-difficulty">
            <span>🔒</span>

            <div>
              <strong>Nível definido pela aula</strong>

              <p>
                Esta prática foi preparada automaticamente para o nível
                escolhido durante a geração.
              </p>
            </div>
          </div>
        )}

        {isDifficultyLocked && (
          <div className="practice-locked-difficulty">
            <span>🔒</span>

            <div>
              <strong>Nível definido pela aula</strong>

              <p>
                Esta prática foi preparada automaticamente para o nível
                escolhido durante a geração.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================================
          PROGRESSÃO
      ================================== */}

      <div className="practice-progression">
        <span className="practice-progression-label">PROGRESSÃO</span>

        <div className="practice-progression-chords">
          {practiceSteps.map((step, index) => (
            <span
              key={`${step.chord}-${index}`}
              className={index === currentChordIndex ? "active" : ""}
            >
              {step.chord}
            </span>
          ))}
        </div>
      </div>

      {/* ==================================
          CONTAGEM INICIAL
      ================================== */}

      {isPlaying && countIn !== null && (
        <div className="practice-count-in">
          <span>{countIn === "go" ? "VAI!" : countIn}</span>
        </div>
      )}

      {/* ==================================
          ACORDE ATUAL
      ================================== */}

      <div className="practice-current">
        <div className="practice-current-header">
          <div>
            <span>AGORA</span>

            <h3>{currentStep.chord}</h3>
          </div>

          {practiceSteps.length > 1 && (
            <div className="practice-next">
              <span>PRÓXIMO</span>

              <strong>{nextStep.chord}</strong>
            </div>
          )}
        </div>

        {shouldWarnChange && (
          <div className="practice-change-warning">
            <span>👀</span>

            <div>
              <strong>Prepare a troca</strong>

              <p>
                Próximo acorde: <b>{nextStep.chord}</b>
              </p>
            </div>

            <span className="practice-countdown">{beatsRemaining}</span>
          </div>
        )}

        <ChordDiagram chord={currentStep.chord} />
      </div>

      {/* ==================================
          BATIDAS
      ================================== */}

      <div className="practice-beats">
        <div className="practice-beats-header">
          <span>🥁 BATIDA</span>

          <strong>{bpm} BPM</strong>
        </div>

        <div className="practice-beat-list">
          {beats.map((beat, index) => (
            <div
              key={`${beat}-${index}`}
              className={
                isPlaying && countIn === null && activeBeat === index
                  ? "practice-beat active"
                  : "practice-beat"
              }
            >
              <span>{beat === "down" ? "↓" : "↑"}</span>

              <small>{index + 1}</small>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================
          PADRÃO DE RITMO
      ================================== */}

      {!isDifficultyLocked && (
        <div className="practice-section">
          <div className="practice-section-title">
            <span>🥁</span>

            <div>
              <strong>Padrão de batida</strong>

              <p>Escolha como você quer praticar.</p>
            </div>
          </div>

          <div className="practice-rhythm-options">
            {practiceRhythms.map((rhythm) => (
              <button
                key={rhythm.id}
                type="button"
                className={
                  rhythm.id === selectedRhythmId
                    ? "practice-option active"
                    : "practice-option"
                }
                onClick={() => setSelectedRhythmId(rhythm.id)}
                disabled={isPlaying}
              >
                <span>{rhythm.emoji}</span>

                <strong>{rhythm.name}</strong>

                <small>{rhythm.description}</small>

                <div>
                  {rhythm.beats.map((beat, index) => (
                    <span key={`${rhythm.id}-${index}`}>
                      {beat === "down" ? "↓" : "↑"}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================================
          VELOCIDADE
      ================================== */}

      {!isDifficultyLocked && (
        <div className="practice-section">
          <div className="practice-section-title">
            <span>⏱️</span>

            <div>
              <strong>Velocidade</strong>

              <p>Comece devagar e aumente quando estiver confortável.</p>
            </div>
          </div>

          <div className="practice-speed-options">
            {speedLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                className={
                  level.id === speedLevel
                    ? "practice-option active"
                    : "practice-option"
                }
                onClick={() => setSpeedLevel(level.id)}
                disabled={isPlaying}
              >
                <span>{level.emoji}</span>

                <strong>{level.name}</strong>

                <small>{level.description}</small>

                <b>{level.bpm} BPM</b>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================================
          CONTROLES
      ================================== */}

      <div className="practice-controls">
        {!isPlaying ? (
          <button
            type="button"
            className="practice-start-button"
            onClick={() => void startPractice()}
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
      </div>

      {/* ==================================
          INFORMAÇÃO DA AULA GERADA
      ================================== */}

      {isDifficultyLocked && (
        <div className="practice-generated-info">
          <span>✨</span>

          <p>
            Esta progressão, ritmo e velocidade vieram da aula gerada pelo motor
            pedagógico do GuitAI.
          </p>
        </div>
      )}
    </section>
  );
}

export default PracticeMode;
