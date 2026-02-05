/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-WASM-PARSER-SENTINEL
 */

import { Language, ParsedMetadata, RuleViolation } from '../types';

class WasmParserService {
  private static instance: WasmParserService;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): WasmParserService {
    if (!WasmParserService.instance) {
      WasmParserService.instance = new WasmParserService();
    }
    return WasmParserService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    // Simulate WASM binary loading and worker initialization
    await new Promise(r => setTimeout(r, 300));
    console.log('ArchLens: WASM Strategic Parser Layer Active.');
    this.isInitialized = true;
  }

  /**
   * High-performance structural extraction and lightweight static analysis.
   */
  public async parseStructuralMetadata(content: string, lang: Language): Promise<{ metadata: ParsedMetadata, localViolations: RuleViolation[] }> {
    if (!this.isInitialized) await this.initialize();
    
    // Simulate non-blocking background thread processing
    await new Promise(r => setTimeout(r, 15));

    const metadata: ParsedMetadata = {
      exports: [],
      imports: [],
      functions: [],
      observabilityGap: 0,
      securityVulnerabilityCount: 0
    };

    const localViolations: RuleViolation[] = [];
    const lines = content.split('\n');
    
    const isUIFile = content.includes('React') || content.includes('JSX') || content.includes('Component') || content.includes('View');

    // RULE-008: Component Monolith (File length check)
    if (lines.length > 500) {
      localViolations.push({
        ruleId: 'RULE-008',
        severity: 'warning',
        message: 'Architectural Monolith: Source file exceeds 500 lines.',
        line: 1,
        suggestion: 'Decompose this file into smaller, specialized modules or sub-components.'
      });
    }

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // 1. Import Detection & Layer Boundaries
      const importMatch = line.match(/(?:import|require)\s+.*?\s+(?:from\s+)?['"](.*?)['"]/);
      if (importMatch) {
        const source = importMatch[1];
        metadata.imports.push({ source });
        
        // RULE-005: UI -> DB Leakage
        if (isUIFile && (source.includes('database') || source.includes('prisma') || source.includes('mongodb') || source.includes('sql'))) {
          localViolations.push({
            ruleId: 'RULE-005',
            severity: 'error',
            message: 'Architectural Layer Breach: UI logic should not import database drivers directly.',
            line: lineNum,
            suggestion: 'Refactor database logic into a dedicated service or repository layer.'
          });
        }
      }

      // 2. Export Detection
      if (line.match(/export\s+(?:const|function|class|type|interface|default)/)) {
        metadata.exports.push(line.trim().slice(0, 100));
      }

      // 3. Function/Method Detection
      const funcMatch = line.match(/(?:function|class|const|let)\s+([a-zA-Z0-9_]+)\s*(?:=|[:(])/);
      if (funcMatch && !['import', 'from', 'export'].includes(funcMatch[1])) {
        metadata.functions.push({ name: funcMatch[1], line: lineNum });
      }

      // 4. RULE-006: Strict Typing (any usage)
      if (line.includes(': any') || line.includes('<any>')) {
        localViolations.push({
          ruleId: 'RULE-006',
          severity: 'warning',
          message: 'Coding Standard Violation: "any" type suppresses architectural safety.',
          line: lineNum,
          suggestion: 'Replace "any" with a concrete interface or "unknown" if the type is truly dynamic.'
        });
      }

      // 5. RULE-007: Environment Leakage
      if (isUIFile && (line.includes('process.env') || line.includes('import.meta.env'))) {
        localViolations.push({
          ruleId: 'RULE-007',
          severity: 'error',
          message: 'Security Risk: Direct environment access in UI logic.',
          line: lineNum,
          suggestion: 'Pass configuration values through a context provider or inject them via props.'
        });
      }

      // 6. RULE-009: Direct DOM Manipulation in React
      if (isUIFile && (line.includes('document.get') || line.includes('document.query') || line.includes('.innerHTML'))) {
        localViolations.push({
          ruleId: 'RULE-009',
          severity: 'error',
          message: 'Anti-Pattern: Direct DOM manipulation detected in React code.',
          line: lineNum,
          suggestion: 'Use React "refs" or state management to interact with the DOM safely.'
        });
      }

      // 7. RULE-010: Unbounded Side Effect (Simple regex for useEffect without cleanup)
      if (line.includes('useEffect(') && !content.slice(lineNum * 50).includes('return () =>')) {
         // This is a very rough heuristic for demo purposes
         if (line.includes('setInterval') || line.includes('addEventListener')) {
            localViolations.push({
              ruleId: 'RULE-010',
              severity: 'warning',
              message: 'Reliability Risk: Side effect detected potentially lacking cleanup.',
              line: lineNum,
              suggestion: 'Ensure the useEffect return function clears intervals or removes listeners.'
            });
         }
      }

      // 8. Basic security heuristics
      if (line.includes('eval(') || line.includes('dangerouslySetInnerHTML')) {
        metadata.securityVulnerabilityCount!++;
      }

      // 9. Heuristic Prop Drilling (Rough check for many props in functional components)
      if (line.includes('Props') && line.includes('{') && line.length > 150) {
        localViolations.push({
          ruleId: 'RULE-003',
          severity: 'info',
          message: 'Prop Drilling Alert: Component signature contains excessive props.',
          line: lineNum,
          suggestion: 'Consider decomposing the component or using a State Management store.'
        });
      }
    });

    metadata.observabilityGap = metadata.functions.length > 5 && !content.includes('console.log') ? 70 : 10;

    return { metadata, localViolations };
  }
}

export const wasmParser = WasmParserService.getInstance();