import { Linking } from 'react-native';

import { useLibraryStore } from '@/store/libraryStore';

type AllowAccess = {
  label: string;
  onPress: () => void;
};

/**
 * The "Allow access" action: asks for the audio permission,
 * or opens the system settings when the user has blocked it ("denied forever").
 */
export function useAllowAccess(defaultLabel: string): AllowAccess {
  const permission = useLibraryStore((state) => state.permission);
  const requestPermission = useLibraryStore((state) => state.requestPermission);

  if (permission === 'blocked') {
    return {
      label: 'Open settings',
      onPress: () => {
        // Nothing useful to do if the settings cannot be opened; the button stays on screen.
        Linking.openSettings().catch(() => undefined);
      },
    };
  }
  return { label: defaultLabel, onPress: () => requestPermission() };
}
