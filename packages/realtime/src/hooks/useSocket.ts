import { useEffect, useRef, useCallback } from 'react';
import type { Socket } from 'socket.io-client';

import type { RealtimeEvent } from '@archlens/types';

import { connectSocket, disconnectSocket, getSocket } from '../socket/client';

/**
 * React hook for Socket.io connection lifecycle.
 */
export function useSocket(config?: {
  url?: string;
  auth?: Record<string, string>;
  autoConnect?: boolean;
}): {
  socket: Socket;
  isConnected: boolean;
  emit: <T>(event: string, payload: T) => void;
} {
  const socketRef = useRef<Socket>(getSocket(config));
  const isConnectedRef = useRef(false);

  useEffect(() => {
    const s = connectSocket(config);
    socketRef.current = s;

    const handleConnect = () => { isConnectedRef.current = true; };
    const handleDisconnect = () => { isConnectedRef.current = false; };

    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);

    return () => {
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
    };
  }, [config?.url, config?.auth]);

  const emit = useCallback(<T,>(event: string, payload: T) => {
    socketRef.current.emit(event, payload);
  }, []);

  return {
    socket: socketRef.current,
    isConnected: isConnectedRef.current,
    emit,
  };
}

/**
 * Hook to subscribe to a specific real-time event.
 */
export function useSocketEvent<T>(
  event: string,
  handler: (data: RealtimeEvent<T>) => void,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const s = getSocket();
    const wrappedHandler = (data: RealtimeEvent<T>) => {
      handlerRef.current(data);
    };
    s.on(event, wrappedHandler);
    return () => {
      s.off(event, wrappedHandler);
    };
  }, [event]);
}
