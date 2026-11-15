import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SongList from '@/features/songs/SongList';
import SongsHeader from '@/features/songs/SongsHeader';
import { colors } from '@/theme';

export default function SongsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SongsHeader />
      <SongList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
