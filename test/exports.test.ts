import { describe, it, expect } from 'vitest';
import * as shim from '../src/index';

/**
 * This package is a one-line re-export now, so the only thing that can break is the
 * re-export itself: a wrong subpath or a name dropped upstream would leave importers
 * with undefined at runtime and nothing at build time to say so.
 */
const PUBLIC_API = [
  'isInMod',
  'isReady',
  'runCommand',
  'postToGame',
  'closeGui',
  'respawn',
  'useWebGUIClient',
  'useWebGUIEntity',
  'useWebGUISelector',
  'usePostToGame',
  'useCloseGui',
  'useRunCommand',
  'useWebGUIToken',
  'useWebGUIEvent',
];

describe('@webgui/client/react re-export', () => {
  it.each(PUBLIC_API)('still exports %s', (name) => {
    expect(shim[name as keyof typeof shim]).toBeDefined();
  });
});
