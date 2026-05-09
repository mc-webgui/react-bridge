import { useCallback } from 'react';

export function useCloseGui(): () => void {
  return useCallback(() => {
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.webgui?.closeGui();
    }
  }, []);
}
