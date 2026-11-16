import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types/theme';

/**
 * Creates a hook that builds a component's styles from the current theme.
 * The styles are rebuilt only when the theme changes.
 *
 *   const useStyles = makeStyles(({ colors }) => ({ row: { backgroundColor: colors.surface } }));
 *   ...
 *   const styles = useStyles();
 */
// The object type StyleSheet.create accepts (React Native does not export a name for it).
type Styles = Parameters<typeof StyleSheet.create>[0];

// `T & Styles` (like StyleSheet.create itself) makes TypeScript catch misspelled style names.
export function makeStyles<T extends Styles>(factory: (theme: Theme) => T & Styles): () => Readonly<T> {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
