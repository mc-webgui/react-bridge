/**
 * Runs a Minecraft command as the player, exactly as if they had typed it in chat.
 *
 * Only works when the page is served from an origin the server declared trusted
 * (`trustedCommandOrigins` in the mod's server config). From any other origin the mod
 * silently drops the request. Fire-and-forget: command feedback appears in the game, not here.
 *
 * @param command the command, with or without a leading slash (e.g. `"give @s minecraft:diamond 1"`)
 *
 * @example
 * runCommand('give @s minecraft:diamond 1');
 */
export function runCommand(command: string): void {
  if (typeof globalThis.window === 'undefined') return;
  globalThis.window.webgui?.postToGame({ channel: 'command', command });
}
