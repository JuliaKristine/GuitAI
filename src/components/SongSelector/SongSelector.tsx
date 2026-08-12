import type { DemoSong } from "../../data/songs";

type SongSelectorProps = {
  songs: DemoSong[];
  selectedSongId: string;
  onSelectSong: (songId: string) => void;
};

function SongSelector({
  songs,
  selectedSongId,
  onSelectSong,
}: SongSelectorProps) {
  return (
    <section className="song-selector">
      <div className="song-selector-header">
        <span className="song-selector-label">🎵 MÚSICAS</span>

        <h2>O que você quer tocar hoje?</h2>

        <p>Escolha uma música de demonstração para aprender e praticar.</p>
      </div>

      <div className="song-list">
        {songs.map((song) => {
          const isSelected = selectedSongId === song.id;

          return (
            <button
              key={song.id}
              type="button"
              className={isSelected ? "song-card active" : "song-card"}
              onClick={() => onSelectSong(song.id)}
            >
              <span className="song-emoji">{song.emoji}</span>

              <div className="song-card-content">
                <div className="song-card-title">
                  <strong>{song.title}</strong>

                  <span>{song.artist}</span>
                </div>

                <p>{song.description}</p>

                <div className="song-card-footer">
                  <span className="song-difficulty">{song.difficulty}</span>

                  <span className="song-progression">
                    {song.progression.join(" → ")}
                  </span>
                </div>
              </div>

              {isSelected && <span className="song-selected">✓</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SongSelector;
