import { create } from 'zustand';

import * as audio from '@/services/audioPlayer';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlaybackProgressStore } from '@/store/playbackProgressStore';
import { getNextIndex, getPreviousAction } from '@/utils/queue';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

type PlayerState = {
  /** Song ids in play order (never copies of songs). */
  queue: string[];
  /** Index in `queue` of the current song, or -1 when nothing is loaded. */
  currentIndex: number;
  isPlaying: boolean;
  status: PlaybackStatus;
  /** A short message to show once (e.g. a song could not be played), or `null`. */
  errorMessage: string | null;

  playQueue: (ids: string[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  clearError: () => void;
};

/**
 * After a tap (play, pause, new song) the native player needs a moment to follow, and a status
 * update that was already on its way still has the old play/pause state. For this long after a
 * tap we trust the tap, not the player's play/pause state, so the icons do not flicker.
 */
const COMMAND_GRACE_MS = 600;
let lastCommandAt = 0;

function markCommand() {
  lastCommandAt = Date.now();
}

// Not persisted yet.
// Note (development only): Fast Refresh of this file or of services/audioPlayer adds a second
// listener / player. Reload the app (press "r") if you hear two songs at once.
export const usePlayerStore = create<PlayerState>()((set, get) => {
  /** Stops at the start of the current song, so tapping play starts it again. */
  function stop(status: PlaybackStatus) {
    markCommand();
    audio.pause();
    audio.seekTo(0).catch(() => undefined);
    usePlaybackProgressStore.setState({ positionSec: 0 });
    set({ isPlaying: false, status });
  }

  /** Loads and plays queue[index]. Returns `false` when the song cannot be started. */
  function startSong(index: number): boolean {
    const song = useLibraryStore.getState().songsById[get().queue[index]];
    markCommand();
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
    while (current !== null) {
      if (startSong(current)) return;
      reportFailedSong(current);
      current = getNextIndex(current, get().queue.length);
    }
    stop('error');
  }

  function handleStatus(status: audio.PlayerStatus) {
    const state = get();
    if (state.currentIndex === -1) return;

    // The native player sends an error only once, in one update.
    if (status.error) {
      if (state.status === 'error') return;
      reportFailedSong(state.currentIndex);
      playFrom(getNextIndex(state.currentIndex, state.queue.length));
      return;
    }

    if (status.didJustFinish) {
      const nextIndex = getNextIndex(state.currentIndex, state.queue.length);
      if (nextIndex === null) {
        stop('paused');
      } else {
        playFrom(nextIndex);
      }
      return;
    }

    usePlaybackProgressStore.setState(
      status.duration > 0
        ? { positionSec: status.currentTime, durationSec: status.duration }
        : { positionSec: status.currentTime },
    );

    if (Date.now() - lastCommandAt < COMMAND_GRACE_MS) return;

    if (status.playing) {
      if (state.status !== 'playing') set({ status: 'playing', isPlaying: true });
    } else if (state.status === 'playing' || (state.status === 'loading' && status.playbackState === 'ready')) {
      // The player stopped (or could not start) by itself: another app or a phone call has the
      // audio focus, or headphones were unplugged.
      set({ status: 'paused', isPlaying: false });
    }
  }

  // Listen to the player for the whole life of the app.
  audio.onStatus(handleStatus);

  return {
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    status: 'idle',
    errorMessage: null,

    playQueue: (ids, startIndex) => {
      if (ids.length === 0) return;
      set({ queue: ids });
      playFrom(startIndex);
    },

    togglePlay: () => {
      const { currentIndex, isPlaying, status } = get();
      if (currentIndex === -1) return;
      if (status === 'error') {
        // Try the same song again.
        playFrom(currentIndex);
      } else if (isPlaying) {
        markCommand();
        audio.pause();
        set({ isPlaying: false, status: 'paused' });
      } else {
        markCommand();
        audio.play();
        set({ isPlaying: true, status: 'playing' });
      }
    },

    next: () => {
      const { currentIndex, queue } = get();
      const nextIndex = getNextIndex(currentIndex, queue.length);
      if (nextIndex !== null) playFrom(nextIndex);
    },

    previous: () => {
      const { currentIndex } = get();
      if (currentIndex === -1) return;
      const action = getPreviousAction(currentIndex, usePlaybackProgressStore.getState().positionSec);
      if (action.type === 'restart') {
        get().seekTo(0);
      } else {
        playFrom(action.index);
      }
    },

    seekTo: (seconds) => {
      usePlaybackProgressStore.setState({ positionSec: seconds });
      audio.seekTo(seconds).catch(() => undefined);
    },

    clearError: () => set({ errorMessage: null }),
  };
});
