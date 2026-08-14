import type {
  LessonDifficulty,
  LessonGeneration,
} from "../types/lessonGeneration";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function create(
  songId: string,
  difficulty: LessonDifficulty,
): Promise<LessonGeneration> {
  const response = await fetch(`${API_BASE_URL}/lesson-generations`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      song_id: songId,
      difficulty,
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível criar a geração da aula.");
  }

  return await response.json();
}

async function start(generationId: string): Promise<LessonGeneration> {
  const response = await fetch(
    `${API_BASE_URL}/lesson-generations/${generationId}/start`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Não foi possível iniciar a geração da aula.");
  }

  return await response.json();
}

async function getById(generationId: string): Promise<LessonGeneration> {
  const response = await fetch(
    `${API_BASE_URL}/lesson-generations/${generationId}`,
  );

  if (!response.ok) {
    throw new Error("Não foi possível consultar a geração da aula.");
  }

  return await response.json();
}

export const lessonGenerationService = {
  create,
  start,
  getById,
};
