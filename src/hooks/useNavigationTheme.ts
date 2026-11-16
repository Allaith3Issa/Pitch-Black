import { DarkTheme, DefaultTheme } from 'expo-router';
import { useMemo } from 'react';

import { useTheme } from '@/hooks/useTheme';

/** React Navigation theme (screen backgrounds, cards) built from our theme colors. */
export function useNavigationTheme() {
  const { colors, isDark } = useTheme();

  return useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.bg,
        card: colors.bg,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [colors, isDark]);
}
