import { chords } from '../../data/chords'

type ChordDiagramProps = {
  chord: string
}

function ChordDiagram({ chord }: ChordDiagramProps) {
  const chordData = chords[chord]

  if (!chordData) {
    return <p>Acorde não encontrado.</p>
  }

  const strings = [6, 5, 4, 3, 2, 1]
  const frets = [1, 2, 3, 4]

  return (
    <div className="chord-diagram">
      <h3>{chordData.name}</h3>

      <p className="chord-full-name">
        {chordData.displayName}
      </p>

      <div className="string-numbers">
        {strings.map((string) => (
          <span key={string}>{string}</span>
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

      <div className="chord-instructions">
        {chordData.fingers.map((position) => (
          <p key={`${position.string}-${position.fret}`}>
            👆 Dedo {position.finger} → corda {position.string},
            casa {position.fret}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ChordDiagram