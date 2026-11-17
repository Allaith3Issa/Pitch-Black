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
import { getErrorCode, toAppError } from '@/utils/toAppError';

export type LibraryStatus = 'idle' | 'loading' | 'ready' | 'error';

type LibraryState = {
  songs: Song[];
  /** The same songs, by id: a fast lookup for the player queue (which holds ids only). */
  songsById: Record<string, Song>;
  status: LibraryStatus;
  /** A quiet rescan (refreshSongs) is running. The list stays on screen meanwhile. */
  isRefreshing: boolean;
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
  /** Rescans quietly: no spinner, unchanged songs keep their objects (see utils/mergeSongs). */
  refreshSongs: () => Promise<void>;
  skipPermission: () => void;
};

// Friendly texts. The original error text is only kept in development (see toAppError).
const PERMISSION_ERROR = 'Could not ask for permission to read your music. Please try again.';

// Errors from the media-store native module, by error code.
const LOAD_ERROR_MESSAGES: Record<string, string> = {
  ERR_MISSING_AUDIO_PERMISSION: 'Pitch PLAYER does not have permission to read your music.',
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

function toSongsById(songs: Song[]): Record<string, Song> {
  return Object.fromEntries(songs.map((song) => [song.id, song]));
}

// Not persisted: the library is scanned again on every app start.
export const useLibraryStore = create<LibraryState>()((set, get) => ({
  songs: [],
  songsById: {},
  status: 'idle',
  isRefreshing: false,
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
      set({ songs, songsById: toSongsById(songs), status: 'ready' });
    } catch (error) {
      set({ status: 'error', error: toLoadError(error) });
      // Access was removed (e.g. in the system settings): re-check, so the screen offers "Grant access"
      // instead of a "Try again" button that would keep failing.
      if (getErrorCode(error) === 'ERR_MISSING_AUDIO_PERMISSION') {
        await get().checkPermission();
      }
    }
  },

  refreshSongs: async () => {
    const { status, isRefreshing } = get();
    if (status !== 'ready' || isRefreshing) return;
    set({ isRefreshing: true });
    const loadCountAtStart = fullLoadCount;
    try {
      const scanned = await loadAllSongs();
      // A full load (loadSongs) started meanwhile: its result is newer, keep it.
      if (fullLoadCount !== loadCountAtStart || get().status !== 'ready') return;
      const songs = mergeSongs(get().songs, scanned);
      if (songs !== get().songs) {
        set({ songs, songsById: toSongsById(songs) });
      }
    } catch {
      // Keep the current list. If access was removed, the permission recheck shows the right screen.
    } finally {
      set({ isRefreshing: false });
    }
  },

  skipPermission: () => set({ skippedPermission: true }),
}));
