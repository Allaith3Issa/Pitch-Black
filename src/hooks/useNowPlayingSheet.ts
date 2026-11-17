import { router, usePreventRemove } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  type GestureResponderHandlers,
  PanResponder,
  useWindowDimensions,
} from 'react-native';

/** Slide up when Now Playing opens. */
const OPEN_DURATION_MS = 300;
/** Slide down when it closes. */
const CLOSE_DURATION_MS = 250;
/** How far (px) the finger must move down before the screen follows it. */
const DRAG_START_DISTANCE = 12;
/** Released after this many px down → close. */
const CLOSE_DISTANCE = 120;
/** Or released faster than this (px per ms) going down → close. */
const CLOSE_VELOCITY = 1;

/**
 * Makes Now Playing behave like a sheet: it slides up when it opens, and slides down when it closes
 * (chevron, Android back button, or a swipe down that follows the finger).
 * The navigator shows the screen without its own animation (see src/app/_layout.tsx).
 */
export function useNowPlayingSheet(): {
  translateY: Animated.Value;
  panHandlers: GestureResponderHandlers;
  close: () => void;
} {
  const { height } = useWindowDimensions();
  // Starts below the screen, then slides up.
  const [translateY] = useState(() => new Animated.Value(height));
  // `false` once the slide down is done, so the real close is not stopped again.
  const [isOpen, setIsOpen] = useState(true);
  // `true` while sliding down: a second close (double tap, chevron + back) is ignored, so we never go back twice.
  const isClosing = useRef(false);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: OPEN_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  // Every way of closing (chevron, back button, swipe) goes through here: slide down first, then close.
  usePreventRemove(isOpen, ({ repeat }) => {
    if (isClosing.current) return;
    isClosing.current = true;
    Animated.timing(translateY, {
      toValue: height,
      duration: CLOSE_DURATION_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      repeat();
    });
  });

  const panResponder = useMemo(() => {
    const springBack = () => Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();

    return PanResponder.create({
      // Not "capture": a child that keeps its touch (the slider) is never interrupted.
      onMoveShouldSetPanResponder: (_, g) => g.dy > DRAG_START_DISTANCE && g.dy > Math.abs(g.dx),
      onPanResponderMove: (_, g) => translateY.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > CLOSE_DISTANCE || g.vy > CLOSE_VELOCITY) {
          closeNowPlaying();
        } else {
          springBack();
        }
      },
      onPanResponderTerminate: springBack,
    });
  }, [translateY]);

  return { translateY, panHandlers: panResponder.panHandlers, close: closeNowPlaying };
}

function closeNowPlaying(): void {
  if (router.canGoBack()) router.back();
}
