import Slider from '@react-native-community/slider';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { useCurrentSongId } from '@/hooks/useCurrentSongId';
import { useTheme } from '@/hooks/useTheme';
import { usePlaybackProgressStore } from '@/store/playbackProgressStore';
import { usePlayerStore } from '@/store/playerStore';
import { makeStyles, spacing, typography } from '@/theme';
import { formatDuration } from '@/utils/formatDuration';

/** Slider with the current time and the song length. Dragging it seeks when the finger is lifted. */
export default function SeekBar() {
  const styles = useStyles();
  const { colors } = useTheme();
  const positionSec = usePlaybackProgressStore((state) => state.positionSec);
  const durationSec = usePlaybackProgressStore((state) => state.durationSec);
  const seekTo = usePlayerStore((state) => state.seekTo);
  const songId = useCurrentSongId();
  // The song under the finger when the drag started.
  const dragSongId = useRef<string | null>(null);

  // While the finger is on the slider, the thumb and the time follow the finger, not the player.
  // `null` = not dragging.
  const [dragSec, setDragSec] = useState<number | null>(null);
  const shownSec = dragSec ?? positionSec;

  const startDrag = (value: number) => {
    dragSongId.current = songId;
    setDragSec(value);
  };

  const finishDrag = (value: number) => {
    // If the song ended (next song started) during the drag, the position belongs to the old song: drop it.
    // The store shows the new position right away, so the thumb does not jump back.
    if (songId === dragSongId.current) {
      seekTo(value);
    }
    setDragSec(null);
  };

  return (
    <View>
      {/* Keeps every touch that starts on the slider, so the swipe down to close Now Playing can
          never take over a drag (it would stop the slider in the middle). */}
      <View onStartShouldSetResponder={() => true} onResponderTerminationRequest={() => false}>
        <Slider
          style={styles.slider}
          value={Math.min(shownSec, durationSec)}
          minimumValue={0}
          maximumValue={durationSec}
          disabled={durationSec <= 0}
          onSlidingStart={startDrag}
          // Only while dragging: a value change that does not come from the finger is ignored.
          onValueChange={(value) => setDragSec((current) => (current === null ? null : value))}
          onSlidingComplete={finishDrag}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
          accessibilityLabel="Song position"
        />
      </View>
      <View style={styles.times}>
        <Text style={styles.time}>{formatDuration(shownSec)}</Text>
        <Text style={styles.time}>{formatDuration(durationSec)}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  slider: {
    // The Android slider has its own side padding; this lines the track up with the times.
    marginHorizontal: -spacing.lg,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
  },
}));
