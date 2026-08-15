export type ChordDecisionAction = "practice" | "defer" | "review";

export type ChordDecision = {
  chord: string;

  action: ChordDecisionAction;

  difficulty_score: number | null;

  reason: string;
};

export type ChordSimplification = {
  difficulty: "absolute-beginner" | "beginner" | "developing";

  original_chords: string[];

  practice_chords: string[];

  deferred_chords: string[];

  review_chords: string[];

  decisions: ChordDecision[];

  recommended_bpm: number;

  max_chords_per_session: number;

  manual_review_required: boolean;

  notes: string[];
};
