import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react-native';
import { View } from 'react-native';

import IconButton from '@/components/IconButton';
import PlayerToggle from '@/features/player/PlayerToggle';
import SkipSecondsButton from '@/features/player/SkipSecondsButton';
import { useTheme } from '@/hooks/useTheme';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { iconSizes, makeStyles, radius, sizes, spacing } from '@/theme';
import type { RepeatMode } from '@/types/player';
import { SKIP_SECONDS } from '@/utils/skip';

const REPEAT_LABELS: Record<RepeatMode, string> = {
  off: 'Repeat: off',
  all: 'Repeat: all songs',
  one: 'Repeat: this song',
};

/**
 * Now Playing controls.
 * Main row: skip back, previous, play/pause, next, skip forward. Under it: shuffle (left), repeat (right).
 */
export default function PlayerControls() {
  const styles = useStyles();
  const { colors } = useTheme();
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const skipBy = usePlayerStore((state) => state.skipBy);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const shuffle = useSettingsStore((state) => state.shuffle);
  const repeatMode = useSettingsStore((state) => state.repeatMode);
  const cycleRepeatMode = useSettingsStore((state) => state.cycleRepeatMode);

  return (
    <View>
      <View style={styles.mainRow}>
        <SkipSecondsButton direction="back" seconds={SKIP_SECONDS} onPress={() => skipBy(-SKIP_SECONDS)} />
        <IconButton
          size={sizes.playerSkipSong}
          accessibilityLabel="Previous song"
          onPress={previous}
          icon={<SkipBack color={colors.text} fill={colors.text} size={iconSizes.playerMain} />}
        />
        <IconButton
          size={sizes.playButtonLarge}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          onPress={togglePlay}
          icon={
            <View style={styles.playCircle}>
              {isPlaying ? (
                <Pause color={colors.onPrimary} fill={colors.onPrimary} size={iconSizes.playerMain} />
              ) : (
                <Play color={colors.onPrimary} fill={colors.onPrimary} size={iconSizes.playerMain} />
              )}
            </View>
          }
        />
        <IconButton
          size={sizes.playerSkipSong}
          accessibilityLabel="Next song"
          onPress={next}
          icon={<SkipForward color={colors.text} fill={colors.text} size={iconSizes.playerMain} />}
        />
        <SkipSecondsButton direction="forward" seconds={SKIP_SECONDS} onPress={() => skipBy(SKIP_SECONDS)} />
      </View>

      <View style={styles.toggleRow}>
        <PlayerToggle icon={Shuffle} active={shuffle} accessibilityLabel="Shuffle" onPress={toggleShuffle} />
        <PlayerToggle
          icon={repeatMode === 'one' ? Repeat1 : Repeat}
          active={repeatMode !== 'off'}
          accessibilityLabel={REPEAT_LABELS[repeatMode]}
          onPress={cycleRepeatMode}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playCircle: {
    width: sizes.playButtonLarge,
    height: sizes.playButtonLarge,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
}));
