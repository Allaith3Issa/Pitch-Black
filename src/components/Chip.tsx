import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { fonts, iconSizes, makeStyles, opacity, radius, sizes, spacing, typography } from '@/theme';

type ChipProps = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Small pill button: icon 16 + label (e.g. the sort chip "Name · A–Z"). */
export default function Chip({ label, icon: Icon, onPress, accessibilityLabel }: ChipProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
    >
      <Icon color={colors.text} size={iconSizes.xs} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  chip: {
    height: sizes.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  label: {
    ...typography.bodySmall,
    fontFamily: fonts.medium,
    color: colors.text,
  },
}));
