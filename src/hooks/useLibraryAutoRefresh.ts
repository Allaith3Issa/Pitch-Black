import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useLibraryStore } from '@/store/libraryStore';

// Not more than one quiet rescan in this time, e.g. when switching apps quickly.
const MIN_REFRESH_GAP_MS = 5000;

/**
 * Rescans the library quietly when the app comes back to the foreground, so songs downloaded
 * meanwhile appear. Does nothing until the first load is done (see libraryStore.refreshSongs).
 */
export function useLibraryAutoRefresh(): void {
  const refreshSongs = useLibraryStore((state) => state.refreshSongs);
  const lastRefreshAt = useRef(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') return;
      const now = Date.now();
      if (now - lastRefreshAt.current < MIN_REFRESH_GAP_MS) return;
      lastRefreshAt.current = now;
      refreshSongs();
    });
    return () => subscription.remove();
  }, [refreshSongs]);
}
