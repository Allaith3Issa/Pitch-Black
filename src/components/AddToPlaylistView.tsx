import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, type ListRenderItem, Text, useWindowDimensions, View } from 'react-native';

import AppText from '@/components/AppText';
import Checkbox from '@/components/Checkbox';
import PlaylistCover from '@/components/PlaylistCover';
import PlaylistNameDialog from '@/components/PlaylistNameDialog';
import PlaylistRow from '@/components/PlaylistRow';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { iconSizes, makeStyles, radius, sizes, spacing, typography } from '@/theme';
import type { Playlist } from '@/types/playlist';
import type { Song } from '@/types/song';
import { formatSongCount } from '@/utils/playlist';
import { countAvailableSongs } from '@/utils/songList';

type AddToPlaylistViewProps = {
  song: Song;
};

// The playlist list takes at most this share of the screen height; it scrolls when longer.
const MAX_LIST_HEIGHT_RATIO = 0.45;

const keyExtractor = (playlist: Playlist) => playlist.id;

/**
 * Add to playlist (design screen 13). Works like a checklist: tapping a playlist adds the song, tapping
 * it again removes it. "New playlist" creates one with this song in it. The sheet stays open.
 */
export default function AddToPlaylistView({ song }: AddToPlaylistViewProps) {
  const styles = useStyles();
  const { height } = useWindowDimensions();
  const playlists = usePlaylistStore((state) => state.playlists);
  const createPlaylist = usePlaylistStore((state) => state.createPlaylist);
  const addSongs = usePlaylistStore((state) => state.addSongs);
  const removeSong = usePlaylistStore((state) => state.removeSong);
  const songsById = useLibraryStore((state) => state.songsById);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);

  const createWithSong = (name: string) => {
    const id = createPlaylist(name);
    addSongs(id, [song]);
    setIsNameDialogOpen(false);
  };

  const renderItem: ListRenderItem<Playlist> = ({ item }) => {
    const hasSong = item.songs.some((ref) => ref.id === song.id);
    const count = formatSongCount(countAvailableSongs(item.songs, songsById));
    return (
      <PlaylistRow
        title={item.name}
        subtitle={hasSong ? `${count} · already added` : count}
        height={sizes.songRow}
        cover={<PlaylistCover size={sizes.artworkRow} iconSize={iconSizes.option} borderRadius={radius.md} />}
        onPress={() => (hasSong ? removeSong(item.id, song.id) : addSongs(item.id, [song]))}
        accessibilityState={{ checked: hasSong }}
        right={
          <View style={styles.check}>
            <Checkbox checked={hasSong} />
          </View>
        }
      />
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Add to playlist</Text>
        {/* Separate texts, so mixed Arabic/English titles and artists stay in place. */}
        <View style={styles.subtitleRow}>
          <AppText style={[styles.subtitle, styles.shrink]} numberOfLines={1}>
            {song.title}
          </AppText>
          {song.artist !== null && (
            <AppText style={[styles.subtitle, styles.shrink]} numberOfLines={1}>
              {` • ${song.artist}`}
            </AppText>
          )}
        </View>
      </View>
      <PlaylistRow
        title="New playlist"
        height={sizes.songRow}
        cover={
          <PlaylistCover
            size={sizes.artworkRow}
            iconSize={iconSizes.md}
            borderRadius={radius.md}
            icon={Plus}
            variant="accent"
          />
        }
        onPress={() => setIsNameDialogOpen(true)}
      />
      {playlists.length > 0 && <View style={styles.divider} />}
      <FlatList
        data={playlists}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={{ maxHeight: height * MAX_LIST_HEIGHT_RATIO }}
      />
      <PlaylistNameDialog
        visible={isNameDialogOpen}
        title="New playlist"
        submitLabel="Create"
        initialName=""
        onClose={() => setIsNameDialogOpen(false)}
        onSubmit={createWithSong}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    ...typography.sheetTitle,
    color: colors.text,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shrink: {
    flexShrink: 1,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  divider: {
    height: sizes.hairline,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  check: {
    paddingHorizontal: spacing.md,
  },
}));
