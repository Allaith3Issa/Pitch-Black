import { Ellipsis } from 'lucide-react-native';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Artwork from '@/components/Artwork';
import IconButton from '@/components/IconButton';
import { colors, iconSizes, screenPadding, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';
import { formatDuration } from '@/utils/formatDuration';

type SongRowProps = {
  song: Song;
};

export const SONG_ROW_HEIGHT = 64;

// Default state only. The "Playing" state comes in Step 4; the "⋯" button gets its action in Step 7.
function SongRow({ song }: SongRowProps) {
  const duration = formatDuration(song.durationSec);
  const subtitle = song.artist ? `${song.artist} • ${duration}` : duration;

  return (
    <View style={styles.row}>
      <Artwork size={48} />
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
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
    height: SONG_ROW_HEIGHT,
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
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
