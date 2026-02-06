/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-STATIC-ANALYSIS-SENTINEL
 */

import { CodeFile, RuleViolation } from '../types';

export interface ArchitecturalRule {
  id: string;
  name: string;
  category: 'architectural' | 'anti-pattern' | 'security' | 'performance';
  severity: 'error' | 'warning' | 'info';
  description: string;
  pattern: RegExp | ((code: string) => boolean);
  autoFix?: (code: string) => string;
}

export interface StaticAnalysisReport {
  violations: RuleViolation[];
  rulesApplied: number;
  filesScanned: number;
  architecturalScore: number;
  timestamp: string;
}

class StaticAnalysisRulesService {
  private static instance: StaticAnalysisRulesService | undefined;
  private rules: ArchitecturalRule[];

  private constructor() {
    this.rules = [];
    this.initializeRules();
  }

  public static getInstance(): StaticAnalysisRulesService {
    if (!StaticAnalysisRulesService.instance) {
      StaticAnalysisRulesService.instance = new StaticAnalysisRulesService();
    }
    return StaticAnalysisRulesService.instance;
  }

  private initializeRules() {
    this.rules = [
      // Anti-Pattern: Prop Drilling
      {
        id: 'ARCH-001',
        name: 'Prevent Prop Drilling',
        category: 'anti-pattern',
        severity: 'warning',
        description: 'Detected potential prop drilling - consider using Context API or state management',
        pattern: (code: string) => {
          const propPassingCount = (code.match(/\w+={[\w.]+}/g) || []).length;
          const componentDepth = (code.match(/function \w+\(/g) || []).length;
          return propPassingCount > 5 && componentDepth > 2;
        }
      },
      
      // Architectural Invariant: No Business Logic in Components
      {
        id: 'ARCH-002',
        name: 'No Business Logic in UI Components',
        category: 'architectural',
        severity: 'error',
        description: 'UI components should not contain business logic - extract to services',
        pattern: /const \w+Component.*=.*\{[\s\S]*?(fetch|axios|api\.|db\.|database\.)[\s\S]*?\}/
      },

      // Anti-Pattern: God Component
      {
        id: 'ARCH-003',
        name: 'Prevent God Components',
        category: 'anti-pattern',
        severity: 'error',
        description: 'Component exceeds 300 lines - consider breaking into smaller components',
        pattern: (code: string) => code.split('\n').length > 300
      },

      // Architectural Invariant: Consistent Import Order
      {
        id: 'ARCH-004',
        name: 'Enforce Import Order',
        category: 'architectural',
        severity: 'warning',
        description: 'Imports should follow order: React, external libs, internal modules, types, styles',
        pattern: (code: string) => {
          const lines = code.split('\n');
          let lastImportType = 0;
          for (const line of lines) {
            if (!line.startsWith('import')) continue;
            
            let currentType = 5;
            if (line.includes('react')) currentType = 1;
            else if (line.includes('from \'') && !line.includes('./') && !line.includes('../')) currentType = 2;
            else if (line.includes('./') || line.includes('../')) currentType = 3;
            else if (line.includes('types')) currentType = 4;
            
            if (currentType < lastImportType) return true;
            lastImportType = currentType;
          }
          return false;
        }
      },

      // Security: No Hardcoded Secrets
      {
        id: 'ARCH-005',
        name: 'No Hardcoded Secrets',
        category: 'security',
        severity: 'error',
        description: 'Detected potential hardcoded secret - use environment variables',
        pattern: /(apiKey|api_key|secret|password|token)\s*[:=]\s*['"][^'"]{20,}['"]/i
      },

      // Anti-Pattern: Inline Styles
      {
        id: 'ARCH-006',
        name: 'Avoid Inline Styles',
        category: 'anti-pattern',
        severity: 'info',
        description: 'Prefer CSS classes or styled-components over inline styles',
        pattern: /style=\{\{[^}]+\}\}/
      },

      // Performance: Avoid Anonymous Functions in JSX
      {
        id: 'ARCH-007',
        name: 'No Anonymous Functions in JSX',
        category: 'performance',
        severity: 'warning',
        description: 'Anonymous functions in JSX cause unnecessary re-renders',
        pattern: /on\w+={(.*?)\s*=>\s*{/
      },

      // Architectural: Enforce Type Safety
      {
        id: 'ARCH-008',
        name: 'Enforce TypeScript Types',
        category: 'architectural',
        severity: 'error',
        description: 'All function parameters and return types must be explicitly typed',
        pattern: /function \w+\([^)]*\)(?!\s*:\s*\w+)/
      },

      // Anti-Pattern: Direct DOM Manipulation
      {
        id: 'ARCH-009',
        name: 'No Direct DOM Manipulation',
        category: 'anti-pattern',
        severity: 'error',
        description: 'Avoid direct DOM manipulation - use React refs and state',
        pattern: /document\.(getElementById|querySelector|getElementsBy)/
      },

      // Architectural: Service Layer Separation
      {
        id: 'ARCH-010',
        name: 'Enforce Service Layer Separation',
        category: 'architectural',
        severity: 'error',
        description: 'API calls must be in service layer, not in components',
        pattern: /const \w+Component.*[\s\S]*?fetch\(/
      },

      // Security: XSS Prevention
      {
        id: 'ARCH-011',
        name: 'Prevent XSS Vulnerabilities',
        category: 'security',
        severity: 'error',
        description: 'Dangerous use of dangerouslySetInnerHTML detected',
        pattern: /dangerouslySetInnerHTML/
      },

      // Performance: Memoization
      {
        id: 'ARCH-012',
        name: 'Use Memoization for Expensive Computations',
        category: 'performance',
        severity: 'info',
        description: 'Consider using useMemo for expensive computations in render',
        pattern: (code: string) => {
          const hasExpensiveOps = /\.(map|filter|reduce|sort)\(/.test(code);
          const hasMemo = /useMemo/.test(code);
          return hasExpensiveOps && !hasMemo;
        }
      }
    ];
  }

  public analyzeFile(file: CodeFile): RuleViolation[] {
    const violations: RuleViolation[] = [];

    for (const rule of this.rules) {
      let matched = false;

      if (typeof rule.pattern === 'function') {
        matched = rule.pattern(file.content);
      } else {
        matched = rule.pattern.test(file.content);
      }

      if (matched) {
        violations.push({
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.description,
          file: file.path,
          line: this.findViolationLine(file.content, rule),
          suggestion: this.generateSuggestion(rule)
        });
      }
    }

    return violations;
  }

  public analyzeCodebase(files: CodeFile[]): StaticAnalysisReport {
    const allViolations: RuleViolation[] = [];

    for (const file of files) {
      const violations = this.analyzeFile(file);
      allViolations.push(...violations);
    }

    const errorCount = allViolations.filter(v => v.severity === 'error').length;
    const warningCount = allViolations.filter(v => v.severity === 'warning').length;
    
    const architecturalScore = Math.max(0, 100 - (errorCount * 10) - (warningCount * 3));

    return {
      violations: allViolations,
      rulesApplied: this.rules.length,
      filesScanned: files.length,
      architecturalScore,
      timestamp: new Date().toISOString()
    };
  }

  public getRules(): ArchitecturalRule[] {
    return [...this.rules];
  }

  public addCustomRule(rule: ArchitecturalRule): void {
    this.rules.push(rule);
  }

  private findViolationLine(content: string, rule: ArchitecturalRule): number {
    if (typeof rule.pattern === 'function') {
      return 1; // Cannot determine line for function-based rules
    }

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (rule.pattern.test(lines[i])) {
        return i + 1;
      }
    }
    return 1;
  }

  private generateSuggestion(rule: ArchitecturalRule): string {
    const suggestions: Record<string, string> = {
      'ARCH-001': 'Use React Context API or a state management library like Redux/Zustand',
      'ARCH-002': 'Extract business logic to a service file in /services directory',
      'ARCH-003': 'Break component into smaller, focused sub-components',
      'ARCH-004': 'Organize imports: React → External → Internal → Types → Styles',
      'ARCH-005': 'Move secrets to .env file and use process.env',
      'ARCH-006': 'Use CSS modules, Tailwind classes, or styled-components',
      'ARCH-007': 'Define handler functions outside JSX or use useCallback',
      'ARCH-008': 'Add explicit TypeScript type annotations',
      'ARCH-009': 'Use useRef hook for DOM references',
      'ARCH-010': 'Move API calls to service layer',
      'ARCH-011': 'Use safe rendering methods or sanitize HTML input',
      'ARCH-012': 'Wrap expensive computations in useMemo hook'
    };

    return suggestions[rule.id] || 'Review and refactor according to best practices';
  }
}

export const staticAnalysisRulesService = StaticAnalysisRulesService.getInstance();
