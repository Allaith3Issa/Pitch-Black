import { router } from 'expo-router';
import { ChevronLeft, Ellipsis } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import MiniPlayer from '@/components/MiniPlayer';
import SongFlatList from '@/components/SongFlatList';
import StateMessage from '@/components/StateMessage';
import PlaylistHero from '@/features/playlists/PlaylistHero';
import PlaylistOptionsSheet from '@/features/playlists/PlaylistOptionsSheet';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useTheme } from '@/hooks/useTheme';
import { useLibraryStore } from '@/store/libraryStore';
import { iconSizes, spacing } from '@/theme';
import type { Playlist } from '@/types/playlist';
import { playlistQueue } from '@/utils/queueSource';

type PlaylistDetailProps = {
  id: string;
};

function goBack() {
  // Opened directly (nothing to go back to): go to the Playlists tab.
  if (router.canGoBack()) router.back();
  else router.replace('/playlists');
}

/** Playlist Detail (design screen 09). The Mini Player sits at the bottom (no tab bar on this screen). */
export default function PlaylistDetail({ id }: PlaylistDetailProps) {
  const { colors } = useTheme();
  const { playlist, songs, missingCount } = usePlaylist(id);
  const isLibraryReady = useLibraryStore((state) => state.status === 'ready');
  const [optionsPlaylist, setOptionsPlaylist] = useState<Playlist | null>(null);
  const queueSource = useMemo(() => playlistQueue(id), [id]);

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <IconButton
          icon={<ChevronLeft color={colors.text} size={iconSizes.md} />}
          accessibilityLabel="Back"
          onPress={goBack}
        />
        {playlist && (
          <IconButton
            icon={<Ellipsis color={colors.text} size={iconSizes.md} />}
            accessibilityLabel={`More options for ${playlist.name}`}
            onPress={() => setOptionsPlaylist(playlist)}
          />
        )}
      </View>

      {playlist ? (
        <SongFlatList
          songs={songs}
          queueSource={queueSource}
          playlistId={playlist.id}
          header={
            // Only count missing songs once the library is loaded (before that, every song looks missing).
            <PlaylistHero
              playlist={playlist}
              songs={songs}
              missingCount={isLibraryReady ? missingCount : 0}
              queueSource={queueSource}
            />
          }
        />
      ) : (
        <StateMessage
          title="Playlist not found"
          description="It may have been deleted."
          action={<Button label="Go back" onPress={goBack} />}
        />
      )}

      <MiniPlayer />
      <PlaylistOptionsSheet playlist={optionsPlaylist} onClose={() => setOptionsPlaylist(null)} onDeleted={goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
});
