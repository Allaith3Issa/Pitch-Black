import { AppState } from 'react-native';

import { useLastPositionStore } from '@/store/lastPositionStore';
import { useLastQueueStore } from '@/store/lastQueueStore';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlaybackProgressStore } from '@/store/playbackProgressStore';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { resolveSavedSession, toSavedQueue } from '@/utils/lastSession';

/*
 * "Resume last song": saves what is playing, and loads it again (paused) on the next app start.
 * The rules for matching the saved songs are in utils/lastSession.
 */

/** While a song plays, its position is saved at most this often (in case the app is killed). */
const POSITION_SAVE_INTERVAL_MS = 10_000;

function saveQueue(): void {
  const { listQueue, queue, queueSource } = usePlayerStore.getState();
  if (queueSource === null || queue.length === 0) return;
  const { songsById } = useLibraryStore.getState();
  useLastQueueStore.getState().saveQueue(toSavedQueue(listQueue, queue, queueSource, songsById));
}

function savePosition(): void {
  const { queue, currentIndex } = usePlayerStore.getState();
  if (currentIndex === -1) return;
  const { positionSec } = usePlaybackProgressStore.getState();
  useLastPositionStore.getState().savePosition({ songId: queue[currentIndex], positionSec });
}

/**
 * Starts saving: the queue only when it changes; the song and position on a song change, on pause,
 * when the app leaves the foreground, and every few seconds while playing. Returns a stop function.
 */
export function startSavingSession(): () => void {
  let lastPositionSaveAt = 0;
  const savePositionNow = () => {
    lastPositionSaveAt = Date.now();
    savePosition();
  };

  const stopPlayer = usePlayerStore.subscribe((state, prev) => {
    if (state.queue !== prev.queue || state.listQueue !== prev.listQueue || state.queueSource !== prev.queueSource) {
      saveQueue();
    }
    // Only within the same queue: a new queue is set a moment before its song index (see playerStore).
    const songChanged =
      state.queue === prev.queue && state.queue[state.currentIndex] !== prev.queue[prev.currentIndex];
    const paused = prev.isPlaying && !state.isPlaying;
    if (songChanged || paused) savePositionNow();
  });

  const stopProgress = usePlaybackProgressStore.subscribe(() => {
    if (!usePlayerStore.getState().isPlaying) return;
    if (Date.now() - lastPositionSaveAt >= POSITION_SAVE_INTERVAL_MS) savePositionNow();
  });

  const appState = AppState.addEventListener('change', (nextState) => {
    if (nextState !== 'active') savePositionNow();
  });

  return () => {
    stopPlayer();
    stopProgress();
    appState.remove();
  };
}

/**
 * Loads the saved song again, paused, if "Resume last song" is on and nothing is loaded yet.
 * Call once, after the library and the saved session were read.
 */
export function restoreLastSession(): void {
  if (!useSettingsStore.getState().resumeLastSong) return;
  if (usePlayerStore.getState().currentIndex !== -1) return;
  const session = resolveSavedSession(
    useLastQueueStore.getState().savedQueue,
    useLastPositionStore.getState().savedPosition,
    useLibraryStore.getState().songs,
  );
  if (session !== null) usePlayerStore.getState().restoreSession(session);
}
