import { useEffect, useReducer } from 'react';

import { type CoverSize, peekSongCover, requestSongCover } from '@/services/songCovers';
import type { Song } from '@/types/song';

// A row must stay on screen this long before its cover is asked for,
// so rows that only fly by during a fast scroll never start a read.
const REQUEST_DELAY_MS = 120;

/** The song's cover URI, or `null` while it loads or when the song has no cover. */
export function useSongCover(song: Song, size: CoverSize): string | null {
  // Re-renders once the cover arrives (the value itself is read with peekSongCover).
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const { id, dateModified } = song;
  const known = peekSongCover({ id, dateModified }, size);

  useEffect(() => {
    if (known !== undefined) return;
    let cancel: (() => void) | undefined;
    const timer = setTimeout(() => {
      cancel = requestSongCover({ id, dateModified }, size, rerender);
    }, REQUEST_DELAY_MS);
    // Unmounted (scrolled away) or another song: stop waiting for this cover.
    return () => {
      clearTimeout(timer);
      cancel?.();
    };
  }, [id, dateModified, size, known]);

  return known ?? null;
}
