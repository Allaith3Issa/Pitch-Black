import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import IconButton from '@/components/IconButton';
import { useTheme } from '@/hooks/useTheme';
import { iconSizes, makeStyles, radius, sizes, spacing } from '@/theme';

type PlayerToggleProps = {
  icon: LucideIcon;
  active: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

/** Shuffle / repeat button on Now Playing. Active: accent color and a small dot under the icon. */
export default function PlayerToggle({ icon: Icon, active, accessibilityLabel, onPress }: PlayerToggleProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <IconButton
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      icon={
        <View style={styles.wrap}>
          <Icon color={active ? colors.primaryText : colors.textSecondary} size={iconSizes.playerToggle} />
          {active && <View style={styles.dot} />}
        </View>
      }
    />
  );
}

const useStyles = makeStyles(({ colors }) => ({
  wrap: {
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: -spacing.sm,
    width: sizes.activeDot,
    height: sizes.activeDot,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryText,
  },
}));
