import { describe, expect, it, jest } from '@jest/globals';

import { createRequestQueue } from '@/utils/requestQueue';

/** A load function whose promises the test resolves by hand. */
function manualLoad() {
  const pending = new Map<string, { resolve: (value: string) => void; reject: () => void }>();
  const started: string[] = [];
  const load = (key: string) =>
    new Promise<string>((resolve, reject) => {
      started.push(key);
      pending.set(key, { resolve, reject: () => reject(new Error('failed')) });
    });
  return { load, started, pending };
}

/** Lets the `.then` callbacks of resolved promises run. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('createRequestQueue', () => {
  it('runs at most maxRunning loads at the same time', () => {
    const { load, started } = manualLoad();
    const queue = createRequestQueue(load, 2);
    ['a', 'b', 'c', 'd'].forEach((key) => queue.request(key, () => undefined));
    expect(started).toHaveLength(2);
  });

  it('starts the newest waiting request first', async () => {
    const { load, started, pending } = manualLoad();
    const queue = createRequestQueue(load, 1);
    ['a', 'b', 'c', 'd'].forEach((key) => queue.request(key, () => undefined));
    pending.get('a')?.resolve('A');
    await flush();
    expect(started).toEqual(['a', 'd']);
  });

  it('gives the result to the listener and keeps it', async () => {
    const { load, pending } = manualLoad();
    const queue = createRequestQueue(load, 2);
    const listener = jest.fn();
    queue.request('a', listener);
    pending.get('a')?.resolve('A');
    await flush();
    expect(listener).toHaveBeenCalledWith('A');
    expect(queue.peek('a')).toBe('A');
  });

  it('never loads the same key twice', async () => {
    const { load, started, pending } = manualLoad();
    const queue = createRequestQueue(load, 2);
    const first = jest.fn();
    const second = jest.fn();
    queue.request('a', first);
    queue.request('a', second);
    pending.get('a')?.resolve('A');
    await flush();
    const third = jest.fn();
    queue.request('a', third);
    expect(started).toEqual(['a']);
    expect(first).toHaveBeenCalledWith('A');
    expect(second).toHaveBeenCalledWith('A');
    expect(third).toHaveBeenCalledWith('A');
  });

  it('skips a waiting request that was cancelled', async () => {
    const { load, started, pending } = manualLoad();
    const queue = createRequestQueue(load, 1);
    queue.request('a', () => undefined);
    const cancelB = queue.request('b', () => undefined);
    cancelB();
    pending.get('a')?.resolve('A');
    await flush();
    expect(started).toEqual(['a']);
  });

  it('still waits for a key while one of its listeners is left', async () => {
    const { load, started, pending } = manualLoad();
    const queue = createRequestQueue(load, 1);
    queue.request('a', () => undefined);
    const cancel = queue.request('b', () => undefined);
    queue.request('b', () => undefined);
    cancel();
    pending.get('a')?.resolve('A');
    await flush();
    expect(started).toEqual(['a', 'b']);
  });

  it('cancelling a request from before a failed load does not remove a newer request', async () => {
    const { load, started, pending } = manualLoad();
    const queue = createRequestQueue(load, 1);
    const cancelOld = queue.request('a', () => undefined);
    pending.get('a')?.reject();
    await flush();
    queue.request('b', () => undefined);
    const newer = jest.fn();
    queue.request('a', newer);
    cancelOld();
    pending.get('b')?.resolve('B');
    await flush();
    expect(started).toEqual(['a', 'b', 'a']);
  });

  it('keeps nothing after a failed load, so a later request tries again', async () => {
    const { load, started, pending } = manualLoad();
    const queue = createRequestQueue(load, 1);
    queue.request('a', () => undefined);
    pending.get('a')?.reject();
    await flush();
    expect(queue.peek('a')).toBeUndefined();
    queue.request('a', () => undefined);
    expect(started).toEqual(['a', 'a']);
  });
});
