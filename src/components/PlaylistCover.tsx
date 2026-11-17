import { ListMusic, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { makeStyles, sizes } from '@/theme';

type PlaylistCoverProps = {
  /** Square size (Figma: 48 / 56 / 120). */
  size: number;
  iconSize: number;
  borderRadius: number;
  /** Default: the playlist icon. "Create playlist", "New playlist" and "Add songs" use a plus. */
  icon?: LucideIcon;
  /**
   * - `default`: gray square
   * - `accent`: accent square, white icon ("New playlist" in the Add to playlist sheet)
   * - `dashed`: dashed outline ("Create playlist" tile on the Playlists tab)
   */
  variant?: 'default' | 'accent' | 'dashed';
};

/** Square cover with an icon, for playlists and the "create" / "add" tiles. */
export default function PlaylistCover({
  size,
  iconSize,
  borderRadius,
  icon: Icon = ListMusic,
  variant = 'default',
}: PlaylistCoverProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={[styles.cover, styles[variant], { width: size, height: size, borderRadius }]}>
      <Icon color={variant === 'accent' ? colors.onPrimary : colors.textSecondary} size={iconSize} />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  cover: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: colors.surface2,
  },
  accent: {
    backgroundColor: colors.primary,
  },
  dashed: {
    borderWidth: sizes.dashedOutline,
    borderStyle: 'dashed',
    borderColor: colors.textTertiary,
  },
}));
