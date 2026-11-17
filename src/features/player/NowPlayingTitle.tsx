import { Heart } from 'lucide-react-native';
import { Text, View } from 'react-native';

import IconButton from '@/components/IconButton';
import { useTheme } from '@/hooks/useTheme';
import { fonts, iconSizes, makeStyles, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';

type NowPlayingTitleProps = {
  song: Song;
};

/** Song title, artist and the heart on Now Playing. */
export default function NowPlayingTitle({ song }: NowPlayingTitleProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist ?? 'Unknown artist'}
        </Text>
      </View>
      {/* The heart gets its action in Step 7 (favorites). */}
      <IconButton icon={<Heart color={colors.text} size={iconSizes.md} />} accessibilityLabel="Add to favorites" />
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
