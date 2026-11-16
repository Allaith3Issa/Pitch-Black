import { Check, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, iconSizes, radius, sizes, spacing, typography } from '@/theme';

type SheetOptionProps = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  /** Selected: highlighted background + check icon on the right. */
  selected?: boolean;
};

/** One row in a bottom sheet: icon + label. */
export default function SheetOption({ label, icon: Icon, onPress, selected = false }: SheetOptionProps) {
  const contentColor = selected ? colors.text : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.row, selected && styles.selected, pressed && styles.pressed]}
    >
      <Icon color={contentColor} size={iconSizes.option} />
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      {selected && <Check color={colors.text} size={iconSizes.option} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: sizes.sheetOption,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  selected: {
    backgroundColor: colors.surface2,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
  selectedLabel: {
    fontFamily: fonts.semiBold,
  },
});
