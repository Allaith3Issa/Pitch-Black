import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { useLibraryStore } from '@/store/libraryStore';
import { usePlayCountStore } from '@/store/playCountStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { Song } from '@/types/song';
import { sortSongs } from '@/utils/sortSongs';

const readPlays = () => usePlayCountStore.getState().plays;

/**
 * All songs in the current sort order. Sorts again only when the songs or the sort choice change.
 *
 * "Most played" uses the counts from when the screen came into focus (or the sort was changed), so
 * rows do not move while you look at the list. The count shown in each row still updates live.
 */
export function useSortedSongs(): Song[] {
  const songs = useLibraryStore((state) => state.songs);
  const sortBy = useSettingsStore((state) => state.sortBy);
  const sortOrder = useSettingsStore((state) => state.sortOrder);

  const [plays, setPlays] = useState(readPlays);

  // Fresh counts each time the screen is shown again.
  useFocusEffect(
    useCallback(() => {
      setPlays(readPlays());
    }, []),
  );

  // Fresh counts when the sort changes (set during render, React's pattern for "reset on prop change").
  const sortKey = `${sortBy}-${sortOrder}`;
  const [lastSortKey, setLastSortKey] = useState(sortKey);
  if (sortKey !== lastSortKey) {
    setLastSortKey(sortKey);
    setPlays(readPlays());
  }

  // Only "Most played" depends on the counts, so the other sorts never re-sort for them.
  const sortPlays = sortBy === 'mostPlayed' ? plays : null;

  return useMemo(() => {
    const getPlayCount = sortPlays ? (id: string) => sortPlays[id]?.count ?? 0 : undefined;
    return sortSongs(songs, sortBy, sortOrder, getPlayCount);
  }, [songs, sortBy, sortOrder, sortPlays]);
}
