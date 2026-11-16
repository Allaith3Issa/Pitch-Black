import { Music } from 'lucide-react-native';
import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { makeStyles, radius } from '@/theme';

type ArtworkProps = {
  /** Design sizes: 44, 48, 120, 296. */
  size: number;
};

// The icon takes this share of the artwork size (as in Figma).
const ICON_RATIO = 0.42;

// Placeholder artwork: a square with a music icon (real album art comes later).
export default function Artwork({ size }: ArtworkProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Music color={colors.textTertiary} size={Math.round(size * ICON_RATIO)} />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
