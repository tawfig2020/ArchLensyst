/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-DEPENDENCY-AUDIT-SENTINEL
 */

import { CodeFile } from '../types';

export interface DependencyVulnerability {
  packageName: string;
  version: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cveId?: string;
  description: string;
  recommendation: string;
  patchedVersion?: string;
}

export interface CompatibilityIssue {
  packageName: string;
  version: string;
  runtime: string;
  issue: string;
  alternative?: string;
}

export interface DependencyAuditReport {
  vulnerabilities: DependencyVulnerability[];
  compatibilityIssues: CompatibilityIssue[];
  highRiskPackages: {
    name: string;
    reason: string;
    alternative?: string;
  }[];
  totalDependencies: number;
  auditScore: number;
  timestamp: string;
}

class DependencyAuditService {
  private static instance: DependencyAuditService | undefined;
  private knownVulnerabilities: Map<string, DependencyVulnerability[]>;
  private runtimeCompatibility: Map<string, string[]>;

  private constructor() {
    this.knownVulnerabilities = new Map();
    this.runtimeCompatibility = new Map();
    this.initializeKnownIssues();
  }

  public static getInstance(): DependencyAuditService {
    if (!DependencyAuditService.instance) {
      DependencyAuditService.instance = new DependencyAuditService();
    }
    return DependencyAuditService.instance;
  }

  private initializeKnownIssues() {
    // Known high-risk patterns
    this.knownVulnerabilities.set('node-domexception', [{
      packageName: 'node-domexception',
      version: '1.0.0',
      severity: 'low',
      description: 'Deprecated package - use platform native DOMException',
      recommendation: 'Remove dependency and use native DOMException',
    }]);

    // Runtime compatibility database
    this.runtimeCompatibility.set('cloudflare_workers', [
      'fs', 'path', 'crypto', 'buffer', 'stream', 'net', 'http', 'https'
    ]);
  }

  public async analyzeDependencies(packageJsonPath?: string): Promise<DependencyAuditReport> {
    const vulnerabilities: DependencyVulnerability[] = [];
    const compatibilityIssues: CompatibilityIssue[] = [];
    const highRiskPackages: { name: string; reason: string; alternative?: string }[] = [];

    try {
      // Read package.json
      const response = await fetch('/package.json');
      const packageJson = await response.json();
      
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      const totalDependencies = Object.keys(allDeps).length;

      // Analyze each dependency
      for (const [name, version] of Object.entries(allDeps)) {
        // Check for known vulnerabilities
        const knownVulns = this.knownVulnerabilities.get(name);
        if (knownVulns) {
          vulnerabilities.push(...knownVulns);
        }

        // Check for deprecated packages
        if (name.includes('deprecated') || version === '1.0.0') {
          highRiskPackages.push({
            name,
            reason: 'Potentially deprecated or unmaintained package',
            alternative: this.suggestAlternative(name)
          });
        }

        // Check for security-sensitive packages
        if (this.isSecuritySensitive(name)) {
          highRiskPackages.push({
            name,
            reason: 'Security-sensitive package requiring careful version management',
          });
        }
      }

      // Calculate audit score (0-100)
      const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
      const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
      const auditScore = Math.max(0, 100 - (criticalCount * 25) - (highCount * 10) - (highRiskPackages.length * 5));

      return {
        vulnerabilities,
        compatibilityIssues,
        highRiskPackages,
        totalDependencies,
        auditScore,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[DependencyAudit] Error analyzing dependencies:', error);
      return {
        vulnerabilities: [],
        compatibilityIssues: [],
        highRiskPackages: [],
        totalDependencies: 0,
        auditScore: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  public async checkCloudflareWorkersCompatibility(dependencies: Record<string, string>): Promise<CompatibilityIssue[]> {
    const issues: CompatibilityIssue[] = [];
    const incompatibleModules = this.runtimeCompatibility.get('cloudflare_workers') || [];

    for (const [name, version] of Object.entries(dependencies)) {
      if (incompatibleModules.some(mod => name.includes(mod))) {
        issues.push({
          packageName: name,
          version: version as string,
          runtime: 'Cloudflare Workers',
          issue: `Package uses Node.js APIs not available in Cloudflare Workers`,
          alternative: this.suggestCloudflareAlternative(name)
        });
      }
    }

    return issues;
  }

  private isSecuritySensitive(packageName: string): boolean {
    const sensitivePatterns = ['crypto', 'auth', 'jwt', 'password', 'security', 'oauth', 'session'];
    return sensitivePatterns.some(pattern => packageName.toLowerCase().includes(pattern));
  }

  private suggestAlternative(packageName: string): string | undefined {
    const alternatives: Record<string, string> = {
      'node-domexception': 'Use native DOMException',
      'request': 'node-fetch or axios',
      'moment': 'date-fns or dayjs',
      'lodash': 'lodash-es (tree-shakeable)',
    };
    return alternatives[packageName];
  }

  private suggestCloudflareAlternative(packageName: string): string | undefined {
    const alternatives: Record<string, string> = {
      'fs': 'Use Cloudflare KV or R2',
      'crypto': 'Use Web Crypto API',
      'buffer': 'Use ArrayBuffer or Uint8Array',
      'stream': 'Use ReadableStream/WritableStream',
    };
    
    for (const [key, value] of Object.entries(alternatives)) {
      if (packageName.includes(key)) {
        return value;
      }
    }
    return undefined;
  }
}

export const dependencyAuditService = DependencyAuditService.getInstance();
