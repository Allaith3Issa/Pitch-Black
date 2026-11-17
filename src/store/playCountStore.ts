import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Song } from '@/types/song';
import { getFallbackKey, rematchSaved, type SavedSongEntry } from '@/utils/songKey';

export type PlayCountEntry = SavedSongEntry & {
  count: number;
};

type PlayCountState = {
  /** Play counts by song id. Songs never played have no entry. */
  plays: Record<string, PlayCountEntry>;
  /** `true` once the saved counts were read from the phone (or reading failed). */
  isHydrated: boolean;
  /** Adds one play. When to call it is decided by utils/listenTracker. */
  addPlay: (song: Song) => void;
  /** Moves counts to the new id of songs whose MediaStore id changed (see utils/songKey). */
  rematch: (songs: readonly Song[]) => void;
};

// Saved on the phone (AsyncStorage), so the counts survive an app restart.
export const usePlayCountStore = create<PlayCountState>()(
  persist(
    (set, get) => ({
      plays: {},
      isHydrated: false,

      addPlay: (song) => {
        const count = (get().plays[song.id]?.count ?? 0) + 1;
        set({ plays: { ...get().plays, [song.id]: { fallbackKey: getFallbackKey(song), count } } });
      },

      rematch: (songs) => {
        const plays = get().plays;
        const rematched = rematchSaved(plays, songs);
        if (rematched !== plays) set({ plays: rematched });
      },
    }),
    {
      name: 'play-counts',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ plays: state.plays }),
      // Runs when reading is done, also after an error (the app then starts with no counts).
      onRehydrateStorage: () => () => {
        usePlayCountStore.setState({ isHydrated: true });
      },
    },
  ),
);
