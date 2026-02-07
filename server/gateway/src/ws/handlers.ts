import type { Server as SocketIOServer, Socket } from 'socket.io';

export function setupSocketHandlers(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // ─── Real-time Analysis Events ────────────────────────────────────
    socket.on('analysis:start', (data: { filePath: string }) => {
      socket.join(`analysis:${data.filePath}`);
      io.to(`analysis:${data.filePath}`).emit('analysis:progress', {
        type: 'analysis:progress',
        payload: { status: 'started', filePath: data.filePath },
        timestamp: Date.now(),
        source: socket.id,
      });
    });

    socket.on('analysis:complete', (data: { filePath: string; result: unknown }) => {
      io.to(`analysis:${data.filePath}`).emit('analysis:result', {
        type: 'analysis:result',
        payload: data.result,
        timestamp: Date.now(),
        source: socket.id,
      });
    });

    // ─── Collaborative Code Review (WebRTC Signaling) ─────────────────
    socket.on('review:create', (data: { fileId: string }, callback: (res: { sessionId: string }) => void) => {
      const sessionId = `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      socket.join(sessionId);
      callback({ sessionId });
      console.log(`[WS] Review session created: ${sessionId}`);
    });

    socket.on('review:join', (data: { sessionId: string }) => {
      socket.join(data.sessionId);
      socket.to(data.sessionId).emit('review:peer-joined', { peerId: socket.id });
      console.log(`[WS] ${socket.id} joined review: ${data.sessionId}`);
    });

    socket.on('review:leave', (data: { sessionId: string }) => {
      socket.to(data.sessionId).emit('review:peer-left', { peerId: socket.id });
      socket.leave(data.sessionId);
    });

    socket.on('review:offer', (data: { sessionId: string; peerId: string; offer: unknown }) => {
      io.to(data.peerId).emit('review:offer', { peerId: socket.id, offer: data.offer });
    });

    socket.on('review:answer', (data: { sessionId: string; peerId: string; answer: unknown }) => {
      io.to(data.peerId).emit('review:answer', { peerId: socket.id, answer: data.answer });
    });

    socket.on('review:ice-candidate', (data: { sessionId: string; peerId: string; candidate: unknown }) => {
      io.to(data.peerId).emit('review:ice-candidate', { peerId: socket.id, candidate: data.candidate });
    });

    // ─── Audit Stream Broadcast ───────────────────────────────────────
    socket.on('audit:event', (data: unknown) => {
      io.emit('audit:event', {
        type: 'audit:event',
        payload: data,
        timestamp: Date.now(),
        source: socket.id,
      });
    });

    // ─── Disconnect ───────────────────────────────────────────────────
    socket.on('disconnect', (reason: string) => {
      console.log(`[WS] Client disconnected: ${socket.id} (${reason})`);
    });
  });
}
