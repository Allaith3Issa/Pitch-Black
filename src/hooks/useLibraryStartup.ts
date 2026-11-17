import { useEffect } from 'react';

import { useLibraryAutoRefresh } from '@/hooks/useLibraryAutoRefresh';
import { usePermissionRecheck } from '@/hooks/usePermissionRecheck';
import { useLibraryStore } from '@/store/libraryStore';

type LibraryStartup = {
  /** `true` once the first permission check is done. */
  isPermissionChecked: boolean;
  /** The user may see the app (permission granted, or "Not now" tapped). */
  canEnterApp: boolean;
};

/**
 * Checks the permission on start and loads the songs as soon as access is granted.
 * Back in the foreground: checks the permission again and rescans quietly.
 */
export function useLibraryStartup(): LibraryStartup {
  const permission = useLibraryStore((state) => state.permission);
  const skippedPermission = useLibraryStore((state) => state.skippedPermission);
  const checkPermission = useLibraryStore((state) => state.checkPermission);
  const loadSongs = useLibraryStore((state) => state.loadSongs);

  usePermissionRecheck();
  useLibraryAutoRefresh();

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const isGranted = permission === 'granted';
  useEffect(() => {
    if (isGranted) {
      loadSongs();
    }
  }, [isGranted, loadSongs]);

  return {
    isPermissionChecked: permission !== null,
    canEnterApp: isGranted || skippedPermission,
  };
}
