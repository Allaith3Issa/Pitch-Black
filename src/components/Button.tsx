import type { LucideIcon } from 'lucide-react-native';
import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, fonts, iconSizes, radius, sizes, spacing, typography } from '@/theme';

type ButtonVariant = 'primary' | 'text';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
};

/**
 * - `primary`: purple background, white content (DESIGN.md "Button / Primary")
 * - `text`: no background, secondary text (e.g. "Not now")
 */
export default function Button({ label, onPress, variant = 'primary', icon: Icon, style }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const contentColor = isPrimary ? colors.onPrimary : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        pressed && styles.pressed,
        style,
      ]}
    >
      {Icon && <Icon color={contentColor} size={iconSizes.sm} />}
      <Text style={[isPrimary ? styles.primaryLabel : styles.textLabel, { color: contentColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  primaryLabel: {
    ...typography.body,
    fontFamily: fonts.semiBold,
  },
  textLabel: {
    ...typography.body,
  },
});
