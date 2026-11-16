import { type AudioStatus, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Everything that talks to expo-audio lives in this file. No UI and no store code here.

/** How often the player reports its position (ms): 4 times a second. */
const STATUS_INTERVAL_MS = 250;

// ONE player for the whole app. It is created once, outside React, and never released.
const player = createAudioPlayer(null, { updateInterval: STATUS_INTERVAL_MS });

export type PlayerStatus = AudioStatus;

/**
 * Sets how the app's audio behaves. Call once on app start.
 * - Plays even when the phone is on silent / vibrate.
 * - 'doNotMixPersistent' asks Android for full audio focus: other music apps stop, and when another
 *   app (or a phone call) takes the focus, expo-audio pauses our player by itself.
 * expo-audio also pauses by itself when headphones are unplugged.
 */
export async function configureAudio(): Promise<void> {
  await setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'doNotMixPersistent',
  });
}

/** Loads a new song. It does not start playing: call play() after it. */
export function load(uri: string): void {
  player.replace({ uri });
}

export function play(): void {
  player.play();
}

export function pause(): void {
  player.pause();
}

export async function seekTo(seconds: number): Promise<void> {
  await player.seekTo(seconds);
}

/** Calls `listener` on every status update. Returns a function that stops listening. */
export function onStatus(listener: (status: PlayerStatus) => void): () => void {
  const subscription = player.addListener('playbackStatusUpdate', listener);
  return () => subscription.remove();
}
