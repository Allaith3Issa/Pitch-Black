import { View } from 'react-native';

import AppText from '@/components/AppText';
import { useTheme } from '@/hooks/useTheme';
import { fonts, makeStyles } from '@/theme';
import { getCoverColorIndex, getCoverLetter } from '@/utils/letterCover';

type LetterCoverProps = {
  songId: string;
  title: string;
  size: number;
  borderRadius: number;
};

// The letter takes this share of the cover size.
const LETTER_RATIO = 0.42;

/** Cover for a song without artwork: the first letter of the title on one of the 5 letter-cover colors. */
export default function LetterCover({ songId, title, size, borderRadius }: LetterCoverProps) {
  const styles = useStyles();
  const { letterCovers } = useTheme();
  const colors = letterCovers[getCoverColorIndex(songId, letterCovers.length)];

  return (
    <View style={[styles.box, { width: size, height: size, borderRadius, backgroundColor: colors.bg }]}>
      <AppText
        style={[styles.letter, { fontSize: Math.round(size * LETTER_RATIO), color: colors.fg }]}
        allowFontScaling={false}
      >
        {getCoverLetter(title)}
      </AppText>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: fonts.bold,
    includeFontPadding: false,
  },
}));
