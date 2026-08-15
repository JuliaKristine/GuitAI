export type SpeedLevelId = "very-slow" | "learning" | "normal" | "challenge";

export type DifficultyId = "absolute-beginner" | "beginner" | "developing";

export type DifficultyProfile = {
  id: DifficultyId;

  emoji: string;

  name: string;

  description: string;

  chords: string[];

  speedLevel: SpeedLevelId;

  rhythmId: string;
};

export const difficultyProfiles: DifficultyProfile[] = [
  {
    id: "absolute-beginner",

    emoji: "🧸",

    name: "Iniciante absoluto",

    description: "Comece com poucos acordes e bastante calma.",

    chords: ["G", "Em"],

    speedLevel: "very-slow",

    rhythmId: "easy",
  },

  {
    id: "beginner",

    emoji: "🌱",

    name: "Iniciante",

    description: "Pratique mais acordes e uma batida simples.",

    chords: ["G", "Em", "C", "D", "Am"],

    speedLevel: "learning",

    rhythmId: "pop",
  },

  {
    id: "developing",

    emoji: "🎸",

    name: "Em evolução",

    description: "Treine mais velocidade e alternância de batidas.",

    chords: ["G", "Em", "C", "D", "Am"],

    speedLevel: "normal",

    rhythmId: "rock",
  },
];

export const defaultDifficultyProfile = difficultyProfiles[0];
