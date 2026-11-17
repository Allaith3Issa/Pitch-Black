import type { Song } from '@/types/song';

/** What a rescan found, compared with the list before it. */
export type SongChanges = {
  added: number;
  removed: number;
};

/** Counts songs that are new and songs that are gone (by id). */
export function getSongChanges(oldSongs: readonly Song[], newSongs: readonly Song[]): SongChanges {
  const oldIds = new Set(oldSongs.map((song) => song.id));
  const newIds = new Set(newSongs.map((song) => song.id));
  const added = newSongs.filter((song) => !oldIds.has(song.id)).length;
  const removed = oldSongs.filter((song) => !newIds.has(song.id)).length;
  return { added, removed };
}

function countText(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

/** Toast text after a rescan, e.g. "Library is up to date" or "3 new songs, 1 song removed". */
export function getRescanMessage({ added, removed }: SongChanges): string {
  const parts: string[] = [];
  if (added > 0) parts.push(countText(added, 'new song', 'new songs'));
  if (removed > 0) parts.push(countText(removed, 'song removed', 'songs removed'));
  return parts.length > 0 ? parts.join(', ') : 'Library is up to date';
}
