import { Play, Shuffle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { screenPadding, spacing } from '@/theme';
import type { QueueSource } from '@/types/player';
import type { Song } from '@/types/song';

type SongActionsProps = {
  /** The list as shown on screen. */
  songs: Song[];
  /** Which list this is (see utils/queueSource). */
  queueSource: QueueSource;
};

/** "Play" and "Shuffle" buttons above a song list. "Shuffle" is an on/off button (active style while on). */
export default function SongActions({ songs, queueSource }: SongActionsProps) {
  const playInOrder = usePlayerStore((state) => state.playInOrder);
  const shufflePlay = usePlayerStore((state) => state.shufflePlay);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const isShuffleOn = useSettingsStore((state) => state.shuffle);

  const ids = () => songs.map((song) => song.id);
  // Turns shuffle off and plays the list in order.
  const playAll = () => playInOrder(ids(), queueSource);
  // A toggle. Off → turn it on and start from a random song. On → turn it off like the shuffle icon on
  // Now Playing: the current song keeps playing and the next songs follow the list order.
  const onShufflePress = () => (isShuffleOn ? toggleShuffle() : shufflePlay(ids(), queueSource));

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
