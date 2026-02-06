# ArchLens Strategic Systems - Code Style Guide

## Table of Contents
1. [TypeScript Guidelines](#typescript-guidelines)
2. [React Best Practices](#react-best-practices)
3. [File Organization](#file-organization)
4. [Naming Conventions](#naming-conventions)
5. [Code Formatting](#code-formatting)
6. [Architecture Patterns](#architecture-patterns)

---

## TypeScript Guidelines

### Type Safety
- **Always** use explicit types for function parameters and return values
- **Avoid** using `any` - use `unknown` if type is truly unknown
- **Prefer** interfaces over type aliases for object shapes
- **Use** strict mode in `tsconfig.json`

```typescript
// ✅ Good
function calculateScore(metrics: PerformanceMetrics): number {
  return metrics.score * 100;
}

// ❌ Bad
function calculateScore(metrics: any) {
  return metrics.score * 100;
}
```

### Enums and Constants
- Use `const enum` for compile-time constants
- Use `as const` for literal types
- Group related constants in namespaces

```typescript
// ✅ Good
const enum Severity {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

// ✅ Good
const AUDIT_TYPES = {
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  DEPENDENCY: 'dependency'
} as const;
```

---

## React Best Practices

### Component Structure
1. Imports (React → External → Internal → Types → Styles)
2. Type definitions
3. Component definition
4. Hooks
5. Event handlers
6. Render logic
7. Export

```typescript
// ✅ Good Component Structure
import React, { useState, useEffect } from 'react';
import { Button } from 'external-lib';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types';
import './Dashboard.css';

interface DashboardProps {
  userId: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId, onLogout }) => {
  const [data, setData] = useState<UserProfile | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Effect logic
  }, [userId]);

  const handleRefresh = () => {
    // Handler logic
  };

  return (
    <div className="dashboard">
      {/* JSX */}
    </div>
  );
};
```

### Hooks Rules
- **Always** clean up side effects in `useEffect`
- **Use** `useCallback` for event handlers passed to child components
- **Use** `useMemo` for expensive computations
- **Never** call hooks conditionally

```typescript
// ✅ Good - Cleanup in useEffect
useEffect(() => {
  const subscription = api.subscribe(data => setData(data));
  return () => subscription.unsubscribe();
}, []);

// ✅ Good - useCallback for handlers
const handleClick = useCallback(() => {
  processData(data);
}, [data]);
```

### State Management
- Keep state as close to where it's used as possible
- Lift state only when necessary
- Use Context API for global state
- Consider state management libraries for complex apps

---

## File Organization

### Directory Structure
```
src/
├── components/          # React components
│   ├── common/         # Reusable components
│   └── features/       # Feature-specific components
├── services/           # Business logic & API calls
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── styles/             # Global styles
```

### File Naming
- **Components**: PascalCase (e.g., `UserDashboard.tsx`)
- **Services**: camelCase with suffix (e.g., `authService.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Types**: PascalCase (e.g., `UserProfile.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)

---

## Naming Conventions

### Variables and Functions
```typescript
// ✅ Good - Descriptive names
const userAuthenticated = checkAuth();
const calculateTotalScore = (metrics: Metrics) => { };

// ❌ Bad - Unclear names
const ua = checkAuth();
const calc = (m: any) => { };
```

### Constants
```typescript
// ✅ Good - UPPER_SNAKE_CASE for true constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ Good - camelCase for configuration objects
const apiConfig = {
  timeout: 5000,
  retries: 3
};
```

### Boolean Variables
```typescript
// ✅ Good - Use is/has/should prefix
const isLoading = true;
const hasPermission = checkPermission();
const shouldRender = data !== null;
```

---

## Code Formatting

### Indentation and Spacing
- **2 spaces** for indentation (no tabs)
- **Max line length**: 120 characters
- **Single blank line** between logical blocks
- **No trailing whitespace**

### Imports
```typescript
// ✅ Good - Organized imports
import React, { useState, useEffect } from 'react';
import { Button, Input } from 'ui-library';

import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

import { UserProfile, AuthState } from '../types';

import './styles.css';
```

### Object and Array Formatting
```typescript
// ✅ Good - Readable formatting
const config = {
  apiKey: process.env.API_KEY,
  timeout: 5000,
  retries: 3
};

const items = [
  'security',
  'performance',
  'reliability'
];
```

---

## Architecture Patterns

### Separation of Concerns
1. **Components**: Only UI logic and rendering
2. **Services**: Business logic, API calls, data processing
3. **Hooks**: Reusable stateful logic
4. **Utils**: Pure functions, no side effects

```typescript
// ✅ Good - Separated concerns

// Service Layer
export const userService = {
  async fetchUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
};

// Component Layer
export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
};
```

### Error Handling
```typescript
// ✅ Good - Comprehensive error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('[ServiceName] Operation failed:', error);
  throw new Error('User-friendly error message');
}
```

### Singleton Pattern for Services
```typescript
// ✅ Good - Singleton service
class AnalyticsService {
  private static instance: AnalyticsService | undefined;

  private constructor() {
    // Initialize
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }
}

export const analyticsService = AnalyticsService.getInstance();
```

---

## Security Best Practices

1. **Never** hardcode secrets or API keys
2. **Always** sanitize user input
3. **Use** environment variables for sensitive data
4. **Validate** all external data
5. **Implement** proper authentication and authorization

---

## Performance Guidelines

1. **Memoize** expensive computations with `useMemo`
2. **Optimize** re-renders with `React.memo` and `useCallback`
3. **Lazy load** components with `React.lazy()`
4. **Virtualize** long lists
5. **Debounce** search inputs and frequent operations

---

## Testing Standards

1. **Write** unit tests for all services
2. **Test** component rendering and user interactions
3. **Mock** external dependencies
4. **Aim** for 80%+ code coverage
5. **Use** descriptive test names

```typescript
// ✅ Good - Descriptive test
describe('UserService', () => {
  it('should fetch user data and return formatted profile', async () => {
    // Test implementation
  });
});
```

---

## Documentation

### Code Comments
- Use JSDoc for public APIs
- Explain **why**, not **what**
- Keep comments up to date

```typescript
/**
 * Analyzes codebase for security vulnerabilities
 * @param files - Array of code files to scan
 * @returns Security audit report with vulnerability details
 */
export async function performSecurityAudit(files: CodeFile[]): Promise<SecurityReport> {
  // Implementation
}
```

---

## Enforcement

This style guide is enforced through:
- **ESLint** - Linting rules
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Pre-commit hooks** - Automated checks
- **Code reviews** - Manual verification

Run checks:
```bash
npm run lint        # ESLint
npm run format      # Prettier
npm run type-check  # TypeScript
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
