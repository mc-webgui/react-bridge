import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, getServerSnapshot } from '../entityStore';
import type { WebGUIEntity } from '../types';

/**
 * Returns the entity the player right-clicked to open this GUI,
 * or `null` if the GUI was opened via command rather than entity interaction.
 *
 * Re-renders whenever the entity context changes (e.g. when the player opens
 * another entity GUI without closing the first one).
 *
 * @example
 * export function ShopHeader() {
 *   const entity = useWebGUIEntity()
 *   if (!entity) return null
 *   return <h2>{entity.name}</h2>
 * }
 */
export function useWebGUIEntity(): WebGUIEntity | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
