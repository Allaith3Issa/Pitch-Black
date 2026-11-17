import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import Artwork from '@/components/Artwork';
import Checkbox from '@/components/Checkbox';
import { makeStyles, opacity, screenPadding, sizes, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';
import { formatDuration } from '@/utils/formatDuration';

type SelectableSongRowProps = {
  song: Song;
  checked: boolean;
  /** Already in the playlist: checked, dimmed and cannot be changed. */
  disabled: boolean;
  onPress: (songId: string) => void;
};

/** Song row with a checkbox (design screen 10, Add Songs). */
function SelectableSongRow({ song, checked, disabled, onPress }: SelectableSongRowProps) {
  const styles = useStyles();
  const duration = formatDuration(song.durationSec);

  return (
    <Pressable
      onPress={() => onPress(song.id)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={disabled ? `${song.title}, already in the playlist` : song.title}
      accessibilityState={{ checked, disabled }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Artwork size={sizes.artworkRow} />
      <View style={[styles.texts, disabled && styles.dimmed]}>
        <Text style={styles.title} numberOfLines={1}>
          {song.title}
        </Text>
        {/* Separate texts, so a mixed Arabic/English artist cannot move the duration (same as SongRow). */}
        <View style={styles.subtitleRow}>
          {song.artist !== null && (
            <Text style={[styles.subtitle, styles.artist]} numberOfLines={1}>
              {song.artist}
            </Text>
          )}
          <Text style={styles.subtitle}>{song.artist !== null ? ` • ${duration}` : duration}</Text>
        </View>
      </View>
      <Checkbox checked={checked} disabled={disabled} />
    </Pressable>
  );
}

export default memo(SelectableSongRow);

const useStyles = makeStyles(({ colors }) => ({
  row: {
    height: sizes.songRow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: screenPadding,
  },
  pressed: {
    opacity: 0.7,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  dimmed: {
    opacity: opacity.disabled,
  },
  title: {
    ...typography.body,
    color: colors.text,
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
