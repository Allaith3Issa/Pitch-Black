import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SongList from '@/features/songs/SongList';
import SongsHeader from '@/features/songs/SongsHeader';

export default function SongsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SongsHeader />
      <SongList />
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
