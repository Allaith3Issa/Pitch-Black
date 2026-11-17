import { router } from 'expo-router';

/** Opens Now Playing (`navigate` does not open it twice after a quick double tap). */
export function openNowPlaying(): void {
  router.navigate('/player');
}
