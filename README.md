# @webgui/react

> **Requires the [WebGUI Minecraft mod](https://modrinth.com/mod/webgui)** ([GitHub](https://github.com/mc-webgui/webgui)) to be installed on the client. This library has no effect outside of the mod.

React hooks and TypeScript types for SPAs running inside the **WebGUI** Minecraft mod (free edition).

WebGUI embeds a Chromium browser (via [MCEF](https://github.com/CinemaMod/mcef)) in-game and injects `window.webgui` into every page. This library wraps that API in React-idiomatic hooks built on `useSyncExternalStore` — concurrent-mode safe, no Provider required.

---

## Installation

```bash
npm install @webgui/react
# or
pnpm add @webgui/react
```

Requires **React 18+** as a peer dependency.

---

## Quick start

```tsx
import { useWebGUIClient, isInMod, isReady } from '@webgui/react';

export function PlayerInfo() {
  const client = useWebGUIClient();

  if (!isInMod()) return <p>Open this page inside Minecraft.</p>;
  if (!isReady(client)) return <p>Waiting for mod data…</p>;

  return <p>Hello, {client!.username}</p>;
}
```

---

## Available data

The mod pushes a client snapshot at **20 TPS** (once per client tick):

```ts
interface WebGUIClient {
  playerUuid:  string;        // player UUID in the world
  username:    string;        // display name
  webviewMode: 'GUI_SCREEN' | 'HUD_OVERLAY' | 'NONE';
  dimension:   string;        // e.g. "minecraft:overworld"
  pos:         { x: number; y: number; z: number };
  server?: {
    address?: string;         // server address
    ping?:    number;         // ping in ms
  };
}
```

---

## Hooks

### `useWebGUIClient(): WebGUIClient | null`

Returns the latest client snapshot. `null` before the first push or outside the mod.

```tsx
const client = useWebGUIClient();
if (!client) return null;
return <div>{client.username} — {client.dimension}</div>;
```

### `useWebGUISelector<T>(selector, equalFn?): T | null`

Derives a value from the snapshot and re-renders **only when that value changes**. Useful to avoid unnecessary re-renders on 20 TPS updates.

```tsx
// Re-renders only when username changes
const username = useWebGUISelector(c => c.username);

// Custom equality for objects
const pos = useWebGUISelector(
  c => c.pos,
  (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
);
```

### `usePostToGame(): (payload: PostToGamePayload) => void`

Stable callback that sends a message from the page to the game via the mod's CEF message router. No-op outside the mod.

```tsx
const post = usePostToGame();

// Log to the Minecraft console
post({ channel: 'log', level: 'info', message: 'UI opened' });

// Custom channel
post({ channel: 'shop:buy', itemId: 'minecraft:diamond', qty: 1 });
```

### `useCloseGui(): () => void`

Stable callback that closes the active GUI screen or HUD overlay from inside the SPA.

```tsx
const close = useCloseGui();
<button onClick={close}>✕ Close</button>
```

---

## Utils

Plain functions — usable outside React, in conditions, in tests.

### `isInMod(): boolean`

`true` when `window.webgui` is present. Does not re-render — the mod either injected it before React started or it didn't.

### `isReady(client): boolean`

`true` once the mod has pushed at least one client snapshot (`client !== null`).

```tsx
const client = useWebGUIClient();
if (!isReady(client)) return <Spinner />;
```

---

## TypeScript

All types are exported from the package root:

```ts
import type {
  WebGUIClient,
  WebGUINamespace,
  WebviewMode,
  PostToGamePayload,
  Vec3,
  ServerInfo,
} from '@webgui/react';
```

The package ships a **global augmentation** for `window.webgui` and the `webgui:client` CustomEvent. To use `window.webgui` directly outside of hooks, add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@webgui/react"]
  }
}
```

---

## Server-side rendering

All hooks return `null` on the server. `isInMod()` returns `false`. No special setup required.

---

## License

MIT
