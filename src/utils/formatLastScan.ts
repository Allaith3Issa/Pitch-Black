import { MONTHS } from '@/utils/formatDate';

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * When the library was last scanned, in the phone's local time:
 * "today, 20:14", "yesterday, 09:03" or "12 Nov, 20:14".
 */
export function formatLastScan(scannedAtMs: number, nowMs: number): string {
  const scanned = new Date(scannedAtMs);
  const now = new Date(nowMs);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const time = `${String(scanned.getHours()).padStart(2, '0')}:${String(scanned.getMinutes()).padStart(2, '0')}`;

  if (isSameDay(scanned, now)) return `today, ${time}`;
  if (isSameDay(scanned, yesterday)) return `yesterday, ${time}`;
  return `${scanned.getDate()} ${MONTHS[scanned.getMonth()]}, ${time}`;
}
