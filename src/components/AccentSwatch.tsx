import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { iconSizes, makeStyles, radius, sizes } from '@/theme';

type AccentSwatchProps = {
  /** The accent color to show. */
  color: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** A round color button. Selected: a ring around it and a check inside. */
export default function AccentSwatch({ color, label, selected, onPress }: AccentSwatchProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      style={[styles.ring, selected && styles.ringSelected]}
    >
      <View style={[styles.circle, { backgroundColor: color }]}>
        {selected && <Check color={colors.onPrimary} size={iconSizes.sm} />}
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  // Same size selected or not, so nothing moves.
  ring: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radius.pill,
    borderWidth: sizes.swatchRing,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSelected: {
    borderColor: colors.text,
  },
  circle: {
    width: sizes.swatch,
    height: sizes.swatch,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
