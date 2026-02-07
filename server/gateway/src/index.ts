/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-GATEWAY-SENTINEL-V3
 */

import http from 'node:http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';

import { setupSocketHandlers } from './ws/handlers.js';
import { setupSSERoutes } from './sse/audit-stream.js';
import { setupAPIRoutes } from './api/routes.js';

const PORT = Number(process.env.PORT) || 4000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// ─── Express App ────────────────────────────────────────────────────────────

const app = express();
const server = http.createServer(app);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'archlens-gateway',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────

setupAPIRoutes(app);

// ─── SSE Routes ─────────────────────────────────────────────────────────────

setupSSERoutes(app);

// ─── Socket.io with Redis Adapter ───────────────────────────────────────────

const io = new SocketIOServer(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 20000,
});

// Redis adapter for horizontal scaling
async function setupRedis(): Promise<void> {
  try {
    const pubClient = new Redis(REDIS_URL);
    const subClient = pubClient.duplicate();

    await Promise.all([
      new Promise<void>((resolve) => pubClient.on('connect', resolve)),
      new Promise<void>((resolve) => subClient.on('connect', resolve)),
    ]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log('[ARCHLENS Gateway] Redis adapter connected');
  } catch (err) {
    console.warn('[ARCHLENS Gateway] Redis unavailable — running without adapter:', (err as Error).message);
  }
}

setupSocketHandlers(io);

// ─── Start ──────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  await setupRedis();

  server.listen(PORT, () => {
    console.log('─────────────────────────────────────────────────');
    console.log('  ArchLens Strategic Systems | API Gateway');
    console.log(`  Status: SECURE — Listening on port ${PORT}`);
    console.log(`  WebSocket: ws://localhost:${PORT}`);
    console.log(`  SSE Stream: http://localhost:${PORT}/api/audit/stream`);
    console.log('─────────────────────────────────────────────────');
  });
}

start().catch(console.error);

export { app, server, io };
