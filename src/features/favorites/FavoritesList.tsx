import { StyleSheet, View } from 'react-native';

import ScreenHeader from '@/components/ScreenHeader';
import SongActions from '@/components/SongActions';
import SongFlatList from '@/components/SongFlatList';
import StateMessage from '@/components/StateMessage';
import { useFavoriteSongs } from '@/hooks/useFavoriteSongs';
import { useLibraryStore } from '@/store/libraryStore';
import { formatSongCount } from '@/utils/playlist';
import { FAVORITES_QUEUE } from '@/utils/queueSource';

/** Favorites tab (design screen 11): count, Play / Shuffle and the favorite songs, newest first. */
export default function FavoritesList() {
  const songs = useFavoriteSongs();
  const isLibraryReady = useLibraryStore((state) => state.status === 'ready' && state.permission === 'granted');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Favorites" meta={isLibraryReady ? formatSongCount(songs.length) : undefined} />
      {!isLibraryReady ? (
        <StateMessage
          title="Your music is not loaded"
          description="Go to the Songs tab to allow access or try again."
        />
      ) : songs.length === 0 ? (
        <StateMessage title="No favorites yet" description="Tap the heart on a song to add it here." />
      ) : (
        <>
          <SongActions songs={songs} queueSource={FAVORITES_QUEUE} />
          <SongFlatList songs={songs} queueSource={FAVORITES_QUEUE} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
