export type Song = {
  id: string;
  title: string;
  /** `null` when the artist is unknown. */
  artist: string | null;
  /** `null` when the album is unknown. */
  album: string | null;
  /** MediaStore album id (used for album art later), or `null`. */
  albumId: string | null;
  durationSec: number;
  /** Playable content URI. */
  uri: string;
  filename: string;
  /** Milliseconds since epoch. */
  dateAdded: number;
};
