// Arabic tashkeel (harakat, tanween, shadda, sukun...) and the small "dagger" alef.
const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;
// Tatweel: the stretching line, e.g. "مـحـمـد".
const TATWEEL = /\u0640/g;
// Latin accents after NFD splits them from their letter ("é" → "e" + "´").
const LATIN_ACCENTS = /[\u0300-\u036F]/g;

// أ إ آ
const ALEF_WITH_HAMZA = /[\u0623\u0625\u0622]/g;
// ة
const TEH_MARBUTA = /\u0629/g;
// ى
const ALEF_MAKSURA = /\u0649/g;

/**
 * Makes text easy to compare in search: lowercase, no accents, no Arabic diacritics,
 * and one form for letters that people type in different ways.
 *
 *   "Beyoncé"   → "beyonce"
 *   "أَحْمَد"    → "احمد"
 *   "مـدرسـة"   → "مدرسه"
 *   "مستشفى"   → "مستشفي"
 */
export function normalizeText(text: string): string {
  return (
    text
      // NFC joins letters that were typed as two code points, so the replacements below see "أ" as one letter.
      .normalize('NFC')
      .replace(ALEF_WITH_HAMZA, 'ا')
      .replace(TEH_MARBUTA, 'ه')
      .replace(ALEF_MAKSURA, 'ي')
      // NFD splits accents from their letter, so they can be removed.
      .normalize('NFD')
      .replace(LATIN_ACCENTS, '')
      .replace(ARABIC_DIACRITICS, '')
      .replace(TATWEEL, '')
      .toLowerCase()
      .trim()
  );
}
