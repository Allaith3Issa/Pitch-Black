/*
 * Counts real listening time for one play-through of a song.
 *
 * A play counts once, when the song has been listened to for 30 s, or for half of its length if
 * it is shorter. Only real listening adds time:
 * - pause / resume: no time is added while paused, and the total goes on after resume
 * - seeking: a jump only adds the real time that passed, not the distance of the jump, and the
 *   total can never be more than the real time spent playing (so many quick seeks do not add up)
 * A new play-through (song loaded again, restart, repeat-one) starts with startListen().
 */

export const MAX_COUNT_THRESHOLD_SEC = 30;

// Extra time allowed, because the player's position and our clock never tick exactly together.
const CLOCK_SLACK_SEC = 0.5;

export type ListenState = {
  listenedSec: number;
  /** Real time spent playing in this play-through. `listenedSec` can never be more (+ slack). */
  playingSec: number;
  /** Position and time of the last update while playing, or `null` after a pause / at the start. */
  lastPositionSec: number | null;
  lastUpdateMs: number;
  /** The play was already counted for this play-through. */
  counted: boolean;
};

export type ListenUpdate = {
  positionSec: number;
  nowMs: number;
  isPlaying: boolean;
  /** Length of the song. 0 when unknown. */
  durationSec: number;
};

/** A new play-through. */
export function startListen(): ListenState {
  return { listenedSec: 0, playingSec: 0, lastPositionSec: null, lastUpdateMs: 0, counted: false };
}

/**
 * Paused: forget the last position, so a seek while paused does not count as listening after resume.
 * Called on every "not playing" update, and right away when the user taps pause.
 */
export function pauseListen(state: ListenState): ListenState {
  return state.lastPositionSec === null ? state : { ...state, lastPositionSec: null };
}

/** 30 s, or half of the song if it is shorter than 60 s. */
export function getCountThresholdSec(durationSec: number): number {
  return durationSec > 0 ? Math.min(MAX_COUNT_THRESHOLD_SEC, durationSec / 2) : MAX_COUNT_THRESHOLD_SEC;
}

/** Adds the listening time of one player update. `countNow` is `true` exactly once per play-through. */
export function trackListening(
  state: ListenState,
  update: ListenUpdate,
): { state: ListenState; countNow: boolean } {
  if (!update.isPlaying) {
    return { state: pauseListen(state), countNow: false };
  }

  let listenedSec = state.listenedSec;
  let playingSec = state.playingSec;
  if (state.lastPositionSec !== null) {
    const moved = update.positionSec - state.lastPositionSec;
    const elapsed = Math.max(0, (update.nowMs - state.lastUpdateMs) / 1000);
    playingSec += elapsed;
    // Backward (seek back) adds nothing. Forward adds at most the real time that passed.
    if (moved > 0) {
      listenedSec = Math.min(listenedSec + Math.min(moved, elapsed + CLOCK_SLACK_SEC), playingSec + CLOCK_SLACK_SEC);
    }
  }

  const countNow = !state.counted && listenedSec >= getCountThresholdSec(update.durationSec);
  return {
    state: {
      listenedSec,
      playingSec,
      lastPositionSec: update.positionSec,
      lastUpdateMs: update.nowMs,
      counted: state.counted || countNow,
    },
    countNow,
  };
}
