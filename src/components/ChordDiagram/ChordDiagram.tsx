import { chords } from '../../data/chords'

type ChordDiagramProps = {
  chord: string
}

const fingerNames: Record<number, string> = {
  1: 'Indicador',
  2: 'Médio',
  3: 'Anelar',
  4: 'Mindinho',
}

function ChordDiagram({ chord }: ChordDiagramProps) {
  const chordData = chords[chord]

  if (!chordData) {
    return <p>Acorde não encontrado.</p>
  }

  const strings = [6, 5, 4, 3, 2, 1]
  const frets = [1, 2, 3, 4]

  const playableStrings = strings.filter(
  (string) => chordData.strings[string] === 'play'
)

const firstPlayableString = Math.max(...playableStrings)

  const isStringFretted = (stringNumber: number) => {
    return chordData.fingers.some(
      (position) => position.string === stringNumber
    )
  }

  return (
    <div className="chord-diagram">
      <div className="chord-title">
        <h3>{chordData.name}</h3>
        <p>{chordData.displayName}</p>
      </div>

      <div className="diagram-wrapper">

        <div className="string-numbers">
          {strings.map((string) => (
            <span key={string}>{string}</span>
          ))}
        </div>

        <div className="string-status">
          {strings.map((string) => {
            const status = chordData.strings[string]
            const fretted = isStringFretted(string)

            return (
              <span key={string}>
                {status === 'mute'
                  ? '×'
                  : !fretted
                    ? '○'
                    : ''}
              </span>
            )
          })}
        </div>

        <div className="fretboard-area">
          <div className="fret-labels">
            {frets.map((fret) => (
              <span key={fret}>
                {fret}
              </span>
            ))}
          </div>

          <div className="fretboard">
            {frets.map((fret) =>
              strings.map((string) => {
                const finger = chordData.fingers.find(
                  (position) =>
                    position.string === string &&
                    position.fret === fret
                )

                return (
                  <div
                    className="fret-position"
                    key={`${string}-${fret}`}
                  >
                    {finger && (
                      <span className="finger-dot">
                        {finger.finger}
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      <div className="diagram-legend">
        <span>
          <strong>○</strong> tocar solta
        </span>

        <span>
          <strong>×</strong> não tocar
        </span>
      </div>

      <div className="finger-guide">
        <h4>🖐️ Onde colocar os dedos</h4>

        <div className="finger-list">
          {chordData.fingers.map((position) => (
            <div
              className="finger-instruction"
              key={`${position.string}-${position.fret}`}
            >
              <span className="finger-badge">
                {position.finger}
              </span>

              <div>
                <strong>
                  {fingerNames[position.finger]}
                </strong>

                <p>
                  Corda {position.string} • Casa {position.fret}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="play-instruction">
        🎵 Comece na corda {firstPlayableString} e toque até a corda 1.
      </div>
    </div>
  )
}

export default ChordDiagram