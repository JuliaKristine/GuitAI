export type GuitAISongStatus = "waiting_for_lesson";

export type GuitAISong = {
  id: string;

  source: "spotify";

  source_id: string;

  title: string;
  artist: string;
  album: string;

  image_url: string | null;

  source_url: string | null;

  duration_ms: number;

  explicit: boolean;

  status: GuitAISongStatus;

  lesson_available: boolean;
};
