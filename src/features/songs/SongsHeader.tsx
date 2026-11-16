import { router } from 'expo-router';
import { ArrowUpDown, Search } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Chip from '@/components/Chip';
import IconButton from '@/components/IconButton';
import SortSheet from '@/features/songs/SortSheet';
import { useLibraryStore } from '@/store/libraryStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors, iconSizes, screenPadding, spacing, typography } from '@/theme';
import { getSortLabel } from '@/utils/getSortLabel';

/** "Songs" title + search button, then the song count and the sort chip once the library is loaded. */
export default function SongsHeader() {
  const count = useLibraryStore((state) => state.songs.length);
  const isReady = useLibraryStore((state) => state.status === 'ready' && state.permission === 'granted');
  const sortBy = useSettingsStore((state) => state.sortBy);
  const sortOrder = useSettingsStore((state) => state.sortOrder);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  const sortLabel = getSortLabel(sortBy, sortOrder);

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
      {isReady && (
        <View style={styles.countRow}>
          <Text style={styles.count}>{count === 1 ? '1 song' : `${count} songs`}</Text>
          <Chip
            label={sortLabel}
            icon={ArrowUpDown}
            accessibilityLabel={`Sort: ${sortLabel}`}
            onPress={() => setIsSortSheetOpen(true)}
          />
        </View>
      )}
      <SortSheet visible={isSortSheetOpen} onClose={() => setIsSortSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing.xs,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: screenPadding,
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
