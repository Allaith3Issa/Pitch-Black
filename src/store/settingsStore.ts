import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SortBy, SortOrder } from '@/types/sort';
import type { Accent, ThemeMode } from '@/types/theme';

type SettingsState = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  themeMode: ThemeMode;
  accent: Accent;
  /** `true` once the saved settings were read from the phone (or reading failed and defaults are used). */
  isHydrated: boolean;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
};

// Saved on the phone (AsyncStorage), so the choices survive an app restart.
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      sortBy: 'name',
      sortOrder: 'asc',
      themeMode: 'oled',
      accent: 'purple',
      isHydrated: false,
      setSortBy: (sortBy) => {
        if (sortBy === get().sortBy) return;
        // Switching to "Most played" starts with the most played songs on top.
        set(sortBy === 'mostPlayed' ? { sortBy, sortOrder: 'desc' } : { sortBy });
      },
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setAccent: (accent) => set({ accent }),
    }),
    {
      name: 'settings',
      // New fields get their default automatically (the saved values are merged into the defaults),
      // so adding a setting does not need a new version.
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Save only the values, not the functions or `isHydrated`.
      partialize: (state) => ({
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        themeMode: state.themeMode,
        accent: state.accent,
      }),
      // Runs when reading is done, also after an error. On an error the defaults stay, so the app still opens.
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ isHydrated: true });
      },
    },
  ),
);
