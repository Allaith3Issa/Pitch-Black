import type { PlayerStatus } from '@/services/audioPlayer';
import { usePlayCountStore } from '@/store/playCountStore';
import type { Song } from '@/types/song';
import { pauseListen, startListen, trackListening } from '@/utils/listenTracker';

/*
 * Play counts for the song in the player. playerStore tells it when a play-through starts or is
 * paused, and passes every status update; the rules are in utils/listenTracker.
 */

let listen = startListen();

/** A new play-through: song loaded, restart via "previous", stop at the end, repeat-one (Step 5). */
export function startPlayThrough(): void {
  listen = startListen();
}

/** The user tapped pause. Called right away, without waiting for the player's "not playing" update. */
export function pausePlayThrough(): void {
  listen = pauseListen(listen);
}

/** Adds the listening time of one status update; adds a play once the threshold is reached. */
export function trackPlayThrough(song: Song, status: PlayerStatus): void {
  const result = trackListening(listen, {
    positionSec: status.currentTime,
    nowMs: Date.now(),
    isPlaying: status.playing,
    durationSec: song.durationSec,
  });
  listen = result.state;
  if (result.countNow) usePlayCountStore.getState().addPlay(song);
}
