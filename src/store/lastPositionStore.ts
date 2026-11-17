import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SavedPosition } from '@/utils/lastSession';

type LastPositionState = {
  /** The last song and where it was ("Resume last song"), or `null`. */
  savedPosition: SavedPosition | null;
  /** `true` once the saved position was read from the phone (or reading failed). */
  isHydrated: boolean;
  savePosition: (savedPosition: SavedPosition) => void;
};

// Saved on the phone (AsyncStorage). Kept apart from the queue on purpose: it is small and written
// often (song change, pause, app in the background, every few seconds while playing).
export const useLastPositionStore = create<LastPositionState>()(
  persist(
    (set) => ({
      savedPosition: null,
      isHydrated: false,
      savePosition: (savedPosition) => set({ savedPosition }),
    }),
    {
      name: 'last-position',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ savedPosition: state.savedPosition }),
      onRehydrateStorage: () => () => {
        useLastPositionStore.setState({ isHydrated: true });
      },
    },
  ),
);
