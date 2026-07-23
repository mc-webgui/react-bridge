import { describe, it, expect } from 'vitest';
import { isInMod, isReady } from '../src/utils';
import { installWebgui, makeClient } from './helpers';

describe('isInMod', () => {
  it('is false in a normal browser tab (no window.webgui)', () => {
    expect(isInMod()).toBe(false);
  });

  it('is true once the mod injected window.webgui', () => {
    installWebgui();
    expect(isInMod()).toBe(true);
  });
});

describe('isReady', () => {
  it('is false for null and undefined', () => {
    expect(isReady(null)).toBe(false);
    expect(isReady(undefined)).toBe(false);
  });

  it('is true for an actual client object', () => {
    expect(isReady(makeClient())).toBe(true);
  });

  it('is true even for falsy-but-present values (0, "", false)', () => {
    expect(isReady(0)).toBe(true);
    expect(isReady('')).toBe(true);
    expect(isReady(false)).toBe(true);
  });
});
