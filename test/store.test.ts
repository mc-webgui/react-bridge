import { describe, it, expect, vi, beforeEach } from 'vitest';
import { installWebgui, makeClient, emitClient } from './helpers';

// store.ts reads window.webgui.client and registers its event listener at
// import time, so each test imports it fresh via dynamic import after the
// desired window state is set up. setup.ts calls vi.resetModules() afterEach.
async function loadStore() {
  return import('../src/store');
}

describe('store', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('starts with a null snapshot when nothing was pre-injected', async () => {
    const store = await loadStore();
    expect(store.getSnapshot()).toBeNull();
  });

  it('captures a client value injected before import (SSR/pre-bootstrap)', async () => {
    const client = makeClient({ username: 'Alex' });
    installWebgui({ client });
    const store = await loadStore();
    expect(store.getSnapshot()).toEqual(client);
  });

  it('updates the snapshot when a webgui:client event fires', async () => {
    const store = await loadStore();
    const next = makeClient({ username: 'Notch' });
    emitClient(next);
    expect(store.getSnapshot()).toEqual(next);
  });

  it('notifies subscribers on change and stops after unsubscribe', async () => {
    const store = await loadStore();
    const listener = vi.fn();
    const unsub = store.subscribe(listener);

    emitClient(makeClient({ username: 'One' }));
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    emitClient(makeClient({ username: 'Two' }));
    expect(listener).toHaveBeenCalledTimes(1); // no further calls
  });

  it('getServerSnapshot always returns null (SSR-safe)', async () => {
    const store = await loadStore();
    expect(store.getServerSnapshot()).toBeNull();
  });
});
