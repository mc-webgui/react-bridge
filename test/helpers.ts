import { vi } from 'vitest';
import type {
  WebGUIClient,
  WebGUIEntity,
  WebGUINamespace,
  PostToGamePayload,
} from '../src/types';

export function makeClient(overrides: Partial<WebGUIClient> = {}): WebGUIClient {
  return {
    playerUuid: '00000000-0000-0000-0000-000000000001',
    username: 'Steve',
    webviewMode: 'GUI_SCREEN',
    dimension: 'minecraft:overworld',
    pos: { x: 0, y: 64, z: 0 },
    look: { yaw: 0, pitch: 0 },
    health: 20,
    maxHealth: 20,
    food: 20,
    xpLevel: 0,
    gamemode: 'survival',
    ...overrides,
  };
}

export function makeEntity(overrides: Partial<WebGUIEntity> = {}): WebGUIEntity {
  return {
    uuid: '00000000-0000-0000-0000-0000000000ff',
    type: 'minecraft:villager',
    name: 'Librarian',
    pos: { x: 1, y: 65, z: 2 },
    ...overrides,
  };
}

/**
 * Installs a fake `window.webgui` namespace with spy-backed methods and
 * returns it. The postToGame/closeGui/on/off functions are vi.fn() spies.
 */
export function installWebgui(
  overrides: Partial<WebGUINamespace> = {},
): WebGUINamespace & {
  postToGame: ReturnType<typeof vi.fn>;
  closeGui: ReturnType<typeof vi.fn>;
} {
  const ns = {
    postToGame: vi.fn((_payload: PostToGamePayload) => {}),
    closeGui: vi.fn(() => {}),
    on: vi.fn(),
    off: vi.fn(),
    ...overrides,
  } as WebGUINamespace & {
    postToGame: ReturnType<typeof vi.fn>;
    closeGui: ReturnType<typeof vi.fn>;
  };
  (window as unknown as { webgui: WebGUINamespace }).webgui = ns;
  return ns;
}

/** Fires a `webgui:client` CustomEvent the way the mod's injected script does. */
export function emitClient(client: WebGUIClient | null): void {
  window.dispatchEvent(new CustomEvent('webgui:client', { detail: client }));
}

/** Fires a `webgui:entity` CustomEvent. */
export function emitEntity(entity: WebGUIEntity | null): void {
  window.dispatchEvent(new CustomEvent('webgui:entity', { detail: entity }));
}
