import { Play, Shuffle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import { usePlayerStore } from '@/store/playerStore';
import { screenPadding, spacing } from '@/theme';
import type { Song } from '@/types/song';

type SongActionsProps = {
  /** The list as shown on screen. */
  songs: Song[];
  /** Names the list on Now Playing. */
  queueTitle: string;
};

/** "Play" and "Shuffle" buttons above the song list. */
export default function SongActions({ songs, queueTitle }: SongActionsProps) {
  const playInOrder = usePlayerStore((state) => state.playInOrder);
  const shufflePlay = usePlayerStore((state) => state.shufflePlay);

  const ids = () => songs.map((song) => song.id);
  // Turns shuffle off and plays the list in order.
  const playAll = () => playInOrder(ids(), queueTitle);
  // Turns shuffle on and starts from a random song.
  const shuffleAll = () => shufflePlay(ids(), queueTitle);

  return (
    <View style={styles.row}>
      <Button label="Play" icon={Play} onPress={playAll} style={styles.button} />
      <Button label="Shuffle" icon={Shuffle} variant="secondary" onPress={shuffleAll} style={styles.button} />
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
