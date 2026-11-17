import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlaylistDetail from '@/features/playlists/PlaylistDetail';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <PlaylistDetail id={id} />
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
