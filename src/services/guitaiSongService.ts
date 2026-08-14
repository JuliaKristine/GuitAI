import type {
  SpotifyTrack,
} from './spotifyService'

import type {
  GuitAISong,
} from '../types/guitaiSong'


const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:8000'


async function prepareSpotifyTrack(
  track: SpotifyTrack
): Promise<GuitAISong> {
  const response =
    await fetch(
      `${API_BASE_URL}/songs/prepare`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          image_url:
            track.image_url,
          spotify_url:
            track.spotify_url,
          duration_ms:
            track.duration_ms,
          explicit:
            track.explicit,
        }),
      }
    )

  if (!response.ok) {
    throw new Error(
      'Não foi possível preparar esta música.'
    )
  }

  const song =
    await response.json() as GuitAISong

  return song
}


export const guitaiSongService = {
  prepareSpotifyTrack,
}