/**
 * ArchLens Edge Worker — Cloudflare Workers
 * Handles edge caching, routing, and security headers.
 */

export interface Env {
  ENVIRONMENT: string;
  API_ORIGIN: string;
  APP_ORIGIN: string;
  ARCHLENS_CACHE?: KVNamespace;
}

const CACHE_TTL: Record<string, number> = {
  '/api/codebase': 60,
  '/api/graph': 300,
  '/api/analysis/audit': 120,
};

const STATIC_ASSET_TTL = 86400 * 30; // 30 days
const API_CACHE_TTL = 60; // 1 minute default

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // ─── Static Asset Caching ───────────────────────────────────────
    if (isStaticAsset(pathname)) {
      return handleStaticAsset(request, ctx);
    }

    // ─── API Proxy with Edge Caching ────────────────────────────────
    if (pathname.startsWith('/api/')) {
      return handleAPIRequest(request, env, ctx, pathname);
    }

    // ─── SPA Fallback ───────────────────────────────────────────────
    const appUrl = `${env.APP_ORIGIN}${pathname}`;
    const response = await fetch(appUrl, { headers: request.headers });
    return addSecurityHeaders(new Response(response.body, response));
  },
};

function isStaticAsset(pathname: string): boolean {
  return /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|ico|webp|avif)$/.test(pathname);
}

async function handleStaticAsset(request: Request, ctx: ExecutionContext): Promise<Response> {
  const cache = caches.default;
  let response = await cache.match(request);

  if (!response) {
    response = await fetch(request);
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', `public, max-age=${STATIC_ASSET_TTL}, immutable`);
    headers.set('CDN-Cache-Control', `public, max-age=${STATIC_ASSET_TTL}`);
    response = new Response(response.body, { ...response, headers });
    ctx.waitUntil(cache.put(request, response.clone()));
  }

  return response;
}

async function handleAPIRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  pathname: string,
): Promise<Response> {
  // Only cache GET requests
  if (request.method !== 'GET') {
    const apiUrl = `${env.API_ORIGIN}${pathname}${new URL(request.url).search}`;
    const response = await fetch(apiUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return addSecurityHeaders(new Response(response.body, response));
  }

  // Determine cache TTL
  const matchedPath = Object.keys(CACHE_TTL).find((key) => pathname.startsWith(key));
  const ttl = matchedPath ? CACHE_TTL[matchedPath]! : API_CACHE_TTL;

  // Try KV cache first
  if (env.ARCHLENS_CACHE) {
    const cacheKey = `api:${pathname}:${new URL(request.url).search}`;
    const cached = await env.ARCHLENS_CACHE.get(cacheKey);
    if (cached) {
      return addSecurityHeaders(
        new Response(cached, {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'X-Cache-TTL': String(ttl),
          },
        }),
      );
    }
  }

  // Fetch from origin
  const apiUrl = `${env.API_ORIGIN}${pathname}${new URL(request.url).search}`;
  const response = await fetch(apiUrl, { headers: request.headers });

  if (response.ok && env.ARCHLENS_CACHE) {
    const body = await response.text();
    const cacheKey = `api:${pathname}:${new URL(request.url).search}`;
    ctx.waitUntil(env.ARCHLENS_CACHE.put(cacheKey, body, { expirationTtl: ttl }));

    return addSecurityHeaders(
      new Response(body, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
          'X-Cache-TTL': String(ttl),
        },
      }),
    );
  }

  return addSecurityHeaders(new Response(response.body, response));
}

function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  headers.set('X-Powered-By', 'ArchLens-Edge');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
