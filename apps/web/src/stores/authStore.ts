import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlanType = 'free' | 'pro' | 'institution';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'developer' | 'viewer';
  orgId: string;
  orgName: string;
  plan: PlanType;
  features: string[];
}

// Demo accounts for testing
export const DEMO_ACCOUNTS: Record<string, { password: string; profile: UserProfile }> = {
  'pro@archlens.io': {
    password: 'ProDemo2025!',
    profile: {
      id: 'usr-pro-001',
      email: 'pro@archlens.io',
      name: 'Alex Rivera',
      role: 'admin',
      orgId: 'org-pro-001',
      orgName: 'Rivera Engineering',
      plan: 'pro',
      features: [
        'dashboard', 'code-analysis', 'dependency-graph', 'drift-detection',
        'semantic-search', 'security-hub', 'audit-log', 'rules-engine',
        'phantom-execution', 'ai-insights', 'api-access', 'custom-rules',
        'team-5', 'export-reports', 'slack-integration',
      ],
    },
  },
  'institution@archlens.io': {
    password: 'InstitutionDemo2025!',
    profile: {
      id: 'usr-inst-001',
      email: 'institution@archlens.io',
      name: 'Dr. Sarah Chen',
      role: 'admin',
      orgId: 'org-inst-001',
      orgName: 'TechCorp Global',
      plan: 'institution',
      features: [
        'dashboard', 'code-analysis', 'dependency-graph', 'drift-detection',
        'semantic-search', 'security-hub', 'audit-log', 'rules-engine',
        'phantom-execution', 'ai-insights', 'api-access', 'custom-rules',
        'team-unlimited', 'export-reports', 'slack-integration',
        'sso-saml', 'sovereign-vault', 'strategic-citadel', 'compliance-reports',
        'sla-99-99', 'dedicated-support', 'on-premise', 'custom-ai-models',
        'white-label', 'multi-region', 'advanced-rbac',
      ],
    },
  },
};

// Generate a proper HMAC-SHA256 JWT (simplified for client-side demo)
function generateDemoJWT(profile: UserProfile): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const payload = btoa(JSON.stringify({
    sub: profile.id,
    org_id: profile.orgId,
    role: profile.role,
    email: profile.email,
    plan: profile.plan,
    exp: Math.floor(Date.now() / 1000) + 86400, // 24h
  })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  // In production, this would be server-signed. For demo, we use a static signature.
  const sig = btoa('archlens-demo-signature-v1')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${header}.${payload}.${sig}`;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 800)); // Simulate network

        const account = DEMO_ACCOUNTS[email.toLowerCase()];
        if (account && account.password === password) {
          const token = generateDemoJWT(account.profile);
          set({ user: account.profile, token, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false, error: 'Invalid email or password. Try the demo accounts.' });
        return false;
      },

      signUp: async (name: string, email: string, _password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 1000));

        const profile: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          name,
          role: 'developer',
          orgId: `org-${Date.now()}`,
          orgName: `${name}'s Workspace`,
          plan: 'free',
          features: ['dashboard', 'code-analysis', 'dependency-graph', 'semantic-search'],
        };
        const token = generateDemoJWT(profile);
        set({ user: profile, token, isAuthenticated: true, isLoading: false });
        return true;
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 1200));
        // Simulate Google OAuth — for demo, create a Pro account
        const profile: UserProfile = {
          id: 'usr-google-001',
          email: 'user@gmail.com',
          name: 'Google User',
          role: 'admin',
          orgId: 'org-google-001',
          orgName: 'Google Workspace',
          plan: 'pro',
          features: DEMO_ACCOUNTS['pro@archlens.io'].profile.features,
        };
        const token = generateDemoJWT(profile);
        set({ user: profile, token, isAuthenticated: true, isLoading: false });
        return true;
      },

      signOut: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'archlens-auth' }
  )
);
