import { CodeFile, Activity, PlanConfig, AnalysisRule } from './types';

export const MOCK_CODEBASE: CodeFile[] = [
  {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    lastModified: '2025-01-22T08:00:00Z',
    content: `{
  "name": "arch-sentinel-citadel",
  "version": "2.5.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lodash": "4.17.15",
    "fs-extra": "^11.2.0",
    "archlens-phantom-scanner": "1.0.0",
    "axios": "0.19.0"
  }
}`
  },
  {
    path: 'src/App.tsx',
    name: 'App.tsx',
    language: 'typescript',
    lastModified: '2025-01-20T10:00:00Z',
    content: `import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';

export const App = () => {
  const [active, setActive] = useState(true);
  return (
    <div className="app-container">
      <Dashboard status={active} />
    </div>
  );
};`
  },
  {
    path: 'src/components/Dashboard.tsx',
    name: 'Dashboard.tsx',
    language: 'typescript',
    lastModified: '2025-01-21T14:30:00Z',
    content: `export const Dashboard = ({ status }: { status: boolean }) => {
  return (
    <div className="p-4 bg-slate-900 text-white">
      System Status: {status ? 'Online' : 'Offline'}
    </div>
  );
};`
  },
  {
    path: 'src/services/api.ts',
    name: 'api.ts',
    language: 'typescript',
    lastModified: '2025-01-15T09:00:00Z',
    content: `export const fetchData = async (endpoint: string) => {
  const response = await fetch(endpoint);
  return response.json();
};`
  }
];

export const ARCH_RULES: AnalysisRule[] = [
  { id: 'RULE-001', name: 'Circular Dependency Prevention', severity: 'error' },
  { id: 'RULE-002', name: 'Z-Index Layer Management', severity: 'warning' },
  { id: 'RULE-003', name: 'Prop Drilling Detection', severity: 'info' },
  { id: 'RULE-004', name: 'Memory Leak Sanitization', severity: 'error' },
  { id: 'RULE-005', name: 'Layer Isolation: UI -> DB leakage', severity: 'error' },
  { id: 'RULE-006', name: 'Strict Typing: "any" suppression', severity: 'warning' },
  { id: 'RULE-007', name: 'Environment Leakage: UI context direct access', severity: 'error' },
  { id: 'RULE-008', name: 'Component Monolith: Max size exceeded', severity: 'warning' },
  { id: 'RULE-009', name: 'Direct DOM Manipulation in React', severity: 'error' },
  { id: 'RULE-010', name: 'Unbounded Side Effect: Missing cleanup', severity: 'warning' }
];

export const MOCK_ACTIVITY: Activity[] = [
  { id: 'ACT-001', user: 'Alex Rivera', action: 'Deployed Sentinel-V2 to Production', timestamp: '2 mins ago', impact: 'positive' },
  { id: 'ACT-002', user: 'System', action: 'Automated Refactor of src/services/api.ts', timestamp: '1 hour ago', impact: 'neutral' },
  { id: 'ACT-003', user: 'Maria Chen', action: 'Security Breach Mitigated in Auth Module', timestamp: '3 hours ago', impact: 'positive' }
];

export const PLAN_CONFIGS: PlanConfig[] = [
  { 
    type: 'Free', 
    price: 0,
    limits: { credits: 100, apiRequests: 1000 },
    features: ['100 Tokens / Cycle', 'Static Graph', 'Basic Sentinel']
  },
  { 
    type: 'Pro', 
    price: 49,
    limits: { credits: 1000, apiRequests: 10000 },
    features: ['1,000 Tokens / Cycle', 'Dynamic RAG', 'Advanced Guardrails', 'Academy Drills']
  },
  { 
    type: 'Enterprise', 
    price: 499,
    limits: { credits: 10000, apiRequests: 100000 },
    features: ['Unlimited Tokens', 'Custom Logic Registry', 'Priority AI Models', 'Sovereign VPC Access']
  }
];

export const MOCK_TEAM = [
  { id: 'TM-001', name: 'Alex Rivera', role: 'Architect', status: 'online' },
  { id: 'TM-002', name: 'Maria Chen', role: 'Staff Engineer', status: 'online' },
  { id: 'TM-003', name: 'Devin Smith', role: 'Senior Developer', status: 'offline' }
];

export const GITHUB_ACTION_YAML = `name: ArchLens Continuity Guard
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: ArchLens Invariant Audit
        uses: archlens/guard-action@v2
        with:
          api-key: \${{ secrets.ARCHLENS_API_KEY }}
          fail_on: 'critical'`;