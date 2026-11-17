import { useEffect, useState } from 'react';
import { Animated, type LayoutChangeEvent, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Artwork from '@/components/Artwork';
import SongActionsSheet from '@/components/SongActionsSheet';
import NowPlayingHeader from '@/features/player/NowPlayingHeader';
import NowPlayingTitle from '@/features/player/NowPlayingTitle';
import PlayerControls from '@/features/player/PlayerControls';
import SeekBar from '@/features/player/SeekBar';
import { useCurrentSong } from '@/hooks/useCurrentSong';
import { useNowPlayingSheet } from '@/hooks/useNowPlayingSheet';
import { usePlayerStore } from '@/store/playerStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { makeStyles, radius, sizes, spacing } from '@/theme';
import type { Song } from '@/types/song';
import { getQueueTitle } from '@/utils/queueSource';

/**
 * Now Playing (design screen 06). Reads the same stores as the Mini Player, so both always match.
 * Slides up when it opens; swipe down (or the chevron / back button) slides it down and closes it.
 */
export default function NowPlaying() {
  const styles = useStyles();
  const song = useCurrentSong();
  const queueSource = usePlayerStore((state) => state.queueSource);
  // Read live, so renaming the playing playlist shows the new name right away.
  const queueTitle = usePlaylistStore((state) => getQueueTitle(queueSource, state.playlists));
  const { translateY, panHandlers, close } = useNowPlayingSheet();
  // The artwork fills the space left above the title (296 like in Figma, smaller on small screens),
  // so the controls always fit without scrolling. 0 until the space is measured.
  const [artworkSize, setArtworkSize] = useState(0);
  // The song whose options are open ("⋯"), or `null`.
  const [optionsSong, setOptionsSong] = useState<Song | null>(null);

  const measureArtworkArea = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setArtworkSize(Math.floor(Math.min(sizes.artworkPlayer, width, height)));
  };

  // Nothing to show (e.g. the song was deleted and the library refreshed): close.
  useEffect(() => {
    if (song === null) close();
  }, [song, close]);

  return (
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]} {...panHandlers}>
      <SafeAreaView style={styles.sheet} edges={['top', 'bottom']}>
        {song !== null && (
          <>
            <NowPlayingHeader queueTitle={queueTitle} onClose={close} onMore={() => setOptionsSong(song)} />
            <View style={styles.content}>
              <View style={styles.artworkArea} onLayout={measureArtworkArea}>
                {artworkSize > 0 && <Artwork song={song} size={artworkSize} borderRadius={radius.xl} />}
              </View>
              <NowPlayingTitle song={song} />
              <SeekBar />
              <PlayerControls />
            </View>
          </>
        )}
      </SafeAreaView>
      <SongActionsSheet song={optionsSong} onClose={() => setOptionsSong(null)} />
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  sheet: {
    flex: 1,
    // The screen behind shows while it slides, so Now Playing has its own background.
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    // Side padding of the Now Playing content (Figma: 32).
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  artworkArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
