import { create } from 'zustand';

import {
  getAudioPermission,
  loadAllSongs,
  requestAudioPermission,
} from '@/services/mediaLibrary';
import type { AudioPermission } from '@/types/permission';
import type { Song } from '@/types/song';

export type LibraryStatus = 'idle' | 'loading' | 'ready' | 'error';

type LibraryState = {
  songs: Song[];
  status: LibraryStatus;
  error: string | null;
  /** `null` until the first check has finished. */
  permission: AudioPermission | null;
  /** The user tapped "Not now" on the permission screen (only for this app session). */
  skippedPermission: boolean;

  checkPermission: () => Promise<void>;
  requestPermission: () => Promise<void>;
  loadSongs: () => Promise<void>;
  skipPermission: () => void;
};

// Not persisted: the library is scanned again on every app start.
export const useLibraryStore = create<LibraryState>()((set, get) => ({
  songs: [],
  status: 'idle',
  error: null,
  permission: null,
  skippedPermission: false,

  checkPermission: async () => {
    try {
      set({ permission: await getAudioPermission() });
    } catch {
      // Treat a failed check like "not asked yet" so the user can still try from the permission screen.
      set({ permission: 'undetermined' });
    }
  },

  requestPermission: async () => {
    try {
      set({ permission: await requestAudioPermission() });
    } catch {
      set({ permission: 'denied' });
    }
  },

  loadSongs: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try {
      const songs = await loadAllSongs();
      set({ songs, status: 'ready' });
    } catch {
      set({ status: 'error', error: 'Could not read the music on your device.' });
    }
  },

  skipPermission: () => set({ skippedPermission: true }),
}));
