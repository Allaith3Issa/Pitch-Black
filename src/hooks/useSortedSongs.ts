import { useMemo } from 'react';

import { useLibraryStore } from '@/store/libraryStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { Song } from '@/types/song';
import { sortSongs } from '@/utils/sortSongs';

/** All songs in the current sort order. Sorts again only when the songs or the sort choice change. */
export function useSortedSongs(): Song[] {
  const songs = useLibraryStore((state) => state.songs);
  const sortBy = useSettingsStore((state) => state.sortBy);
  const sortOrder = useSettingsStore((state) => state.sortOrder);

  return useMemo(() => sortSongs(songs, sortBy, sortOrder), [songs, sortBy, sortOrder]);
}
