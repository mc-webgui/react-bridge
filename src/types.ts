export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ServerInfo {
  address?: string;
  /** Ping in ms */
  ping?: number;
}

export type WebviewMode = 'GUI_SCREEN' | 'HUD_OVERLAY' | 'NONE';

export interface WebGUIClient {
  playerUuid: string;
  username: string;
  webviewMode: WebviewMode;
  /** Namespaced dimension key, e.g. "minecraft:overworld" */
  dimension: string;
  pos: Vec3;
  server?: ServerInfo;
}

export interface PostToGameLog {
  channel: 'log';
  level?: 'info' | 'warn' | 'error' | 'debug';
  message: string;
}

export interface PostToGameMessage {
  channel: string;
  [key: string]: unknown;
}

export type PostToGamePayload = PostToGameLog | PostToGameMessage | string;

/** The entity a player right-clicked to open the current GUI. Null when opened via command. */
export interface WebGUIEntity {
  /** Entity UUID */
  uuid: string;
  /** Namespaced entity type, e.g. "minecraft:villager" */
  type: string;
  /** Custom name if set, otherwise the entity type's display name */
  name: string;
  pos: Vec3;
}

export interface WebGUINamespace {
  client?: WebGUIClient;
  /** Set when the GUI was opened by interacting with an entity; null otherwise. */
  entity?: WebGUIEntity | null;
  postToGame: (payload: PostToGamePayload) => void;
  closeGui: () => void;
  /** Subscribe to a named event emitted by the server via {@code WebviewApi.emitToPage}. */
  on: (eventName: string, handler: (data: unknown) => void) => void;
  /** Unsubscribe a previously registered handler. */
  off: (eventName: string, handler: (data: unknown) => void) => void;
  onClientInfo?: (client: WebGUIClient) => void;
  /** @internal handler registry used by on/off */
  _hs?: Record<string, Array<{ f: (data: unknown) => void; w: EventListener }>>;
}

declare global {
  interface Window {
    /** Injected by the WebGUI mod. Undefined in a normal browser tab. */
    webgui?: WebGUINamespace;
  }

  interface WindowEventMap {
    'webgui:client': CustomEvent<WebGUIClient>;
    'webgui:entity': CustomEvent<WebGUIEntity | null>;
  }
}
