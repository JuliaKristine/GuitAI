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
    description:
      "Para quem está começando do zero. Poucos acordes e bastante tempo para trocar os dedos.",
    chords: ["G", "Em"],
    speedLevel: "very-slow",
    rhythmId: "easy",
  },

  {
    id: "beginner",
    emoji: "🌱",
    name: "Iniciante",
    description:
      "Quatro acordes simples com uma velocidade confortável para praticar.",
    chords: ["G", "Em", "C", "D"],
    speedLevel: "learning",
    rhythmId: "easy",
  },

  {
    id: "developing",
    emoji: "🎸",
    name: "Em evolução",
    description:
      "Mais velocidade e uma batida com movimentos para baixo e para cima.",
    chords: ["G", "Em", "C", "D"],
    speedLevel: "normal",
    rhythmId: "pop",
  },
];

export const defaultDifficultyProfile: DifficultyProfile = {
  id: "absolute-beginner",
  emoji: "🧸",
  name: "Iniciante absoluto",
  description:
    "Para quem está começando do zero. Poucos acordes e bastante tempo para trocar os dedos.",
  chords: ["G", "Em"],
  speedLevel: "very-slow",
  rhythmId: "easy",
};
