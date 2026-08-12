import { difficultyProfiles, type DifficultyId } from "../../data/difficulty";

type DifficultySelectorProps = {
  selectedDifficulty: DifficultyId;
  disabled?: boolean;
  onChange: (difficulty: DifficultyId) => void;
};

function DifficultySelector({
  selectedDifficulty,
  disabled = false,
  onChange,
}: DifficultySelectorProps) {
  const activeDifficulty = difficultyProfiles.find(
    (difficulty) => difficulty.id === selectedDifficulty,
  );

  return (
    <section className="difficulty-selector">
      <div className="difficulty-header">
        <span className="difficulty-label">NÍVEL</span>

        <h3>Como está seu aprendizado?</h3>

        <p>O GuitAI adapta a prática para você.</p>
      </div>

      <div className="difficulty-options">
        {difficultyProfiles.map((difficulty) => (
          <button
            key={difficulty.id}
            type="button"
            className={
              selectedDifficulty === difficulty.id
                ? "difficulty-option active"
                : "difficulty-option"
            }
            onClick={() => onChange(difficulty.id)}
            disabled={disabled}
          >
            <span className="difficulty-emoji">{difficulty.emoji}</span>

            <strong>{difficulty.name}</strong>
          </button>
        ))}
      </div>

      {activeDifficulty && (
        <div className="difficulty-description">
          <strong>
            {activeDifficulty.emoji} {activeDifficulty.name}
          </strong>

          <p>{activeDifficulty.description}</p>
        </div>
      )}
    </section>
  );
}

export default DifficultySelector;
