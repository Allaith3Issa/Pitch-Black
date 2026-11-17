/**
 * Returns a shuffled copy of `ids`. When `firstId` is in the list it goes first (the song that is
 * playing, or the song that was tapped), and only the other songs are mixed.
 * `random` returns a number in [0, 1); tests pass their own to get a fixed order.
 */
export function shuffleIds(ids: string[], firstId: string | null, random: () => number = Math.random): string[] {
  const hasFirst = firstId !== null && ids.includes(firstId);
  const rest = hasFirst ? ids.filter((id) => id !== firstId) : [...ids];

  // Fisher–Yates: every order is equally likely.
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  return hasFirst ? [firstId, ...rest] : rest;
}

/**
 * A new mixed order for the next round (repeat 'all' with shuffle on, after the last song).
 * The song that just played goes last, so it is not heard twice in a row.
 */
export function shuffleNewRound(ids: string[], lastId: string, random: () => number = Math.random): string[] {
  if (!ids.includes(lastId)) return shuffleIds(ids, null, random);
  return [...shuffleIds(ids.filter((id) => id !== lastId), null, random), lastId];
}

/** A random index in a list of `length` items (`length` > 0). */
export function randomIndex(length: number, random: () => number = Math.random): number {
  return Math.floor(random() * length);
}
