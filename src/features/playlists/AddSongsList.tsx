import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, type ListRenderItem, Text, ToastAndroid, View } from 'react-native';

import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import SearchInput from '@/components/SearchInput';
import SelectableSongRow from '@/components/SelectableSongRow';
import StateMessage from '@/components/StateMessage';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useSongSearch } from '@/hooks/useSongSearch';
import { useSortedSongs } from '@/hooks/useSortedSongs';
import { useTheme } from '@/hooks/useTheme';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { fonts, iconSizes, makeStyles, screenPadding, sizes, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';
import { formatSongCount } from '@/utils/playlist';

type AddSongsListProps = {
  playlistId: string;
};

// Wait a moment after the last key press before searching (same as the Search screen).
const SEARCH_DELAY_MS = 150;

const keyExtractor = (song: Song) => song.id;
const getItemLayout = (_: ArrayLike<Song> | null | undefined, index: number) => ({
  length: sizes.songRow,
  offset: sizes.songRow * index,
  index,
});

function close() {
  // Opened directly (nothing to go back to): go to the Playlists tab.
  if (router.canGoBack()) router.back();
  else router.replace('/playlists');
}

/**
 * Add Songs (design screen 10): all songs in the Songs sort order, searchable by title, with checkboxes.
 * Songs already in the playlist are checked and dimmed. "Add (n)" adds the selected songs in list order.
 */
export default function AddSongsList({ playlistId }: AddSongsListProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { playlist } = usePlaylist(playlistId);
  const addSongs = usePlaylistStore((state) => state.addSongs);
  const isLibraryReady = useLibraryStore((state) => state.status === 'ready' && state.permission === 'granted');
  const allSongs = useSortedSongs();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DELAY_MS);
  // `null` while nothing is typed: then all songs are shown.
  const results = useSongSearch(debouncedQuery);
  const songs = results ?? allSongs;
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());

  const inPlaylist = useMemo(() => new Set(playlist?.songs.map((ref) => ref.id)), [playlist]);

  const toggle = useCallback((songId: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(songId)) next.delete(songId);
      else next.add(songId);
      return next;
    });
  }, []);

  const add = () => {
    // In the order of the full list, not the order they were tapped.
    const toAdd = allSongs.filter((song) => selected.has(song.id));
    addSongs(playlistId, toAdd);
    ToastAndroid.show(`${formatSongCount(toAdd.length)} added`, ToastAndroid.SHORT);
    close();
  };

  const renderItem = useCallback<ListRenderItem<Song>>(
    ({ item }) => {
      const isInPlaylist = inPlaylist.has(item.id);
      return (
        <SelectableSongRow
          song={item}
          checked={isInPlaylist || selected.has(item.id)}
          disabled={isInPlaylist}
          onPress={toggle}
        />
      );
    },
    [inPlaylist, selected, toggle],
  );

  if (!playlist) {
    return (
      <StateMessage
        title="Playlist not found"
        description="It may have been deleted."
        action={<Button label="Close" onPress={close} />}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <IconButton icon={<X color={colors.text} size={iconSizes.md} />} accessibilityLabel="Close" onPress={close} />
        <View style={styles.titles}>
          <Text style={styles.title}>Add songs</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            to {playlist.name}
          </Text>
        </View>
        <Button label={`Add (${selected.size})`} onPress={add} disabled={selected.size === 0} />
      </View>
      <View style={styles.search}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search songs" />
      </View>
      {!isLibraryReady || allSongs.length === 0 ? (
        <StateMessage
          title="Your music is not loaded"
          description="Go to the Songs tab to allow access or try again."
        />
      ) : songs.length === 0 ? (
        <StateMessage title="No songs found" description="Try another title." />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          extraData={selected}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.xs,
    paddingRight: screenPadding,
  },
  titles: {
    flex: 1,
  },
  title: {
    ...typography.sheetTitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  search: {
    flexDirection: 'row',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
  },
  content: {
    paddingBottom: spacing.xl,
  },
}));
