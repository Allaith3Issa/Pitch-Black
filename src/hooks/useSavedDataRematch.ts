import { useEffect } from 'react';

import { useLibraryStore } from '@/store/libraryStore';
import { usePlayCountStore } from '@/store/playCountStore';

/**
 * After every library load, moves saved data to the new id of songs whose MediaStore id changed
 * (see utils/songKey). Waits until the saved data is read from the phone.
 */
export function useSavedDataRematch(): void {
  const songs = useLibraryStore((state) => state.songs);
  const isPlayCountReady = usePlayCountStore((state) => state.isHydrated);
  const rematchPlayCounts = usePlayCountStore((state) => state.rematch);

  useEffect(() => {
    if (isPlayCountReady && songs.length > 0) {
      rematchPlayCounts(songs);
    }
  }, [songs, isPlayCountReady, rematchPlayCounts]);
}
