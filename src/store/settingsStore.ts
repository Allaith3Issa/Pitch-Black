import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { RepeatMode } from '@/types/player';
import type { SortBy, SortOrder } from '@/types/sort';
import type { Accent, ThemeMode } from '@/types/theme';
import { getNextRepeatMode } from '@/utils/queue';
import { DEFAULT_SKIP_SECONDS, type SkipSeconds } from '@/utils/skip';

type SettingsState = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  themeMode: ThemeMode;
  accent: Accent;
  shuffle: boolean;
  repeatMode: RepeatMode;
  /** On app start, load the last song again (paused, at the saved position). */
  resumeLastSong: boolean;
  /** Only search for covers on Wi-Fi. Saved now, used by the covers in Step 6. */
  coversWifiOnly: boolean;
  /** Show the skip back / skip forward buttons on Now Playing. */
  skipButtonsEnabled: boolean;
  skipSeconds: SkipSeconds;
  /** `true` once the saved settings were read from the phone (or reading failed and defaults are used). */
  isHydrated: boolean;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
  /** Only playerStore calls this: it also changes the order of the queue. */
  setShuffle: (shuffle: boolean) => void;
  cycleRepeatMode: () => void;
  setResumeLastSong: (resumeLastSong: boolean) => void;
  setCoversWifiOnly: (coversWifiOnly: boolean) => void;
  setSkipButtonsEnabled: (skipButtonsEnabled: boolean) => void;
  setSkipSeconds: (skipSeconds: SkipSeconds) => void;
};

// Saved on the phone (AsyncStorage), so the choices survive an app restart.
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      sortBy: 'name',
      sortOrder: 'asc',
      themeMode: 'oled',
      accent: 'purple',
      shuffle: false,
      repeatMode: 'off',
      resumeLastSong: true,
      coversWifiOnly: true,
      skipButtonsEnabled: true,
      skipSeconds: DEFAULT_SKIP_SECONDS,
      isHydrated: false,
      setSortBy: (sortBy) => {
        if (sortBy === get().sortBy) return;
        // Switching to "Most played" starts with the most played songs on top.
        set(sortBy === 'mostPlayed' ? { sortBy, sortOrder: 'desc' } : { sortBy });
      },
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setAccent: (accent) => set({ accent }),
      setShuffle: (shuffle) => set({ shuffle }),
      cycleRepeatMode: () => set({ repeatMode: getNextRepeatMode(get().repeatMode) }),
      setResumeLastSong: (resumeLastSong) => set({ resumeLastSong }),
      setCoversWifiOnly: (coversWifiOnly) => set({ coversWifiOnly }),
      setSkipButtonsEnabled: (skipButtonsEnabled) => set({ skipButtonsEnabled }),
      setSkipSeconds: (skipSeconds) => set({ skipSeconds }),
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
        shuffle: state.shuffle,
        repeatMode: state.repeatMode,
        resumeLastSong: state.resumeLastSong,
        coversWifiOnly: state.coversWifiOnly,
        skipButtonsEnabled: state.skipButtonsEnabled,
        skipSeconds: state.skipSeconds,
      }),
      // Runs when reading is done, also after an error. On an error the defaults stay, so the app still opens.
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ isHydrated: true });
      },
    },
  ),
);
