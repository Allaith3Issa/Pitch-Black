import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SavedQueue } from '@/utils/lastSession';

type LastQueueState = {
  /** The last queue ("Resume last song"), or `null` when nothing was played yet. */
  savedQueue: SavedQueue | null;
  /** `true` once the saved queue was read from the phone (or reading failed). */
  isHydrated: boolean;
  saveQueue: (savedQueue: SavedQueue) => void;
};

// Saved on the phone (AsyncStorage). Written only when the queue changes (see services/lastSession).
// The current song and its position are in lastPositionStore, because they change much more often.
export const useLastQueueStore = create<LastQueueState>()(
  persist(
    (set) => ({
      savedQueue: null,
      isHydrated: false,
      saveQueue: (savedQueue) => set({ savedQueue }),
    }),
    {
      name: 'last-queue',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ savedQueue: state.savedQueue }),
      // Runs when reading is done, also after an error (the app then starts with nothing loaded).
      onRehydrateStorage: () => () => {
        useLastQueueStore.setState({ isHydrated: true });
      },
    },
  ),
);
