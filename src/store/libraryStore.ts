import { create } from 'zustand';

import {
  getAudioPermission,
  loadAllSongs,
  requestAudioPermission,
} from '@/services/mediaLibrary';
import type { AppError } from '@/types/error';
import type { AudioPermission } from '@/types/permission';
import type { Song } from '@/types/song';
import { getErrorCode, toAppError } from '@/utils/toAppError';

export type LibraryStatus = 'idle' | 'loading' | 'ready' | 'error';

type LibraryState = {
  songs: Song[];
  status: LibraryStatus;
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
  skipPermission: () => void;
};

// Friendly texts. The original error text is only kept in development (see toAppError).
const PERMISSION_ERROR = 'Could not ask for permission to read your music. Please try again.';

// Errors from the media-store native module, by error code.
const LOAD_ERROR_MESSAGES: Record<string, string> = {
  ERR_MISSING_AUDIO_PERMISSION: 'B4F Player does not have permission to read your music.',
  ERR_MEDIA_STORE_QUERY: 'Could not read the music on your device. Please try again.',
};
const DEFAULT_LOAD_ERROR = 'Could not read the music on your device.';

function toLoadError(error: unknown): AppError {
  const code = getErrorCode(error);
  return toAppError((code && LOAD_ERROR_MESSAGES[code]) || DEFAULT_LOAD_ERROR, error);
}

// Not persisted: the library is scanned again on every app start.
export const useLibraryStore = create<LibraryState>()((set, get) => ({
  songs: [],
  status: 'idle',
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
    set({ status: 'loading', error: null });
    try {
      const songs = await loadAllSongs();
      set({ songs, status: 'ready' });
    } catch (error) {
      set({ status: 'error', error: toLoadError(error) });
      // Access was removed (e.g. in the system settings): re-check, so the screen offers "Grant access"
      // instead of a "Try again" button that would keep failing.
      if (getErrorCode(error) === 'ERR_MISSING_AUDIO_PERMISSION') {
        await get().checkPermission();
      }
    }
  },

  skipPermission: () => set({ skippedPermission: true }),
}));
