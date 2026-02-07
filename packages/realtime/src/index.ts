// ─── Socket.io ──────────────────────────────────────────────────────────────
export {
  getSocket,
  connectSocket,
  disconnectSocket,
  emitEvent,
  onEvent,
} from './socket/client';
export type { SocketConfig } from './socket/client';

// ─── SSE Audit Stream ───────────────────────────────────────────────────────
export { createAuditStream } from './sse/audit-stream';
export type { AuditStreamHandler, AuditStreamErrorHandler } from './sse/audit-stream';

// ─── WebRTC Collaborative Review ────────────────────────────────────────────
export { CollaborativeReviewManager } from './webrtc/collaborative-review';
export type { PeerConnection } from './webrtc/collaborative-review';

// ─── React Hooks ────────────────────────────────────────────────────────────
export { useSocket, useSocketEvent } from './hooks/useSocket';
export { useAuditStream } from './hooks/useAuditStream';
