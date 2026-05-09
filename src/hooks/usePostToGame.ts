import { useCallback } from 'react';
import type { PostToGamePayload } from '../types';

export function usePostToGame(): (payload: PostToGamePayload) => void {
  return useCallback((payload: PostToGamePayload) => {
    if (typeof globalThis.window === 'undefined') return;
    globalThis.window.webgui?.postToGame(payload);
  }, []);
}
