import { FastForward, History, Timer } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import SectionLabel from '@/components/SectionLabel';
import SettingsCard from '@/components/SettingsCard';
import SettingsRow from '@/components/SettingsRow';
import Toggle from '@/components/Toggle';
import SkipBySheet from '@/features/settings/SkipBySheet';
import { useSettingsStore } from '@/store/settingsStore';

/** Settings: PLAYBACK section. Resume last song, skip buttons on/off and how far they jump. */
export default function PlaybackSection() {
  const resumeLastSong = useSettingsStore((state) => state.resumeLastSong);
  const skipButtonsEnabled = useSettingsStore((state) => state.skipButtonsEnabled);
  const skipSeconds = useSettingsStore((state) => state.skipSeconds);
  const setResumeLastSong = useSettingsStore((state) => state.setResumeLastSong);
  const setSkipButtonsEnabled = useSettingsStore((state) => state.setSkipButtonsEnabled);
  const [isSkipSheetOpen, setIsSkipSheetOpen] = useState(false);

  return (
    <View>
      <SectionLabel label="Playback" />
      <SettingsCard>
        <SettingsRow
          icon={History}
          title="Resume last song"
          subtitle="Continue where you left off"
          right={
            <Toggle value={resumeLastSong} onChange={setResumeLastSong} accessibilityLabel="Resume last song" />
          }
        />
        <SettingsRow
          icon={FastForward}
          title="Skip buttons"
          subtitle="Show skip back / forward on Now Playing"
          right={
            <Toggle value={skipButtonsEnabled} onChange={setSkipButtonsEnabled} accessibilityLabel="Skip buttons" />
          }
        />
        {/* Stays visible but dimmed while the skip buttons are off. */}
        <SettingsRow
          icon={Timer}
          title="Skip by"
          value={`${skipSeconds} seconds`}
          onPress={() => setIsSkipSheetOpen(true)}
          disabled={!skipButtonsEnabled}
        />
      </SettingsCard>
      <SkipBySheet visible={isSkipSheetOpen} onClose={() => setIsSkipSheetOpen(false)} />
    </View>
  );
}
