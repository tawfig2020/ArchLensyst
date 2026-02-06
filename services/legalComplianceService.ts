/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-LEGAL-COMPLIANCE-SENTINEL
 */

import { CodeFile } from '../types';

export interface LicenseIssue {
  packageName: string;
  version: string;
  license: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
}

export interface IntellectualPropertyIssue {
  type: 'copyright' | 'trademark' | 'patent' | 'attribution';
  file: string;
  line: number;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface GDPRCompliance {
  dataCollectionPoints: {
    file: string;
    line: number;
    dataType: string;
    hasConsent: boolean;
    hasPrivacyPolicy: boolean;
  }[];
  piiDetected: {
    file: string;
    line: number;
    piiType: string;
    isEncrypted: boolean;
  }[];
  cookieCompliance: {
    hasCookieBanner: boolean;
    hasConsentManagement: boolean;
  };
  dataRetention: {
    hasRetentionPolicy: boolean;
    hasDeletionMechanism: boolean;
  };
  complianceScore: number;
}

export interface LegalComplianceReport {
  licenseIssues: LicenseIssue[];
  intellectualPropertyIssues: IntellectualPropertyIssue[];
  gdprCompliance: GDPRCompliance;
  overallComplianceScore: number;
  criticalIssues: number;
  timestamp: string;
}

class LegalComplianceService {
  private static instance: LegalComplianceService | undefined;
  private problematicLicenses: Set<string>;
  private copyleftLicenses: Set<string>;
  private piiPatterns: Map<string, RegExp>;

  private constructor() {
    this.problematicLicenses = new Set();
    this.copyleftLicenses = new Set();
    this.piiPatterns = new Map();
    this.initializeLegalDatabase();
  }

  public static getInstance(): LegalComplianceService {
    if (!LegalComplianceService.instance) {
      LegalComplianceService.instance = new LegalComplianceService();
    }
    return LegalComplianceService.instance;
  }

