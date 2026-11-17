import { Pause, Play, SkipForward } from 'lucide-react-native';
import { Animated, Pressable, Text, View } from 'react-native';

import Artwork from '@/components/Artwork';
import FavoriteButton from '@/components/FavoriteButton';
import IconButton from '@/components/IconButton';
import MiniPlayerProgress from '@/components/MiniPlayerProgress';
import { useCurrentSong } from '@/hooks/useCurrentSong';
import { useMiniPlayerGestures } from '@/hooks/useMiniPlayerGestures';
import { useTheme } from '@/hooks/useTheme';
import { usePlayerStore } from '@/store/playerStore';
import { iconSizes, makeStyles, radius, sizes, spacing, typography } from '@/theme';
import { openNowPlaying } from '@/utils/openNowPlaying';

/**
 * Mini Player (design screen 02), shown above the tab bar. Hidden when nothing is loaded.
 * Tap or swipe up = open Now Playing. Swipe left = next song, swipe right = previous song.
 */
export default function MiniPlayer() {
  const styles = useStyles();
  const { colors } = useTheme();
  const song = useCurrentSong();
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);
  const { translateX, panHandlers } = useMiniPlayerGestures();

  if (song === null) return null;

  return (
    <Animated.View style={[styles.card, { transform: [{ translateX }] }]} {...panHandlers}>
      <View style={styles.content}>
        <Pressable
          style={styles.openArea}
          onPress={openNowPlaying}
          accessibilityRole="button"
          accessibilityLabel={`Open Now Playing: ${song.title}`}
        >
          <Artwork size={sizes.artworkMini} />
          <View style={styles.texts}>
            <Text style={styles.title} numberOfLines={1}>
              {song.title}
            </Text>
            {song.artist !== null && (
              <Text style={styles.artist} numberOfLines={1}>
                {song.artist}
              </Text>
            )}
          </View>
        </Pressable>
        <FavoriteButton song={song} />
        <IconButton
          icon={<SkipForward color={colors.text} size={iconSizes.md} />}
          accessibilityLabel="Next song"
          onPress={next}
        />
        <IconButton
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          onPress={togglePlay}
          icon={
            <View style={styles.playCircle}>
              {isPlaying ? (
                <Pause color={colors.onPrimary} fill={colors.onPrimary} size={iconSizes.sm} />
              ) : (
                <Play color={colors.onPrimary} fill={colors.onPrimary} size={iconSizes.sm} />
              )}
            </View>
          }
        />
      </View>
      <MiniPlayerProgress />
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  card: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    // surface2 + a thin border, so the card stands out from the song rows behind it (OLED and Light).
    backgroundColor: colors.surface2,
    borderWidth: sizes.hairline,
    borderColor: colors.border,
    borderRadius: radius.miniPlayer,
    // Clips the progress line to the rounded corners.
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    paddingVertical: spacing.sm,
  },
  openArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  texts: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.miniPlayerTitle,
    color: colors.text,
  },
  artist: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  playCircle: {
    width: sizes.miniPlayButton,
    height: sizes.miniPlayButton,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
