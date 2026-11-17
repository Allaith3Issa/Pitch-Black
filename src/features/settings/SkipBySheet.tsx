import BottomSheet from '@/components/BottomSheet';
import SectionLabel from '@/components/SectionLabel';
import SheetOption from '@/components/SheetOption';
import { useSettingsStore } from '@/store/settingsStore';
import { SKIP_SECONDS_OPTIONS, type SkipSeconds } from '@/utils/skip';

type SkipBySheetProps = {
  visible: boolean;
  onClose: () => void;
};

/** "Skip by" sheet (Figma 12c): how far the skip back / forward buttons jump. Closes after a choice. */
export default function SkipBySheet({ visible, onClose }: SkipBySheetProps) {
  const skipSeconds = useSettingsStore((state) => state.skipSeconds);
  const setSkipSeconds = useSettingsStore((state) => state.setSkipSeconds);

  const choose = (seconds: SkipSeconds) => {
    setSkipSeconds(seconds);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <SectionLabel label="Skip by" />
      {SKIP_SECONDS_OPTIONS.map((seconds) => (
        <SheetOption
          key={seconds}
          label={`${seconds} seconds`}
          selected={seconds === skipSeconds}
          onPress={() => choose(seconds)}
        />
      ))}
    </BottomSheet>
  );
}
