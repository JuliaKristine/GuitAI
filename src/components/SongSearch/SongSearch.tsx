import { useCallback, useEffect, useRef, useState } from "react";

import { songService } from "../../services/songService";

import type { DemoSong } from "../../data/songs";

type SongSearchProps = {
  selectedSongId: string;

  onSelectSong: (songId: string) => void;
};

function SongSearch({ selectedSongId, onSelectSong }: SongSearchProps) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<DemoSong[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
   * Cada busca ganha um número.
   *
   * Isso evita que uma busca antiga
   * sobrescreva uma busca mais nova.
   */
  const requestIdRef = useRef(0);

  const search = useCallback(async (searchQuery: string) => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);

    setError(null);

    try {
      const songs = await songService.searchSongs(searchQuery);

      /*
       * Só atualiza se esta ainda
       * for a busca mais recente.
       */
      if (requestId !== requestIdRef.current) {
        return;
      }

      setResults(songs);
    } catch (searchError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error("Erro ao buscar músicas:", searchError);

      setResults([]);

      setError("Não foi possível buscar as músicas.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  /*
   * Debounce:
   *
   * esperamos 350ms após a pessoa
   * parar de digitar antes da busca.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void search(query);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, search]);

  function clearSearch() {
    setQuery("");
  }

  function retrySearch() {
    void search(query);
  }

  const hasQuery = query.trim().length > 0;

  return (
    <section className="song-search">
      <div className="song-search-header">
        <span className="song-search-label">🔎 BUSCAR MÚSICA</span>

        <h2>Que música você quer aprender?</h2>

        <p>Procure pelo nome da música ou pelo artista.</p>
      </div>

      {/* Campo de busca */}

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

      {/* Carregamento */}

      {isLoading && (
        <div className="song-search-loading" aria-live="polite">
          <span className="search-spinner">🎵</span>

          <div>
            <strong>Buscando músicas...</strong>

            <p>Só um instante.</p>
          </div>
        </div>
      )}

      {/* Erro */}

      {!isLoading && error !== null && (
        <div className="song-search-error" role="alert">
          <span className="search-error-icon">😕</span>

          <strong>Ops! Algo deu errado.</strong>

          <p>{error}</p>

          <button type="button" onClick={retrySearch}>
            ↻ Tentar novamente
          </button>
        </div>
      )}

      {/* Resultado */}

      {!isLoading && error === null && (
        <>
          <div className="song-search-info">
            {hasQuery ? (
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
                    className={
                      isSelected ? "song-result active" : "song-result"
                    }
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
        </>
      )}

      <div className="song-search-future">
        <span>✨</span>

        <p>Em breve você poderá buscar músicas diretamente pelo Spotify.</p>
      </div>
    </section>
  );
}

export default SongSearch;
