import { useEffect, useState } from 'react';

import { loadSongFileDetails } from '@/services/mediaLibrary';
import type { SongFileDetails } from '@/types/song';

type Loaded = { songId: string; details: SongFileDetails | null };

/**
 * The file details of a song (Song info sheet): `undefined` while loading,
 * `null` when they could not be read (e.g. the file was deleted).
 */
export function useSongFileDetails(songId: string): SongFileDetails | null | undefined {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let isCurrent = true;
    loadSongFileDetails(songId).then(
      (details) => isCurrent && setLoaded({ songId, details }),
      () => isCurrent && setLoaded({ songId, details: null }),
    );
    return () => {
      isCurrent = false;
    };
  }, [songId]);

  // Details of another song (the sheet switched songs) count as "still loading".
  return loaded?.songId === songId ? loaded.details : undefined;
}
