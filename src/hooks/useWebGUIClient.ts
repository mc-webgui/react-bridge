import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, getServerSnapshot } from '../store';
import type { WebGUIClient } from '../types';

export function useWebGUIClient(): WebGUIClient | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
