import { ChartNoAxesColumn, Ellipsis } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import Artwork from '@/components/Artwork';
import IconButton from '@/components/IconButton';
import PlayCount from '@/components/PlayCount';
import { useTheme } from '@/hooks/useTheme';
import { fonts, iconSizes, makeStyles, radius, screenPadding, sizes, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';
import { formatDuration } from '@/utils/formatDuration';

type SongRowProps = {
  song: Song;
  index: number;
  /** This song is loaded in the player (playing or paused): show the "Playing" state. */
  isCurrent: boolean;
  onPress: (index: number) => void;
  /** The "⋯" button: opens the song options. */
  onMore: (song: Song) => void;
};

function SongRow({ song, index, isCurrent, onPress, onMore }: SongRowProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const duration = formatDuration(song.durationSec);

  return (
    <Pressable
      onPress={() => onPress(index)}
      accessibilityRole="button"
      accessibilityLabel={isCurrent ? `${song.title}, now playing` : song.title}
      style={({ pressed }) => [styles.row, isCurrent && styles.rowCurrent, pressed && styles.pressed]}
    >
      <Artwork size={sizes.artworkRow} />
      <View style={styles.texts}>
        <Text style={[styles.title, isCurrent && styles.titleCurrent]} numberOfLines={1}>
          {song.title}
        </Text>
        {/* Artist, duration and play count are separate texts, so mixed Arabic/English artists cannot
            move them into the middle, and they stay visible when the artist is cut off. */}
        <View style={styles.subtitleRow}>
          {song.artist !== null && (
            <Text style={[styles.subtitle, styles.artist]} numberOfLines={1}>
              {song.artist}
            </Text>
          )}
          <Text style={styles.subtitle}>{song.artist !== null ? ` • ${duration}` : duration}</Text>
          <PlayCount songId={song.id} />
        </View>
      </View>
      {isCurrent && <ChartNoAxesColumn color={colors.primaryText} size={iconSizes.option} />}
      <IconButton
        icon={<Ellipsis color={colors.textSecondary} size={iconSizes.md} />}
        accessibilityLabel={`More options for ${song.title}`}
        onPress={() => onMore(song)}
      />
    </Pressable>
  );
}

export default memo(SongRow);

const useStyles = makeStyles(({ colors }) => ({
  row: {
    height: sizes.songRow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: screenPadding,
    paddingRight: spacing.xs,
  },
  rowCurrent: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
  },
  pressed: {
    opacity: 0.7,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  titleCurrent: {
    fontFamily: fonts.semiBold,
    color: colors.primaryText,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artist: {
    flexShrink: 1,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
}));
