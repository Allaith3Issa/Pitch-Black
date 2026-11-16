import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SortBy, SortOrder } from '@/types/sort';

type SettingsState = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  /** `true` once the saved settings were read from the phone (or reading failed and defaults are used). */
  isHydrated: boolean;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
};

// Saved on the phone (AsyncStorage), so the choices survive an app restart.
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sortBy: 'name',
      sortOrder: 'asc',
      isHydrated: false,
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
    }),
    {
      name: 'settings',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Save only the values, not the functions or `isHydrated`.
      partialize: (state) => ({ sortBy: state.sortBy, sortOrder: state.sortOrder }),
      // Runs when reading is done, also after an error. On an error the defaults stay, so the app still opens.
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ isHydrated: true });
      },
    },
  ),
);
