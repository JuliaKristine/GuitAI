export type MusicAnalysisStatus =
  | 'ready'
  | 'experimental'
  | 'unavailable'
  | 'failed'


export type ChordEvent = {
  chord: string

  measure:
    number | null

  beat:
    number | null

  time_seconds:
    number | null

  confidence:
    number | null
}


export type MusicAnalysis = {
  song_id: string

  provider: string

  status:
    MusicAnalysisStatus

  tempo_bpm:
    number | null

  key:
    string | null

  time_signature:
    string | null

  chords:
    string[]

  chord_events:
    ChordEvent[]

  confidence:
    number | null

  message:
    string | null
}