import type { AuditStreamEvent } from '@archlens/types';

const SSE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export type AuditStreamHandler = (event: AuditStreamEvent) => void;
export type AuditStreamErrorHandler = (error: Event) => void;

/**
 * Creates a Server-Sent Events connection to the audit stream endpoint.
 * Returns cleanup function to close the connection.
 */
export function createAuditStream(
  options: {
    onEvent: AuditStreamHandler;
    onError?: AuditStreamErrorHandler;
    onOpen?: () => void;
    endpoint?: string;
  },
): () => void {
  const url = options.endpoint ?? `${SSE_URL}/api/audit/stream`;
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onopen = () => {
    console.warn('[ARCHLENS SSE] Audit stream connected');
    options.onOpen?.();
  };

  eventSource.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as AuditStreamEvent;
      options.onEvent(data);
    } catch (err) {
      console.error('[ARCHLENS SSE] Failed to parse audit event:', err);
    }
  };

  // Named events
  eventSource.addEventListener('audit:violation', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as AuditStreamEvent;
      options.onEvent({ ...data, action: 'violation' });
    } catch (err) {
      console.error('[ARCHLENS SSE] Parse error on violation event:', err);
    }
  });

  eventSource.addEventListener('audit:fix', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as AuditStreamEvent;
      options.onEvent({ ...data, action: 'fix_applied' });
    } catch (err) {
      console.error('[ARCHLENS SSE] Parse error on fix event:', err);
    }
  });

  eventSource.addEventListener('audit:alert', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as AuditStreamEvent;
      options.onEvent({ ...data, action: 'security_alert' });
    } catch (err) {
      console.error('[ARCHLENS SSE] Parse error on alert event:', err);
    }
  });

  eventSource.onerror = (error: Event) => {
    console.error('[ARCHLENS SSE] Audit stream error:', error);
    options.onError?.(error);
  };

  return () => {
    eventSource.close();
    console.warn('[ARCHLENS SSE] Audit stream closed');
  };
}
