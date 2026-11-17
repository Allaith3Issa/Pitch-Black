import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlaylistList from '@/features/playlists/PlaylistList';

export default function PlaylistsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <PlaylistList />
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
