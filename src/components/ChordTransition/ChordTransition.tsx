import type { ChordTransition as ChordTransitionType } from '../../data/lessons'

type ChordTransitionProps = {
  transition: ChordTransitionType
}

function ChordTransition({
  transition,
}: ChordTransitionProps) {
  return (
    <div className="chord-transition">
      <div className="transition-title">
        <span>🔄</span>

        <div>
          <small>TROCA DE ACORDE</small>

          <h4>
            {transition.from}
            <span> → </span>
            {transition.to}
          </h4>
        </div>
      </div>

      <div className="transition-steps">
        {transition.instructions.map(
          (instruction, index) => (
            <div
              className="transition-step"
              key={index}
            >
              <span className="transition-number">
                {index + 1}
              </span>

              <p>{instruction}</p>
            </div>
          )
        )}
      </div>

      <p className="transition-reminder">
        🐢 Faça essa troca bem devagar primeiro.
      </p>
    </div>
  )
}

export default ChordTransition