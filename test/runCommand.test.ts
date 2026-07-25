import { describe, it, expect, beforeEach } from 'vitest';
import { installWebgui } from './helpers';
import { runCommand } from '../src/runCommand';

describe('runCommand', () => {
  beforeEach(() => {
    delete (window as unknown as { webgui?: unknown }).webgui;
  });

  it('posts the command on the command channel', () => {
    const ns = installWebgui();
    runCommand('give @s minecraft:diamond 1');

    expect(ns.postToGame).toHaveBeenCalledTimes(1);
    expect(ns.postToGame.mock.calls[0][0]).toEqual({
      channel: 'command',
      command: 'give @s minecraft:diamond 1',
    });
  });

  it('is a no-op when not running in the mod', () => {
    expect(() => runCommand('spawn')).not.toThrow();
  });
});
