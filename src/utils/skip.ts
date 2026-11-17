/** How far the skip back / skip forward buttons jump, in seconds (chosen in Settings). */
export type SkipSeconds = 5 | 10 | 15 | 30;

export const SKIP_SECONDS_OPTIONS: readonly SkipSeconds[] = [5, 10, 15, 30];

export const DEFAULT_SKIP_SECONDS: SkipSeconds = 10;

/**
 * Where a skip of `deltaSec` (negative = back) lands in the song.
 * Back never goes before 0:00. Returns `null` when a skip forward would pass the end of the song:
 * then the player goes to the next song instead.
 */
export function getSkipTarget(positionSec: number, durationSec: number, deltaSec: number): number | null {
  const target = positionSec + deltaSec;
  if (deltaSec > 0 && durationSec > 0 && target >= durationSec) return null;
  return Math.max(0, target);
}
