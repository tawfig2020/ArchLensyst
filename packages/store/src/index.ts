// ─── Stores ─────────────────────────────────────────────────────────────────
export {
  useAppStore,
  selectActiveTab,
  selectCodebase,
  selectSelectedFile,
  selectCurrentUser,
  selectLogs,
  selectPhantomStatus,
  selectSandboxes,
  selectDbStatus,
  selectRefactorSuggestions,
  selectCurrentViolations,
} from './stores/app-store';
export type { AppState } from './stores/app-store';

// ─── Middleware ──────────────────────────────────────────────────────────────
export { logger } from './middleware/logger';
export { createEncryptedPersist } from './middleware/persist-encrypted';
