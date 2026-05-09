import type { WebGUIClient } from './types';

type Listener = () => void;

let _client: WebGUIClient | null = null;
const _listeners = new Set<Listener>();

function notify() {
  _listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export function getSnapshot(): WebGUIClient | null {
  return _client;
}

export function getServerSnapshot(): null {
  return null;
}

if (typeof globalThis.window !== 'undefined') {
  // Capture value injected before React bootstrapped.
  _client = globalThis.window.webgui?.client ?? null;

  globalThis.window.addEventListener('webgui:client', (e) => {
    _client = (e as CustomEvent<WebGUIClient>).detail;
    notify();
  });
}
