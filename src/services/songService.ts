import { demoSongs, type DemoSong } from "../data/songs";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getAllSongs(): DemoSong[] {
  return demoSongs;
}

function getSongById(songId: string): DemoSong | undefined {
  return demoSongs.find((song) => song.id === songId);
}

function searchSongs(query: string): DemoSong[] {
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
