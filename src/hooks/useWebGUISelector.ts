import { useRef } from 'react';
import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot as getClientSnapshot, getServerSnapshot } from '../store';
import type { WebGUIClient } from '../types';

export function useWebGUISelector<T>(
  selector: (client: WebGUIClient) => T,
  equalFn: (a: T, b: T) => boolean = Object.is,
): T | null {
  const prevRef = useRef<T | null>(null);

  function getSnapshot(): T | null {
    const c = getClientSnapshot();
    if (c === null) return null;
    const next = selector(c);
    if (prevRef.current !== null && equalFn(prevRef.current, next)) return prevRef.current;
    prevRef.current = next;
    return next;
  }

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot as () => T | null,
  );
}
