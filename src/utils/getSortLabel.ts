import type { SortBy, SortOrder } from '@/types/sort';

/** Text for the sort chip, e.g. "Name · A–Z", "Date added · Newest" or "Most played · Most". */
export function getSortLabel(sortBy: SortBy, order: SortOrder): string {
  switch (sortBy) {
    case 'name':
      return order === 'asc' ? 'Name · A–Z' : 'Name · Z–A';
    case 'dateAdded':
      return order === 'asc' ? 'Date added · Oldest' : 'Date added · Newest';
    case 'mostPlayed':
      return order === 'asc' ? 'Most played · Least' : 'Most played · Most';
  }
}
