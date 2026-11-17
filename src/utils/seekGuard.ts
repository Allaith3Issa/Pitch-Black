/*
 * After a seek the player can still send one or two updates with the OLD position. Showing them
 * would make the slider thumb and the progress line jump back for a moment. So after a seek we
 * ignore positions until the player reports one near the target, or a short time has passed.
 */

/** How close (seconds) a reported position must be to the target to count as "arrived". */
const SEEK_TOLERANCE_SEC = 1.5;
/** After this long we trust the player again, even if it never reported the target. */
const SEEK_TIMEOUT_MS = 1500;

export type PendingSeek = {
  targetSec: number;
  untilMs: number;
};

export function startSeek(targetSec: number, nowMs: number): PendingSeek {
  return { targetSec, untilMs: nowMs + SEEK_TIMEOUT_MS };
}

/** `true` while the player still reports an old position from before the seek. */
export function isStalePosition(pending: PendingSeek | null, positionSec: number, nowMs: number): boolean {
  if (pending === null || nowMs > pending.untilMs) return false;
  return Math.abs(positionSec - pending.targetSec) > SEEK_TOLERANCE_SEC;
}
