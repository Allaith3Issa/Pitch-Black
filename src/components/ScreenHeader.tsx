import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { makeStyles, screenPadding, sizes, spacing, typography } from '@/theme';

type ScreenHeaderProps = {
  title: string;
  /** Optional button on the right of the title (e.g. "+" on Playlists). */
  action?: ReactNode;
  /** Small line under the title, e.g. "12 songs". */
  meta?: string;
};

/** Big tab title (Favorites, Playlists) with an optional button and a count line. */
export default function ScreenHeader({ title, action, meta }: ScreenHeaderProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {action}
      </View>
      {meta !== undefined && <Text style={styles.meta}>{meta}</Text>}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // The title keeps its height when there is no button.
    minHeight: sizes.touchTarget,
    // The button's icon lines up with the screen padding.
    marginRight: -spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
}));
