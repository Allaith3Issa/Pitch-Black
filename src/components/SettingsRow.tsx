import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { iconSizes, makeStyles, opacity, sizes, spacing, typography } from '@/theme';

type SettingsRowProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  /** Short text on the right, e.g. "Name · A–Z". */
  value?: string;
  /** Makes the row tappable and shows a chevron on the right. */
  onPress?: () => void;
  /** Element on the right, e.g. a Toggle. */
  right?: ReactNode;
  /** Dimmed and not tappable. */
  disabled?: boolean;
};

/** One row in a Settings card: icon + title (+ subtitle), and a value, chevron or toggle on the right. */
export default function SettingsRow({ icon: Icon, title, subtitle, value, onPress, right, disabled }: SettingsRowProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  const content = (
    <>
      <Icon color={colors.textSecondary} size={iconSizes.option} />
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle !== undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {value !== undefined && (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      )}
      {right}
      {onPress && <ChevronRight color={colors.textTertiary} size={iconSizes.sm} />}
    </>
  );

  const rowStyle = [styles.row, subtitle !== undefined && styles.rowWithSubtitle, disabled && styles.disabled];

  if (!onPress) {
    return <View style={rowStyle}>{content}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [rowStyle, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  row: {
    minHeight: sizes.settingsRowCompact,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  rowWithSubtitle: {
    minHeight: sizes.settingsRow,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flexShrink: 1,
  },
}));
