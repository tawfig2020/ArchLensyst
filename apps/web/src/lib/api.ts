import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const COGNITIVE_BASE = import.meta.env.VITE_COGNITIVE_URL || 'http://localhost:8100';
const CITADEL_BASE = import.meta.env.VITE_CITADEL_URL || 'http://localhost:8201';
const VAULT_BASE = import.meta.env.VITE_VAULT_URL || 'http://localhost:8300';

function getToken(): string | null {
  try {
    const auth = JSON.parse(localStorage.getItem('archlens-auth') || '{}');
    return auth?.state?.token || null;
  } catch {
    return null;
  }
}

export const api = axios.create({ baseURL: API_BASE });
export const cognitiveApi = axios.create({ baseURL: COGNITIVE_BASE });
export const citadelApi = axios.create({ baseURL: CITADEL_BASE });
export const vaultApi = axios.create({ baseURL: VAULT_BASE });

[api, cognitiveApi, citadelApi, vaultApi].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
});

// ── API Gateway endpoints ──
export const gateway = {
  health: () => api.get('/health'),
  ready: () => api.get('/ready'),
  listOrgs: () => api.get('/api/v1/organizations'),
  createOrg: (data: { name: string }) => api.post('/api/v1/organizations', data),
  getOrg: (id: string) => api.get(`/api/v1/organizations/${id}`),
  listRepos: (orgId: string) => api.get(`/api/v1/organizations/${orgId}/repos`),
  createRepo: (orgId: string, data: { name: string; url: string }) =>
    api.post(`/api/v1/organizations/${orgId}/repos`, data),
  triggerAnalysis: (repoId: string) => api.post(`/api/v1/repos/${repoId}/analyze`),
  listAnalyses: (repoId: string) => api.get(`/api/v1/repos/${repoId}/analyses`),
  listDrift: (repoId: string) => api.get(`/api/v1/repos/${repoId}/drift`),
  listRules: (orgId: string) => api.get(`/api/v1/organizations/${orgId}/rules`),
  createRule: (orgId: string, data: { name: string; severity: string }) =>
    api.post(`/api/v1/organizations/${orgId}/rules`, data),
  phantomExec: (repoId: string, data: { changes: string[] }) =>
    api.post(`/api/v1/repos/${repoId}/phantom`, data),
  getMetrics: (repoId: string) => api.get(`/api/v1/repos/${repoId}/metrics`),
  getAuditLog: (orgId: string) => api.get(`/api/v1/organizations/${orgId}/audit`),
};

// ── Cognitive Service endpoints ──
export const cognitive = {
  health: () => cognitiveApi.get('/health'),
  triggerAnalysis: (data: { repo_url: string; files: string[] }) =>
    cognitiveApi.post('/analysis/trigger', data),
  getInsights: (id: string) => cognitiveApi.get(`/analysis/insights/${id}`),
  getRationale: (id: string) => cognitiveApi.get(`/analysis/rationale/${id}`),
  getHealthScore: (id: string) => cognitiveApi.get(`/analysis/health-score/${id}`),
  semanticSearch: (data: { query: string; top_k?: number }) =>
    cognitiveApi.post('/embeddings/search', data),
};

// ── Citadel Service endpoints ──
export const citadel = {
  health: () => citadelApi.get('/health'),
  scanDrift: (data: { repo_id: string }) => citadelApi.post('/drift/scan', data),
  getDriftStatus: (id: string) => citadelApi.get(`/drift/status/${id}`),
  getDriftReport: (id: string) => citadelApi.get(`/drift/report/${id}`),
  getMeshTopology: () => citadelApi.get('/mesh/topology'),
  getMeshHealth: () => citadelApi.get('/mesh/health'),
};

// ── Vault Service endpoints ──
export const vault = {
  health: () => vaultApi.get('/health'),
  sign: (data: { payload: string }) => vaultApi.post('/crypto/sign', data),
  verify: (data: { payload: string; signature: string }) =>
    vaultApi.post('/crypto/verify', data),
  getLedger: () => vaultApi.get('/ledger'),
  getRationales: () => vaultApi.get('/rationale'),
  createRationale: (data: { title: string; content: string; decision: string }) =>
    vaultApi.post('/rationale', data),
};
