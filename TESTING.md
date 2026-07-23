# Testing

Unit tests for the `@webgui/react` library, run with
[Vitest](https://vitest.dev) in a jsdom environment.

```bash
npm test          # run once
npm run test:watch
```

## What's covered (`test/`)

| File | Covers |
|------|--------|
| `utils.test.ts` | `isInMod`, `isReady` |
| `store.test.ts` | Client store: pre-injected value, `webgui:client` events, subscribe/unsubscribe |
| `entityStore.test.ts` | Entity store: injection, `webgui:entity` events, clearing to `null` |
| `hooks.test.tsx` | All hooks — `useWebGUIClient`, `useWebGUIEntity`, `useWebGUISelector` (incl. memoization + custom `equalFn`), `usePostToGame`, `useCloseGui`, `useWebGUIToken`, `useWebGUIEvent` |

`test/helpers.ts` provides `installWebgui()` (a spy-backed fake `window.webgui`)
and event emitters that mimic the mod's injected runtime, so the hooks are
exercised exactly as they would be inside Minecraft.

CI runs `npm test` in `.github/workflows/ci.yml`.
