import { useMemo, useState } from "react";

import type { DemoSong } from "../../data/songs";

type SongSearchProps = {
  songs: DemoSong[];
  selectedSongId: string;
  onSelectSong: (songId: string) => void;
};

function SongSearch({ songs, selectedSongId, onSelectSong }: SongSearchProps) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return songs;
    }

    return songs.filter((song) => {
      const title = song.title.toLowerCase();

      const artist = song.artist.toLowerCase();

      return (
        title.includes(normalizedQuery) || artist.includes(normalizedQuery)
      );
    });
  }, [songs, normalizedQuery]);

  function clearSearch() {
    setQuery("");
  }

  return (
    <section className="song-search">
      <div className="song-search-header">
        <span className="song-search-label">🔎 BUSCAR MÚSICA</span>

        <h2>Que música você quer aprender?</h2>

        <p>Procure pelo nome da música ou pelo artista.</p>
      </div>

      <div className="song-search-box">
        <span className="song-search-icon" aria-hidden="true">
          🔎
        </span>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Digite uma música ou artista..."
          aria-label="Buscar música ou artista"
        />

        {query && (
          <button
            type="button"
            className="song-search-clear"
            onClick={clearSearch}
            aria-label="Limpar busca"
          >
            ×
          </button>
        )}
      </div>

      <div className="song-search-info">
        {normalizedQuery ? (
          <span>
            {results.length === 1
              ? "1 música encontrada"
              : `${results.length} músicas encontradas`}
          </span>
        ) : (
          <span>Músicas disponíveis para demonstração</span>
        )}
      </div>

      {results.length > 0 ? (
        <div className="song-search-results">
          {results.map((song) => {
            const isSelected = selectedSongId === song.id;

            return (
              <article
                key={song.id}
                className={isSelected ? "song-result active" : "song-result"}
              >
                <div className="song-result-main">
                  <span className="song-result-emoji">{song.emoji}</span>

                  <div className="song-result-info">
                    <div className="song-result-title">
                      <strong>{song.title}</strong>

                      <span>{song.artist}</span>
                    </div>

                    <p>{song.description}</p>

                    <div className="song-result-details">
                      <span className="song-result-difficulty">
                        {song.difficulty}
                      </span>

                      <span className="song-result-progression">
                        {song.progression.join(" → ")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    isSelected
                      ? "song-result-button selected"
                      : "song-result-button"
                  }
                  onClick={() => onSelectSong(song.id)}
                >
                  {isSelected
                    ? "✓ Música selecionada"
                    : "🎸 Aprender esta música"}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="song-search-empty">
          <span>🎵</span>

          <strong>Nenhuma música encontrada</strong>

          <p>Tente pesquisar outro título ou artista.</p>

          <button type="button" onClick={clearSearch}>
            Limpar busca
          </button>
        </div>
      )}

      <div className="song-search-future">
        <span>✨</span>

        <p>Em breve você poderá buscar músicas diretamente pelo Spotify.</p>
      </div>
    </section>
  );
}

export default SongSearch;
