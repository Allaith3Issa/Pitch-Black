import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FavoritesList from '@/features/favorites/FavoritesList';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FavoritesList />
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
