import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddSongsList from '@/features/playlists/AddSongsList';

export default function AddSongsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <AddSongsList playlistId={id} />
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
