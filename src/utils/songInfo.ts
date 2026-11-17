import type { Song, SongFileDetails } from '@/types/song';
import { formatAudioFormat, formatBitrate, formatFileSize } from '@/utils/fileInfo';
import { formatDate } from '@/utils/formatDate';
import { formatDuration } from '@/utils/formatDuration';

export type SongInfoRow = {
  label: string;
  value: string;
};

/** Shown when a value is unknown. */
export const UNKNOWN_VALUE = '—';

/** Shown for the file details while they load. */
export const LOADING_VALUE = '…';

/**
 * The rows of the Song info sheet, in order.
 * `details`: `undefined` while loading, `null` when they could not be read.
 */
export function buildSongInfoRows(song: Song, details: SongFileDetails | null | undefined): SongInfoRow[] {
  const fileValue = (value: string | null | undefined): string =>
    details === undefined ? LOADING_VALUE : (value ?? UNKNOWN_VALUE);

  return [
    { label: 'Title', value: song.title },
    { label: 'Artist', value: song.artist ?? UNKNOWN_VALUE },
    { label: 'Album', value: song.album ?? UNKNOWN_VALUE },
    { label: 'Duration', value: formatDuration(song.durationSec) },
    { label: 'Filename', value: song.filename || UNKNOWN_VALUE },
    { label: 'Folder', value: fileValue(details?.folder || null) },
    { label: 'Size', value: fileValue(details?.sizeBytes ? formatFileSize(details.sizeBytes) : null) },
    { label: 'Format', value: fileValue(details ? formatAudioFormat(details.mimeType, song.filename) : null) },
    { label: 'Bitrate', value: fileValue(details?.bitrate ? formatBitrate(details.bitrate) : null) },
    { label: 'Date added', value: song.dateAdded > 0 ? formatDate(song.dateAdded) : UNKNOWN_VALUE },
  ];
}
