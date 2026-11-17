import { create } from 'zustand';

import {
  getAudioPermission,
  loadAllSongs,
  requestAudioPermission,
} from '@/services/mediaLibrary';
import type { AppError } from '@/types/error';
import type { AudioPermission } from '@/types/permission';
import type { Song } from '@/types/song';
import { mergeSongs } from '@/utils/mergeSongs';
import { getSongChanges, type SongChanges } from '@/utils/songChanges';
import { getErrorCode, toAppError } from '@/utils/toAppError';

export type LibraryStatus = 'idle' | 'loading' | 'ready' | 'error';

type LibraryState = {
  songs: Song[];
  /** The same songs, by id: a fast lookup for the player queue (which holds ids only). */
  songsById: Record<string, Song>;
  status: LibraryStatus;
  /** A quiet rescan (refreshSongs) is running. The list stays on screen meanwhile. */
  isRefreshing: boolean;
  /** When the last scan (full load or quiet rescan) finished, or `null`. Shown in Settings. */
  lastScanAt: number | null;
  error: AppError | null;
  /** `null` until the first check has finished. */
  permission: AudioPermission | null;
  /** The user tapped "Not now" on the permission screen (only for this app session). */
  skippedPermission: boolean;
  /** Why the last permission check/request failed (shown on screen), or `null`. */
  permissionError: AppError | null;

  checkPermission: () => Promise<void>;
  requestPermission: () => Promise<void>;
  loadSongs: () => Promise<void>;
  /**
   * Rescans quietly: no spinner, unchanged songs keep their objects (see utils/mergeSongs).
   * If a rescan is already running, returns that one's result instead of starting another.
   * Returns what changed, or `null` when it did not run (no list yet) or failed.
   */
  refreshSongs: () => Promise<SongChanges | null>;
  /**
   * "Rescan music library" in Settings: a quiet rescan, or a full load when the last load failed.
   * Returns what changed, or `null` when it did not run or failed.
   */
  rescan: () => Promise<SongChanges | null>;
  skipPermission: () => void;
};

// Friendly texts. The original error text is only kept in development (see toAppError).
const PERMISSION_ERROR = 'Could not ask for permission to read your music. Please try again.';

// Errors from the media-store native module, by error code.
const LOAD_ERROR_MESSAGES: Record<string, string> = {
  ERR_MISSING_AUDIO_PERMISSION: 'Pitch Black does not have permission to read your music.',
  ERR_MEDIA_STORE_QUERY: 'Could not read the music on your device. Please try again.',
};
const DEFAULT_LOAD_ERROR = 'Could not read the music on your device.';

function toLoadError(error: unknown): AppError {
  const code = getErrorCode(error);
  return toAppError((code && LOAD_ERROR_MESSAGES[code]) || DEFAULT_LOAD_ERROR, error);
}

// Goes up with every full load (loadSongs). A quiet scan that started before a full load is older
// than its result, so it is dropped.
let fullLoadCount = 0;

// The quiet rescan that is running now, or `null`. A second rescan meanwhile (e.g. "Rescan" in
// Settings during the auto refresh) waits for this one and gets its result.
let runningRefresh: Promise<SongChanges | null> | null = null;

function toSongsById(songs: Song[]): Record<string, Song> {
  return Object.fromEntries(songs.map((song) => [song.id, song]));
}

// Not persisted: the library is scanned again on every app start.
export const useLibraryStore = create<LibraryState>()((set, get) => {
  /** One quiet rescan (see refreshSongs). */
  async function quietScan(): Promise<SongChanges | null> {
    set({ isRefreshing: true });
    const loadCountAtStart = fullLoadCount;
    try {
      const scanned = await loadAllSongs();
      // A full load (loadSongs) started meanwhile: its result is newer, keep it.
      if (fullLoadCount !== loadCountAtStart || get().status !== 'ready') return null;
      const oldSongs = get().songs;
      const songs = mergeSongs(oldSongs, scanned);
      if (songs !== oldSongs) {
        set({ songs, songsById: toSongsById(songs) });
      }
      set({ lastScanAt: Date.now() });
      return getSongChanges(oldSongs, songs);
    } catch {
      // Keep the current list. If access was removed, the permission recheck shows the right screen.
      return null;
    } finally {
      set({ isRefreshing: false });
    }
  }

  return {
    songs: [],
    songsById: {},
    status: 'idle',
    isRefreshing: false,
    lastScanAt: null,
    error: null,
    permission: null,
    skippedPermission: false,
    permissionError: null,

    checkPermission: async () => {
      try {
        set({ permission: await getAudioPermission(), permissionError: null });
      } catch (error) {
        // Still show the permission screen, with the reason.
        set({ permission: 'undetermined', permissionError: toAppError(PERMISSION_ERROR, error) });
      }
    },

    requestPermission: async () => {
      try {
        set({ permission: await requestAudioPermission(), permissionError: null });
      } catch (error) {
        set({ permissionError: toAppError(PERMISSION_ERROR, error) });
      }
    },

    loadSongs: async () => {
      if (get().status === 'loading') return;
      fullLoadCount += 1;
      set({ status: 'loading', error: null });
      try {
        const songs = await loadAllSongs();
        set({ songs, songsById: toSongsById(songs), status: 'ready', lastScanAt: Date.now() });
      } catch (error) {
        set({ status: 'error', error: toLoadError(error) });
        // Access was removed (e.g. in the system settings): re-check, so the screen offers "Grant access"
        // instead of a "Try again" button that would keep failing.
        if (getErrorCode(error) === 'ERR_MISSING_AUDIO_PERMISSION') {
          await get().checkPermission();
        }
      }
    },

    refreshSongs: () => {
      if (runningRefresh) return runningRefresh;
      if (get().status !== 'ready') return Promise.resolve(null);
      runningRefresh = quietScan().finally(() => {
        runningRefresh = null;
      });
      return runningRefresh;
    },

    rescan: async () => {
      const { status, permission } = get();
      if (status === 'ready') return get().refreshSongs();
      if (status === 'loading' || permission !== 'granted') return null;
      const oldSongs = get().songs;
      await get().loadSongs();
      return get().status === 'ready' ? getSongChanges(oldSongs, get().songs) : null;
    },

    skipPermission: () => set({ skippedPermission: true }),
  };
});
