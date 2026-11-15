import { useLocalSearchParams } from 'expo-router';

import PlaceholderScreen from '@/components/PlaceholderScreen';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaceholderScreen title={`Playlist ${id}`} />;
}
