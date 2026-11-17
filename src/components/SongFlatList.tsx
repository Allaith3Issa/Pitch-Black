import { useCallback } from 'react';
import { FlatList, type ListRenderItem, StyleSheet } from 'react-native';

import SongRow from '@/components/SongRow';
import { useCurrentSongId } from '@/hooks/useCurrentSongId';
import { usePlayFromList } from '@/hooks/usePlayFromList';
import { sizes, spacing } from '@/theme';
import type { Song } from '@/types/song';

type SongFlatListProps = {
  /** The songs exactly as shown. Tapping one plays this list from that song. */
  songs: Song[];
  /** Names the list on Now Playing when a song from it plays (e.g. "All songs"). */
  queueTitle: string;
  /** Hide the keyboard when the user scrolls (used on the Search screen). */
  dismissKeyboardOnDrag?: boolean;
};

const keyExtractor = (song: Song) => song.id;
// Every row has the same height, so FlatList can skip measuring them.
const getItemLayout = (_: ArrayLike<Song> | null | undefined, index: number) => ({
  length: sizes.songRow,
  offset: sizes.songRow * index,
  index,
});

/** A fast, scrollable list of SongRows. The song in the player is highlighted. */
export default function SongFlatList({ songs, queueTitle, dismissKeyboardOnDrag = false }: SongFlatListProps) {
  const currentSongId = useCurrentSongId();
  const playFromList = usePlayFromList(songs, queueTitle);

  // SongRow is memoized: when the song changes, only the old and the new current row re-render.
  const renderItem = useCallback<ListRenderItem<Song>>(
    ({ item, index }) => (
      <SongRow song={item} index={index} isCurrent={item.id === currentSongId} onPress={playFromList} />
    ),
    [currentSongId, playFromList],
  );

  return (
    <FlatList
      data={songs}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      extraData={currentSongId}
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
