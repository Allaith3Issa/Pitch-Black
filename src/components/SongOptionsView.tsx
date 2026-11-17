import { Heart, HeartOff, ListMinus, ListPlus } from 'lucide-react-native';
import { Text, ToastAndroid, View } from 'react-native';

import Artwork from '@/components/Artwork';
import SheetOption from '@/components/SheetOption';
import { useIsFavorite } from '@/hooks/useIsFavorite';
import { useFavoritesStore } from '@/store/favoritesStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { fonts, makeStyles, sizes, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';
import { formatDuration } from '@/utils/formatDuration';

type SongOptionsViewProps = {
  song: Song;
  /** Set on Playlist Detail: also offers "Remove from playlist". */
  playlistId?: string;
  onAddToPlaylist: () => void;
  onClose: () => void;
};

/** Song Options (design screen 04): song header, favorites, add to playlist. Song info and Share come in Step 6. */
export default function SongOptionsView({ song, playlistId, onAddToPlaylist, onClose }: SongOptionsViewProps) {
  const styles = useStyles();
  const isFavorite = useIsFavorite(song.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const removeSong = usePlaylistStore((state) => state.removeSong);
  const playlistName = usePlaylistStore((state) => state.playlists.find((item) => item.id === playlistId)?.name);
  const duration = formatDuration(song.durationSec);

  const onToggleFavorite = () => {
    toggleFavorite(song);
    onClose();
  };

  const onRemoveFromPlaylist = () => {
    if (playlistId === undefined) return;
    removeSong(playlistId, song.id);
    ToastAndroid.show(`Removed from ${playlistName ?? 'the playlist'}`, ToastAndroid.SHORT);
    onClose();
  };

  return (
    <View>
      <View style={styles.header}>
        <Artwork size={sizes.artworkRow} />
        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          {/* Separate texts, so a mixed Arabic/English artist cannot move the duration (same as SongRow). */}
          <View style={styles.subtitleRow}>
            {song.artist !== null && (
              <Text style={[styles.subtitle, styles.shrink]} numberOfLines={1}>
                {song.artist}
              </Text>
            )}
            <Text style={styles.subtitle}>{song.artist !== null ? ` • ${duration}` : duration}</Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
      <SheetOption
        label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        icon={isFavorite ? HeartOff : Heart}
        onPress={onToggleFavorite}
      />
      <SheetOption label="Add to playlist" icon={ListPlus} onPress={onAddToPlaylist} />
      {playlistId !== undefined && (
        <SheetOption label="Remove from playlist" icon={ListMinus} onPress={onRemoveFromPlaylist} />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.body,
    fontFamily: fonts.semiBold,
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
    marginBottom: spacing.xs,
  },
}));
