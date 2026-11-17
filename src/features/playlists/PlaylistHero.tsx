import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Text, View } from 'react-native';

import AppText from '@/components/AppText';
import PlaylistCover from '@/components/PlaylistCover';
import PlaylistRow from '@/components/PlaylistRow';
import SongActions from '@/components/SongActions';
import { fonts, iconSizes, letterSpacing, makeStyles, radius, screenPadding, sizes, spacing, typography } from '@/theme';
import type { QueueSource } from '@/types/player';
import type { Playlist } from '@/types/playlist';
import type { Song } from '@/types/song';
import { getPlaylistSummary } from '@/utils/playlist';

type PlaylistHeroProps = {
  playlist: Playlist;
  /** Its songs that are on the phone. */
  songs: Song[];
  /** Saved songs that are not on the phone right now. */
  missingCount: number;
  /** This playlist as a queue source (see utils/queueSource). */
  queueSource: QueueSource;
};

/** Top of Playlist Detail (design screen 09): cover, name, summary, Play / Shuffle and "Add songs". */
export default function PlaylistHero({ playlist, songs, missingCount, queueSource }: PlaylistHeroProps) {
  const styles = useStyles();

  return (
    <View>
      <View style={styles.hero}>
        <PlaylistCover
          size={sizes.playlistCoverHero}
          iconSize={iconSizes.playlistHero}
          borderRadius={radius.lg}
          imageUri={playlist.coverUri}
        />
        <View style={styles.info}>
          <Text style={styles.label}>PLAYLIST</Text>
          <AppText style={styles.name} numberOfLines={2}>
            {playlist.name}
          </AppText>
          <Text style={styles.summary}>{getPlaylistSummary(songs)}</Text>
        </View>
      </View>
      {songs.length > 0 && <SongActions songs={songs} queueSource={queueSource} />}
      <PlaylistRow
        title="Add songs"
        height={sizes.songRow}
        cover={
          <PlaylistCover size={sizes.artworkRow} iconSize={iconSizes.tab} borderRadius={radius.sm} icon={Plus} />
        }
        onPress={() => router.push({ pathname: '/playlist/[id]/add-songs', params: { id: playlist.id } })}
      />
      {playlist.songs.length === 0 && (
        <Text style={styles.note}>{'No songs yet. Tap "Add songs" to add some.'}</Text>
      )}
      {missingCount > 0 && (
        <Text style={styles.note}>
          {missingCount === 1 ? '1 song is not on this phone' : `${missingCount} songs are not on this phone`}
        </Text>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontFamily: fonts.semiBold,
    letterSpacing: letterSpacing.label,
    color: colors.textSecondary,
  },
  name: {
    ...typography.heroTitle,
    color: colors.text,
  },
  summary: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  note: {
    ...typography.caption,
    color: colors.textTertiary,
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
  },
}));
