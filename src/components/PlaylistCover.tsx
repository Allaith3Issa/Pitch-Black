import { Image } from 'expo-image';
import { ListMusic, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
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
  /** A cover chosen from the gallery. Shown instead of the icon. */
  imageUri?: string;
};

/** Square cover for playlists (the chosen image, or an icon) and the "create" / "add" tiles. */
export default function PlaylistCover({
  size,
  iconSize,
  borderRadius,
  icon: Icon = ListMusic,
  variant = 'default',
  imageUri,
}: PlaylistCoverProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  // A cover file that cannot be shown falls back to the icon.
  const [failedUri, setFailedUri] = useState<string | null>(null);

  if (imageUri && imageUri !== failedUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[styles.default, { width: size, height: size, borderRadius }]}
        contentFit="cover"
        onError={() => setFailedUri(imageUri)}
      />
    );
  }

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
