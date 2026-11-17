import { Image } from 'lucide-react-native';
import { View } from 'react-native';

import SectionLabel from '@/components/SectionLabel';
import SettingsCard from '@/components/SettingsCard';
import SettingsRow from '@/components/SettingsRow';
import Toggle from '@/components/Toggle';
import { useSettingsStore } from '@/store/settingsStore';

/** Settings: COVERS section. The setting is only saved for now; the cover search uses it in Step 6. */
export default function CoversSection() {
  const coversWifiOnly = useSettingsStore((state) => state.coversWifiOnly);
  const setCoversWifiOnly = useSettingsStore((state) => state.setCoversWifiOnly);

  return (
    <View>
      <SectionLabel label="Covers" />
      <SettingsCard>
        <SettingsRow
          icon={Image}
          title="Download covers on Wi-Fi only"
          subtitle="Searching for covers uses the internet"
          right={
            <Toggle
              value={coversWifiOnly}
              onChange={setCoversWifiOnly}
              accessibilityLabel="Download covers on Wi-Fi only"
            />
          }
        />
      </SettingsCard>
    </View>
  );
}
