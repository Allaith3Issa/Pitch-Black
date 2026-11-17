import type { Song } from '@/types/song';
import { createRequestQueue } from '@/utils/requestQueue';
import MediaStore from '@modules/media-store';

// Embedded song covers, read and cached by the native module (modules/media-store).
// The queue makes sure fast scrolling stays smooth: few reads at a time, newest first,
// skipped when the row scrolled away, and each cover read only once (see utils/requestQueue).

/** `small`: song rows and the Mini Player. `large`: Now Playing. */
export type CoverSize = 'small' | 'large';

/** Shorter side of the cached image, in pixels (about 3× the shown size on a typical phone). */
const COVER_PIXELS: Record<CoverSize, number> = {
  small: 160,
  large: 800,
};

/** At most this many covers are read at the same time. */
const MAX_RUNNING = 3;

type CoverSong = Pick<Song, 'id' | 'dateModified'>;

/** One key per song, file version and size, e.g. "large:123:1731830400000". */
function coverKey(song: CoverSong, size: CoverSize): string {
  return `${size}:${song.id}:${song.dateModified}`;
}

/** `string` = cover file URI, `null` = the song has no cover. */
const queue = createRequestQueue<string | null>((key) => {
  const [size, id, dateModified] = key.split(':');
  const pixels = size === 'large' ? COVER_PIXELS.large : COVER_PIXELS.small;
  return MediaStore.getCoverAsync(id, Number(dateModified), pixels);
}, MAX_RUNNING);

/** The cover if it is already known: a URI, `null` (no cover), or `undefined` (not loaded yet). */
export function peekSongCover(song: CoverSong, size: CoverSize): string | null | undefined {
  const known = queue.peek(coverKey(song, size));
  // A song without a small cover has no large one either: no need to read the file again.
  if (known === undefined && size === 'large' && queue.peek(coverKey(song, 'small')) === null) return null;
  return known;
}

/** Loads the cover; `listener` gets it. Returns a cancel function (see utils/requestQueue). */
export function requestSongCover(
  song: CoverSong,
  size: CoverSize,
  listener: (uri: string | null) => void,
): () => void {
  return queue.request(coverKey(song, size), listener);
}
