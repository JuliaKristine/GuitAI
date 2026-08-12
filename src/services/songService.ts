import { demoSongs, type DemoSong } from "../data/songs";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type SongSearchApiItem = {
  id: string;
  title: string;
  artist: string;
};

type SongSearchApiResponse = {
  query: string;
  count: number;
  items: SongSearchApiItem[];
};

function getAllSongs(): DemoSong[] {
  return demoSongs;
}

function getSongById(songId: string): DemoSong | undefined {
  return demoSongs.find((song) => song.id === songId);
}

async function searchSongs(query: string): Promise<DemoSong[]> {
  const parameters = new URLSearchParams({
    q: query,
  });

  const response = await fetch(
    `${API_BASE_URL}/songs/search?${parameters.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  const data = (await response.json()) as SongSearchApiResponse;

  /*
   * Nesta fase transitória o backend
   * realiza a busca e devolve os IDs.
   *
   * A aula completa ainda está armazenada
   * no frontend.
   */
  return data.items
    .map((item) => demoSongs.find((song) => song.id === item.id))
    .filter((song): song is DemoSong => Boolean(song));
}

export const songService = {
  getAllSongs,
  getSongById,
  searchSongs,
};
