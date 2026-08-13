export type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  image_url: string | null;
  spotify_url: string | null;
  duration_ms: number;
  explicit: boolean;
};

type SpotifyTrackSearchResponse = {
  query: string;
  count: number;
  items: SpotifyTrack[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [];
  }

  const parameters = new URLSearchParams({
    q: cleanQuery,
    limit: "10",
  });

  const response = await fetch(
    `${API_BASE_URL}/spotify/search?${parameters.toString()}`,
  );

  if (!response.ok) {
    let message = "Não foi possível buscar músicas no Spotify.";

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      }
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(message);
  }

  const data = (await response.json()) as SpotifyTrackSearchResponse;

  return data.items;
}

export const spotifyService = {
  searchTracks,
};
