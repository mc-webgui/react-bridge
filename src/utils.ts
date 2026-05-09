export function isInMod(): boolean {
  return typeof globalThis.window?.webgui !== 'undefined';
}

export function isReady(client: unknown): boolean {
  return client !== null && client !== undefined;
}
