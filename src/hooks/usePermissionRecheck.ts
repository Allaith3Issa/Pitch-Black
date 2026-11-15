import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useLibraryStore } from '@/store/libraryStore';

/**
 * Checks the audio permission again whenever the app comes back to the foreground,
 * e.g. after the user changed it in the system settings.
 */
export function usePermissionRecheck(): void {
  const checkPermission = useLibraryStore((state) => state.checkPermission);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkPermission();
      }
    });
    return () => subscription.remove();
  }, [checkPermission]);
}
