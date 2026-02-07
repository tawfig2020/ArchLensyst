import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

// ─── Query Keys Factory ─────────────────────────────────────────────────────

export const queryKeys = {
  all: ['archlens'] as const,

  codebase: {
    all: ['archlens', 'codebase'] as const,
    list: () => [...queryKeys.codebase.all, 'list'] as const,
    detail: (path: string) => [...queryKeys.codebase.all, 'detail', path] as const,
  },

  analysis: {
    all: ['archlens', 'analysis'] as const,
    impact: (filePath: string) => [...queryKeys.analysis.all, 'impact', filePath] as const,
    audit: (projectId: string, type: string) =>
      [...queryKeys.analysis.all, 'audit', projectId, type] as const,
  },

  graph: {
    all: ['archlens', 'graph'] as const,
    dependencies: (projectId: string) =>
      [...queryKeys.graph.all, 'dependencies', projectId] as const,
  },

  user: {
    all: ['archlens', 'user'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
    membership: (userId: string) => [...queryKeys.user.all, 'membership', userId] as const,
  },

  realtime: {
    all: ['archlens', 'realtime'] as const,
    auditStream: () => [...queryKeys.realtime.all, 'audit-stream'] as const,
    sessions: () => [...queryKeys.realtime.all, 'sessions'] as const,
  },
} as const;
