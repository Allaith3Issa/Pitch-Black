import { Check } from 'lucide-react-native';
import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { iconSizes, iconStrokes, makeStyles, opacity, radius, sizes } from '@/theme';

type CheckboxProps = {
  checked: boolean;
  /** Shown dimmed (e.g. a song that is already in the playlist). */
  disabled?: boolean;
};

/** Round checkbox (DESIGN.md). Only shows the state: the row around it handles the tap. */
export default function Checkbox({ checked, disabled = false }: CheckboxProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={[styles.box, checked ? styles.on : styles.off, disabled && styles.disabled]}>
      {checked && <Check color={colors.onPrimary} size={iconSizes.xs} strokeWidth={iconStrokes.bold} />}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  box: {
    width: sizes.checkbox,
    height: sizes.checkbox,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: {
    backgroundColor: colors.primary,
  },
  off: {
    borderWidth: sizes.checkboxBorder,
    borderColor: colors.textTertiary,
  },
  disabled: {
    opacity: opacity.disabled,
  },
}));
