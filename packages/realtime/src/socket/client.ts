import { io, type Socket } from 'socket.io-client';

import type { RealtimeEvent } from '@archlens/types';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:4000';

// ─── Socket.io Client Singleton ─────────────────────────────────────────────

let socket: Socket | null = null;

export interface SocketConfig {
  url?: string;
  auth?: Record<string, string>;
  autoConnect?: boolean;
}

export function getSocket(config?: SocketConfig): Socket {
  if (socket) return socket;

  socket = io(config?.url ?? WS_URL, {
    autoConnect: config?.autoConnect ?? false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket', 'polling'],
    auth: config?.auth ?? {},
    withCredentials: true,
  });

  // Connection lifecycle logging
  socket.on('connect', () => {
    console.warn('[ARCHLENS WS] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.warn('[ARCHLENS WS] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[ARCHLENS WS] Connection error:', error.message);
  });

  socket.on('reconnect_attempt', (attempt) => {
    console.warn(`[ARCHLENS WS] Reconnect attempt ${String(attempt)}`);
  });

  return socket;
}

export function connectSocket(config?: SocketConfig): Socket {
  const s = getSocket(config);
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// ─── Typed Event Emitters ───────────────────────────────────────────────────

export function emitEvent<T>(event: string, payload: T): void {
  const s = getSocket();
  if (s.connected) {
    s.emit(event, payload);
  } else {
    console.error('[ARCHLENS WS] Cannot emit — socket not connected');
  }
}

export function onEvent<T>(
  event: string,
  handler: (data: RealtimeEvent<T>) => void,
): () => void {
  const s = getSocket();
  s.on(event, handler);
  return () => {
    s.off(event, handler);
  };
}
