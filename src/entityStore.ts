import type { WebGUIEntity } from './types';

type Listener = () => void;

let _entity: WebGUIEntity | null = null;
const _listeners = new Set<Listener>();

function notify() {
  _listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export function getSnapshot(): WebGUIEntity | null {
  return _entity;
}

export function getServerSnapshot(): null {
  return null;
}

if (typeof globalThis.window !== 'undefined') {
  _entity = globalThis.window.webgui?.entity ?? null;

  globalThis.window.addEventListener('webgui:entity', (e) => {
    _entity = (e as CustomEvent<WebGUIEntity | null>).detail;
    notify();
  });
}
