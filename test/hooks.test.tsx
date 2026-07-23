import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  installWebgui,
  makeClient,
  makeEntity,
  emitClient,
  emitEntity,
} from './helpers';

// The store-backed hooks share a module-level singleton, so import them
// freshly per test (after vi.resetModules) to isolate state.
beforeEach(() => {
  vi.resetModules();
});

describe('useWebGUIClient', () => {
  it('returns null before any client, then the client after an event', async () => {
    const { useWebGUIClient } = await import('../src/hooks/useWebGUIClient');
    const { result } = renderHook(() => useWebGUIClient());
    expect(result.current).toBeNull();

    const client = makeClient({ username: 'Alex' });
    act(() => emitClient(client));
    expect(result.current).toEqual(client);
  });
});

describe('useWebGUIEntity', () => {
  it('tracks the interacted entity and clears to null', async () => {
    const { useWebGUIEntity } = await import('../src/hooks/useWebGUIEntity');
    const { result } = renderHook(() => useWebGUIEntity());
    expect(result.current).toBeNull();

    const entity = makeEntity();
    act(() => emitEntity(entity));
    expect(result.current).toEqual(entity);

    act(() => emitEntity(null));
    expect(result.current).toBeNull();
  });
});

describe('useWebGUISelector', () => {
  it('selects a slice of the client and returns null before ready', async () => {
    const { useWebGUISelector } = await import('../src/hooks/useWebGUISelector');
    const { result } = renderHook(() =>
      useWebGUISelector((c) => c.username),
    );
    expect(result.current).toBeNull();

    act(() => emitClient(makeClient({ username: 'Herobrine' })));
    expect(result.current).toBe('Herobrine');
  });

  it('keeps a stable reference when the selected value is equal (Object.is)', async () => {
    const { useWebGUISelector } = await import('../src/hooks/useWebGUISelector');
    const { result } = renderHook(() => useWebGUISelector((c) => c.pos));

    const pos = { x: 1, y: 2, z: 3 };
    act(() => emitClient(makeClient({ pos })));
    const first = result.current;

    // A new client with a different pos object but equal contents; without a
    // custom equalFn the reference changes only when the selected object changes.
    act(() => emitClient(makeClient({ pos })));
    expect(result.current).toBe(first); // same object reference reused
  });

  it('respects a custom equalFn to dedupe structurally-equal values', async () => {
    const { useWebGUISelector } = await import('../src/hooks/useWebGUISelector');
    const eq = (a: { x: number }, b: { x: number }) => a.x === b.x;
    const { result } = renderHook(() =>
      useWebGUISelector((c) => ({ x: c.pos.x }), eq),
    );

    act(() => emitClient(makeClient({ pos: { x: 5, y: 0, z: 0 } })));
    const first = result.current;
    act(() => emitClient(makeClient({ pos: { x: 5, y: 99, z: 99 } })));
    expect(result.current).toBe(first); // x unchanged → same reference
  });
});

describe('usePostToGame', () => {
  it('forwards the payload to window.webgui.postToGame', async () => {
    const ns = installWebgui();
    const { usePostToGame } = await import('../src/hooks/usePostToGame');
    const { result } = renderHook(() => usePostToGame());

    const payload = { channel: 'log' as const, message: 'hi' };
    act(() => result.current(payload));
    expect(ns.postToGame).toHaveBeenCalledWith(payload);
  });

  it('is a no-op (no throw) when not running inside the mod', async () => {
    const { usePostToGame } = await import('../src/hooks/usePostToGame');
    const { result } = renderHook(() => usePostToGame());
    expect(() => result.current('noop')).not.toThrow();
  });
});

describe('useCloseGui', () => {
  it('calls window.webgui.closeGui', async () => {
    const ns = installWebgui();
    const { useCloseGui } = await import('../src/hooks/useCloseGui');
    const { result } = renderHook(() => useCloseGui());

    act(() => result.current());
    expect(ns.closeGui).toHaveBeenCalledTimes(1);
  });

  it('does not throw outside the mod', async () => {
    const { useCloseGui } = await import('../src/hooks/useCloseGui');
    const { result } = renderHook(() => useCloseGui());
    expect(() => result.current()).not.toThrow();
  });
});

describe('useWebGUIToken', () => {
  it('returns the token from the URL query string', async () => {
    window.history.replaceState({}, '', '/?webgui_token=abc.def');
    const { useWebGUIToken } = await import('../src/hooks/useWebGUIToken');
    const { result } = renderHook(() => useWebGUIToken());
    expect(result.current).toBe('abc.def');
  });

  it('returns null when the param is absent', async () => {
    window.history.replaceState({}, '', '/?other=1');
    const { useWebGUIToken } = await import('../src/hooks/useWebGUIToken');
    const { result } = renderHook(() => useWebGUIToken());
    expect(result.current).toBeNull();
  });

  it('honours a custom param name', async () => {
    window.history.replaceState({}, '', '/?custom_tok=xyz');
    const { useWebGUIToken } = await import('../src/hooks/useWebGUIToken');
    const { result } = renderHook(() => useWebGUIToken('custom_tok'));
    expect(result.current).toBe('xyz');
  });
});

describe('useWebGUIEvent', () => {
  it('invokes the handler with event detail and cleans up on unmount', async () => {
    const { useWebGUIEvent } = await import('../src/hooks/useWebGUIEvent');
    const handler = vi.fn();
    const { unmount } = renderHook(() =>
      useWebGUIEvent<{ balance: number }>('walletUpdate', handler),
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent('webgui:walletUpdate', { detail: { balance: 42 } }),
      );
    });
    expect(handler).toHaveBeenCalledWith({ balance: 42 });

    unmount();
    act(() => {
      window.dispatchEvent(
        new CustomEvent('webgui:walletUpdate', { detail: { balance: 99 } }),
      );
    });
    expect(handler).toHaveBeenCalledTimes(1); // no call after unmount
  });
});
