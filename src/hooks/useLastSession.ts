import { useEffect, useRef } from 'react';

import { restoreLastSession, startSavingSession } from '@/services/lastSession';
import { useLastPositionStore } from '@/store/lastPositionStore';
import { useLastQueueStore } from '@/store/lastQueueStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * "Resume last song" (see services/lastSession): keeps saving what is playing, and once on app
 * start (when the songs and the saved session are read) loads the last song again, paused.
 */
export function useLastSession(): void {
  const isLibraryReady = useLibraryStore((state) => state.status === 'ready');
  const isQueueRead = useLastQueueStore((state) => state.isHydrated);
  const isPositionRead = useLastPositionStore((state) => state.isHydrated);
  // The saved "Resume last song" choice, not the default.
  const isSettingsRead = useSettingsStore((state) => state.isHydrated);
  const hasRestored = useRef(false);

  useEffect(() => startSavingSession(), []);

  useEffect(() => {
    if (hasRestored.current || !isLibraryReady || !isQueueRead || !isPositionRead || !isSettingsRead) return;
    hasRestored.current = true;
    restoreLastSession();
  }, [isLibraryReady, isQueueRead, isPositionRead, isSettingsRead]);
}
