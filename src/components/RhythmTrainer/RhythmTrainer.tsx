import { useEffect, useRef, useState } from "react";

import type { RhythmPattern } from "../../data/lessons";

type RhythmTrainerProps = {
  rhythm: RhythmPattern;
};

function RhythmTrainer({ rhythm }: RhythmTrainerProps) {
  const [bpm, setBpm] = useState(rhythm.bpm);

  const [isPlaying, setIsPlaying] = useState(false);

  const [activeBeat, setActiveBeat] = useState(-1);

  const audioContextRef = useRef<AudioContext | null>(null);

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

  useEffect(() => {
    if (!isPlaying) {
      setActiveBeat(-1);
      return;
    }

    const audioContext = audioContextRef.current;

    if (!audioContext) {
      return;
    }

    const beatsCount = rhythm.beats.length;

    if (beatsCount === 0) {
      return;
    }

    const intervalTime = 60000 / bpm;

    let beatIndex = 0;

    function playClick(currentBeat: number, context: AudioContext) {
      const oscillator = context.createOscillator();

      const gain = context.createGain();

      /*
       * Primeiro tempo mais agudo.
       * Outros tempos mais graves.
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
     * Primeira batida imediatamente.
     */
    setActiveBeat(0);

    playClick(0, audioContext);

    /*
     * Próximas batidas.
     */
    const interval = window.setInterval(() => {
      beatIndex = (beatIndex + 1) % beatsCount;

      setActiveBeat(beatIndex);

      playClick(beatIndex, audioContext);
    }, intervalTime);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPlaying, bpm, rhythm.beats]);

  /*
   * Fecha o sistema de áudio quando
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

  async function togglePractice() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    await prepareAudio();

    setIsPlaying(true);
  }

  return (
    <section className="rhythm-trainer">
      <div className="rhythm-header">
        <div>
          <span className="rhythm-label">🥁 RITMO</span>

          <h4>{rhythm.name}</h4>
        </div>

        <div className="bpm-display">
          <strong>{bpm}</strong>

          <span>BPM</span>
        </div>
      </div>

      <p className="rhythm-description">
        Passe a mão pelas cordas seguindo as setas e acompanhe o som do
        metrônomo.
      </p>

      <div className="beat-count">
        {rhythm.beats.map((_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>

      <div className="rhythm-beats">
        {rhythm.beats.map((direction, index) => (
          <div
            key={index}
            className={
              activeBeat === index ? "rhythm-beat active" : "rhythm-beat"
            }
          >
            <span className="strum-arrow">
              {direction === "down" ? "↓" : "↑"}
            </span>

            <small>{direction === "down" ? "baixo" : "cima"}</small>
          </div>
        ))}
      </div>

      <div className="metronome-status">
        <span
          className={isPlaying ? "metronome-light active" : "metronome-light"}
        />

        <span>{isPlaying ? "Metrônomo tocando" : "Metrônomo parado"}</span>
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
          disabled={isPlaying}
          aria-label="Velocidade do ritmo"
        />
      </div>

      <button
        type="button"
        className={isPlaying ? "rhythm-button playing" : "rhythm-button"}
        onClick={togglePractice}
        aria-pressed={isPlaying}
      >
        {isPlaying ? "■ Parar metrônomo" : "▶ Praticar ritmo"}
      </button>

      <p className="rhythm-tip">
        💡 O primeiro som é diferente para indicar o começo da sequência.
      </p>
    </section>
  );
}

export default RhythmTrainer;
