// Formatters for the Song info sheet.

const KB = 1024;
const MB = KB * 1024;

/** "4.2 MB", "820 KB". */
export function formatFileSize(bytes: number): string {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / KB))} KB`;
}

/** Bits per second → "320 kbps". */
export function formatBitrate(bitsPerSecond: number): string {
  return `${Math.round(bitsPerSecond / 1000)} kbps`;
}

// MIME types whose short name is not simply the part after "audio/".
const FORMAT_NAMES: Record<string, string> = {
  'audio/mpeg': 'MP3',
  'audio/mp4': 'M4A',
  'audio/x-m4a': 'M4A',
  'audio/aac': 'AAC',
  'audio/x-wav': 'WAV',
  'audio/wav': 'WAV',
  'audio/flac': 'FLAC',
  'audio/x-flac': 'FLAC',
  'audio/ogg': 'OGG',
  'audio/opus': 'OPUS',
  'audio/amr': 'AMR',
  'audio/x-ms-wma': 'WMA',
};

/**
 * A short format name: from the MIME type ("audio/mpeg" → "MP3"), otherwise from the file extension,
 * or `null` when neither says anything.
 */
export function formatAudioFormat(mimeType: string | null, filename: string): string | null {
  const known = mimeType ? FORMAT_NAMES[mimeType.toLowerCase()] : undefined;
  if (known) return known;
  const dot = filename.lastIndexOf('.');
  if (dot > 0 && dot < filename.length - 1) return filename.slice(dot + 1).toUpperCase();
  return null;
}
