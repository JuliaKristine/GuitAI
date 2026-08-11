export type FingerPosition = {
  finger: number
  string: number
  fret: number
}

export type StringStatus = 'play' | 'mute'

export type Chord = {
  name: string
  displayName: string
  fingers: FingerPosition[]
  strings: Record<number, StringStatus>
}

export const chords: Record<string, Chord> = {
  G: {
    name: 'G',
    displayName: 'Sol maior',

    fingers: [
      {
        finger: 1,
        string: 5,
        fret: 2,
      },
      {
        finger: 2,
        string: 6,
        fret: 3,
      },
      {
        finger: 3,
        string: 1,
        fret: 3,
      },
    ],

    strings: {
      6: 'play',
      5: 'play',
      4: 'play',
      3: 'play',
      2: 'play',
      1: 'play',
    },
  },

  C: {
    name: 'C',
    displayName: 'Dó maior',

    fingers: [
      {
        finger: 1,
        string: 2,
        fret: 1,
      },
      {
        finger: 2,
        string: 4,
        fret: 2,
      },
      {
        finger: 3,
        string: 5,
        fret: 3,
      },
    ],

    strings: {
      6: 'mute',
      5: 'play',
      4: 'play',
      3: 'play',
      2: 'play',
      1: 'play',
    },
  },
}