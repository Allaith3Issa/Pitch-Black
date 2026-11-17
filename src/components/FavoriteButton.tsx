import { Heart } from 'lucide-react-native';

import IconButton from '@/components/IconButton';
import { useIsFavorite } from '@/hooks/useIsFavorite';
import { useTheme } from '@/hooks/useTheme';
import { useFavoritesStore } from '@/store/favoritesStore';
import { iconSizes } from '@/theme';
import type { Song } from '@/types/song';

type FavoriteButtonProps = {
  song: Song;
};

/** Heart button (Mini Player, Now Playing). Filled in the accent color when the song is a favorite. */
export default function FavoriteButton({ song }: FavoriteButtonProps) {
  const { colors } = useTheme();
  const isFavorite = useIsFavorite(song.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <IconButton
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityState={{ selected: isFavorite }}
      onPress={() => toggleFavorite(song)}
      icon={
        <Heart
          color={isFavorite ? colors.primaryText : colors.text}
          fill={isFavorite ? colors.primaryText : 'none'}
          size={iconSizes.md}
        />
      }
    />
  );
}
