// Arabic letters and marks: Arabic, Arabic Supplement, Arabic Extended-A and the two blocks of
// Arabic presentation forms.
const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/** `true` when the text contains at least one Arabic letter or mark. */
export function hasArabic(text: string): boolean {
  return ARABIC.test(text);
}
