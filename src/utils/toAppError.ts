import type { AppError } from '@/types/error';

/** The `code` of an error from a native module (e.g. "ERR_MEDIA_STORE_QUERY"), if any. */
export function getErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return null;
}

/**
 * Builds an on-screen error: always the friendly `message`;
 * the original error text only in development, so release builds never show it.
 */
export function toAppError(message: string, error: unknown): AppError {
  const original =
    error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);
  return { message, detail: __DEV__ ? original : null };
}
