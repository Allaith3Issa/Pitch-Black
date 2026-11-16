import { describe, expect, it } from '@jest/globals';

import { ACCENTS, accentColors, baseColors } from '@/theme/palettes';
import { resolveTheme, resolveVariant } from '@/theme/resolveTheme';

describe('resolveVariant', () => {
  it('follows the phone in system mode', () => {
    expect(resolveVariant('system', 'dark')).toBe('oled');
    expect(resolveVariant('system', 'light')).toBe('light');
  });

  it('uses OLED in system mode when the phone setting is unknown', () => {
    expect(resolveVariant('system', null)).toBe('oled');
    expect(resolveVariant('system', undefined)).toBe('oled');
    expect(resolveVariant('system', 'unspecified')).toBe('oled');
  });

  it('ignores the phone when OLED or Light is chosen', () => {
    expect(resolveVariant('oled', 'light')).toBe('oled');
    expect(resolveVariant('light', 'dark')).toBe('light');
  });
});

describe('resolveTheme', () => {
  it('uses the OLED or Light base colors', () => {
    const oled = resolveTheme('oled', 'purple', 'light');
    expect(oled.isDark).toBe(true);
    expect(oled.colors.bg).toBe('#000000');
    expect(oled.colors.text).toBe('#FFFFFF');

    const light = resolveTheme('light', 'purple', 'dark');
    expect(light.isDark).toBe(false);
    expect(light.colors.bg).toBe('#FFFFFF');
    expect(light.colors.text).toBe('#0A0A0A');
    expect(light.colors.surface).toBe(baseColors.light.surface);
  });

  it('picks the right accent colors for every accent and theme', () => {
    for (const accent of ACCENTS) {
      for (const variant of ['oled', 'light'] as const) {
        const { colors } = resolveTheme(variant, accent, null);
        expect(colors.primary).toBe(accentColors[accent].primary);
        expect(colors.primarySoft).toBe(accentColors[accent].primarySoft[variant]);
        expect(colors.primaryText).toBe(accentColors[accent].primaryText[variant]);
      }
    }
  });

  it('matches the exact tokens from DESIGN.md (spot check)', () => {
    expect(resolveTheme('oled', 'blue', null).colors.primaryText).toBe('#93C5FD');
    expect(resolveTheme('light', 'green', null).colors.primarySoft).toBe('#D1FAE5');
    expect(resolveTheme('light', 'red', null).colors.primaryText).toBe('#B91C1C');
  });

  it('has 5 letter-cover colors per theme', () => {
    expect(resolveTheme('oled', 'purple', null).letterCovers).toHaveLength(5);
    expect(resolveTheme('light', 'purple', null).letterCovers[0]).toEqual({ bg: '#EDE9FE', fg: '#6D28D9' });
  });

  it('returns the same object for the same choice', () => {
    expect(resolveTheme('system', 'pink', 'dark')).toBe(resolveTheme('oled', 'pink', null));
    expect(resolveTheme('light', 'pink', null)).not.toBe(resolveTheme('oled', 'pink', null));
  });
});
