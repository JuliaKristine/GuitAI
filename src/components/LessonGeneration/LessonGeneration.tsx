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

  async function generateLesson() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    setError(null);

    try {
      const created = await lessonGenerationService.create(song.id, difficulty);

      setGeneration(created);

      const started = await lessonGenerationService.start(created.id);

      setGeneration(started);
    } catch (generationError) {
      console.error("Erro ao iniciar geração:", generationError);

      if (generationError instanceof Error) {
        setError(generationError.message);
      } else {
        setError("Não foi possível iniciar a geração.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function statusText() {
    if (!generation) {
      return "Aguardando início";
    }

    if (generation.status === "pending") {
      return "Na fila";
    }

    if (generation.status === "processing") {
      return "Preparando análise";
    }

    if (generation.status === "completed") {
      return "Aula pronta";
    }

    return "Falha na geração";
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
          onClick={() => void generateLesson()}
          disabled={isLoading}
        >
          {isLoading ? "⏳ Preparando..." : "🧠 Preparar minha aula"}
        </button>
      ) : (
        <div className="generation-status-card">
          <div className="generation-status-icon">
            {generation.status === "processing" ? "⚙️" : "🧠"}
          </div>

          <div>
            <span>STATUS</span>

            <h4>{statusText()}</h4>

            <p>
              Processo: <code>{generation.id}</code>
            </p>

            {generation.status === "processing" && (
              <small>
                O contrato da geração está funcionando. O motor musical ainda
                será conectado na próxima etapa.
              </small>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default LessonGeneration;
