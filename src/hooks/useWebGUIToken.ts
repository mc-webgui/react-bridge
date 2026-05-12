import { useSyncExternalStore } from 'react';

// Token is static for the page lifetime — subscribe is a no-op.
const NOOP_SUBSCRIBE = () => () => {};

/**
 * Returns the signed token the mod appended to the current page URL, or `null`
 * when the token is absent (tokens disabled on the server, or normal browser tab).
 *
 * The token is static for the page lifetime — it does not change between renders.
 * Pass it to your backend for verification.
 *
 * Uses `useSyncExternalStore` so SSR always returns `null` without hydration
 * mismatches.
 *
 * @param paramName  Query parameter name configured via `queryParamName` in
 *                   `server.json` (default: `"webgui_token"`).
 */
export function useWebGUIToken(paramName = 'webgui_token'): string | null {
  return useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => new URLSearchParams(globalThis.window.location.search).get(paramName) ?? null,
    () => null,
  );
}
