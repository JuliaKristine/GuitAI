export type LessonGenerationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type LessonDifficulty = "absolute-beginner" | "beginner" | "developing";

export type GeneratedChord = {
  chord: string;

  simplified_from: string | null;
};

export type GeneratedRhythm = {
  name: string;

  bpm: number;

  beats: string[];
};

export type GeneratedLessonStep = {
  chord: string;

  title: string;

  instruction: string;

  tip: string;
};

export type GeneratedLesson = {
  title: string;

  description: string;

  chords: GeneratedChord[];

  rhythm: GeneratedRhythm;

  steps: GeneratedLessonStep[];

  simplification_notes: string[];
};

export type LessonGeneration = {
  id: string;

  song_id: string;

  difficulty: LessonDifficulty;

  status: LessonGenerationStatus;

  created_at: string;

  updated_at: string;

  lesson: GeneratedLesson | null;

  error: string | null;
};
