import { useColorScheme } from 'react-native';

import { resolveTheme } from '@/theme/resolveTheme';
import { useSettingsStore } from '@/store/settingsStore';
import type { Theme } from '@/types/theme';

/** The current theme (colors), from the user's choice in Settings and the phone's dark/light setting. */
export function useTheme(): Theme {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const accent = useSettingsStore((state) => state.accent);
  const systemScheme = useColorScheme();
  return resolveTheme(themeMode, accent, systemScheme);
}
