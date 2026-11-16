import { create } from 'zustand';

type PlaybackProgressState = {
  positionSec: number;
  durationSec: number;
};

// Kept apart from playerStore on purpose: it changes 4 times a second, and only the
// progress line reads it, so the song list never re-renders because of it.
// Only playerStore writes here.
export const usePlaybackProgressStore = create<PlaybackProgressState>()(() => ({
  positionSec: 0,
  durationSec: 0,
}));
