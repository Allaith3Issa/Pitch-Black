import { FlatList, StyleSheet } from 'react-native';

import SongRow from '@/components/SongRow';
import { sizes, spacing } from '@/theme';
import type { Song } from '@/types/song';

type SongFlatListProps = {
  songs: Song[];
  /** Hide the keyboard when the user scrolls (used on the Search screen). */
  dismissKeyboardOnDrag?: boolean;
};

const keyExtractor = (song: Song) => song.id;
const renderItem = ({ item }: { item: Song }) => <SongRow song={item} />;
// Every row has the same height, so FlatList can skip measuring them.
const getItemLayout = (_: ArrayLike<Song> | null | undefined, index: number) => ({
  length: sizes.songRow,
  offset: sizes.songRow * index,
  index,
});

/** A fast, scrollable list of SongRows. */
export default function SongFlatList({ songs, dismissKeyboardOnDrag = false }: SongFlatListProps) {
  return (
    <FlatList
      data={songs}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      contentContainerStyle={styles.content}
      keyboardDismissMode={dismissKeyboardOnDrag ? 'on-drag' : 'none'}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    // Breathing room under the last row.
    paddingBottom: spacing.xl,
  },
});
