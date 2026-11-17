import type { LucideIcon } from 'lucide-react-native';
import { Pressable, type StyleProp, Text, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { fonts, iconSizes, makeStyles, opacity, radius, sizes, spacing, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'active' | 'text';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
  /** Dimmed and not tappable. */
  disabled?: boolean;
  /** For on/off buttons (e.g. Shuffle): tells screen readers the button is on. */
  selected?: boolean;
};

/**
 * - `primary`: accent background, white content (DESIGN.md "Button / Primary")
 * - `secondary`: gray background, normal text color (DESIGN.md "Button / Secondary")
 * - `active`: soft accent background, accent text (an on/off button that is on, e.g. Shuffle)
 * - `text`: no background, secondary text (e.g. "Not now")
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon: Icon,
  style,
  disabled = false,
  selected,
}: ButtonProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const isFilled = variant !== 'text';
  const contentColors: Record<ButtonVariant, string> = {
    primary: colors.onPrimary,
    secondary: colors.text,
    active: colors.primaryText,
    text: colors.textSecondary,
  };
  const contentColor = contentColors[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'active' && styles.active,
        pressed && styles.pressed,
        disabled && styles.disabled,
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

const useStyles = makeStyles(({ colors }) => ({
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
  active: {
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  filledLabel: {
    ...typography.body,
    fontFamily: fonts.semiBold,
  },
  textLabel: {
    ...typography.body,
  },
}));
