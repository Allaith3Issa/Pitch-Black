export type Song = {
  id: string;
  title: string;
  /** `null` when the artist is unknown. */
  artist: string | null;
  durationSec: number;
  /** Playable content URI. */
  uri: string;
  filename: string;
  /** Milliseconds since epoch. */
  dateAdded: number;
};
