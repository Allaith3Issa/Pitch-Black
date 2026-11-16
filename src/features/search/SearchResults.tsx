import { Text, View } from 'react-native';

import SongFlatList from '@/components/SongFlatList';
import StateMessage from '@/components/StateMessage';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSongSearch } from '@/hooks/useSongSearch';
import { useLibraryStore } from '@/store/libraryStore';
import { makeStyles, screenPadding, spacing, typography } from '@/theme';

type SearchResultsProps = {
  query: string;
};

// Wait a moment after the last key press before searching.
const SEARCH_DELAY_MS = 150;

/** Results count + matching songs, or a hint / "No songs found". */
export default function SearchResults({ query }: SearchResultsProps) {
  const styles = useStyles();
  const debouncedQuery = useDebouncedValue(query, SEARCH_DELAY_MS);
  const results = useSongSearch(debouncedQuery);
  const isLibraryReady = useLibraryStore((state) => state.status === 'ready' && state.permission === 'granted');

  // Without access (or after a load error) there is nothing to search: say so instead of "No songs found".
  if (!isLibraryReady) {
    return (
      <StateMessage
        title="Your music is not loaded"
        description="Go back to the Songs screen to allow access or try again."
      />
    );
  }

  if (results === null) {
    return <StateMessage title="Search your music" description="Type a song title to find it." />;
  }

  if (results.length === 0) {
    return <StateMessage title="No songs found" description="Try another title." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{results.length === 1 ? '1 result' : `${results.length} results`}</Text>
      <SongFlatList songs={results} dismissKeyboardOnDrag />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
  },
  count: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.sm,
  },
}));
