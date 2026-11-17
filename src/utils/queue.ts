import type { RepeatMode } from '@/types/player';

/** After this many seconds, "previous" restarts the current song instead of going back. */
export const RESTART_THRESHOLD_SEC = 3;

/**
 * The next index in the queue, or `null` at the end.
 * Only 'all' starts again from the first song. Repeat-one does not matter here: it only acts when a
 * song ends by itself, and "next" always goes to the next song.
 */
export function getNextIndex(currentIndex: number, queueLength: number, repeatMode: RepeatMode): number | null {
  if (queueLength === 0) return null;
  const next = currentIndex + 1;
  if (next < queueLength) return next;
  return repeatMode === 'all' ? 0 : null;
}

export type PreviousAction = { type: 'restart' } | { type: 'play'; index: number };

/**
 * What "previous" should do:
 * - more than 3 s into the song → restart it
 * - otherwise → play the previous song
 * - on the first song → the last song with repeat 'all', otherwise restart the first song
 */
export function getPreviousAction(
  currentIndex: number,
  positionSec: number,
  queueLength: number,
  repeatMode: RepeatMode,
): PreviousAction {
  if (positionSec > RESTART_THRESHOLD_SEC) return { type: 'restart' };
  if (currentIndex > 0) return { type: 'play', index: currentIndex - 1 };
  if (repeatMode === 'all' && queueLength > 1) return { type: 'play', index: queueLength - 1 };
  return { type: 'restart' };
}

/** The repeat button cycles off → all → one → off. */
export function getNextRepeatMode(mode: RepeatMode): RepeatMode {
  if (mode === 'off') return 'all';
  if (mode === 'all') return 'one';
  return 'off';
}
