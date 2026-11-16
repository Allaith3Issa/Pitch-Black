import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import SongRow from '@/components/SongRow';
import StateMessage from '@/components/StateMessage';
import { useAllowAccess } from '@/hooks/useAllowAccess';
import { useLibraryStore } from '@/store/libraryStore';
import { colors, sizes, spacing } from '@/theme';
import type { Song } from '@/types/song';

const keyExtractor = (song: Song) => song.id;
const renderItem = ({ item }: { item: Song }) => <SongRow song={item} />;
const getItemLayout = (_: ArrayLike<Song> | null | undefined, index: number) => ({
  length: sizes.songRow,
  offset: sizes.songRow * index,
  index,
});

/** The song list with its loading / error / empty / no-access states. */
export default function SongList() {
  const songs = useLibraryStore((state) => state.songs);
  const status = useLibraryStore((state) => state.status);
  const error = useLibraryStore((state) => state.error);
  const permission = useLibraryStore((state) => state.permission);
  const permissionError = useLibraryStore((state) => state.permissionError);
  const loadSongs = useLibraryStore((state) => state.loadSongs);
  const allowAccess = useAllowAccess('Grant access');

  if (permission !== 'granted') {
    return (
      <StateMessage
        title="No access to your music"
        description={permissionError?.message ?? 'Allow B4F Player to read the audio files on your device.'}
        detail={permissionError?.detail}
        action={<Button label={allowAccess.label} onPress={allowAccess.onPress} />}
      />
    );
  }

  if (status === 'idle' || status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primaryText} size="large" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <StateMessage
        title="Something went wrong"
        description={error?.message}
        detail={error?.detail}
        action={<Button label="Try again" onPress={loadSongs} />}
      />
    );
  }

  if (songs.length === 0) {
    return <StateMessage title="No songs found" description="Add audio files to your phone and try again." />;
  }

  return (
    <FlatList
      data={songs}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    // Breathing room under the last row, above the tab bar.
    paddingBottom: spacing.xl,
  },
});
