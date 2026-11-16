import { Ellipsis } from 'lucide-react-native';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Artwork from '@/components/Artwork';
import IconButton from '@/components/IconButton';
import { colors, iconSizes, screenPadding, sizes, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';
import { formatDuration } from '@/utils/formatDuration';

type SongRowProps = {
  song: Song;
};

// Default state only. The "Playing" state comes in Step 4; the "⋯" button gets its action in Step 7.
function SongRow({ song }: SongRowProps) {
  const duration = formatDuration(song.durationSec);

  return (
    <View style={styles.row}>
      <Artwork size={sizes.artworkRow} />
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {song.title}
        </Text>
        {/* Artist and duration are separate texts, so mixed Arabic/English artists cannot move the
            duration into the middle, and the duration stays visible when the artist is cut off. */}
        <View style={styles.subtitleRow}>
          {song.artist !== null && (
            <Text style={[styles.subtitle, styles.artist]} numberOfLines={1}>
              {song.artist}
            </Text>
          )}
          <Text style={styles.subtitle}>{song.artist !== null ? ` • ${duration}` : duration}</Text>
        </View>
      </View>
      <IconButton
        icon={<Ellipsis color={colors.textSecondary} size={iconSizes.md} />}
        accessibilityLabel={`More options for ${song.title}`}
      />
    </View>
  );
}

export default memo(SongRow);

const styles = StyleSheet.create({
  row: {
    height: sizes.songRow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: screenPadding,
    paddingRight: spacing.xs,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  subtitleRow: {
    flexDirection: 'row',
  },
  artist: {
    flexShrink: 1,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
