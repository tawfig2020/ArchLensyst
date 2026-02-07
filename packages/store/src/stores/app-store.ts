import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type {
  CodeFile,
  DependencyNode,
  DependencyLink,
  ImpactAnalysis,
  MonitorLog,
  UserProfile,
  DeveloperPersona,
  NewcomerGuide,
  PhantomStatus,
  PhantomExecutionResult,
  RuleViolation,
  SyntheticFix,
  SandboxInstance,
  DatabaseStatus,
} from '@archlens/types';

import { logger } from '../middleware/logger';

// ─── State Shape ────────────────────────────────────────────────────────────

export interface AppState {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Codebase
  codebase: CodeFile[];
  selectedFile: CodeFile | null;
  setCodebase: (files: CodeFile[]) => void;
  setSelectedFile: (file: CodeFile) => void;

  // Graph
  nodes: DependencyNode[];
  links: DependencyLink[];
  setGraph: (nodes: DependencyNode[], links: DependencyLink[]) => void;

  // Analysis
  impactData: ImpactAnalysis | null;
  setImpactData: (data: ImpactAnalysis | null) => void;

  // Logs
  logs: MonitorLog[];
  addLog: (log: MonitorLog) => void;
  clearLogs: () => void;

  // User
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile) => void;
  updateMembership: (patch: Partial<UserProfile['membership']>) => void;

  // Persona
  persona: DeveloperPersona | null;
  setPersona: (persona: DeveloperPersona) => void;

  // Newcomer
  newcomerGuide: NewcomerGuide | null;
  isLoadingGuide: boolean;
  setNewcomerGuide: (guide: NewcomerGuide | null) => void;
  setIsLoadingGuide: (loading: boolean) => void;

  // Phantom Execution
  phantomStatus: PhantomStatus;
  phantomResult: PhantomExecutionResult | null;
  setPhantomStatus: (status: PhantomStatus) => void;
  setPhantomResult: (result: PhantomExecutionResult | null) => void;

  // Refactoring
  refactorSuggestions: { violation: RuleViolation; fix?: SyntheticFix }[];
  isRefactoring: boolean;
  addRefactorSuggestion: (violation: RuleViolation, fix?: SyntheticFix) => void;
  removeRefactorSuggestion: (ruleId: string) => void;
  setIsRefactoring: (value: boolean) => void;

  // Infrastructure
  sandboxes: SandboxInstance[];
  throughput: number;
  setSandboxes: (sandboxes: SandboxInstance[]) => void;
  setThroughput: (value: number) => void;
  updateSandbox: (id: string, patch: Partial<SandboxInstance>) => void;

  // Database
  dbStatus: DatabaseStatus;
  setDbStatus: (status: DatabaseStatus) => void;

  // UI
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isSyncingPersona: boolean;
  setIsSyncingPersona: (syncing: boolean) => void;
}

// ─── Store Creation ─────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  devtools(
    subscribeWithSelector(
      persist(
        logger(
          immer((set) => ({
            // Navigation
            activeTab: 'landing',
            setActiveTab: (tab) => set((state) => { state.activeTab = tab; }),

            // Codebase
            codebase: [],
            selectedFile: null,
            setCodebase: (files) => set((state) => { state.codebase = files; }),
            setSelectedFile: (file) => set((state) => { state.selectedFile = file; }),

            // Graph
            nodes: [],
            links: [],
            setGraph: (nodes, links) => set((state) => {
              state.nodes = nodes;
              state.links = links;
            }),

            // Analysis
            impactData: null,
            setImpactData: (data) => set((state) => { state.impactData = data; }),

            // Logs
            logs: [],
            addLog: (log) => set((state) => { state.logs.push(log); }),
            clearLogs: () => set((state) => { state.logs = []; }),

            // User
            currentUser: null,
            setCurrentUser: (user) => set((state) => { state.currentUser = user; }),
            updateMembership: (patch) => set((state) => {
              if (state.currentUser) {
                Object.assign(state.currentUser.membership, patch);
              }
            }),

            // Persona
            persona: null,
            setPersona: (persona) => set((state) => { state.persona = persona; }),

            // Newcomer
            newcomerGuide: null,
            isLoadingGuide: false,
            setNewcomerGuide: (guide) => set((state) => { state.newcomerGuide = guide; }),
            setIsLoadingGuide: (loading) => set((state) => { state.isLoadingGuide = loading; }),

            // Phantom Execution
            phantomStatus: 'idle',
            phantomResult: null,
            setPhantomStatus: (status) => set((state) => { state.phantomStatus = status; }),
            setPhantomResult: (result) => set((state) => { state.phantomResult = result; }),

            // Refactoring
            refactorSuggestions: [],
            isRefactoring: false,
            addRefactorSuggestion: (violation, fix) => set((state) => {
              const idx = state.refactorSuggestions.findIndex(
                (s) => s.violation.ruleId === violation.ruleId,
              );
              if (idx >= 0) {
                state.refactorSuggestions[idx] = { violation, fix };
              } else {
                state.refactorSuggestions.push({ violation, fix });
              }
            }),
            removeRefactorSuggestion: (ruleId) => set((state) => {
              state.refactorSuggestions = state.refactorSuggestions.filter(
                (s) => s.violation.ruleId !== ruleId,
              );
            }),
            setIsRefactoring: (value) => set((state) => { state.isRefactoring = value; }),

            // Infrastructure
            sandboxes: [],
            throughput: 0,
            setSandboxes: (sandboxes) => set((state) => { state.sandboxes = sandboxes; }),
            setThroughput: (value) => set((state) => { state.throughput = value; }),
            updateSandbox: (id, patch) => set((state) => {
              const sb = state.sandboxes.find((s) => s.id === id);
              if (sb) Object.assign(sb, patch);
            }),

            // Database
            dbStatus: { connected: false, lastSync: '', pendingTransactions: 0, clusterHealth: 'offline' },
            setDbStatus: (status) => set((state) => { state.dbStatus = status; }),

            // UI
            isUpgradeModalOpen: false,
            setIsUpgradeModalOpen: (open) => set((state) => { state.isUpgradeModalOpen = open; }),
            isSyncingPersona: false,
            setIsSyncingPersona: (syncing) => set((state) => { state.isSyncingPersona = syncing; }),
          })),
          'AppStore',
        ),
        {
          name: 'archlens-app-store',
          partialize: (state) => ({
            activeTab: state.activeTab,
            currentUser: state.currentUser,
            persona: state.persona,
          }),
        },
      ),
    ),
    { name: 'ArchLens', enabled: process.env.NODE_ENV === 'development' },
  ),
);

// ─── Selectors ──────────────────────────────────────────────────────────────

export const selectActiveTab = (state: AppState) => state.activeTab;
export const selectCodebase = (state: AppState) => state.codebase;
export const selectSelectedFile = (state: AppState) => state.selectedFile;
export const selectCurrentUser = (state: AppState) => state.currentUser;
export const selectLogs = (state: AppState) => state.logs;
export const selectPhantomStatus = (state: AppState) => state.phantomStatus;
export const selectSandboxes = (state: AppState) => state.sandboxes;
export const selectDbStatus = (state: AppState) => state.dbStatus;
export const selectRefactorSuggestions = (state: AppState) => state.refactorSuggestions;
export const selectCurrentViolations = (state: AppState) =>
  state.refactorSuggestions.map((s) => s.violation);
