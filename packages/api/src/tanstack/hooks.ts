import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  CodeFile,
  ImpactAnalysis,
  AuditReport,
  DependencyNode,
  DependencyLink,
} from '@archlens/types';

import { queryKeys } from './query-client';

// ─── API Layer (replace with real fetch calls) ──────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`[ARCHLENS API] ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ─── Codebase Hooks ─────────────────────────────────────────────────────────

export function useCodebase() {
  return useQuery({
    queryKey: queryKeys.codebase.list(),
    queryFn: () => fetchJSON<CodeFile[]>('/codebase'),
  });
}

export function useFileDetail(filePath: string) {
  return useQuery({
    queryKey: queryKeys.codebase.detail(filePath),
    queryFn: () => fetchJSON<CodeFile>(`/codebase/${encodeURIComponent(filePath)}`),
    enabled: Boolean(filePath),
  });
}

// ─── Analysis Hooks ─────────────────────────────────────────────────────────

export function useImpactAnalysis(filePath: string) {
  return useQuery({
    queryKey: queryKeys.analysis.impact(filePath),
    queryFn: () => fetchJSON<ImpactAnalysis>(`/analysis/impact/${encodeURIComponent(filePath)}`),
    enabled: Boolean(filePath),
    staleTime: 1000 * 30, // 30 seconds for analysis data
  });
}

export function useAuditReport(projectId: string, type: string) {
  return useQuery({
    queryKey: queryKeys.analysis.audit(projectId, type),
    queryFn: () => fetchJSON<AuditReport>(`/analysis/audit/${projectId}?type=${type}`),
    enabled: Boolean(projectId) && Boolean(type),
  });
}

export function useRunImpactAnalysis() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { filePath: string; content: string }) =>
      fetchJSON<ImpactAnalysis>('/analysis/impact', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (data, variables) => {
      qc.setQueryData(queryKeys.analysis.impact(variables.filePath), data);
    },
  });
}

// ─── Dependency Graph Hooks ─────────────────────────────────────────────────

export function useDependencyGraph(projectId: string) {
  return useQuery({
    queryKey: queryKeys.graph.dependencies(projectId),
    queryFn: () =>
      fetchJSON<{ nodes: DependencyNode[]; links: DependencyLink[] }>(
        `/graph/dependencies/${projectId}`,
      ),
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5, // 5 min for graph data
  });
}

// ─── Mutation: Apply Fix ────────────────────────────────────────────────────

export function useApplySyntheticFix() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { filePath: string; fixId: string }) =>
      fetchJSON<{ success: boolean; updatedFile: CodeFile }>('/fixes/apply', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.codebase.all });
      void qc.invalidateQueries({ queryKey: queryKeys.analysis.all });
    },
  });
}
