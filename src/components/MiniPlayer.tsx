import { Heart, Pause, Play, SkipForward } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import Artwork from '@/components/Artwork';
import IconButton from '@/components/IconButton';
import MiniPlayerProgress from '@/components/MiniPlayerProgress';
import { useCurrentSong } from '@/hooks/useCurrentSong';
import { usePlayerStore } from '@/store/playerStore';
import { colors, iconSizes, radius, sizes, spacing, typography } from '@/theme';

/**
 * Basic Mini Player (design screen 02), shown above the tab bar. Hidden when nothing is loaded.
 * The heart gets its action in Step 7; tapping the player opens Now Playing in Step 5.
 */
export default function MiniPlayer() {
  const song = useCurrentSong();
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);

  if (song === null) return null;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
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
        <IconButton icon={<Heart color={colors.text} size={iconSizes.md} />} accessibilityLabel="Add to favorites" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
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
  texts: {
    flex: 1,
    marginLeft: spacing.sm,
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
});
