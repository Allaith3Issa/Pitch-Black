import type { ReactNode } from 'react';
import { type AccessibilityState, Pressable, StyleSheet } from 'react-native';

import { radius, sizes } from '@/theme';

type IconButtonProps = {
  icon: ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
  /** Size of the round touch area. Default 44. */
  size?: number;
  /** For on/off buttons (e.g. shuffle): `{ selected: true }`. */
  accessibilityState?: AccessibilityState;
};

/** Round touch area (44×44 by default) around an icon. */
export default function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = sizes.touchTarget,
  accessibilityState,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      style={({ pressed }) => [styles.button, { width: size, height: size }, pressed && styles.pressed]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
