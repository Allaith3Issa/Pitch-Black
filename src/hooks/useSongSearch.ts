import { useMemo } from 'react';

import { useSortedSongs } from '@/hooks/useSortedSongs';
import type { Song } from '@/types/song';
import { normalizeText } from '@/utils/normalizeText';

/**
 * Songs whose title contains `query`, in the current sort order.
 * Returns `null` when the query is empty (nothing searched yet).
 */
export function useSongSearch(query: string): Song[] | null {
  const songs = useSortedSongs();

  // Normalize every title once per song list, not on every key press.
  const searchable = useMemo(
    () => songs.map((song) => ({ song, title: normalizeText(song.title) })),
    [songs],
  );

  return useMemo(() => {
    const needle = normalizeText(query);
    if (needle === '') return null;
    return searchable.filter((item) => item.title.includes(needle)).map((item) => item.song);
  }, [searchable, query]);
}
