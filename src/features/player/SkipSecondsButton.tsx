import { RotateCcw, RotateCw } from 'lucide-react-native';
import { Text, View } from 'react-native';

import IconButton from '@/components/IconButton';
import { useTheme } from '@/hooks/useTheme';
import { iconSizes, makeStyles, typography } from '@/theme';

type SkipSecondsButtonProps = {
  direction: 'back' | 'forward';
  seconds: number;
  onPress: () => void;
};

/** Round arrow with the number of seconds inside (skip back / skip forward on Now Playing). */
export default function SkipSecondsButton({ direction, seconds, onPress }: SkipSecondsButtonProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const Icon = direction === 'back' ? RotateCcw : RotateCw;

  return (
    <IconButton
      accessibilityLabel={direction === 'back' ? `Back ${seconds} seconds` : `Forward ${seconds} seconds`}
      onPress={onPress}
      icon={
        <View style={styles.wrap}>
          <Icon color={colors.text} size={iconSizes.md} />
          <Text style={styles.label}>{seconds}</Text>
        </View>
      }
    />
  );
}

const useStyles = makeStyles(({ colors }) => ({
  wrap: {
    width: iconSizes.md,
    height: iconSizes.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.iconLabel,
    position: 'absolute',
    color: colors.text,
    // Centers the small number exactly inside the arrow (Android adds extra space above text).
    includeFontPadding: false,
  },
}));
