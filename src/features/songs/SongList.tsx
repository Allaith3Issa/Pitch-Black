import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import SongFlatList from '@/components/SongFlatList';
import StateMessage from '@/components/StateMessage';
import SongActions from '@/features/songs/SongActions';
import { useAllowAccess } from '@/hooks/useAllowAccess';
import { useSortedSongs } from '@/hooks/useSortedSongs';
import { useLibraryStore } from '@/store/libraryStore';
import { colors } from '@/theme';

/** The sorted song list with its loading / error / empty / no-access states. */
export default function SongList() {
  const songs = useSortedSongs();
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
    <>
      <SongActions songs={songs} />
      <SongFlatList songs={songs} />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
