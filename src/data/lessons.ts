export type ChordTransition = {
  from: string
  to: string
  instructions: string[]
}

export type LessonStep = {
  chord: string
  title: string
  instruction: string
  tip: string
  transition?: ChordTransition
}

export type Lesson = {
  id: string
  title: string
  description: string
  steps: LessonStep[]
}

export const firstLesson: Lesson = {
  id: 'primeiros-acordes',

  title: 'Meus primeiros acordes',

  description:
    'Aprenda quatro acordes simples e pratique a troca entre eles.',

  steps: [
    {
      chord: 'G',

      title: 'Vamos começar com Sol maior',

      instruction:
        'Monte o acorde devagar e confira se cada dedo está na posição correta.',

      tip:
        'Não tenha pressa. Primeiro tente fazer todas as cordas soarem limpas.',
    },

    {
      chord: 'Em',

      title: 'Agora vamos para Mi menor',

      instruction:
        'Vamos sair do G e chegar no Em com o menor movimento possível.',

      tip:
        'Faça a troca devagar antes de tentar aumentar a velocidade.',

      transition: {
        from: 'G',
        to: 'Em',

        instructions: [
          '🟢 O dedo 1 pode continuar na corda 5, casa 2.',
          '🟡 Mova o dedo 2 para a corda 4, casa 2.',
          '⚪ Retire o dedo 3 da corda 1.',
        ],
      },
    },

    {
      chord: 'C',

      title: 'Agora vamos para Dó maior',

      instruction:
        'Vamos transformar o Em em C movimentando os dedos com calma.',

      tip:
        'O dedo médio já está em uma posição útil. Use isso para facilitar a troca.',

      transition: {
        from: 'Em',
        to: 'C',

        instructions: [
          '🟢 O dedo 2 continua na corda 4, casa 2.',
          '🟡 Mova o dedo 1 para a corda 2, casa 1.',
          '➕ Coloque o dedo 3 na corda 5, casa 3.',
          '🚫 Lembre-se: no C, não toque a corda 6.',
        ],
      },
    },

    {
      chord: 'D',

      title: 'Terminamos com Ré maior',

      instruction:
        'Agora vamos sair do C e montar o pequeno triângulo do acorde D.',

      tip:
        'Monte primeiro o formato dos dedos e depois confira cada corda.',

      transition: {
        from: 'C',
        to: 'D',

        instructions: [
          '⚪ Retire os dedos da posição do C.',
          '🟡 Coloque o dedo 1 na corda 3, casa 2.',
          '🟡 Coloque o dedo 2 na corda 1, casa 2.',
          '🟡 Coloque o dedo 3 na corda 2, casa 3.',
          '🚫 No D, não toque as cordas 6 e 5.',
        ],
      },
    },
  ],
}