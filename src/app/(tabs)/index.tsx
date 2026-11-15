import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import PlaceholderScreen from '@/components/PlaceholderScreen';
import { colors, typography } from '@/theme';

export default function SongsScreen() {
  return (
    <PlaceholderScreen title="Songs">
      {/* TEMP (Step 1): test links to check the root stack. Remove when real screens exist. */}
      <Link href="/player" style={styles.link}>
        Open Player (modal)
      </Link>
      <Link href="/playlist/1" style={styles.link}>
        Open Playlist 1
      </Link>
    </PlaceholderScreen>
  );
}

// TEMP (Step 1): style for the test links above.
const styles = StyleSheet.create({
  link: {
    ...typography.body,
    color: colors.primaryText,
  },
});
