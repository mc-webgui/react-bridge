import { useCallback } from 'react';
import { runCommand } from '../runCommand';

/**
 * Returns a stable {@link runCommand} callback.
 *
 * @example
 * const run = useRunCommand();
 * <button onClick={() => run('spawn')}>Teleport to spawn</button>
 */
export function useRunCommand(): (command: string) => void {
  return useCallback((command: string) => runCommand(command), []);
}
