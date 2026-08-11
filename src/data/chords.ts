export type FingerPosition = {
  finger: number
  string: number
  fret: number
}

export type Chord = {
  name: string
  displayName: string
  fingers: FingerPosition[]
  strings: ('play' | 'mute')[]
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

    strings: [
      'play',
      'play',
      'play',
      'play',
      'play',
      'play',
    ],
  },
}