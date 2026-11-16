import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchHeader from '@/features/search/SearchHeader';
import SearchResults from '@/features/search/SearchResults';
import { colors } from '@/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <SearchHeader query={query} onChangeQuery={setQuery} />
      <SearchResults query={query} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
