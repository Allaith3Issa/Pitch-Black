import type { ReactNode } from 'react';
import { Text, type TextProps } from 'react-native';

import { withArabicFont } from '@/theme/withArabicFont';

/** The text inside `children` (strings and numbers, also in an array like `to {name}`). */
function toPlainText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(toPlainText).join('');
  return '';
}

/**
 * `Text` for song data (titles, artists, playlist names). Text with Arabic letters uses IBM Plex Sans
 * Arabic in the same weight; all other text renders exactly like `Text` with Inter.
 */
export default function AppText({ style, children, ...props }: TextProps) {
  return (
    <Text {...props} style={withArabicFont(toPlainText(children), style)}>
      {children}
    </Text>
  );
}
