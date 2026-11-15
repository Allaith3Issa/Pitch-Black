import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import IconButton from '@/components/IconButton';
import { useLibraryStore } from '@/store/libraryStore';
import { colors, iconSizes, screenPadding, spacing, typography } from '@/theme';

/** "Songs" title + search button, and the song count once the library is loaded. */
export default function SongsHeader() {
  const count = useLibraryStore((state) => state.songs.length);
  const isReady = useLibraryStore((state) => state.status === 'ready' && state.permission === 'granted');

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Songs</Text>
        <IconButton
          icon={<Search color={colors.text} size={iconSizes.md} />}
          accessibilityLabel="Search songs"
          onPress={() => router.push('/search')}
        />
      </View>
      {isReady && <Text style={styles.count}>{count === 1 ? '1 song' : `${count} songs`}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: screenPadding,
    paddingRight: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  count: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
