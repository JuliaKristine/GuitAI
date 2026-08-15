import { useState } from "react";

import { lessonGenerationService } from "../../services/lessonGenerationService";

import type { GuitAISong } from "../../types/guitaiSong";

import type {
  LessonDifficulty,
  LessonGeneration as LessonGenerationType,
} from "../../types/lessonGeneration";

type LessonGenerationProps = {
  song: GuitAISong;
};

function LessonGeneration({ song }: LessonGenerationProps) {
  const [difficulty, setDifficulty] =
    useState<LessonDifficulty>("absolute-beginner");

  const [generation, setGeneration] = useState<LessonGenerationType | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function createAndStart() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    setError(null);

    try {
      const created = await lessonGenerationService.create(song.id, difficulty);

      setGeneration(created);

      const processed = await lessonGenerationService.start(created.id);

      setGeneration(processed);
    } catch (generationError) {
      console.error("Erro ao iniciar geração:", generationError);

      setError(
        generationError instanceof Error
          ? generationError.message
          : "Não foi possível iniciar a geração.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function retryAnalysis() {
    if (!generation || isLoading) {
      return;
    }

    setIsLoading(true);

    setError(null);

    try {
      const processed = await lessonGenerationService.start(generation.id);

      setGeneration(processed);
    } catch (retryError) {
      console.error("Erro ao repetir análise:", retryError);

      setError(
        retryError instanceof Error
          ? retryError.message
          : "Não foi possível repetir a análise.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function getStatusTitle() {
    if (!generation) {
      return "Aguardando início";
    }

    switch (generation.status) {
      case "pending":
        return "Na fila";

      case "processing":
        return "Analisando música";

      case "waiting_for_analysis":
        return "Aguardando fonte de análise";

      case "analysis_ready":
        return "Análise musical pronta";

      case "completed":
        return "Aula pronta";

      case "failed":
        return "Falha na geração";

      case "simplification_ready":
        return "Prática simplificada pronta";
    }
  }

  function getStatusIcon() {
    if (!generation) {
      return "🧠";
    }

    switch (generation.status) {
      case "pending":
        return "🕐";

      case "processing":
        return "⚙️";

      case "waiting_for_analysis":
        return "🔌";

      case "analysis_ready":
        return "🎼";

      case "completed":
        return "✅";

      case "failed":
        return "⚠️";

      case "simplification_ready":
        return "🎸";
    }
  }

  return (
    <section className="lesson-generation">
      <div className="lesson-generation-header">
        <span>🧠 GERADOR DE AULA</span>

        <h3>Como devemos simplificar esta música?</h3>

        <p>Escolha seu nível antes de iniciar a preparação.</p>
      </div>

      <div className="lesson-generation-levels">
        <button
          type="button"
          className={
            difficulty === "absolute-beginner"
              ? "lesson-level active"
              : "lesson-level"
          }
          onClick={() => setDifficulty("absolute-beginner")}
          disabled={Boolean(generation)}
        >
          <span>🧸</span>

          <strong>Iniciante absoluto</strong>

          <small>Máxima simplificação</small>
        </button>

        <button
          type="button"
          className={
            difficulty === "beginner" ? "lesson-level active" : "lesson-level"
          }
          onClick={() => setDifficulty("beginner")}
          disabled={Boolean(generation)}
        >
          <span>🌱</span>

          <strong>Iniciante</strong>

          <small>Poucos acordes</small>
        </button>

        <button
          type="button"
          className={
            difficulty === "developing" ? "lesson-level active" : "lesson-level"
          }
          onClick={() => setDifficulty("developing")}
          disabled={Boolean(generation)}
        >
          <span>🎸</span>

          <strong>Em evolução</strong>

          <small>Mais próximo da música</small>
        </button>
      </div>

      {error && (
        <div className="lesson-generation-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {!generation ? (
        <button
          type="button"
          className="lesson-generation-button"
          onClick={() => void createAndStart()}
          disabled={isLoading}
        >
          {isLoading ? "⏳ Preparando..." : "🧠 Preparar minha aula"}
        </button>
      ) : (
        <div className="generation-status-card">
          <div className="generation-status-icon">{getStatusIcon()}</div>

          <div>
            <span>STATUS</span>

            <h4>{getStatusTitle()}</h4>

            {generation.message && (
              <p className="generation-message">{generation.message}</p>
            )}

            <p>
              Processo: <code>{generation.id}</code>
            </p>

            {generation.analysis && (
              <div className="analysis-summary">
                <span>ANÁLISE MUSICAL</span>

                <p>
                  Provedor: <strong>{generation.analysis.provider}</strong>
                </p>

                <p>
                  Status: <strong>{generation.analysis.status}</strong>
                </p>
              </div>
            )}

            {generation.simplification && (
              <div className="simplification-summary">
                <span>PLANO DE PRÁTICA</span>

                <div className="simplification-row">
                  <strong>Acordes originais</strong>

                  <p>{generation.simplification.original_chords.join(" → ")}</p>
                </div>

                <div className="simplification-row">
                  <strong>🎸 Pratique agora</strong>

                  <p>
                    {generation.simplification.practice_chords.length > 0
                      ? generation.simplification.practice_chords.join(" → ")
                      : "Nenhum acorde ainda"}
                  </p>
                </div>

                {generation.simplification.deferred_chords.length > 0 && (
                  <div className="simplification-row">
                    <strong>🕐 Depois</strong>

                    <p>
                      {generation.simplification.deferred_chords.join(" → ")}
                    </p>
                  </div>
                )}

                {generation.simplification.review_chords.length > 0 && (
                  <div className="simplification-row">
                    <strong>⚠️ Precisa revisar</strong>

                    <p>{generation.simplification.review_chords.join(" → ")}</p>
                  </div>
                )}

                <div className="simplification-bpm">
                  <span>VELOCIDADE RECOMENDADA</span>

                  <strong>
                    {generation.simplification.recommended_bpm} BPM
                  </strong>
                </div>
              </div>
            )}

            {generation.lesson && (
              <div className="generated-lesson-summary">
                <span>✅ AULA GERADA</span>

                <h4>{generation.lesson.title}</h4>

                <div className="generated-lesson-rhythm">
                  <div>
                    <small>BPM</small>

                    <strong>{generation.lesson.rhythm.bpm}</strong>
                  </div>

                  <div>
                    <small>BATIDA</small>

                    <strong>
                      {generation.lesson.rhythm.beats
                        .map((beat) => (beat === "down" ? "↓" : "↑"))
                        .join(" ")}
                    </strong>
                  </div>
                </div>

                <div className="generated-lesson-chords">
                  <small>ACORDES DA AULA</small>

                  <strong>
                    {generation.lesson.practice_chords.join(" → ")}
                  </strong>
                </div>

                <p>
                  A aula foi gerada com {generation.lesson.steps.length} passos.
                </p>
              </div>
            )}

            {generation.status === "waiting_for_analysis" && (
              <button
                type="button"
                className="retry-analysis-button"
                onClick={() => void retryAnalysis()}
                disabled={isLoading}
              >
                {isLoading
                  ? "⏳ Verificando..."
                  : "↻ Verificar análise novamente"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default LessonGeneration;
