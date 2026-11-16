import { accentColors, baseColors, letterCoverColors } from '@/theme/palettes';
import type { Accent, Theme, ThemeMode, ThemeVariant } from '@/types/theme';

/** What the phone reports (React Native's useColorScheme). */
export type SystemScheme = 'light' | 'dark' | 'unspecified' | null | undefined;

/** Which theme is shown: 'system' follows the phone (unknown → OLED). */
export function resolveVariant(mode: ThemeMode, systemScheme: SystemScheme): ThemeVariant {
  if (mode !== 'system') return mode;
  return systemScheme === 'light' ? 'light' : 'oled';
}

// One Theme object per variant + accent, so the same choice always returns the same object.
// Components use the theme in useMemo, so this keeps their styles from being rebuilt for nothing.
const cache = new Map<string, Theme>();

function buildTheme(variant: ThemeVariant, accent: Accent): Theme {
  const accentSet = accentColors[accent];
  return {
    variant,
    isDark: variant === 'oled',
    colors: {
      ...baseColors[variant],
      primary: accentSet.primary,
      primarySoft: accentSet.primarySoft[variant],
      primaryText: accentSet.primaryText[variant],
    },
    letterCovers: letterCoverColors[variant],
  };
}

/** The full theme for the user's choices and the phone's setting. */
export function resolveTheme(mode: ThemeMode, accent: Accent, systemScheme: SystemScheme): Theme {
  const variant = resolveVariant(mode, systemScheme);
  const key = `${variant}-${accent}`;
  let theme = cache.get(key);
  if (!theme) {
    theme = buildTheme(variant, accent);
    cache.set(key, theme);
  }
  return theme;
}
