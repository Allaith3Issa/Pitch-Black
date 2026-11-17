import type { QueueSource } from '@/types/player';
import type { Song } from '@/types/song';
import { getFallbackKey } from '@/utils/songKey';

/**
 * The queue as saved on the phone ("Resume last song"). Saved only when the queue changes.
 * MediaStore ids can change, so every id keeps its fallback key (see utils/songKey).
 */
export type SavedQueue = {
  listQueue: string[];
  queue: string[];
  queueSource: QueueSource;
  /** Fallback key per song id in the queue. */
  fallbackKeys: Record<string, string>;
};

/** The current song and where it was. Saved more often than the queue (on pause, in the background...). */
export type SavedPosition = {
  songId: string;
  positionSec: number;
};

/** What the player loads on app start: the same queue, the same song, paused at the same place. */
export type RestoredSession = {
  listQueue: string[];
  queue: string[];
  queueSource: QueueSource;
  currentIndex: number;
  positionSec: number;
};

export function toSavedQueue(
  listQueue: string[],
  queue: string[],
  queueSource: QueueSource,
  songsById: Readonly<Record<string, Song>>,
): SavedQueue {
  const fallbackKeys: Record<string, string> = {};
  for (const id of listQueue) {
    const song = songsById[id];
    if (song) fallbackKeys[id] = getFallbackKey(song);
  }
  return { listQueue, queue, queueSource, fallbackKeys };
}

/**
 * Matches the saved session with the songs on the phone now (same id, or the same fallback key).
 * Queue songs that are gone are left out. Returns `null` when the current song is no longer on the
 * phone: then the app starts with nothing loaded.
 */
export function resolveSavedSession(
  saved: SavedQueue | null,
  position: SavedPosition | null,
  songs: readonly Song[],
): RestoredSession | null {
  if (saved === null || position === null) return null;

  const songById = new Map(songs.map((song) => [song.id, song]));
  // fallback key → song id, or null when two songs share it (then we do not guess).
  const idByFallbackKey = new Map<string, string | null>();
  for (const song of songs) {
    const key = getFallbackKey(song);
    idByFallbackKey.set(key, idByFallbackKey.has(key) ? null : song.id);
  }

  const toCurrentId = (savedId: string): string | null => {
    const key = saved.fallbackKeys[savedId];
    if (key === undefined) return null;
    const song = songById.get(savedId);
    if (song && getFallbackKey(song) === key) return savedId;
    return idByFallbackKey.get(key) ?? null;
  };
  const toCurrentIds = (ids: string[]) => ids.map(toCurrentId).filter((id): id is string => id !== null);

  const queue = toCurrentIds(saved.queue);
  const currentId = toCurrentId(position.songId);
  const currentIndex = currentId === null ? -1 : queue.indexOf(currentId);
  if (currentId === null || currentIndex === -1) return null;

  const durationSec = songById.get(currentId)?.durationSec ?? 0;
  // A position at (or past) the end would finish the song at once: start it from 0:00 instead.
  const positionSec = position.positionSec > 0 && position.positionSec < durationSec ? position.positionSec : 0;

  return {
    listQueue: toCurrentIds(saved.listQueue),
    queue,
    queueSource: saved.queueSource,
    currentIndex,
    positionSec,
  };
}
