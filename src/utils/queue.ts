/** After this many seconds, "previous" restarts the current song instead of going back. */
export const RESTART_THRESHOLD_SEC = 3;

/** The next index in the queue, or `null` at the end (repeat comes in Step 5). */
export function getNextIndex(currentIndex: number, queueLength: number): number | null {
  const next = currentIndex + 1;
  return next < queueLength ? next : null;
}

export type PreviousAction = { type: 'restart' } | { type: 'play'; index: number };

/**
 * What "previous" should do:
 * - more than 3 s into the song → restart it
 * - otherwise → play the previous song (or restart the first song of the queue)
 */
export function getPreviousAction(currentIndex: number, positionSec: number): PreviousAction {
  if (positionSec > RESTART_THRESHOLD_SEC || currentIndex <= 0) {
    return { type: 'restart' };
  }
  return { type: 'play', index: currentIndex - 1 };
}
