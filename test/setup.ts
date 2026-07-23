import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { WebGUINamespace } from '../src/types';

// Reset the DOM/global state and the module registry between tests so the
// store modules (which read window.webgui at import time) start clean.
afterEach(() => {
  cleanup();
  delete (window as unknown as { webgui?: WebGUINamespace }).webgui;
  vi.resetModules();
});