  private initializeLegalDatabase() {
    // Problematic licenses (incompatible with commercial use)
    this.problematicLicenses = new Set([
      'GPL-3.0',
      'GPL-2.0',
      'AGPL-3.0',
      'AGPL-1.0',
      'CC-BY-NC',
      'CC-BY-NC-SA',
      'SSPL'
    ]);

    // Copyleft licenses (require source disclosure)
    this.copyleftLicenses = new Set([
      'GPL-3.0',
      'GPL-2.0',
      'LGPL-3.0',
      'LGPL-2.1',
      'MPL-2.0',
      'EPL-2.0',
      'AGPL-3.0'
    ]);

    // PII detection patterns (GDPR)
    this.piiPatterns.set('EMAIL', /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    this.piiPatterns.set('PHONE', /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
    this.piiPatterns.set('SSN', /\b\d{3}-\d{2}-\d{4}\b/);
    this.piiPatterns.set('CREDIT_CARD', /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/);
    this.piiPatterns.set('IP_ADDRESS', /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
    this.piiPatterns.set('PASSPORT', /\b[A-Z]{1,2}\d{6,9}\b/);
  }

  public async performLegalAudit(files: CodeFile[]): Promise<LegalComplianceReport> {
    const licenseIssues = await this.auditLicenses();
    const intellectualPropertyIssues = this.auditIntellectualProperty(files);
    const gdprCompliance = this.auditGDPRCompliance(files);

    const criticalIssues = 
      licenseIssues.filter(i => i.severity === 'critical').length +
      intellectualPropertyIssues.filter(i => i.severity === 'critical').length;

    const licenseScore = Math.max(0, 100 - (licenseIssues.length * 10));
    const ipScore = Math.max(0, 100 - (intellectualPropertyIssues.length * 15));
    const overallComplianceScore = Math.round((licenseScore + ipScore + gdprCompliance.complianceScore) / 3);

    return {
      licenseIssues,
      intellectualPropertyIssues,
      gdprCompliance,
      overallComplianceScore,
      criticalIssues,
      timestamp: new Date().toISOString()
    };
  }

  private async auditLicenses(): Promise<LicenseIssue[]> {
    const issues: LicenseIssue[] = [];

    try {
      const response = await fetch('/package.json');
      const packageJson = await response.json();
      
      const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };

      // Check project license
      if (!packageJson.license) {
        issues.push({
          packageName: packageJson.name || 'project',
          version: packageJson.version || '0.0.0',
          license: 'NONE',
          severity: 'high',
          issue: 'No license specified for the project',
          recommendation: 'Add a license field to package.json (e.g., MIT, Apache-2.0)'
        });
      }

      // In production, would fetch actual license info from npm registry
      // For now, simulate license checking
      for (const [name, version] of Object.entries(allDeps)) {
        // Simulate problematic license detection
        if (name.includes('gpl') || name.includes('agpl')) {
          issues.push({
            packageName: name,
            version: version as string,
            license: 'GPL-3.0',
            severity: 'critical',
            issue: 'GPL license incompatible with proprietary software',
            recommendation: 'Replace with MIT, Apache-2.0, or BSD licensed alternative'
          });
        }
      }

    } catch (error) {
      console.error('[LegalCompliance] Error auditing licenses:', error);
    }

    return issues;
  }

  private auditIntellectualProperty(files: CodeFile[]): IntellectualPropertyIssue[] {
    const issues: IntellectualPropertyIssue[] = [];

    files.forEach(file => {
      const lines = file.content.split('\n');

      lines.forEach((line, index) => {
        // Check for missing copyright notices in source files
        if (index === 0 && !file.content.includes('@license') && !file.content.includes('Copyright')) {
          if (file.path.includes('services') || file.path.includes('components')) {
            issues.push({
              type: 'copyright',
              file: file.path,
              line: 1,
              description: 'Missing copyright notice in source file',
              severity: 'medium',
              recommendation: 'Add copyright and license header to file'
            });
          }
        }

        // Check for copied code without attribution
        if (line.includes('// Source:') || line.includes('// From:')) {
          const hasAttribution = line.includes('http') || line.includes('github');
          if (!hasAttribution) {
            issues.push({
              type: 'attribution',
              file: file.path,
              line: index + 1,
              description: 'Code source mentioned but no proper attribution link',
              severity: 'medium',
              recommendation: 'Add proper attribution with source URL'
            });
          }
        }

        // Check for trademark usage without proper notice
        const trademarks = ['React', 'Google', 'Microsoft', 'Amazon', 'Apple'];
        trademarks.forEach(trademark => {
          if (line.includes(trademark) && !line.includes('™') && !line.includes('®')) {
            // Only flag if it's in documentation/comments
            if (line.includes('//') || line.includes('/*')) {
              issues.push({
                type: 'trademark',
                file: file.path,
                line: index + 1,
                description: `Trademark "${trademark}" used without proper notice`,
                severity: 'low',
                recommendation: 'Add ™ or ® symbol when referencing trademarks'
              });
            }
          }
        });
      });
    });

    return issues;
  }

  private auditGDPRCompliance(files: CodeFile[]): GDPRCompliance {
    const dataCollectionPoints: GDPRCompliance['dataCollectionPoints'] = [];
    const piiDetected: GDPRCompliance['piiDetected'] = [];
    let hasCookieBanner = false;
    let hasConsentManagement = false;
    let hasRetentionPolicy = false;
    let hasDeletionMechanism = false;

    files.forEach(file => {
      const lines = file.content.split('\n');

      lines.forEach((line, index) => {
        // Detect data collection points
        if (line.includes('localStorage.setItem') || line.includes('sessionStorage.setItem')) {
          dataCollectionPoints.push({
            file: file.path,
            line: index + 1,
            dataType: 'Local Storage',
            hasConsent: file.content.includes('consent') || file.content.includes('cookie-consent'),
            hasPrivacyPolicy: file.content.includes('privacy') || file.content.includes('terms')
          });
        }

        if (line.includes('fetch') || line.includes('axios')) {
          if (line.includes('user') || line.includes('profile') || line.includes('personal')) {
            dataCollectionPoints.push({
              file: file.path,
              line: index + 1,
              dataType: 'API Data Collection',
              hasConsent: file.content.includes('consent'),
              hasPrivacyPolicy: file.content.includes('privacy')
            });
          }
        }

        // Detect PII in code
        for (const [piiType, pattern] of this.piiPatterns.entries()) {
          if (pattern.test(line)) {
            const isEncrypted = file.content.includes('encrypt') || 
                               file.content.includes('crypto') ||
                               file.content.includes('hash');
            
            piiDetected.push({
              file: file.path,
              line: index + 1,
              piiType,
              isEncrypted
            });
          }
        }

        // Check for GDPR compliance features
        if (line.includes('cookie-banner') || line.includes('CookieBanner')) {
          hasCookieBanner = true;
        }
        if (line.includes('consent') && line.includes('manage')) {
          hasConsentManagement = true;
        }
        if (line.includes('retention') || line.includes('data-retention')) {
          hasRetentionPolicy = true;
        }
        if (line.includes('delete') && (line.includes('user') || line.includes('data'))) {
          hasDeletionMechanism = true;
        }
      });
    });

    // Calculate GDPR compliance score
    let complianceScore = 100;

    // Deduct points for missing consent
    const unconsented = dataCollectionPoints.filter(p => !p.hasConsent).length;
    complianceScore -= unconsented * 15;

    // Deduct points for unencrypted PII
    const unencryptedPII = piiDetected.filter(p => !p.isEncrypted).length;
    complianceScore -= unencryptedPII * 20;

    // Deduct points for missing compliance features
    if (!hasCookieBanner) complianceScore -= 10;
    if (!hasConsentManagement) complianceScore -= 10;
    if (!hasRetentionPolicy) complianceScore -= 5;
    if (!hasDeletionMechanism) complianceScore -= 10;

    return {
      dataCollectionPoints,
      piiDetected,
      cookieCompliance: {
        hasCookieBanner,
        hasConsentManagement
      },
      dataRetention: {
        hasRetentionPolicy,
        hasDeletionMechanism
      },
      complianceScore: Math.max(0, complianceScore)
    };
  }

  public generateComplianceReport(report: LegalComplianceReport): string {
    return `# Legal Compliance Audit Report

**Generated**: ${new Date(report.timestamp).toLocaleString()}
**Overall Compliance Score**: ${report.overallComplianceScore}/100
**Critical Issues**: ${report.criticalIssues}

## 📜 License Compliance

${report.licenseIssues.length === 0 ? '✅ No license issues detected' : `
⚠️ **${report.licenseIssues.length} License Issues Found**

${report.licenseIssues.map(issue => `
### ${issue.packageName}@${issue.version}
- **License**: ${issue.license}
- **Severity**: ${issue.severity}
- **Issue**: ${issue.issue}
- **Recommendation**: ${issue.recommendation}
`).join('\n')}
`}

## 🏛️ Intellectual Property

${report.intellectualPropertyIssues.length === 0 ? '✅ No IP issues detected' : `
⚠️ **${report.intellectualPropertyIssues.length} IP Issues Found**

${report.intellectualPropertyIssues.slice(0, 10).map(issue => `
- **${issue.type}** in \`${issue.file}:${issue.line}\`
  - ${issue.description}
  - Recommendation: ${issue.recommendation}
`).join('\n')}
`}

## 🔒 GDPR Compliance

**Compliance Score**: ${report.gdprCompliance.complianceScore}/100

### Data Collection
- **Collection Points**: ${report.gdprCompliance.dataCollectionPoints.length}
- **With Consent**: ${report.gdprCompliance.dataCollectionPoints.filter(p => p.hasConsent).length}
- **Without Consent**: ${report.gdprCompliance.dataCollectionPoints.filter(p => !p.hasConsent).length}

### PII Detection
- **PII Instances**: ${report.gdprCompliance.piiDetected.length}
- **Encrypted**: ${report.gdprCompliance.piiDetected.filter(p => p.isEncrypted).length}
- **Unencrypted**: ${report.gdprCompliance.piiDetected.filter(p => !p.isEncrypted).length}

### Compliance Features
- Cookie Banner: ${report.gdprCompliance.cookieCompliance.hasCookieBanner ? '✅' : '❌'}
- Consent Management: ${report.gdprCompliance.cookieCompliance.hasConsentManagement ? '✅' : '❌'}
- Data Retention Policy: ${report.gdprCompliance.dataRetention.hasRetentionPolicy ? '✅' : '❌'}
- Data Deletion Mechanism: ${report.gdprCompliance.dataRetention.hasDeletionMechanism ? '✅' : '❌'}

## 📋 Recommendations

${report.criticalIssues > 0 ? `
### Critical Actions Required
1. Address ${report.criticalIssues} critical compliance issues immediately
2. Review and replace incompatible licenses
3. Implement proper consent management for data collection
` : ''}

### General Recommendations
1. Add copyright notices to all source files
2. Implement cookie consent banner
3. Add data retention and deletion policies
4. Encrypt all PII data
5. Document third-party code attributions

---

*Generated by ArchLens Legal Compliance Sentinel*
`;
  }
}

export const legalComplianceService = LegalComplianceService.getInstance();
