export type Song = {
  id: string;
  title: string;
  /** `null` when the artist is unknown. */
  artist: string | null;
  /** `null` when the album is unknown. */
  album: string | null;
  /** MediaStore album id, or `null`. */
  albumId: string | null;
  durationSec: number;
  /** Playable content URI. */
  uri: string;
  filename: string;
  /** Milliseconds since epoch. */
  dateAdded: number;
  /** Milliseconds since epoch. Changes when the file changes (the cover cache uses it). */
  dateModified: number;
};

/** File details for the Song info sheet. `null` when Android does not know the value. */
export type SongFileDetails = {
  sizeBytes: number | null;
  /** E.g. "audio/mpeg". */
  mimeType: string | null;
  /** E.g. "Music/Downloads". */
  folder: string | null;
  /** Bits per second. */
  bitrate: number | null;
};
