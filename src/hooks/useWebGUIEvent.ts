import { useEffect } from 'react';

/**
 * Listens for a named event emitted by the server via {@code WebviewApi.emitToPage}.
 *
 * @param eventName - the event name (without the "webgui:" prefix)
 * @param handler   - called with the event's {@code detail} payload each time the event fires
 *
 * @example
 * useWebGUIEvent<{ balance: number }>('walletUpdate', ({ balance }) => {
 *   setBalance(balance)
 * })
 */
export function useWebGUIEvent<T = unknown>(
  eventName: string,
  handler: (data: T) => void,
): void {
  useEffect(() => {
    const listener = (e: Event) => handler((e as CustomEvent<T>).detail);
    window.addEventListener(`webgui:${eventName}` as keyof WindowEventMap, listener as EventListener);
    return () => {
      window.removeEventListener(`webgui:${eventName}` as keyof WindowEventMap, listener as EventListener);
    };
  }, [eventName, handler]);
}
