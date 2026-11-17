import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Song } from '@/types/song';
import type { FavoriteEntry } from '@/utils/favorites';
import { getFallbackKey, rematchSaved } from '@/utils/songKey';

type FavoritesState = {
  /** Favorite songs by id. */
  favorites: Record<string, FavoriteEntry>;
  /** `true` once the saved favorites were read from the phone (or reading failed). */
  isHydrated: boolean;
  /** Adds the song to the favorites, or removes it when it is already one. */
  toggleFavorite: (song: Song) => void;
  /** Moves favorites to the new id of songs whose MediaStore id changed (see utils/songKey). */
  rematch: (songs: readonly Song[]) => void;
};

// Saved on the phone (AsyncStorage), so favorites survive an app restart.
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      isHydrated: false,

      toggleFavorite: (song) => {
        const { [song.id]: existing, ...others } = get().favorites;
        set({
          favorites: existing
            ? others
            : { ...others, [song.id]: { fallbackKey: getFallbackKey(song), addedAt: Date.now() } },
        });
      },

      rematch: (songs) => {
        const favorites = get().favorites;
        const rematched = rematchSaved(favorites, songs);
        if (rematched !== favorites) set({ favorites: rematched });
      },
    }),
    {
      name: 'favorites',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ favorites: state.favorites }),
      // Runs when reading is done, also after an error (the app then starts with no favorites).
      onRehydrateStorage: () => () => {
        useFavoritesStore.setState({ isHydrated: true });
      },
    },
  ),
);
