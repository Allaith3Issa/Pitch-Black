import { useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  type GestureResponderHandlers,
  PanResponder,
  type PanResponderGestureState,
} from 'react-native';

import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { openNowPlaying } from '@/utils/openNowPlaying';
import { getNextIndex, getPreviousAction } from '@/utils/queue';

/**
 * How far (px) the finger must move before the Mini Player takes the touch. Shorter moves stay
 * taps, so the buttons on the Mini Player keep working.
 */
const DRAG_START_DISTANCE = 12;
/** How far (px) a sideways swipe must go to change the song. */
const SWIPE_SIDE_DISTANCE = 60;
/** How far (px) an upward swipe must go to open Now Playing. */
const SWIPE_UP_DISTANCE = 40;
/** The old song slides out, then the new one slides in: about 270 ms together. */
const SLIDE_OUT_MS = 120;
const SLIDE_IN_MS = 150;

const isSideways = (g: PanResponderGestureState) => Math.abs(g.dx) > Math.abs(g.dy);

/** `true` when "next" really changes the song (not at the end of the queue with repeat off). */
function hasNextSong(): boolean {
  const { currentIndex, queue } = usePlayerStore.getState();
  return getNextIndex(currentIndex, queue.length, useSettingsStore.getState().repeatMode) !== null;
}

/** `true` when there is a song before this one (otherwise "previous" only restarts the song). */
function hasPreviousSong(): boolean {
  const { currentIndex, queue } = usePlayerStore.getState();
  return getPreviousAction(currentIndex, 0, queue.length, useSettingsStore.getState().repeatMode).type === 'play';
}

/**
 * Swipes on the Mini Player: left = next song, right = previous song, up = open Now Playing.
 * While swiping sideways the card follows the finger. A long enough swipe slides the card out
 * and the new song in from the other side; a short one springs back.
 */
export function useMiniPlayerGestures(): { translateX: Animated.Value; panHandlers: GestureResponderHandlers } {
  const [translateX] = useState(() => new Animated.Value(0));

  // Created once, with the card's animated position.
  const [panResponder] = useState(() => {
    // `true` while the card slides out and in: a new swipe waits until it is done, so the card never jumps.
    let isSliding = false;
    const springBack = () => Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();

    /** `direction` -1 = out to the left (next song), 1 = out to the right (previous song). */
    const slideToNewSong = (direction: -1 | 1, changeSong: () => void) => {
      const { width } = Dimensions.get('window');
      isSliding = true;
      Animated.timing(translateX, {
        toValue: direction * width,
        duration: SLIDE_OUT_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        changeSong();
        translateX.setValue(-direction * width);
        Animated.timing(translateX, {
          toValue: 0,
          duration: SLIDE_IN_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          isSliding = false;
        });
      });
    };

    return PanResponder.create({
      // "Capture": the card can take the touch even when it started on one of its buttons.
      onMoveShouldSetPanResponderCapture: (_, g) =>
        !isSliding &&
        (isSideways(g) ? Math.abs(g.dx) > DRAG_START_DISTANCE : g.dy < -DRAG_START_DISTANCE),
      onPanResponderMove: (_, g) => {
        if (isSideways(g)) translateX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        const { next, previousSong } = usePlayerStore.getState();
        if (isSideways(g) && g.dx <= -SWIPE_SIDE_DISTANCE && hasNextSong()) {
          slideToNewSong(-1, next);
        } else if (isSideways(g) && g.dx >= SWIPE_SIDE_DISTANCE && hasPreviousSong()) {
          slideToNewSong(1, previousSong);
        } else {
          springBack();
          if (!isSideways(g) && g.dy <= -SWIPE_UP_DISTANCE) openNowPlaying();
        }
      },
      onPanResponderTerminate: springBack,
    });
  });

  return { translateX, panHandlers: panResponder.panHandlers };
}
