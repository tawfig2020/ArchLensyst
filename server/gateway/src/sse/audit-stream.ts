import type { Express, Request, Response } from 'express';

const clients: Set<Response> = new Set();

export function setupSSERoutes(app: Express): void {
  // SSE endpoint for audit event stream
  app.get('/api/audit/stream', (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no',
    });

    // Send initial connection event
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: Date.now() })}\n\n`);

    clients.add(res);
    console.log(`[SSE] Client connected. Total: ${clients.size}`);

    // Heartbeat every 30s
    const heartbeat = setInterval(() => {
      res.write(`:heartbeat ${Date.now()}\n\n`);
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeat);
      clients.delete(res);
      console.log(`[SSE] Client disconnected. Total: ${clients.size}`);
    });
  });
}

/**
 * Broadcast an audit event to all connected SSE clients.
 */
export function broadcastAuditEvent(
  eventType: string,
  data: Record<string, unknown>,
): void {
  const payload = JSON.stringify({
    eventId: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...data,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    client.write(`event: ${eventType}\ndata: ${payload}\n\n`);
  });
}
