import { useCallback, useEffect, useRef, useState } from "react";

import { songService } from "../../services/songService";

import { spotifyService } from "../../services/spotifyService";

import type { SpotifyTrack } from "../../services/spotifyService";

type SongSearchProps = {
  selectedSongId: string;

  onSelectSong: (songId: string) => void;

  onLearnSpotifyTrack: (track: SpotifyTrack) => Promise<void>;
};

const demoSongs = songService.getAllSongs();

function SongSearch({
  selectedSongId,
  onSelectSong,
  onLearnSpotifyTrack,
}: SongSearchProps) {
  const [query, setQuery] = useState("");

  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [preparingTrackId, setPreparingTrackId] = useState<string | null>(null);

  const [preparationError, setPreparationError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const searchSpotify = useCallback(async (searchQuery: string) => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);

    setError(null);

    try {
      const tracks = await spotifyService.searchTracks(searchQuery);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setSpotifyResults(tracks);
    } catch (searchError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error("Erro na busca do Spotify:", searchError);

      setSpotifyResults([]);

      if (searchError instanceof Error) {
        setError(searchError.message);
      } else {
        setError("Não foi possível buscar músicas.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      requestIdRef.current += 1;

      setSpotifyResults([]);

      setIsLoading(false);

      setError(null);

      return;
    }

    const timer = window.setTimeout(() => {
      void searchSpotify(cleanQuery);
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, searchSpotify]);

  function clearSearch() {
    setQuery("");
  }

  function retrySearch() {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return;
    }

    void searchSpotify(cleanQuery);
  }

  async function handleLearnTrack(track: SpotifyTrack) {
    if (preparingTrackId) {
      return;
    }

    setPreparingTrackId(track.id);

    setPreparationError(null);

    try {
      await onLearnSpotifyTrack(track);
    } catch (prepareError) {
      console.error("Erro ao preparar música:", prepareError);

      if (prepareError instanceof Error) {
        setPreparationError(prepareError.message);
      } else {
        setPreparationError("Não foi possível preparar esta música.");
      }
    } finally {
      setPreparingTrackId(null);
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <section className="song-search">
      <div className="song-search-header">
        <span className="song-search-label">🔎 BUSCAR MÚSICA</span>

        <h2>Que música você quer aprender?</h2>

        <p>Digite uma música ou artista para pesquisar no Spotify.</p>
      </div>

      <div className="song-search-box">
        <span className="song-search-icon" aria-hidden="true">
          🔎
        </span>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex.: Wonderwall, Taylor Swift..."
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

      {/* DEMOS */}

      {!hasQuery && (
        <>
          <div className="song-search-info">
            <span>🎸 Músicas de demonstração</span>
          </div>

          <div className="song-search-results">
            {demoSongs.map((song) => {
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
        </>
      )}

      {/* LOADING */}

      {hasQuery && isLoading && (
        <div className="song-search-loading">
          <span className="search-spinner">🎵</span>

          <div>
            <strong>Buscando no Spotify...</strong>

            <p>Procurando músicas no catálogo.</p>
          </div>
        </div>
      )}

      {/* ERRO DE BUSCA */}

      {hasQuery && !isLoading && error !== null && (
        <div className="song-search-error" role="alert">
          <span className="search-error-icon">😕</span>

          <strong>Não conseguimos buscar.</strong>

          <p>{error}</p>

          <button type="button" onClick={retrySearch}>
            ↻ Tentar novamente
          </button>
        </div>
      )}

      {/* RESULTADOS SPOTIFY */}

      {hasQuery && !isLoading && error === null && (
        <>
          <div className="song-search-info">
            <span>
              {spotifyResults.length === 1
                ? "1 faixa encontrada no Spotify"
                : `${spotifyResults.length} faixas encontradas no Spotify`}
            </span>
          </div>

          {preparationError && (
            <div className="song-prepare-error" role="alert">
              ⚠️ {preparationError}
            </div>
          )}

          {spotifyResults.length > 0 ? (
            <div className="song-search-results">
              {spotifyResults.map((track) => {
                const isPreparing = preparingTrackId === track.id;

                return (
                  <article key={track.id} className="spotify-result">
                    <div className="spotify-result-main">
                      {track.image_url ? (
                        <img
                          className="spotify-result-cover"
                          src={track.image_url}
                          alt={`Capa de ${track.album}`}
                        />
                      ) : (
                        <div className="spotify-result-cover-placeholder">
                          🎵
                        </div>
                      )}

                      <div className="spotify-result-info">
                        <div className="spotify-result-title">
                          <strong>{track.title}</strong>

                          {track.explicit && (
                            <span className="explicit-badge">E</span>
                          )}
                        </div>

                        <span className="spotify-result-artist">
                          {track.artist}
                        </span>

                        <span className="spotify-result-album">
                          {track.album}
                        </span>
                      </div>
                    </div>

                    <div className="spotify-result-actions">
                      <button
                        type="button"
                        className="spotify-learn-button"
                        onClick={() => void handleLearnTrack(track)}
                        disabled={preparingTrackId !== null}
                      >
                        {isPreparing
                          ? "⏳ Preparando..."
                          : "🎸 Aprender esta música"}
                      </button>

                      {track.spotify_url && (
                        <a
                          className="spotify-open-button"
                          href={track.spotify_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          🟢 Abrir no Spotify
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="song-search-empty">
              <span>🎵</span>

              <strong>Nenhuma faixa encontrada</strong>

              <p>Tente pesquisar outro nome ou artista.</p>

              <button type="button" onClick={clearSearch}>
                Limpar busca
              </button>
            </div>
          )}
        </>
      )}

      <div className="song-search-future">
        <span>🟢</span>

        <p>Busca conectada ao catálogo do Spotify.</p>
      </div>
    </section>
  );
}

export default SongSearch;
