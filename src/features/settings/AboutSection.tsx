import Constants from 'expo-constants';
import { Info } from 'lucide-react-native';
import { View } from 'react-native';

import SectionLabel from '@/components/SectionLabel';
import SettingsCard from '@/components/SettingsCard';
import SettingsRow from '@/components/SettingsRow';

// Name and version from app.json (the app config built into the app).
const APP_NAME = Constants.expoConfig?.name ?? 'Pitch Black';
const APP_VERSION = Constants.expoConfig?.version;

/** Settings: ABOUT section. The app name and version. */
export default function AboutSection() {
  return (
    <View>
      <SectionLabel label="About" />
      <SettingsCard>
        <SettingsRow icon={Info} title={APP_NAME} value={APP_VERSION ? `v${APP_VERSION}` : undefined} />
      </SettingsCard>
    </View>
  );
}
