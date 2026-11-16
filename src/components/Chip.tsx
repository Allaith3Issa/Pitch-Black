import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, iconSizes, radius, sizes, spacing, typography } from '@/theme';

type ChipProps = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Small pill button: icon 16 + label (e.g. the sort chip "Name · A–Z"). */
export default function Chip({ label, icon: Icon, onPress, accessibilityLabel }: ChipProps) {
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

const styles = StyleSheet.create({
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
    opacity: 0.7,
  },
  label: {
    ...typography.bodySmall,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});
