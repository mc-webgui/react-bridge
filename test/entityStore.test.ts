import { describe, it, expect, vi, beforeEach } from 'vitest';
import { installWebgui, makeEntity, emitEntity } from './helpers';

async function loadStore() {
  return import('../src/entityStore');
}

describe('entityStore', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('starts null when opened via command (no entity)', async () => {
    const store = await loadStore();
    expect(store.getSnapshot()).toBeNull();
  });

  it('captures an entity injected before import', async () => {
    const entity = makeEntity();
    installWebgui({ entity });
    const store = await loadStore();
    expect(store.getSnapshot()).toEqual(entity);
  });

  it('updates and notifies on webgui:entity events', async () => {
    const store = await loadStore();
    const listener = vi.fn();
    store.subscribe(listener);

    const entity = makeEntity({ name: 'Shopkeeper' });
    emitEntity(entity);

    expect(store.getSnapshot()).toEqual(entity);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('clears back to null when a null entity event fires', async () => {
    const store = await loadStore();
    emitEntity(makeEntity());
    expect(store.getSnapshot()).not.toBeNull();
    emitEntity(null);
    expect(store.getSnapshot()).toBeNull();
  });
});
