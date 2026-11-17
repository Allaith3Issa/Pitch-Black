import { describe, expect, it } from '@jest/globals';

import {
  getCountThresholdSec,
  type ListenState,
  pauseListen,
  startListen,
  trackListening,
} from '@/utils/listenTracker';

const SONG_SEC = 200;

/** Plays from `fromSec` to `toSec` with an update every 250 ms. Returns the state and how many counts. */
function play(state: ListenState, fromSec: number, toSec: number, startMs: number, durationSec = SONG_SEC) {
  let current = state;
  let counts = 0;
  let nowMs = startMs;
  for (let position = fromSec; position <= toSec + 1e-9; position += 0.25) {
    const result = trackListening(current, { positionSec: position, nowMs, isPlaying: true, durationSec });
    current = result.state;
    if (result.countNow) counts += 1;
    nowMs += 250;
  }
  return { state: current, counts, nowMs };
}

function pause(state: ListenState, positionSec: number, nowMs: number) {
  return trackListening(state, { positionSec, nowMs, isPlaying: false, durationSec: SONG_SEC }).state;
}

describe('getCountThresholdSec', () => {
  it('is 30 s for songs of 60 s and longer', () => {
    expect(getCountThresholdSec(200)).toBe(30);
    expect(getCountThresholdSec(60)).toBe(30);
  });

  it('is half of the song when it is shorter than 60 s', () => {
    expect(getCountThresholdSec(40)).toBe(20);
  });

  it('is 30 s when the length is unknown', () => {
    expect(getCountThresholdSec(0)).toBe(30);
  });
});

describe('trackListening', () => {
  it('counts once after 30 s of listening', () => {
    expect(play(startListen(), 0, 29.5, 0).counts).toBe(0);
    expect(play(startListen(), 0, 30.25, 0).counts).toBe(1);
  });

  it('counts only once per play-through, even when the whole song is played', () => {
    expect(play(startListen(), 0, SONG_SEC, 0).counts).toBe(1);
  });

  it('counts a short song after half of it', () => {
    expect(play(startListen(), 0, 19.5, 0, 40).counts).toBe(0);
    expect(play(startListen(), 0, 20.25, 0, 40).counts).toBe(1);
  });

  it('keeps the listened time over a pause and does not count twice', () => {
    const first = play(startListen(), 0, 20, 0);
    const paused = pause(first.state, 20, first.nowMs);
    // Resume one minute later.
    const second = play(paused, 20, 60, first.nowMs + 60_000);
    expect(first.counts + second.counts).toBe(1);
  });

  it('does not count time spent paused', () => {
    const first = play(startListen(), 0, 10, 0);
    const paused = pause(first.state, 10, first.nowMs);
    // 10 minutes later, still at 10 s, playing again for 10 s: only 20 s in total.
    const second = play(paused, 10, 20, first.nowMs + 600_000);
    expect(second.state.listenedSec).toBeLessThan(30);
    expect(second.counts).toBe(0);
  });

  it('does not count a seek forward as listening', () => {
    const first = play(startListen(), 0, 5, 0);
    // Jump from 5 s to 150 s, then listen for 10 s.
    const second = play(first.state, 150, 160, first.nowMs);
    expect(second.state.listenedSec).toBeLessThan(20);
    expect(second.counts).toBe(0);
  });

  it('does not count a seek made while paused', () => {
    const first = play(startListen(), 0, 5, 0);
    const paused = pause(first.state, 5, first.nowMs);
    // Seek to 150 s while paused, wait a minute, resume.
    const second = play(paused, 150, 155, first.nowMs + 60_000);
    expect(second.state.listenedSec).toBeLessThan(15);
  });

  it('many quick seeks forward never add more than the real playing time', () => {
    // Jump 5 s forward on every update (every 250 ms) for 10 s of real time.
    let state = startListen();
    let counts = 0;
    for (let step = 0; step <= 40; step += 1) {
      const result = trackListening(state, {
        positionSec: step * 5,
        nowMs: step * 250,
        isPlaying: true,
        durationSec: SONG_SEC,
      });
      state = result.state;
      if (result.countNow) counts += 1;
    }
    expect(state.listenedSec).toBeLessThanOrEqual(10.5);
    expect(counts).toBe(0);
  });

  it('a tap on pause forgets the position even without a "not playing" update', () => {
    const first = play(startListen(), 0, 5, 0);
    // Paused by a tap, seek to 150 s, resume a minute later; the player never sent "not playing".
    const second = play(pauseListen(first.state), 150, 155, first.nowMs + 60_000);
    expect(second.state.listenedSec).toBeLessThan(15);
  });

  it('adds nothing for a seek backward', () => {
    const first = play(startListen(), 0, 20, 0);
    const back = trackListening(first.state, {
      positionSec: 0,
      nowMs: first.nowMs,
      isPlaying: true,
      durationSec: SONG_SEC,
    });
    expect(back.state.listenedSec).toBe(first.state.listenedSec);
  });

  it('counts listening again after a seek backward', () => {
    // Listen 0→20 s, seek back to 0, listen 0→15 s: 35 s of real listening.
    const first = play(startListen(), 0, 20, 0);
    const second = play(first.state, 0, 15, first.nowMs);
    expect(first.counts + second.counts).toBe(1);
  });

  it('counts real time when updates come late (e.g. in the background)', () => {
    const start = trackListening(startListen(), { positionSec: 0, nowMs: 0, isPlaying: true, durationSec: SONG_SEC });
    const late = trackListening(start.state, { positionSec: 31, nowMs: 31_000, isPlaying: true, durationSec: SONG_SEC });
    expect(late.countNow).toBe(true);
  });

  it('a new play-through (restart, repeat-one) can count again', () => {
    const first = play(startListen(), 0, 40, 0);
    const second = play(startListen(), 0, 40, first.nowMs);
    expect(first.counts).toBe(1);
    expect(second.counts).toBe(1);
  });
});
