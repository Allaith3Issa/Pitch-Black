import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import AppText from '@/components/AppText';
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
      <Artwork song={song} size={sizes.artworkRow} />
      <View style={[styles.texts, disabled && styles.dimmed]}>
        <AppText style={styles.title} numberOfLines={1}>
          {song.title}
        </AppText>
        {/* Separate texts, so a mixed Arabic/English artist cannot move the duration (same as SongRow). */}
        <View style={styles.subtitleRow}>
          {song.artist !== null && (
            <AppText style={[styles.subtitle, styles.artist]} numberOfLines={1}>
              {song.artist}
            </AppText>
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
    opacity: opacity.pressed,
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
