import type { StoreApi } from 'zustand';

import * as audio from '@/services/audioPlayer';
import { startPlayThrough, trackPlayThrough } from '@/services/playCountTracker';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlaybackProgressStore } from '@/store/playbackProgressStore';
import type { PlaybackStatus, PlayerState } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { getNextIndex, getPreviousAction } from '@/utils/queue';
import { isStalePosition, type PendingSeek, startSeek } from '@/utils/seekGuard';
import { shuffleNewRound } from '@/utils/shuffle';

/*
 * The inside of playerStore: loading songs, moving through the queue and reacting to the native
 * player. Only playerStore uses this file; screens use the store's actions.
 */

/**
 * After a tap (play, pause, new song) the native player needs a moment to follow, and a status
 * update that was already on its way still has the old play/pause state. For this long after a
 * tap we trust the tap, not the player's play/pause state, so the icons do not flicker.
 */
const COMMAND_GRACE_MS = 600;

const getRepeatMode = () => useSettingsStore.getState().repeatMode;

export function createPlayerEngine(set: StoreApi<PlayerState>['setState'], get: StoreApi<PlayerState>['getState']) {
  let lastCommandAt = 0;
  /** The last seek, until the player reports the new position (see utils/seekGuard). */
  let pendingSeek: PendingSeek | null = null;
  /** Songs in a row that failed while loading. When every song fails, we stop instead of looping. */
  let failedInARow = 0;

  function markCommand() {
    lastCommandAt = Date.now();
  }

  function seek(seconds: number) {
    pendingSeek = startSeek(seconds, Date.now());
    usePlaybackProgressStore.setState({ positionSec: seconds });
    audio.seekTo(seconds).catch(() => undefined);
  }

  /** Back to 0:00 as a new play-through, so the song can count again (previous, repeat-one). */
  function restartSong() {
    startPlayThrough();
    seek(0);
  }

  /** Stops at the start of the current song, so tapping play starts it again. */
  function stop(status: PlaybackStatus) {
    markCommand();
    startPlayThrough();
    audio.pause();
    seek(0);
    set({ isPlaying: false, status });
  }

  /** Loads and plays queue[index]. Returns `false` when the song cannot be started. */
  function startSong(index: number): boolean {
    const song = useLibraryStore.getState().songsById[get().queue[index]];
    markCommand();
    startPlayThrough();
    pendingSeek = null;
    set({ currentIndex: index, status: 'loading', isPlaying: true });
    usePlaybackProgressStore.setState({ positionSec: 0, durationSec: song?.durationSec ?? 0 });

    // The song is no longer in the library (e.g. the file was deleted).
    if (!song) return false;
    try {
      audio.load(song.uri);
      audio.play();
      return true;
    } catch {
      return false;
    }
  }

  function reportFailedSong(index: number) {
    const title = useLibraryStore.getState().songsById[get().queue[index]]?.title;
    set({ errorMessage: title ? `Could not play "${title}". Skipped.` : 'Could not play this song. Skipped.' });
  }

  /** Plays the song at `index`. Songs that cannot be started are skipped; stops at the end of the queue. */
  function playFrom(index: number | null) {
    let current = index;
    // With repeat 'all' the queue never ends, so try each song at most once.
    for (let tries = 0; current !== null && tries < get().queue.length; tries++) {
      if (startSong(current)) return;
      failedInARow += 1;
      reportFailedSong(current);
      current = getNextIndex(current, get().queue.length, getRepeatMode());
    }
    stop('error');
  }

  /** Plays a new queue from `index` (a new start: earlier failures are forgotten). */
  function startQueue(index: number) {
    failedInARow = 0;
    playFrom(index);
  }

  /** Previous song, or restart; `positionSec` 0 means "always go to the previous song". */
  function goBack(positionSec: number) {
    const { currentIndex, queue } = get();
    if (currentIndex === -1) return;
    const action = getPreviousAction(currentIndex, positionSec, queue.length, getRepeatMode());
    if (action.type === 'restart') {
      restartSong();
    } else {
      playFrom(action.index);
    }
  }

  /**
   * Plays the next song. At the end of the queue: `stopAtEnd` stops (the song ended by itself, or a
   * skip forward passed its end); otherwise nothing happens ("next" button).
   * Repeat 'all' with shuffle on: a new round starts with a new mixed order.
   */
  function goNext(stopAtEnd: boolean) {
    const { currentIndex, queue, listQueue } = get();
    const nextIndex = getNextIndex(currentIndex, queue.length, getRepeatMode());
    if (nextIndex === null) {
      if (stopAtEnd) stop('paused');
      return;
    }
    if (nextIndex === 0 && useSettingsStore.getState().shuffle) {
      // The current song goes last in the new order, so `currentIndex` (the last index) still points at it.
      set({ queue: shuffleNewRound(listQueue, queue[currentIndex]) });
    }
    playFrom(nextIndex);
  }

  function play() {
    markCommand();
    audio.play();
    set({ isPlaying: true, status: 'playing' });
  }

  function pause() {
    markCommand();
    audio.pause();
    set({ isPlaying: false, status: 'paused' });
  }

  function handleStatus(status: audio.PlayerStatus) {
    const state = get();
    if (state.currentIndex === -1) return;

    // The native player sends an error only once, in one update.
    if (status.error) {
      if (state.status === 'error') return;
      reportFailedSong(state.currentIndex);
      failedInARow += 1;
      if (failedInARow >= state.queue.length) {
        stop('error');
      } else {
        playFrom(getNextIndex(state.currentIndex, state.queue.length, getRepeatMode()));
      }
      return;
    }

    if (status.didJustFinish) {
      if (getRepeatMode() === 'one') {
        restartSong();
        play();
      } else {
        goNext(true);
      }
      return;
    }

    if (status.playing) failedInARow = 0;

    if (!isStalePosition(pendingSeek, status.currentTime, Date.now())) {
      pendingSeek = null;
      usePlaybackProgressStore.setState(
        status.duration > 0
          ? { positionSec: status.currentTime, durationSec: status.duration }
          : { positionSec: status.currentTime },
      );
    }
    // Play count (see services/playCountTracker).
    const song = useLibraryStore.getState().songsById[state.queue[state.currentIndex]];
    if (song) trackPlayThrough(song, status);

    if (Date.now() - lastCommandAt < COMMAND_GRACE_MS) return;

    if (status.playing) {
      if (state.status !== 'playing') set({ status: 'playing', isPlaying: true });
    } else if (state.status === 'playing' || (state.status === 'loading' && status.playbackState === 'ready')) {
      // The player stopped (or could not start) by itself: another app or a phone call has the
      // audio focus, or headphones were unplugged.
      set({ status: 'paused', isPlaying: false });
    }
  }

  return { seek, startQueue, goBack, goNext, play, pause, handleStatus };
}
