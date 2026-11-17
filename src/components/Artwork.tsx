import { Image } from 'expo-image';
import { useState } from 'react';

import LetterCover from '@/components/LetterCover';
import { useSongCover } from '@/hooks/useSongCover';
import { type CoverSize, peekSongCover } from '@/services/songCovers';
import { makeStyles, radius, sizes } from '@/theme';
import type { Song } from '@/types/song';

type ArtworkProps = {
  song: Song;
  /** Design sizes: 44, 48, 120, 296. */
  size: number;
  /** Corner radius. Default `radius.sm`; Now Playing uses `radius.xl`. */
  borderRadius?: number;
};

// Short fade when a cover appears.
const FADE_MS = 150;

/** The song's embedded cover, or a letter cover when it has none (or while it loads). */
export default function Artwork({ song, size, borderRadius = radius.sm }: ArtworkProps) {
  const styles = useStyles();
  // Rows and the Mini Player use the small cover; anything bigger than a row (Now Playing) the large one.
  const coverSize: CoverSize = size > sizes.artworkRow ? 'large' : 'small';
  const coverUri = useSongCover(song, coverSize);
  // While the large cover loads, the small one (usually known from the Mini Player) avoids a flash.
  const uri = coverUri ?? (coverSize === 'large' ? peekSongCover(song, 'small') : null);
  // A cover file that cannot be shown (e.g. Android cleared the cache): fall back to the letter cover.
  const [failedUri, setFailedUri] = useState<string | null>(null);

  if (!uri || uri === failedUri) {
    return <LetterCover songId={song.id} title={song.title} size={size} borderRadius={borderRadius} />;
  }
  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width: size, height: size, borderRadius }]}
      contentFit="cover"
      transition={FADE_MS}
      // Shows the right image right away when a row is reused for another song.
      recyclingKey={song.id}
      onError={() => setFailedUri(uri)}
    />
  );
}

const useStyles = makeStyles(({ colors }) => ({
  image: {
    backgroundColor: colors.surface2,
  },
}));
