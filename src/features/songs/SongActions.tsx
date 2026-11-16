import { Play, Shuffle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import { usePlayerStore } from '@/store/playerStore';
import { screenPadding, spacing } from '@/theme';
import type { Song } from '@/types/song';

type SongActionsProps = {
  /** The list as shown on screen. */
  songs: Song[];
};

/** "Play" and "Shuffle" buttons above the song list. */
export default function SongActions({ songs }: SongActionsProps) {
  const playQueue = usePlayerStore((state) => state.playQueue);

  const playAll = () =>
    playQueue(
      songs.map((song) => song.id),
      0,
    );

  return (
    <View style={styles.row}>
      <Button label="Play" icon={Play} onPress={playAll} style={styles.button} />
      {/* Shuffle gets its action in Step 5. */}
      <Button label="Shuffle" icon={Shuffle} variant="secondary" onPress={() => undefined} style={styles.button} />
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
