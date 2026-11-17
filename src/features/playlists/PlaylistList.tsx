import { router } from 'expo-router';
import { Ellipsis, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native';

import IconButton from '@/components/IconButton';
import PlaylistCover from '@/components/PlaylistCover';
import PlaylistNameDialog from '@/components/PlaylistNameDialog';
import PlaylistRow from '@/components/PlaylistRow';
import ScreenHeader from '@/components/ScreenHeader';
import PlaylistOptionsSheet from '@/features/playlists/PlaylistOptionsSheet';
import { useTheme } from '@/hooks/useTheme';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { iconSizes, radius, sizes, spacing } from '@/theme';
import type { Playlist } from '@/types/playlist';
import { formatPlaylistCount, formatSongCount } from '@/utils/playlist';
import { countAvailableSongs } from '@/utils/songList';

const keyExtractor = (playlist: Playlist) => playlist.id;

function openPlaylist(id: string) {
  router.push({ pathname: '/playlist/[id]', params: { id } });
}

/** Playlists tab (design screen 07): "Create playlist" tile and the playlists, newest first. */
export default function PlaylistList() {
  const { colors } = useTheme();
  const playlists = usePlaylistStore((state) => state.playlists);
  const createPlaylist = usePlaylistStore((state) => state.createPlaylist);
  const songsById = useLibraryStore((state) => state.songsById);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [optionsPlaylist, setOptionsPlaylist] = useState<Playlist | null>(null);

  // A new playlist opens right away, so songs can be added to it.
  const create = (name: string) => {
    const id = createPlaylist(name);
    setIsCreateOpen(false);
    openPlaylist(id);
  };

  const renderItem: ListRenderItem<Playlist> = ({ item }) => (
    <PlaylistRow
      title={item.name}
      subtitle={formatSongCount(countAvailableSongs(item.songs, songsById))}
      height={sizes.playlistRow}
      cover={<PlaylistCover size={sizes.playlistCoverRow} iconSize={iconSizes.playlistRow} borderRadius={radius.md} />}
      onPress={() => openPlaylist(item.id)}
      right={
        <IconButton
          icon={<Ellipsis color={colors.textSecondary} size={iconSizes.md} />}
          accessibilityLabel={`More options for ${item.name}`}
          onPress={() => setOptionsPlaylist(item)}
        />
      }
    />
  );

  const createTile = (
    <PlaylistRow
      title="Create playlist"
      height={sizes.playlistRow}
      cover={
        <PlaylistCover
          size={sizes.playlistCoverRow}
          iconSize={iconSizes.md}
          borderRadius={radius.md}
          icon={Plus}
          variant="dashed"
        />
      }
      onPress={() => setIsCreateOpen(true)}
    />
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Playlists"
        meta={formatPlaylistCount(playlists.length)}
        action={
          <IconButton
            icon={<Plus color={colors.text} size={iconSizes.md} />}
            accessibilityLabel="Create playlist"
            onPress={() => setIsCreateOpen(true)}
          />
        }
      />
      <FlatList
        data={playlists}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={createTile}
        contentContainerStyle={styles.content}
      />
      <PlaylistNameDialog
        visible={isCreateOpen}
        title="New playlist"
        submitLabel="Create"
        initialName=""
        onClose={() => setIsCreateOpen(false)}
        onSubmit={create}
      />
      <PlaylistOptionsSheet playlist={optionsPlaylist} onClose={() => setOptionsPlaylist(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
});
