import type {
  ChordSimplification,
} from './chordSimplification'

import type {
  MusicAnalysis,
} from './musicAnalysis'


export type LessonGenerationStatus =
  | 'pending'
  | 'processing'
  | 'waiting_for_analysis'
  | 'waiting_for_validation'
  | 'analysis_ready'
  | 'simplification_ready'
  | 'completed'
  | 'failed'


export type LessonDifficulty =
  | 'absolute-beginner'
  | 'beginner'
  | 'developing'


export type GeneratedChordTransition = {
  from: string

  to: string

  instructions: string[]
}


export type GeneratedRhythm = {
  name: string

  bpm: number

  beats: (
    | 'down'
    | 'up'
  )[]
}


export type GeneratedLessonStep = {
  chord: string

  title: string

  instruction: string

  tip: string

  transition:
    GeneratedChordTransition
    | null
}


export type GeneratedLesson = {
  id: string

  title: string

  description: string

  rhythm:
    GeneratedRhythm

  steps:
    GeneratedLessonStep[]

  original_chords:
    string[]

  practice_chords:
    string[]

  simplification_notes:
    string[]
}


export type LessonGeneration = {
  id: string

  song_id: string

  difficulty:
    LessonDifficulty

  status:
    LessonGenerationStatus

  created_at: string

  updated_at: string

  analysis:
    MusicAnalysis | null

  simplification:
    ChordSimplification | null

  lesson:
    GeneratedLesson | null

  message:
    string | null

  error:
    string | null
}