import type { SortBy, SortOrder } from '@/types/sort';

/** Text for the sort chip, e.g. "Name · A–Z" or "Date added · Newest". */
export function getSortLabel(sortBy: SortBy, order: SortOrder): string {
  if (sortBy === 'name') {
    return order === 'asc' ? 'Name · A–Z' : 'Name · Z–A';
  }
  return order === 'asc' ? 'Date added · Oldest' : 'Date added · Newest';
}
