import type { SongRef } from '@/types/playlist';
import type { Song } from '@/types/song';
import { getFallbackKey, rematchSaved, type SavedSongEntry } from '@/utils/songKey';

export function toSongRef(song: Song): SongRef {
  return { id: song.id, fallbackKey: getFallbackKey(song) };
}

/**
 * Re-matches an ordered list of saved songs (a playlist) with the current songs, with the same rules
 * as rematchSaved (utils/songKey). The order is kept.
 * Returns the same array when nothing changed, so nothing re-renders.
 */
export function rematchSongList(list: SongRef[], songs: readonly Song[]): SongRef[] {
  // rematchSaved works on a record by id; the position remembers the order.
  const byId: Record<string, SavedSongEntry & { position: number }> = {};
  list.forEach((ref, position) => {
    byId[ref.id] = { fallbackKey: ref.fallbackKey, position };
  });

  const rematched = rematchSaved(byId, songs);
  if (rematched === byId) return list;

  return Object.entries(rematched)
    .sort(([, a], [, b]) => a.position - b.position)
    .map(([id, entry]) => ({ id, fallbackKey: entry.fallbackKey }));
}

/** How many of the saved songs are on the phone right now. */
export function countAvailableSongs(refs: readonly SongRef[], songsById: Readonly<Record<string, Song>>): number {
  return refs.reduce((count, ref) => (songsById[ref.id] ? count + 1 : count), 0);
}

/**
 * The songs for saved ids, in the same order. Ids that are not on the phone right now are left out,
 * so a missing song is never shown or played.
 */
export function resolveSongs(ids: readonly string[], songsById: Readonly<Record<string, Song>>): Song[] {
  const songs: Song[] = [];
  for (const id of ids) {
    const song = songsById[id];
    if (song) songs.push(song);
  }
  return songs;
}
