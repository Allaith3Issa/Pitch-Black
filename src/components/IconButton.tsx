import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { radius, sizes } from '@/theme';

type IconButtonProps = {
  icon: ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
};

/** 44×44 round touch area around a 24px icon. */
export default function IconButton({ icon, accessibilityLabel, onPress }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
