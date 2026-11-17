import type { Song } from '@/types/song';

/** Saved data about one song (play count, later favorites...), stored under the song's id. */
export type SavedSongEntry = {
  /** See getFallbackKey. Used when the id no longer points to this song. */
  fallbackKey: string;
};

/** Entries whose song is not found are kept under this prefix + their old id, waiting for a match. */
export const MISSING_KEY_PREFIX = 'missing:';

/**
 * A second key for a song, for when its MediaStore id changes (file re-added, phone migration...):
 * the filename (any case) + the duration in whole seconds, e.g. "hello.mp3|225".
 */
export function getFallbackKey(song: Pick<Song, 'filename' | 'durationSec'>): string {
  return `${song.filename.toLowerCase()}|${Math.round(song.durationSec)}`;
}

/**
 * Re-matches saved entries with the current songs:
 *
 * - The id exists and its song has the same fallback key → the entry stays.
 * - Otherwise (id gone, or after a migration the id now belongs to another song): the entry moves to
 *   the one song with its fallback key, if that song has no entry yet.
 * - Two songs share the fallback key → no guess.
 * - No match → the entry is kept (the file may be on an SD card that is not mounted right now).
 *   If its old id now belongs to another song, it is kept under "missing:<old id>", so that other
 *   song does not show it.
 *
 * Returns the same object when nothing changed, so nothing re-renders.
 */
export function rematchSaved<T extends SavedSongEntry>(
  saved: Readonly<Record<string, T>>,
  songs: readonly Song[],
): Record<string, T> {
  const fallbackKeyById = new Map(songs.map((song) => [song.id, getFallbackKey(song)]));

  // fallback key → song id, or null when two songs share it.
  const idByFallbackKey = new Map<string, string | null>();
  for (const [id, key] of fallbackKeyById) {
    idByFallbackKey.set(key, idByFallbackKey.has(key) ? null : id);
  }

  // First keep every entry that still matches, so a moved entry can never push one of them out.
  const result: Record<string, T> = {};
  const unmatched: [string, T][] = [];
  for (const [key, entry] of Object.entries(saved)) {
    if (fallbackKeyById.get(key) === entry.fallbackKey) {
      result[key] = entry;
    } else {
      unmatched.push([key, entry]);
    }
  }

  let changed = false;
  for (const [key, entry] of unmatched) {
    const newId = idByFallbackKey.get(entry.fallbackKey);
    let target: string;
    if (newId != null && !(newId in result)) {
      target = newId;
    } else if (fallbackKeyById.has(key) || key in result) {
      // The old id belongs to another song now (or is taken): park the entry.
      target = `${MISSING_KEY_PREFIX}${key}`;
    } else {
      target = key;
    }
    result[target] = entry;
    if (target !== key) changed = true;
  }

  return changed ? result : (saved as Record<string, T>);
}
