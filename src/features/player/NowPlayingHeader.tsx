import { ChevronDown, Ellipsis } from 'lucide-react-native';
import { Text, View } from 'react-native';

import AppText from '@/components/AppText';
import IconButton from '@/components/IconButton';
import { useTheme } from '@/hooks/useTheme';
import { fonts, iconSizes, letterSpacing, makeStyles, sizes, spacing, typography } from '@/theme';

type NowPlayingHeaderProps = {
  /** Where the queue comes from, e.g. "All songs". */
  queueTitle: string;
  onClose: () => void;
  /** Opens the song options (favorites, playlists, song info, share). */
  onMore: () => void;
};

/** Top bar of Now Playing: close, "NOW PLAYING / All songs", more options. */
export default function NowPlayingHeader({ queueTitle, onClose, onMore }: NowPlayingHeaderProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.bar}>
      <IconButton
        icon={<ChevronDown color={colors.text} size={iconSizes.md} />}
        accessibilityLabel="Close Now Playing"
        onPress={onClose}
      />
      <View style={styles.source}>
        <Text style={styles.label}>NOW PLAYING</Text>
        <AppText style={styles.queueTitle} numberOfLines={1}>
          {queueTitle}
        </AppText>
      </View>
      <IconButton
        icon={<Ellipsis color={colors.text} size={iconSizes.md} />}
        accessibilityLabel="More options"
        onPress={onMore}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  bar: {
    height: sizes.playerTopBar,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  source: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    ...typography.tabLabel,
    fontFamily: fonts.semiBold,
    letterSpacing: letterSpacing.label,
    color: colors.textSecondary,
  },
  queueTitle: {
    ...typography.bodySmall,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
}));
