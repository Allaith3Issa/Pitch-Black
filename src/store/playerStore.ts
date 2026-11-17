import { create } from 'zustand';

import * as audio from '@/services/audioPlayer';
import { pausePlayThrough } from '@/services/playCountTracker';
import { usePlaybackProgressStore } from '@/store/playbackProgressStore';
import { createPlayerEngine } from '@/store/playerEngine';
import { useSettingsStore } from '@/store/settingsStore';
import { randomIndex, shuffleIds } from '@/utils/shuffle';
import { getSkipTarget } from '@/utils/skip';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export type PlayerState = {
  /** Song ids in the order of the list where playback started (never copies of songs). */
  listQueue: string[];
  /** Song ids in play order: `listQueue`, or a shuffled copy of it when shuffle is on. */
  queue: string[];
  /** Where the queue comes from, shown on Now Playing (e.g. "All songs"). */
  queueTitle: string;
  /** Index in `queue` of the current song, or -1 when nothing is loaded. */
  currentIndex: number;
  isPlaying: boolean;
  status: PlaybackStatus;
  /** A short message to show once (e.g. a song could not be played), or `null`. */
  errorMessage: string | null;

  playQueue: (ids: string[], startIndex: number, title: string) => void;
  /** "Play" button: turns shuffle off and plays `ids` in list order from the first song. */
  playInOrder: (ids: string[], title: string) => void;
  /** Turns shuffle on and plays `ids` from a random song. */
  shufflePlay: (ids: string[], title: string) => void;
  /** Shuffle on: the other songs are mixed. Off: back to the list order. The current song keeps playing. */
  toggleShuffle: () => void;
  togglePlay: () => void;
  next: () => void;
  /** "Previous" button: restarts the song after 3 s, otherwise goes to the previous song. */
  previous: () => void;
  /** Always goes to the previous song (Mini Player swipe). */
  previousSong: () => void;
  seekTo: (seconds: number) => void;
  /** Jumps forward (positive) or back (negative) inside the song. */
  skipBy: (deltaSec: number) => void;
  clearError: () => void;
};

// Not persisted (only shuffle and repeat are saved, in settingsStore).
// The playback logic itself is in store/playerEngine.
// Note (development only): Fast Refresh of this file or of services/audioPlayer adds a second
// listener / player. Reload the app (press "r") if you hear two songs at once.
export const usePlayerStore = create<PlayerState>()((set, get) => {
  const engine = createPlayerEngine(set, get);

  // Listen to the player for the whole life of the app.
  audio.onStatus(engine.handleStatus);

  return {
    listQueue: [],
    queue: [],
    queueTitle: '',
    currentIndex: -1,
    isPlaying: false,
    status: 'idle',
    errorMessage: null,

    playQueue: (ids, startIndex, title) => {
      if (ids.length === 0) return;
      const shuffle = useSettingsStore.getState().shuffle;
      // With shuffle on, the tapped song plays first and the others follow in a mixed order.
      set({ listQueue: ids, queue: shuffle ? shuffleIds(ids, ids[startIndex]) : ids, queueTitle: title });
      engine.startQueue(shuffle ? 0 : startIndex);
    },

    playInOrder: (ids, title) => {
      if (ids.length === 0) return;
      useSettingsStore.getState().setShuffle(false);
      get().playQueue(ids, 0, title);
    },

    shufflePlay: (ids, title) => {
      if (ids.length === 0) return;
      useSettingsStore.getState().setShuffle(true);
      get().playQueue(ids, randomIndex(ids.length), title);
    },

    toggleShuffle: () => {
      const shuffle = !useSettingsStore.getState().shuffle;
      useSettingsStore.getState().setShuffle(shuffle);
      const { listQueue, queue, currentIndex } = get();
      if (currentIndex === -1) return;
      const currentId = queue[currentIndex];
      if (shuffle) {
        set({ queue: shuffleIds(listQueue, currentId), currentIndex: 0 });
      } else {
        set({ queue: listQueue, currentIndex: Math.max(0, listQueue.indexOf(currentId)) });
      }
    },

    togglePlay: () => {
      const { currentIndex, isPlaying, status } = get();
      if (currentIndex === -1) return;
      if (status === 'error') {
        // Try the same song again.
        engine.startQueue(currentIndex);
      } else if (isPlaying) {
        pausePlayThrough();
        engine.pause();
      } else {
        engine.play();
      }
    },

    next: () => engine.goNext(false),

    previous: () => engine.goBack(usePlaybackProgressStore.getState().positionSec),

    previousSong: () => engine.goBack(0),

    seekTo: engine.seek,

    skipBy: (deltaSec) => {
      if (get().currentIndex === -1) return;
      const { positionSec, durationSec } = usePlaybackProgressStore.getState();
      const target = getSkipTarget(positionSec, durationSec, deltaSec);
      if (target === null) {
        engine.goNext(true);
      } else {
        engine.seek(target);
      }
    },

    clearError: () => set({ errorMessage: null }),
  };
});
