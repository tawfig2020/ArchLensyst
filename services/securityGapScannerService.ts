/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SECURITY-GAP-SCANNER
 */

import { CodeFile } from '../types';

export interface SecurityGap {
  id: string;
  type: 'vulnerability' | 'leak' | 'misconfiguration' | 'injection';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  line: number;
  cwe?: string;
  recommendation: string;
  codeSnippet?: string;
}

export interface SecurityScanReport {
  gaps: SecurityGap[];
  securityScore: number;
  leakedSecrets: {
    type: string;
    location: string;
    severity: string;
  }[];
  vulnerabilityCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  timestamp: string;
}

class SecurityGapScannerService {
  private static instance: SecurityGapScannerService | undefined;
  private secretPatterns: Map<string, RegExp>;
  private vulnerabilityPatterns: Map<string, RegExp>;

  private constructor() {
    this.secretPatterns = new Map();
    this.vulnerabilityPatterns = new Map();
    this.initializePatterns();
  }

  public static getInstance(): SecurityGapScannerService {
    if (!SecurityGapScannerService.instance) {
      SecurityGapScannerService.instance = new SecurityGapScannerService();
    }
    return SecurityGapScannerService.instance;
  }

  private initializePatterns() {
    // Secret detection patterns
    this.secretPatterns.set('AWS_KEY', /AKIA[0-9A-Z]{16}/);
    this.secretPatterns.set('PRIVATE_KEY', /-----BEGIN (RSA |EC )?PRIVATE KEY-----/);
    this.secretPatterns.set('API_KEY', /(api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/i);
    this.secretPatterns.set('PASSWORD', /(password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/i);
    this.secretPatterns.set('JWT_TOKEN', /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/);
    this.secretPatterns.set('OAUTH_TOKEN', /(oauth|bearer)\s+[a-zA-Z0-9_-]{20,}/i);
    this.secretPatterns.set('GITHUB_TOKEN', /gh[pousr]_[A-Za-z0-9_]{36,}/);
    this.secretPatterns.set('SLACK_TOKEN', /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24,}/);

    // Vulnerability patterns
    this.vulnerabilityPatterns.set('SQL_INJECTION', /execute\(.*\+.*\)|query\(.*\+.*\)/);
    this.vulnerabilityPatterns.set('XSS', /dangerouslySetInnerHTML|innerHTML\s*=|document\.write/);
    this.vulnerabilityPatterns.set('EVAL', /eval\(|Function\(|setTimeout\([^,]+,|setInterval\([^,]+,/);
    this.vulnerabilityPatterns.set('INSECURE_RANDOM', /Math\.random\(\)/);
    this.vulnerabilityPatterns.set('WEAK_CRYPTO', /md5|sha1(?!256)/i);
    this.vulnerabilityPatterns.set('OPEN_REDIRECT', /window\.location\s*=\s*[^'"]/);
    this.vulnerabilityPatterns.set('PROTOTYPE_POLLUTION', /__proto__|constructor\[/);
    this.vulnerabilityPatterns.set('COMMAND_INJECTION', /exec\(|spawn\(|execSync\(/);
  }

  public async scanFile(file: CodeFile): Promise<SecurityScanReport> {
    const gaps: SecurityGap[] = [];
    const leakedSecrets: { type: string; location: string; severity: string }[] = [];

    const lines = file.content.split('\n');

    // Scan for leaked secrets
    for (const [secretType, pattern] of this.secretPatterns.entries()) {
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          const match = line.match(pattern);
          gaps.push({
            id: `SEC-LEAK-${gaps.length + 1}`,
            type: 'leak',
            severity: 'critical',
            title: `Leaked ${secretType}`,
            description: `Detected hardcoded ${secretType} in source code`,
            file: file.path,
            line: index + 1,
            cwe: 'CWE-798',
            recommendation: 'Move sensitive data to environment variables (.env file)',
            codeSnippet: line.trim()
          });

          leakedSecrets.push({
            type: secretType,
            location: `${file.path}:${index + 1}`,
            severity: 'critical'
          });
        }
      });
    }

    // Scan for vulnerabilities
    for (const [vulnType, pattern] of this.vulnerabilityPatterns.entries()) {
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          gaps.push({
            id: `SEC-VULN-${gaps.length + 1}`,
            type: 'vulnerability',
            severity: this.getSeverityForVulnerability(vulnType),
            title: `${vulnType.replace(/_/g, ' ')} Vulnerability`,
            description: this.getVulnerabilityDescription(vulnType),
            file: file.path,
            line: index + 1,
            cwe: this.getCWEForVulnerability(vulnType),
            recommendation: this.getRecommendationForVulnerability(vulnType),
            codeSnippet: line.trim()
          });
        }
      });
    }

    // Additional security checks
    this.checkInsecureProtocols(file, gaps);
    this.checkMissingInputValidation(file, gaps);
    this.checkInsecureHeaders(file, gaps);

    // Calculate security score
    const vulnerabilityCount = {
      critical: gaps.filter(g => g.severity === 'critical').length,
      high: gaps.filter(g => g.severity === 'high').length,
      medium: gaps.filter(g => g.severity === 'medium').length,
      low: gaps.filter(g => g.severity === 'low').length
    };

    const securityScore = Math.max(0, 100 - 
      (vulnerabilityCount.critical * 25) - 
      (vulnerabilityCount.high * 15) - 
      (vulnerabilityCount.medium * 8) - 
      (vulnerabilityCount.low * 3)
    );

    return {
      gaps,
      securityScore,
      leakedSecrets,
      vulnerabilityCount,
      timestamp: new Date().toISOString()
    };
  }

  private checkInsecureProtocols(file: CodeFile, gaps: SecurityGap[]): void {
    const httpPattern = /['"]http:\/\//g;
    const lines = file.content.split('\n');
    
    lines.forEach((line, index) => {
      if (httpPattern.test(line) && !line.includes('localhost')) {
        gaps.push({
          id: `SEC-PROTO-${gaps.length + 1}`,
          type: 'misconfiguration',
          severity: 'medium',
          title: 'Insecure Protocol',
          description: 'Using HTTP instead of HTTPS for external resources',
          file: file.path,
          line: index + 1,
          cwe: 'CWE-319',
          recommendation: 'Use HTTPS for all external resources',
          codeSnippet: line.trim()
        });
      }
    });
  }

  private checkMissingInputValidation(file: CodeFile, gaps: SecurityGap[]): void {
    const userInputPattern = /\.(value|innerHTML|textContent)\s*=|params\.|query\.|body\./;
    const validationPattern = /validate|sanitize|escape|trim/i;
    
    const lines = file.content.split('\n');
    lines.forEach((line, index) => {
      if (userInputPattern.test(line) && !validationPattern.test(line)) {
        gaps.push({
          id: `SEC-INPUT-${gaps.length + 1}`,
          type: 'vulnerability',
          severity: 'high',
          title: 'Missing Input Validation',
          description: 'User input is not validated or sanitized',
          file: file.path,
          line: index + 1,
          cwe: 'CWE-20',
          recommendation: 'Validate and sanitize all user inputs before processing',
          codeSnippet: line.trim()
        });
      }
    });
  }

  private checkInsecureHeaders(file: CodeFile, gaps: SecurityGap[]): void {
    if (file.content.includes('express') || file.content.includes('cors')) {
      if (!file.content.includes('helmet') && !file.content.includes('Content-Security-Policy')) {
        gaps.push({
          id: `SEC-HEADER-${gaps.length + 1}`,
          type: 'misconfiguration',
          severity: 'medium',
          title: 'Missing Security Headers',
          description: 'Application lacks security headers (CSP, X-Frame-Options, etc.)',
          file: file.path,
          line: 1,
          cwe: 'CWE-693',
          recommendation: 'Implement security headers using helmet.js or manual configuration'
        });
      }
    }
  }

  private getSeverityForVulnerability(vulnType: string): 'critical' | 'high' | 'medium' | 'low' {
    const severityMap: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
      'SQL_INJECTION': 'critical',
      'XSS': 'high',
      'EVAL': 'high',
      'COMMAND_INJECTION': 'critical',
      'PROTOTYPE_POLLUTION': 'high',
      'OPEN_REDIRECT': 'medium',
      'INSECURE_RANDOM': 'low',
      'WEAK_CRYPTO': 'medium'
    };
    return severityMap[vulnType] || 'medium';
  }

  private getVulnerabilityDescription(vulnType: string): string {
    const descriptions: Record<string, string> = {
      'SQL_INJECTION': 'Potential SQL injection vulnerability from unsanitized input',
      'XSS': 'Cross-Site Scripting (XSS) vulnerability detected',
      'EVAL': 'Dangerous use of eval() or dynamic code execution',
      'COMMAND_INJECTION': 'Command injection vulnerability from unsanitized input',
      'PROTOTYPE_POLLUTION': 'Prototype pollution vulnerability detected',
      'OPEN_REDIRECT': 'Open redirect vulnerability',
      'INSECURE_RANDOM': 'Using Math.random() for security-sensitive operations',
      'WEAK_CRYPTO': 'Using weak cryptographic algorithm (MD5/SHA1)'
    };
    return descriptions[vulnType] || 'Security vulnerability detected';
  }

  private getCWEForVulnerability(vulnType: string): string {
    const cweMap: Record<string, string> = {
      'SQL_INJECTION': 'CWE-89',
      'XSS': 'CWE-79',
      'EVAL': 'CWE-95',
      'COMMAND_INJECTION': 'CWE-78',
      'PROTOTYPE_POLLUTION': 'CWE-1321',
      'OPEN_REDIRECT': 'CWE-601',
      'INSECURE_RANDOM': 'CWE-330',
      'WEAK_CRYPTO': 'CWE-327'
    };
    return cweMap[vulnType] || 'CWE-Unknown';
  }

  private getRecommendationForVulnerability(vulnType: string): string {
    const recommendations: Record<string, string> = {
      'SQL_INJECTION': 'Use parameterized queries or ORM with proper escaping',
      'XSS': 'Sanitize user input and use safe rendering methods',
      'EVAL': 'Avoid eval() and dynamic code execution; use safer alternatives',
      'COMMAND_INJECTION': 'Validate and sanitize all input before executing commands',
      'PROTOTYPE_POLLUTION': 'Use Object.create(null) or validate object keys',
      'OPEN_REDIRECT': 'Validate redirect URLs against whitelist',
      'INSECURE_RANDOM': 'Use crypto.randomBytes() for security-sensitive operations',
      'WEAK_CRYPTO': 'Use SHA-256 or stronger cryptographic algorithms'
    };
    return recommendations[vulnType] || 'Review and fix security issue';
  }
}

export const securityGapScannerService = SecurityGapScannerService.getInstance();
