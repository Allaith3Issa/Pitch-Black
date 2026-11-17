import type { ReactNode } from 'react';
import { type AccessibilityState, Pressable, Text, View } from 'react-native';

import AppText from '@/components/AppText';
import { makeStyles, opacity, screenPadding, spacing, typography } from '@/theme';

type PlaylistRowProps = {
  title: string;
  /** e.g. "8 songs". */
  subtitle?: string;
  /** A PlaylistCover. */
  cover: ReactNode;
  onPress: () => void;
  /** Optional element on the right, e.g. a "⋯" button or a checkbox. */
  right?: ReactNode;
  /** Row height (Playlists tab: 72, sheets: 64). */
  height: number;
  accessibilityState?: AccessibilityState;
};

/** A playlist row: cover, name and subtitle. Also used for "Create playlist", "New playlist" and "Add songs". */
export default function PlaylistRow({
  title,
  subtitle,
  cover,
  onPress,
  right,
  height,
  accessibilityState,
}: PlaylistRowProps) {
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={accessibilityState}
      style={({ pressed }) => [styles.row, { height }, pressed && styles.pressed]}
    >
      {cover}
      <View style={styles.texts}>
        <AppText style={styles.title} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle !== undefined && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: screenPadding,
    paddingRight: spacing.sm,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.itemTitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
}));
