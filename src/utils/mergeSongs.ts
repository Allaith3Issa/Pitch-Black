import type { Song } from '@/types/song';

// Every field of Song. `satisfies` makes TypeScript complain here when Song gets a new field.
const SONG_FIELDS = Object.keys({
  id: true,
  title: true,
  artist: true,
  album: true,
  albumId: true,
  durationSec: true,
  uri: true,
  filename: true,
  dateAdded: true,
  dateModified: true,
} satisfies Record<keyof Song, true>) as (keyof Song)[];

function isSameSong(a: Song, b: Song): boolean {
  return SONG_FIELDS.every((field) => a[field] === b[field]);
}

/**
 * Merges a new scan into the current list, for a quiet refresh:
 * - songs that did not change keep their old object, so their rows do not re-render
 * - when nothing changed at all, the old array itself is returned, so nothing re-sorts
 */
export function mergeSongs(oldSongs: Song[], newSongs: Song[]): Song[] {
  const oldById = new Map(oldSongs.map((song) => [song.id, song]));
  const merged = newSongs.map((song) => {
    const old = oldById.get(song.id);
    return old && isSameSong(old, song) ? old : song;
  });

  const unchanged = merged.length === oldSongs.length && merged.every((song, index) => song === oldSongs[index]);
  return unchanged ? oldSongs : merged;
}
