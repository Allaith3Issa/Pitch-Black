import { View } from 'react-native';

import AppText from '@/components/AppText';
import FavoriteButton from '@/components/FavoriteButton';
import { fonts, makeStyles, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';

type NowPlayingTitleProps = {
  song: Song;
};

/** Song title, artist and the heart on Now Playing. */
export default function NowPlayingTitle({ song }: NowPlayingTitleProps) {
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <AppText style={styles.title} numberOfLines={1}>
          {song.title}
        </AppText>
        <AppText style={styles.artist} numberOfLines={1}>
          {song.artist ?? 'Unknown artist'}
        </AppText>
      </View>
      <FavoriteButton song={song} />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.playerTitle,
    color: colors.text,
  },
  artist: {
    ...typography.itemTitle,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
}));
