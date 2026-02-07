// ─── TanStack Query ─────────────────────────────────────────────────────────
export { queryClient, queryKeys } from './tanstack/query-client';
export {
  useCodebase,
  useFileDetail,
  useImpactAnalysis,
  useAuditReport,
  useRunImpactAnalysis,
  useDependencyGraph,
  useApplySyntheticFix,
} from './tanstack/hooks';

// ─── Apollo Client (GraphQL) ────────────────────────────────────────────────
export { apolloClient } from './graphql/client';
export {
  GET_CODEBASE,
  GET_FILE_ANALYSIS,
  GET_DEPENDENCY_GRAPH,
  GET_AUDIT_REPORT,
  APPLY_SYNTHETIC_FIX,
  RUN_IMPACT_ANALYSIS,
} from './graphql/queries';
