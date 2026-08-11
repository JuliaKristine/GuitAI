export type LessonStep = {
    chord: string;
    title: string;
    instruction: string;
    tip: string;
};

export type Lesson = {
    id: string;
    title: string;
    description: string;
    steps: LessonStep[];
};

export const firstLesson: Lesson = {
    id: "primeiros-acordes",

    title: "Meus primeiros acordes",

    description: "Aprenda quatro acordes simples e pratique a troca entre eles.",

    steps: [
    {
        chord: "G",
        title: "Vamos começar com Sol maior",
        instruction:
        "Monte o acorde devagar e confira se cada dedo está na posição correta.",
        tip: "Não tenha pressa. Primeiro tente fazer todas as cordas soarem limpas.",
    },

    {
        chord: "Em",
        title: "Agora vamos para Mi menor",
        instruction: "Observe que este acorde precisa de apenas dois dedos.",
        tip: "Tente manter os dedos próximos das cordas para facilitar a próxima troca.",
    },

    {
        chord: "C",
        title: "Vamos aprender Dó maior",
        instruction:
        "Coloque os dedos um de cada vez e lembre de não tocar a corda 6.",
        tip: "Comece a palhetada pela corda 5.",
    },

    {
        chord: "D",
        title: "Terminamos com Ré maior",
        instruction: "Monte o pequeno triângulo formado pelos três dedos.",
        tip: "Neste acorde, comece a tocar pela corda 4.",
    },
],
};
