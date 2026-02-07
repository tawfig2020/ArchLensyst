import { useEffect, useRef, useState, useCallback } from 'react';

import type { AuditStreamEvent } from '@archlens/types';

import { createAuditStream } from '../sse/audit-stream';

/**
 * React hook for SSE-based audit stream.
 */
export function useAuditStream(options?: {
  endpoint?: string;
  enabled?: boolean;
  maxEvents?: number;
}): {
  events: AuditStreamEvent[];
  isConnected: boolean;
  error: Event | null;
  clearEvents: () => void;
} {
  const [events, setEvents] = useState<AuditStreamEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const maxEvents = options?.maxEvents ?? 500;
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    const cleanup = createAuditStream({
      endpoint: options?.endpoint,
      onEvent: (event) => {
        setEvents((prev) => {
          const next = [...prev, event];
          return next.length > maxEvents ? next.slice(-maxEvents) : next;
        });
      },
      onOpen: () => {
        setIsConnected(true);
        setError(null);
      },
      onError: (err) => {
        setIsConnected(false);
        setError(err);
      },
    });

    return cleanup;
  }, [enabled, options?.endpoint, maxEvents]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, isConnected, error, clearEvents };
}
