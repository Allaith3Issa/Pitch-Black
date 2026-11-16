import type { LucideIcon } from 'lucide-react-native';
import { Pressable, type StyleProp, Text, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { fonts, iconSizes, makeStyles, radius, sizes, spacing, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'text';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
};

/**
 * - `primary`: accent background, white content (DESIGN.md "Button / Primary")
 * - `secondary`: gray background, normal text color (DESIGN.md "Button / Secondary")
 * - `text`: no background, secondary text (e.g. "Not now")
 */
export default function Button({ label, onPress, variant = 'primary', icon: Icon, style }: ButtonProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const isFilled = variant !== 'text';
  const contentColor =
    variant === 'primary' ? colors.onPrimary : variant === 'secondary' ? colors.text : colors.textSecondary;

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
}));
