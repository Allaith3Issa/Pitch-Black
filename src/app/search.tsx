import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchHeader from '@/features/search/SearchHeader';
import SearchResults from '@/features/search/SearchResults';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <SearchHeader query={query} onChangeQuery={setQuery} />
      <SearchResults query={query} />
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
