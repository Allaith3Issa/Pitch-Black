/** An error ready to show on screen. */
export type AppError = {
  /** Friendly English text for the user. */
  message: string;
  /** The original error text. Only set in development builds (`__DEV__`), for debugging. */
  detail: string | null;
};
