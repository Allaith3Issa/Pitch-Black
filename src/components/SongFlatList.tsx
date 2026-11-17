import { type ReactElement, useCallback, useState } from 'react';
import { FlatList, type ListRenderItem, StyleSheet } from 'react-native';

import SongActionsSheet from '@/components/SongActionsSheet';
import SongRow from '@/components/SongRow';
import { useCurrentSongId } from '@/hooks/useCurrentSongId';
import { usePlayFromList } from '@/hooks/usePlayFromList';
import { sizes, spacing } from '@/theme';
import type { QueueSource } from '@/types/player';
import type { Song } from '@/types/song';

type SongFlatListProps = {
  /** The songs exactly as shown. Tapping one plays this list from that song. */
  songs: Song[];
  /** Which list this is (the queue source when a song from it plays, see utils/queueSource). */
  queueSource: QueueSource;
  /** Set on Playlist Detail: the song options then also offer "Remove from playlist". */
  playlistId?: string;
  /** Scrolls with the list, above the first song (e.g. the playlist header). */
  header?: ReactElement;
  /** Hide the keyboard when the user scrolls (used on the Search screen). */
  dismissKeyboardOnDrag?: boolean;
};

const keyExtractor = (song: Song) => song.id;

/** A fast, scrollable list of SongRows. The song in the player is highlighted. "⋯" opens the song options. */
export default function SongFlatList({
  songs,
  queueSource,
  playlistId,
  header,
  dismissKeyboardOnDrag = false,
}: SongFlatListProps) {
  const currentSongId = useCurrentSongId();
  const playFromList = usePlayFromList(songs, queueSource);
  // The song whose options are open, or `null`.
  const [optionsSong, setOptionsSong] = useState<Song | null>(null);

  // SongRow is memoized: when the song changes, only the old and the new current row re-render.
  const renderItem = useCallback<ListRenderItem<Song>>(
    ({ item, index }) => (
      <SongRow
        song={item}
        index={index}
        isCurrent={item.id === currentSongId}
        onPress={playFromList}
        onMore={setOptionsSong}
      />
    ),
    [currentSongId, playFromList],
  );

  return (
    <>
      <FlatList
        data={songs}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // Every row has the same height, so FlatList can skip measuring them. Not with a header,
        // because its height is not known.
        getItemLayout={header ? undefined : getItemLayout}
        ListHeaderComponent={header}
        extraData={currentSongId}
        contentContainerStyle={styles.content}
        keyboardDismissMode={dismissKeyboardOnDrag ? 'on-drag' : 'none'}
        keyboardShouldPersistTaps="handled"
      />
      <SongActionsSheet song={optionsSong} playlistId={playlistId} onClose={() => setOptionsSong(null)} />
    </>
  );
}

function getItemLayout(_: ArrayLike<Song> | null | undefined, index: number) {
  return { length: sizes.songRow, offset: sizes.songRow * index, index };
}

const styles = StyleSheet.create({
  content: {
    // Breathing room under the last row.
    paddingBottom: spacing.xl,
  },
});
