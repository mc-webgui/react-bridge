import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { makeClient, emitClient } from './helpers';

// Covers the player-stat fields the mod pushes on window.webgui.client:
// look, health, maxHealth, food, xpLevel, gamemode.
beforeEach(() => {
  vi.resetModules();
});

describe('client player-stat fields', () => {
  it('round-trips the new fields through the store snapshot', async () => {
    const store = await import('../src/store');
    const client = makeClient({
      look: { yaw: 90, pitch: -12.5 },
      health: 15.5,
      maxHealth: 20,
      food: 7,
      xpLevel: 30,
      gamemode: 'creative',
    });
    emitClient(client);

    const snap = store.getSnapshot();
    expect(snap).not.toBeNull();
    expect(snap!.look).toEqual({ yaw: 90, pitch: -12.5 });
    expect(snap!.health).toBe(15.5);
    expect(snap!.maxHealth).toBe(20);
    expect(snap!.food).toBe(7);
    expect(snap!.xpLevel).toBe(30);
    expect(snap!.gamemode).toBe('creative');
  });

  it('is selectable via useWebGUISelector (e.g. health ratio)', async () => {
    const { useWebGUISelector } = await import('../src/hooks/useWebGUISelector');
    const { result } = renderHook(() =>
      useWebGUISelector((c) => c.health / c.maxHealth),
    );
    expect(result.current).toBeNull();

    act(() => emitClient(makeClient({ health: 10, maxHealth: 20 })));
    expect(result.current).toBe(0.5);
  });

  it('allows gamemode to be absent (optional field)', async () => {
    const store = await import('../src/store');
    const { gamemode, ...noMode } = makeClient();
    void gamemode;
    emitClient(noMode as ReturnType<typeof makeClient>);
    expect(store.getSnapshot()!.gamemode).toBeUndefined();
  });
});
