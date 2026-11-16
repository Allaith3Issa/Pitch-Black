import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/store/settingsStore';
import type { ThemeMode } from '@/types/theme';

// What Android should use for the app's dark/light mode. 'auto' = follow the phone.
const NATIVE_SCHEME: Record<ThemeMode, 'dark' | 'light' | 'auto'> = {
  oled: 'dark',
  light: 'light',
  system: 'auto',
};

/**
 * Keeps Android in line with the chosen theme:
 * - the app's dark/light mode (React Native's Appearance API). 'System' only works because of this:
 *   the current dev build was made with userInterfaceStyle "dark", which forces dark mode until it is
 *   changed here. With "automatic" in the next build this is still correct.
 * - the root view background, so there is no flash of the wrong color behind screens.
 */
export function useSystemUiTheme(): void {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const { colors } = useTheme();

  useEffect(() => {
    Appearance.setColorScheme(NATIVE_SCHEME[themeMode]);
  }, [themeMode]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg).catch(() => undefined);
  }, [colors.bg]);
}
