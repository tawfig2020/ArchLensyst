/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-PERFORMANCE-OPTIMIZER
 */

import { CodeFile } from '../types';

export interface PerformanceIssue {
  id: string;
  type: 'memory_leak' | 'inefficient_algorithm' | 'unnecessary_render' | 'blocking_operation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  line: number;
  impact: string;
  recommendation: string;
  codeSnippet?: string;
}

export interface PerformanceOptimizationReport {
  issues: PerformanceIssue[];
  performanceScore: number;
  resourceLeaks: {
    type: string;
    location: string;
    severity: string;
  }[];
  algorithmicComplexity: {
    function: string;
    complexity: string;
    recommendation: string;
  }[];
  optimizationOpportunities: string[];
  timestamp: string;
}

class PerformanceOptimizerService {
  private static instance: PerformanceOptimizerService | undefined;

  private constructor() {}

  public static getInstance(): PerformanceOptimizerService {
    if (!PerformanceOptimizerService.instance) {
      PerformanceOptimizerService.instance = new PerformanceOptimizerService();
    }
    return PerformanceOptimizerService.instance;
  }

  public async analyzeFile(file: CodeFile): Promise<PerformanceOptimizationReport> {
    const issues: PerformanceIssue[] = [];
    const resourceLeaks: { type: string; location: string; severity: string }[] = [];
    const algorithmicComplexity: { function: string; complexity: string; recommendation: string }[] = [];
    const optimizationOpportunities: string[] = [];

    const lines = file.content.split('\n');

    // Check for memory leaks
    this.detectMemoryLeaks(file, lines, issues, resourceLeaks);

    // Check for inefficient algorithms
    this.detectInefficientAlgorithms(file, lines, issues, algorithmicComplexity);

    // Check for unnecessary re-renders
    this.detectUnnecessaryRenders(file, lines, issues);

    // Check for blocking operations
    this.detectBlockingOperations(file, lines, issues);

    // Identify optimization opportunities
    this.identifyOptimizationOpportunities(file, optimizationOpportunities);

    // Calculate performance score
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    const mediumCount = issues.filter(i => i.severity === 'medium').length;

    const performanceScore = Math.max(0, 100 - 
      (criticalCount * 20) - 
      (highCount * 12) - 
      (mediumCount * 6)
    );

    return {
      issues,
      performanceScore,
      resourceLeaks,
      algorithmicComplexity,
      optimizationOpportunities,
      timestamp: new Date().toISOString()
    };
  }

