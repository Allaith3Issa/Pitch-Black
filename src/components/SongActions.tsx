import { Play, Shuffle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { screenPadding, spacing } from '@/theme';
import type { QueueSource } from '@/types/player';
import type { Song } from '@/types/song';
import { isSameQueueSource } from '@/utils/queueSource';
import { getShuffleButtonAction } from '@/utils/shuffleButton';

type SongActionsProps = {
  /** The list as shown on screen. */
  songs: Song[];
  /** Which list this is (see utils/queueSource). */
  queueSource: QueueSource;
};

/** "Play" and "Shuffle" buttons above a song list. "Shuffle" shows the active style while shuffle is on. */
export default function SongActions({ songs, queueSource }: SongActionsProps) {
  const playInOrder = usePlayerStore((state) => state.playInOrder);
  const shufflePlay = usePlayerStore((state) => state.shufflePlay);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const isShuffleOn = useSettingsStore((state) => state.shuffle);
  // The loaded song (playing or paused) comes from this list.
  const isThisListQueued = usePlayerStore(
    (state) => state.currentIndex !== -1 && isSameQueueSource(state.queueSource, queueSource),
  );

  const ids = () => songs.map((song) => song.id);
  // Turns shuffle off and plays the list in order.
  const playAll = () => playInOrder(ids(), queueSource);
  // On while this list plays → turn it off like the shuffle icon on Now Playing: the current song keeps
  // playing and the next songs follow the list order. Otherwise → shuffle on and play this list from a
  // random song (see utils/shuffleButton).
  const onShufflePress = () =>
    getShuffleButtonAction(isShuffleOn, isThisListQueued) === 'turnOff'
      ? toggleShuffle()
      : shufflePlay(ids(), queueSource);

  return (
    <View style={styles.row}>
      <Button label="Play" icon={Play} onPress={playAll} style={styles.button} />
      <Button
        label="Shuffle"
        icon={Shuffle}
        variant={isShuffleOn ? 'active' : 'secondary'}
        selected={isShuffleOn}
        onPress={onShufflePress}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
