import { useEffect } from 'react';
import { ToastAndroid } from 'react-native';

import { usePlayerStore } from '@/store/playerStore';

/** Shows player errors (e.g. "Could not play …") as a short Android toast. */
export function usePlayerErrorToast(): void {
  const errorMessage = usePlayerStore((state) => state.errorMessage);
  const clearError = usePlayerStore((state) => state.clearError);

  useEffect(() => {
    if (errorMessage === null) return;
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    clearError();
  }, [errorMessage, clearError]);
}
