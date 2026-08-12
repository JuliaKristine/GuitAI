import type { Lesson } from "./lessons";

export type DemoSong = {
  id: string;
  title: string;
  artist: string;
  emoji: string;
  description: string;
  difficulty: string;
  progression: string[];
  lesson: Lesson;
};

export const demoSongs: DemoSong[] = [
  {
    id: "primeiros-passos",

    title: "Primeiros Passos",

    artist: "GuitAI Demo",

    emoji: "🌱",

    description:
      "Uma música simples para praticar seus primeiros quatro acordes.",

    difficulty: "Iniciante",

    progression: ["G", "Em", "C", "D"],

    lesson: {
      id: "primeiros-passos",

      title: "Primeiros Passos",

      description: "Aprenda uma progressão simples usando G, Em, C e D.",

      rhythm: {
        name: "Batida iniciante",

        bpm: 60,

        beats: ["down", "down", "down", "down"],
      },

      steps: [
        {
          chord: "G",

          title: "Comece com Sol maior",

          instruction: "Monte o acorde G e toque as cordas devagar.",

          tip: "Confira se todas as cordas estão soando limpas.",
        },

        {
          chord: "Em",

          title: "Agora vá para Mi menor",

          instruction: "Faça a troca de G para Em com calma.",

          tip: "Tente mexer apenas os dedos necessários.",

          transition: {
            from: "G",
            to: "Em",

            instructions: [
              "O dedo 1 pode continuar na corda 5, casa 2.",
              "Mova o dedo 2 para a corda 4, casa 2.",
              "Retire o dedo 3 da corda 1.",
            ],
          },
        },

        {
          chord: "C",

          title: "Vamos para Dó maior",

          instruction: "Monte o acorde C lentamente.",

          tip: "Não toque a corda 6.",

          transition: {
            from: "Em",
            to: "C",

            instructions: [
              "O dedo 2 continua na corda 4, casa 2.",
              "Mova o dedo 1 para a corda 2, casa 1.",
              "Coloque o dedo 3 na corda 5, casa 3.",
              "Não toque a corda 6.",
            ],
          },
        },

        {
          chord: "D",

          title: "Termine com Ré maior",

          instruction:
            "Monte o acorde D e toque apenas da corda 4 até a corda 1.",

          tip: "As cordas 6 e 5 não devem ser tocadas.",

          transition: {
            from: "C",
            to: "D",

            instructions: [
              "Retire os dedos da posição do C.",
              "Coloque o dedo 1 na corda 3, casa 2.",
              "Coloque o dedo 2 na corda 1, casa 2.",
              "Coloque o dedo 3 na corda 2, casa 3.",
            ],
          },
        },
      ],
    },
  },

  {
    id: "estrada-aberta",

    title: "Estrada Aberta",

    artist: "The Purple Strings",

    emoji: "🚗",

    description: "Uma progressão com clima leve para treinar trocas contínuas.",

    difficulty: "Iniciante",

    progression: ["Em", "C", "G", "D"],

    lesson: {
      id: "estrada-aberta",

      title: "Estrada Aberta",

      description: "Pratique Em, C, G e D em uma nova ordem.",

      rhythm: {
        name: "Batida Pop",

        bpm: 70,

        beats: ["down", "down", "up", "up"],
      },

      steps: [
        {
          chord: "Em",

          title: "Comece com Mi menor",

          instruction: "Posicione os dois dedos do Em e toque todas as cordas.",

          tip: "Esse é um ótimo acorde para começar porque usa apenas dois dedos.",
        },

        {
          chord: "C",

          title: "Troque para Dó maior",

          instruction: "Monte o C e evite tocar a corda 6.",

          tip: "Faça a troca devagar antes de tentar acompanhar o ritmo.",

          transition: {
            from: "Em",
            to: "C",

            instructions: [
              "Mantenha o dedo 2 na corda 4, casa 2.",
              "Leve o dedo 1 para a corda 2, casa 1.",
              "Coloque o dedo 3 na corda 5, casa 3.",
            ],
          },
        },

        {
          chord: "G",

          title: "Agora toque Sol maior",

          instruction: "Monte o G e toque todas as seis cordas.",

          tip: "Tente preparar o dedo 3 antes da troca.",

          transition: {
            from: "C",
            to: "G",

            instructions: [
              "Retire os dedos da posição do C.",
              "Monte o G lentamente.",
              "Confira a posição antes de tocar.",
            ],
          },
        },

        {
          chord: "D",

          title: "Finalize com Ré maior",

          instruction: "Toque o D começando pela corda 4.",

          tip: "Evite tocar as cordas 6 e 5.",

          transition: {
            from: "G",
            to: "D",

            instructions: [
              "Retire os dedos do G.",
              "Coloque o dedo 1 na corda 3, casa 2.",
              "Coloque o dedo 2 na corda 1, casa 2.",
              "Coloque o dedo 3 na corda 2, casa 3.",
            ],
          },
        },
      ],
    },
  },

  {
    id: "noite-eletrica",

    title: "Noite Elétrica",

    artist: "Neon Chords",

    emoji: "⚡",

    description:
      "Uma demo um pouco mais rápida para praticar precisão e ritmo.",

    difficulty: "Em evolução",

    progression: ["G", "D", "Em", "C"],

    lesson: {
      id: "noite-eletrica",

      title: "Noite Elétrica",

      description: "Uma progressão clássica em uma velocidade um pouco maior.",

      rhythm: {
        name: "Batida Rock",

        bpm: 80,

        beats: ["down", "up", "down", "up"],
      },

      steps: [
        {
          chord: "G",

          title: "Comece com Sol maior",

          instruction:
            "Monte o acorde G e prepare-se para uma prática mais dinâmica.",

          tip: "Não tente correr. Precisão vem antes da velocidade.",
        },

        {
          chord: "D",

          title: "Troque para Ré maior",

          instruction: "Monte o D e toque apenas a partir da corda 4.",

          tip: "Tente fazer a troca sem olhar para a mão por alguns segundos.",

          transition: {
            from: "G",
            to: "D",

            instructions: [
              "Retire os dedos do G.",
              "Monte o formato triangular do D.",
              "Confira se as cordas 6 e 5 não serão tocadas.",
            ],
          },
        },

        {
          chord: "Em",

          title: "Agora Mi menor",

          instruction: "Use dois dedos e toque todas as cordas.",

          tip: "Aproveite a simplicidade do Em para se preparar para o próximo acorde.",

          transition: {
            from: "D",
            to: "Em",

            instructions: [
              "Retire os dedos da posição do D.",
              "Coloque o dedo 1 na corda 5, casa 2.",
              "Coloque o dedo 2 na corda 4, casa 2.",
            ],
          },
        },

        {
          chord: "C",

          title: "Finalize com Dó maior",

          instruction: "Monte o C e toque da corda 5 até a corda 1.",

          tip: "Não deixe o dedo encostar nas cordas vizinhas.",

          transition: {
            from: "Em",
            to: "C",

            instructions: [
              "Mantenha o dedo 2 na corda 4, casa 2.",
              "Leve o dedo 1 para a corda 2, casa 1.",
              "Coloque o dedo 3 na corda 5, casa 3.",
            ],
          },
        },
      ],
    },
  },
];
