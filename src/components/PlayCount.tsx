import { Play } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { usePlayCountStore } from '@/store/playCountStore';
import { iconSizes, makeStyles, spacing, typography } from '@/theme';

type PlayCountProps = {
  songId: string;
};

/**
 * " • ▶ 12" at the end of a SongRow subtitle. Hidden while the song was never played.
 * Reads only this song's count, so a new play re-renders only its own row.
 */
export default function PlayCount({ songId }: PlayCountProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const count = usePlayCountStore((state) => state.plays[songId]?.count ?? 0);

  if (count === 0) return null;

  return (
    <View style={styles.container} accessible accessibilityLabel={`Played ${count} times`}>
      <Text style={styles.separator}> • </Text>
      <Play color={colors.textTertiary} fill={colors.textTertiary} size={iconSizes.inline} />
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  // Never shrinks: the artist is cut off first.
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  separator: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  count: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
}));
