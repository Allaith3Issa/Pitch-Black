import { useMemo } from 'react';

import { useFavoritesStore } from '@/store/favoritesStore';
import { useLibraryStore } from '@/store/libraryStore';
import type { Song } from '@/types/song';
import { getFavoriteIdsNewestFirst } from '@/utils/favorites';
import { resolveSongs } from '@/utils/songList';

/** Favorite songs that are on the phone right now, newest favorite first. */
export function useFavoriteSongs(): Song[] {
  const favorites = useFavoritesStore((state) => state.favorites);
  const songsById = useLibraryStore((state) => state.songsById);

  return useMemo(() => resolveSongs(getFavoriteIdsNewestFirst(favorites), songsById), [favorites, songsById]);
}