  private detectMemoryLeaks(
    file: CodeFile, 
    lines: string[], 
    issues: PerformanceIssue[], 
    resourceLeaks: { type: string; location: string; severity: string }[]
  ): void {
    // Check for missing cleanup in useEffect
    lines.forEach((line, index) => {
      if (line.includes('useEffect')) {
        const effectBlock = this.extractBlock(lines, index);
        const hasEventListener = /addEventListener/.test(effectBlock);
        const hasInterval = /setInterval|setTimeout/.test(effectBlock);
        const hasSubscription = /subscribe/.test(effectBlock);
        const hasCleanup = /return\s*\(\s*\)\s*=>|return\s*function/.test(effectBlock);

        if ((hasEventListener || hasInterval || hasSubscription) && !hasCleanup) {
          issues.push({
            id: `PERF-LEAK-${issues.length + 1}`,
            type: 'memory_leak',
            severity: 'high',
            title: 'Missing Cleanup in useEffect',
            description: 'useEffect with side effects lacks cleanup function',
            file: file.path,
            line: index + 1,
            impact: 'Memory leak - event listeners/intervals not cleaned up',
            recommendation: 'Add cleanup function to remove event listeners and clear intervals',
            codeSnippet: line.trim()
          });

          resourceLeaks.push({
            type: hasEventListener ? 'Event Listener' : hasInterval ? 'Timer' : 'Subscription',
            location: `${file.path}:${index + 1}`,
            severity: 'high'
          });
        }
      }
    });

    // Check for large state objects
    lines.forEach((line, index) => {
      if (/useState\s*\(\s*\[/.test(line) || /useState\s*\(\s*\{/.test(line)) {
        const stateSize = line.length;
        if (stateSize > 200) {
          issues.push({
            id: `PERF-STATE-${issues.length + 1}`,
            type: 'memory_leak',
            severity: 'medium',
            title: 'Large State Object',
            description: 'State initialization contains large object/array',
            file: file.path,
            line: index + 1,
            impact: 'Increased memory usage and potential performance degradation',
            recommendation: 'Consider splitting into smaller state pieces or using useReducer',
            codeSnippet: line.trim()
          });
        }
      }
    });
  }

  private detectInefficientAlgorithms(
    file: CodeFile, 
    lines: string[], 
    issues: PerformanceIssue[],
    algorithmicComplexity: { function: string; complexity: string; recommendation: string }[]
  ): void {
    // Nested loops - O(n²) or worse
    lines.forEach((line, index) => {
      if (/\.(map|forEach|filter)\(/.test(line)) {
        const block = this.extractBlock(lines, index);
        const nestedLoops = (block.match(/\.(map|forEach|filter)\(/g) || []).length;
        
        if (nestedLoops > 1) {
          const functionName = this.extractFunctionName(lines, index);
          
          issues.push({
            id: `PERF-ALGO-${issues.length + 1}`,
            type: 'inefficient_algorithm',
            severity: 'high',
            title: 'Nested Array Operations',
            description: `Detected O(n²) complexity from nested ${nestedLoops} array operations`,
            file: file.path,
            line: index + 1,
            impact: 'Exponential time complexity - performance degrades with data size',
            recommendation: 'Refactor to use hash maps, Set, or single-pass algorithms',
            codeSnippet: line.trim()
          });

          algorithmicComplexity.push({
            function: functionName,
            complexity: `O(n^${nestedLoops})`,
            recommendation: 'Use Map/Set for O(1) lookups instead of nested iterations'
          });
        }
      }
    });

    // Inefficient array operations
    lines.forEach((line, index) => {
      // Array.find in loop
      if (/\.(map|forEach).*\.find\(/.test(line)) {
        issues.push({
          id: `PERF-FIND-${issues.length + 1}`,
          type: 'inefficient_algorithm',
          severity: 'medium',
          title: 'Array.find() in Loop',
          description: 'Using find() inside map/forEach creates O(n²) complexity',
          file: file.path,
          line: index + 1,
          impact: 'Poor performance with large datasets',
          recommendation: 'Create a Map/Object lookup before the loop',
          codeSnippet: line.trim()
        });
      }

      // Multiple array operations that could be combined
      if (/\.filter\(.*\)\.map\(/.test(line)) {
        issues.push({
          id: `PERF-CHAIN-${issues.length + 1}`,
          type: 'inefficient_algorithm',
          severity: 'low',
          title: 'Chained Array Operations',
          description: 'Multiple array iterations can be combined',
          file: file.path,
          line: index + 1,
          impact: 'Multiple passes over array data',
          recommendation: 'Combine filter and map into single reduce operation',
          codeSnippet: line.trim()
        });
      }
    });
  }

  private detectUnnecessaryRenders(
    file: CodeFile, 
    lines: string[], 
    issues: PerformanceIssue[]
  ): void {
    // Inline object/array creation in JSX
    lines.forEach((line, index) => {
      if (/\w+={(\{|\[)/.test(line) && !line.includes('style={{')) {
        issues.push({
          id: `PERF-RENDER-${issues.length + 1}`,
          type: 'unnecessary_render',
          severity: 'medium',
          title: 'Inline Object/Array in JSX',
          description: 'Creating new object/array reference on every render',
          file: file.path,
          line: index + 1,
          impact: 'Causes unnecessary child component re-renders',
          recommendation: 'Move object/array outside component or use useMemo',
          codeSnippet: line.trim()
        });
      }
    });

    // Missing React.memo for expensive components
    const hasExpensiveOperations = file.content.includes('.map(') || 
                                   file.content.includes('.filter(') ||
                                   file.content.includes('useMemo');
    const hasMemo = /React\.memo|memo\(/.test(file.content);

    if (hasExpensiveOperations && !hasMemo && file.path.includes('component')) {
      issues.push({
        id: `PERF-MEMO-${issues.length + 1}`,
        type: 'unnecessary_render',
        severity: 'medium',
        title: 'Missing React.memo',
        description: 'Component with expensive operations not memoized',
        file: file.path,
        line: 1,
        impact: 'Component re-renders even when props unchanged',
        recommendation: 'Wrap component with React.memo',
      });
    }

    // Anonymous functions in JSX
    lines.forEach((line, index) => {
      if (/on\w+={(.*?)\s*=>\s*/.test(line)) {
        issues.push({
          id: `PERF-ANON-${issues.length + 1}`,
          type: 'unnecessary_render',
          severity: 'low',
          title: 'Anonymous Function in JSX',
          description: 'Creating new function on every render',
          file: file.path,
          line: index + 1,
          impact: 'Breaks PureComponent/memo optimization',
          recommendation: 'Use useCallback or define handler outside render',
          codeSnippet: line.trim()
        });
      }
    });
  }

  private detectBlockingOperations(
    file: CodeFile, 
    lines: string[], 
    issues: PerformanceIssue[]
  ): void {
    // Synchronous heavy operations
    lines.forEach((line, index) => {
      // Large JSON parsing
      if (/JSON\.parse\(/.test(line) && !line.includes('try')) {
        issues.push({
          id: `PERF-BLOCK-${issues.length + 1}`,
          type: 'blocking_operation',
          severity: 'medium',
          title: 'Unprotected JSON.parse',
          description: 'Synchronous JSON parsing without error handling',
          file: file.path,
          line: index + 1,
          impact: 'Can block main thread and crash app on invalid JSON',
          recommendation: 'Wrap in try-catch and consider async parsing for large data',
          codeSnippet: line.trim()
        });
      }

      // Synchronous localStorage access in render
      if ((/localStorage\.getItem|sessionStorage\.getItem/.test(line)) && 
          !line.includes('useEffect') && !line.includes('useState')) {
        issues.push({
          id: `PERF-STORAGE-${issues.length + 1}`,
          type: 'blocking_operation',
          severity: 'low',
          title: 'Synchronous Storage Access in Render',
          description: 'localStorage access during render can block UI',
          file: file.path,
          line: index + 1,
          impact: 'Blocks render cycle',
          recommendation: 'Move to useEffect or use lazy initialization in useState',
          codeSnippet: line.trim()
        });
      }
    });
  }

  private identifyOptimizationOpportunities(file: CodeFile, opportunities: string[]): void {
    // Code splitting opportunities
    if (file.content.includes('import') && file.path.includes('App.tsx')) {
      const importCount = (file.content.match(/^import.*from/gm) || []).length;
      if (importCount > 15) {
        opportunities.push('Consider code splitting with React.lazy() for route-based components');
      }
    }

    // Virtualization opportunities
    if (file.content.includes('.map(') && /\{.*\.map\(.*\).*\}/.test(file.content)) {
      opportunities.push('For large lists, consider using react-window or react-virtualized');
    }

    // Image optimization
    if (file.content.includes('<img') && !file.content.includes('loading="lazy"')) {
      opportunities.push('Add lazy loading to images with loading="lazy" attribute');
    }

    // Bundle size optimization
    if (file.content.includes('import * as')) {
      opportunities.push('Use named imports instead of namespace imports to enable tree-shaking');
    }

    // Debouncing/Throttling
    if (file.content.includes('onChange') && !file.content.includes('debounce') && !file.content.includes('throttle')) {
      opportunities.push('Consider debouncing/throttling for onChange handlers on search inputs');
    }
  }

  private extractBlock(lines: string[], startIndex: number): string {
    let depth = 0;
    let block = '';
    
    for (let i = startIndex; i < Math.min(startIndex + 50, lines.length); i++) {
      const line = lines[i];
      block += line + '\n';
      
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;
      
      if (depth === 0 && i > startIndex) break;
    }
    
    return block;
  }

  private extractFunctionName(lines: string[], index: number): string {
    for (let i = index; i >= Math.max(0, index - 10); i--) {
      const match = lines[i].match(/(?:function|const|let|var)\s+(\w+)/);
      if (match) return match[1];
    }
    return 'anonymous';
  }
}

export const performanceOptimizerService = PerformanceOptimizerService.getInstance();
