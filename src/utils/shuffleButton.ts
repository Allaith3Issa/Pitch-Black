/**
 * What the "Shuffle" button above a list does:
 * - shuffle is on and the queue comes from THIS list → 'turnOff' (like the shuffle icon on Now Playing)
 * - otherwise → 'shufflePlay': shuffle on and play this list from a random song
 */
export function getShuffleButtonAction(isShuffleOn: boolean, isThisListQueued: boolean): 'turnOff' | 'shufflePlay' {
  return isShuffleOn && isThisListQueued ? 'turnOff' : 'shufflePlay';
}
