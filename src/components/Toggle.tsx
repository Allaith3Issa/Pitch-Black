import { useEffect, useState } from 'react';
import { Animated, Pressable } from 'react-native';

import { makeStyles, opacity, radius, sizes } from '@/theme';

type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  /** What the switch turns on or off, for screen readers (e.g. "Resume last song"). */
  accessibilityLabel: string;
};

const SLIDE_DURATION_MS = 150;
// Space around the knob inside the track, and how far the knob moves.
const KNOB_INSET = (sizes.toggleHeight - sizes.toggleKnob) / 2;
const KNOB_TRAVEL = sizes.toggleWidth - sizes.toggleKnob - KNOB_INSET * 2;

/** On/off switch. On: `primary` track. Off: `surface2` track. The white knob slides. */
export default function Toggle({ value, onChange, accessibilityLabel }: ToggleProps) {
  const styles = useStyles();
  // 0 = off (knob left), 1 = on (knob right).
  const [position] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(position, {
      toValue: value ? 1 : 0,
      duration: SLIDE_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [value, position]);

  const translateX = position.interpolate({ inputRange: [0, 1], outputRange: [0, KNOB_TRAVEL] });

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      // The track is only 26 high: make the touch area as big as a normal button.
      hitSlop={(sizes.touchTarget - sizes.toggleHeight) / 2}
      style={({ pressed }) => [styles.track, value && styles.trackOn, pressed && styles.pressed]}
    >
      <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  track: {
    width: sizes.toggleWidth,
    height: sizes.toggleHeight,
    borderRadius: radius.pill,
    padding: KNOB_INSET,
    backgroundColor: colors.surface2,
  },
  trackOn: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  knob: {
    width: sizes.toggleKnob,
    height: sizes.toggleKnob,
    borderRadius: radius.pill,
    backgroundColor: colors.onPrimary,
  },
}));
