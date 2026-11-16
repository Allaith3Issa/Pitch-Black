import { type ReactNode, useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { makeStyles, radius, sizes, spacing } from '@/theme';

type BottomSheetProps = {
  visible: boolean;
  /** Called when the user taps the scrim or presses the Android back button. */
  onClose: () => void;
  children: ReactNode;
};

const OPEN_DURATION_MS = 250;
const CLOSE_DURATION_MS = 200;

/** Sheet that slides up from the bottom, with a dark scrim behind it. */
export default function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const styles = useStyles();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // 0 = closed (sheet below the screen, scrim invisible), 1 = open.
  const [progress] = useState(() => new Animated.Value(0));
  // The Modal stays mounted while the close animation runs.
  const [isMounted, setIsMounted] = useState(visible);

  if (visible && !isMounted) {
    setIsMounted(true);
  }

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_DURATION_MS : CLOSE_DURATION_MS,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && !visible) setIsMounted(false);
    });
    return () => animation.stop();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [screenHeight, 0] });

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: progress }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>

      <Animated.View
        style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg, transform: [{ translateY }] }]}
      >
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </Modal>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  scrim: {
    backgroundColor: colors.scrim,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: sizes.hairline,
    borderBottomWidth: 0,
    borderColor: colors.border,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: sizes.sheetHandleWidth,
    height: sizes.sheetHandleHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.textTertiary,
    marginBottom: spacing.sm,
  },
}));
