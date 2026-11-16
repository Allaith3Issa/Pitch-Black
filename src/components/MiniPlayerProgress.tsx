import { View } from 'react-native';

import { usePlaybackProgressStore } from '@/store/playbackProgressStore';
import { makeStyles, sizes } from '@/theme';

/** Thin progress line at the bottom of the Mini Player. The only part that re-renders every tick. */
export default function MiniPlayerProgress() {
  const styles = useStyles();
  const fraction = usePlaybackProgressStore((state) =>
    state.durationSec > 0 ? Math.min(state.positionSec / state.durationSec, 1) : 0,
  );

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  track: {
    height: sizes.progressLine,
    backgroundColor: colors.border,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
}));
