import { Text, View } from 'react-native';

import AppText from '@/components/AppText';
import { useSongFileDetails } from '@/hooks/useSongFileDetails';
import { makeStyles, sizes, spacing, typography } from '@/theme';
import type { Song } from '@/types/song';
import { buildSongInfoRows } from '@/utils/songInfo';

type SongInfoViewProps = {
  song: Song;
};

/** Song info (inside the song "⋯" sheet): tags from the library + file details from Android. */
export default function SongInfoView({ song }: SongInfoViewProps) {
  const styles = useStyles();
  const details = useSongFileDetails(song.id);
  const rows = buildSongInfoRows(song, details);

  return (
    <View>
      <Text style={styles.title}>Song info</Text>
      <View style={styles.divider} />
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          {/* Selectable, so a filename or folder can be copied. */}
          <AppText style={styles.value} selectable>
            {row.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  title: {
    ...typography.sheetTitle,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  divider: {
    height: sizes.hairline,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    width: sizes.infoLabel,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.text,
  },
}));
