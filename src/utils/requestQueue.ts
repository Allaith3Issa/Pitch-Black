/** Called once with the result. */
type Listener<T> = (value: T) => void;

export type RequestQueue<T> = {
  /** The result if it was already loaded, otherwise `undefined`. */
  peek: (key: string) => T | undefined;
  /**
   * Asks for `key`; `listener` gets the result when it is loaded.
   * Returns a cancel function: call it when the result is no longer needed (e.g. the row scrolled away).
   */
  request: (key: string, listener: Listener<T>) => () => void;
};

/**
 * Loads values by key with a few rules, for many requests from a fast-scrolling list:
 * - at most `maxRunning` loads at the same time
 * - the newest request goes first (the rows on screen now matter more than the ones that flew by)
 * - a request that nobody waits for anymore (all cancelled) is skipped before it starts
 * - a key is loaded only once: the result is kept, and requests for a key that is waiting or loading share it
 * If a load fails, nothing is kept, so a later request tries again.
 * `T` must not include `undefined` (`peek` uses it for "not loaded yet"); use `null` for "nothing".
 */
export function createRequestQueue<T>(load: (key: string) => Promise<T>, maxRunning: number): RequestQueue<T> {
  const results = new Map<string, T>();
  const listeners = new Map<string, Set<Listener<T>>>();
  // Keys waiting to start, the newest last.
  const waiting: string[] = [];
  const running = new Set<string>();

  function removeWaiting(key: string) {
    const index = waiting.indexOf(key);
    if (index !== -1) waiting.splice(index, 1);
  }

  function onLoaded(key: string, value: T) {
    running.delete(key);
    results.set(key, value);
    const keyListeners = listeners.get(key);
    listeners.delete(key);
    keyListeners?.forEach((listener) => listener(value));
    startNext();
  }

  function onFailed(key: string) {
    running.delete(key);
    listeners.delete(key);
    startNext();
  }

  function startNext() {
    while (running.size < maxRunning && waiting.length > 0) {
      const key = waiting.pop();
      if (key === undefined) return;
      running.add(key);
      load(key).then(
        (value) => onLoaded(key, value),
        () => onFailed(key),
      );
    }
  }

  return {
    peek: (key) => results.get(key),

    request: (key, listener) => {
      const loaded = results.get(key);
      if (loaded !== undefined) {
        listener(loaded);
        return () => undefined;
      }

      const keyListeners = listeners.get(key) ?? new Set<Listener<T>>();
      keyListeners.add(listener);
      listeners.set(key, keyListeners);
      if (!running.has(key)) {
        // Asked again while waiting: move it to the front of the line.
        removeWaiting(key);
        waiting.push(key);
        startNext();
      }

      return () => {
        keyListeners.delete(listener);
        // Only when this key's listeners are still this set: after a failed load, a newer request may
        // have started a new set, and cancelling an old request must not remove it.
        if (keyListeners.size === 0 && listeners.get(key) === keyListeners && !running.has(key)) {
          listeners.delete(key);
          removeWaiting(key);
        }
      };
    },
  };
}
