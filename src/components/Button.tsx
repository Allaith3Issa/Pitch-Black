import type { LucideIcon } from 'lucide-react-native';
import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, fonts, iconSizes, radius, sizes, spacing, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'text';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
};

const CONTENT_COLORS: Record<ButtonVariant, string> = {
  primary: colors.onPrimary,
  secondary: colors.text,
  text: colors.textSecondary,
};

/**
 * - `primary`: purple background, white content (DESIGN.md "Button / Primary")
 * - `secondary`: dark gray background, white content (DESIGN.md "Button / Secondary")
 * - `text`: no background, secondary text (e.g. "Not now")
 */
export default function Button({ label, onPress, variant = 'primary', icon: Icon, style }: ButtonProps) {
  const isFilled = variant !== 'text';
  const contentColor = CONTENT_COLORS[variant];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
    >
      {Icon && <Icon color={contentColor} size={iconSizes.sm} />}
      <Text style={[isFilled ? styles.filledLabel : styles.textLabel, { color: contentColor }]}>
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
  secondary: {
    backgroundColor: colors.surface2,
  },
  pressed: {
    opacity: 0.8,
  },
  filledLabel: {
    ...typography.body,
    fontFamily: fonts.semiBold,
  },
  textLabel: {
    ...typography.body,
  },
});
