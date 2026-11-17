import { useEffect, useState } from 'react';

/** The current time (ms), updated every `intervalMs`. For texts like "today, 20:14". */
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
