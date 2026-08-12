import { demoSongs, type DemoSong } from "../data/songs";

const SEARCH_DELAY = 600;

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function getAllSongs(): DemoSong[] {
  return demoSongs;
}

function getSongById(songId: string): DemoSong | undefined {
  return demoSongs.find((song) => song.id === songId);
}

async function searchSongs(query: string): Promise<DemoSong[]> {
  /*
   * Simula o tempo que futuramente
   * será gasto chamando nosso backend.
   */
  await wait(SEARCH_DELAY);

  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return demoSongs;
  }

  return demoSongs.filter((song) => {
    const title = normalizeText(song.title);

    const artist = normalizeText(song.artist);

    return title.includes(normalizedQuery) || artist.includes(normalizedQuery);
  });
}

export const songService = {
  getAllSongs,
  getSongById,
  searchSongs,
};
