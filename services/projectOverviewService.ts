/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-PROJECT-OVERVIEW-GENERATOR
 */

import { CodeFile, DependencyNode, DependencyLink } from '../types';

export interface ProjectOverview {
  metadata: {
    name: string;
    version: string;
    description: string;
    totalFiles: number;
    totalLines: number;
    languages: Record<string, number>;
  };
  architecture: {
    layers: {
      name: string;
      components: string[];
      description: string;
    }[];
    patterns: string[];
    dependencies: {
      production: number;
      development: number;
      total: number;
    };
  };
  keyComponents: {
    name: string;
    path: string;
    type: 'service' | 'component' | 'hook' | 'util' | 'type';
    description: string;
    dependencies: string[];
    complexity: number;
  }[];
  dependencyGraph: {
    nodes: DependencyNode[];
    links: DependencyLink[];
  };
  healthMetrics: {
    codeQuality: number;
    testCoverage: number;
    documentation: number;
    maintainability: number;
  };
  timestamp: string;
}

class ProjectOverviewService {
  private static instance: ProjectOverviewService | undefined;

  private constructor() {}

  public static getInstance(): ProjectOverviewService {
    if (!ProjectOverviewService.instance) {
      ProjectOverviewService.instance = new ProjectOverviewService();
    }
    return ProjectOverviewService.instance;
  }

  public async generateOverview(files: CodeFile[]): Promise<ProjectOverview> {
    const metadata = await this.extractMetadata(files);
    const architecture = this.analyzeArchitecture(files);
    const keyComponents = this.identifyKeyComponents(files);
    const dependencyGraph = this.buildDependencyGraph(files);
    const healthMetrics = this.calculateHealthMetrics(files);

    return {
      metadata,
      architecture,
      keyComponents,
      dependencyGraph,
      healthMetrics,
      timestamp: new Date().toISOString()
    };
  }

  private async extractMetadata(files: CodeFile[]) {
    let totalLines = 0;
    const languages: Record<string, number> = {};

    files.forEach(file => {
      const lines = file.content.split('\n').length;
      totalLines += lines;

      const lang = file.language || 'unknown';
      languages[lang] = (languages[lang] || 0) + 1;
    });

    // Try to read package.json
    let name = 'ArchLens Strategic Systems';
    let version = '2.5.0';
    let description = 'High-security AI-driven codebase orchestration platform';

    try {
      const response = await fetch('/package.json');
      const packageJson = await response.json();
      name = packageJson.name || name;
      version = packageJson.version || version;
      description = packageJson.description || description;
    } catch (error) {
      console.warn('[ProjectOverview] Could not read package.json');
    }

    return {
      name,
      version,
      description,
      totalFiles: files.length,
      totalLines,
      languages
    };
  }

  private analyzeArchitecture(files: CodeFile[]) {
    const layers = [
      {
        name: 'Presentation Layer',
        components: files.filter(f => f.path.includes('components')).map(f => f.name),
        description: 'React components and UI logic'
      },
      {
        name: 'Service Layer',
        components: files.filter(f => f.path.includes('services')).map(f => f.name),
        description: 'Business logic, API calls, and data processing'
      },
      {
        name: 'Data Layer',
        components: files.filter(f => f.path.includes('types') || f.path.includes('models')).map(f => f.name),
        description: 'Type definitions and data models'
      },
      {
        name: 'Utility Layer',
        components: files.filter(f => f.path.includes('utils') || f.path.includes('helpers')).map(f => f.name),
        description: 'Shared utilities and helper functions'
      }
    ];

    const patterns = this.detectArchitecturalPatterns(files);

    const dependencies = {
      production: 0,
      development: 0,
      total: 0
    };

    return {
      layers: layers.filter(layer => layer.components.length > 0),
      patterns,
      dependencies
    };
  }

  private detectArchitecturalPatterns(files: CodeFile[]): string[] {
    const patterns: string[] = [];

    // Detect Singleton pattern
    if (files.some(f => f.content.includes('getInstance()'))) {
      patterns.push('Singleton Pattern (Service Layer)');
    }

    // Detect Context API usage
    if (files.some(f => f.content.includes('createContext') || f.content.includes('useContext'))) {
      patterns.push('React Context API (State Management)');
    }

    // Detect Custom Hooks
    if (files.some(f => f.path.includes('hooks') || /function use[A-Z]/.test(f.content))) {
      patterns.push('Custom Hooks Pattern');
    }

    // Detect Service Layer
    if (files.some(f => f.path.includes('services'))) {
      patterns.push('Service Layer Architecture');
    }

    // Detect Component Composition
    if (files.some(f => f.content.includes('children') && f.path.includes('component'))) {
      patterns.push('Component Composition');
    }

    // Detect HOC pattern
    if (files.some(f => /with[A-Z]\w+/.test(f.content))) {
      patterns.push('Higher-Order Components (HOC)');
    }

    // Detect Render Props
    if (files.some(f => f.content.includes('render={') || f.content.includes('children={'))) {
      patterns.push('Render Props Pattern');
    }

    return patterns;
  }

  private identifyKeyComponents(files: CodeFile[]) {
    const keyComponents = [];

    for (const file of files) {
      const complexity = this.calculateComplexity(file);
      const dependencies = this.extractDependencies(file);

      // Identify component type
      let type: 'service' | 'component' | 'hook' | 'util' | 'type' = 'util';
      if (file.path.includes('services')) type = 'service';
      else if (file.path.includes('components')) type = 'component';
      else if (file.path.includes('hooks')) type = 'hook';
      else if (file.path.includes('types')) type = 'type';

      // Only include significant components
      if (complexity > 10 || dependencies.length > 3 || type === 'service') {
        keyComponents.push({
          name: file.name,
          path: file.path,
          type,
          description: this.generateComponentDescription(file, type),
          dependencies,
          complexity
        });
      }
    }

    // Sort by complexity (most complex first)
    return keyComponents.sort((a, b) => b.complexity - a.complexity).slice(0, 20);
  }

  private calculateComplexity(file: CodeFile): number {
    let complexity = 0;

    // Count control flow statements
    complexity += (file.content.match(/\bif\b/g) || []).length;
    complexity += (file.content.match(/\bfor\b/g) || []).length;
    complexity += (file.content.match(/\bwhile\b/g) || []).length;
    complexity += (file.content.match(/\bswitch\b/g) || []).length;
    complexity += (file.content.match(/\bcatch\b/g) || []).length;

    // Count functions
    complexity += (file.content.match(/function\s+\w+/g) || []).length;
    complexity += (file.content.match(/const\s+\w+\s*=\s*\(/g) || []).length;

    return complexity;
  }

  private extractDependencies(file: CodeFile): string[] {
    const dependencies: string[] = [];
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(file.content)) !== null) {
      dependencies.push(match[1]);
    }

    return dependencies;
  }

  private generateComponentDescription(file: CodeFile, type: string): string {
    const descriptions: Record<string, string> = {
      service: 'Business logic and data processing service',
      component: 'React UI component',
      hook: 'Custom React hook for reusable logic',
      util: 'Utility function or helper',
      type: 'TypeScript type definitions'
    };

    // Try to extract JSDoc description
    const jsdocMatch = file.content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
    if (jsdocMatch) {
      return jsdocMatch[1].trim();
    }

    return descriptions[type] || 'Component';
  }

  private buildDependencyGraph(files: CodeFile[]): { nodes: DependencyNode[]; links: DependencyLink[] } {
    const nodes: DependencyNode[] = [];
    const links: DependencyLink[] = [];

    files.forEach(file => {
      // Create node
      nodes.push({
        id: file.path,
        label: file.name,
        type: 'file',
        group: this.getFileGroup(file),
        tier: file.tier || 'Implementation',
        toxicity: file.toxicity?.godObjectProbability || 0
      });

      // Extract imports and create links
      const importRegex = /import\s+.*\s+from\s+['"](\.[^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(file.content)) !== null) {
        const importPath = match[1];
        const targetFile = files.find(f => f.path.includes(importPath));

        if (targetFile) {
          links.push({
            source: file.path,
            target: targetFile.path,
            relationship: 'import'
          });
        }
      }
    });

    return { nodes, links };
  }

  private getFileGroup(file: CodeFile): number {
    if (file.path.includes('services')) return 1;
    if (file.path.includes('components')) return 2;
    if (file.path.includes('hooks')) return 3;
    if (file.path.includes('types')) return 4;
    if (file.path.includes('utils')) return 5;
    return 6;
  }

  private calculateHealthMetrics(files: CodeFile[]) {
    // Code Quality: Based on file size, complexity, and patterns
    let qualityScore = 100;
    files.forEach(file => {
      const lines = file.content.split('\n').length;
      if (lines > 500) qualityScore -= 5;
      if (file.content.includes('any')) qualityScore -= 2;
      if (!file.content.includes('export')) qualityScore -= 1;
    });

    // Test Coverage: Check for test files
    const testFiles = files.filter(f => f.path.includes('.test.') || f.path.includes('.spec.'));
    const testCoverage = Math.min(100, (testFiles.length / files.length) * 200);

    // Documentation: Check for comments and JSDoc
    let docScore = 0;
    files.forEach(file => {
      if (file.content.includes('/**')) docScore += 5;
      if (file.content.includes('//')) docScore += 1;
    });
    const documentation = Math.min(100, (docScore / files.length) * 10);

    // Maintainability: Based on various factors
    const maintainability = Math.round((qualityScore + testCoverage + documentation) / 3);

    return {
      codeQuality: Math.max(0, Math.min(100, qualityScore)),
      testCoverage: Math.round(testCoverage),
      documentation: Math.round(documentation),
      maintainability
    };
  }

  public generateMarkdownReport(overview: ProjectOverview): string {
    return `# ${overview.metadata.name} - Project Overview

**Version**: ${overview.metadata.version}  
**Generated**: ${new Date(overview.timestamp).toLocaleString()}

## 📊 Project Statistics

- **Total Files**: ${overview.metadata.totalFiles}
- **Total Lines of Code**: ${overview.metadata.totalLines.toLocaleString()}
- **Languages**: ${Object.entries(overview.metadata.languages).map(([lang, count]) => `${lang} (${count})`).join(', ')}

## 🏗️ Architecture

### Layers
${overview.architecture.layers.map(layer => `
**${layer.name}**
- Components: ${layer.components.length}
- Description: ${layer.description}
`).join('\n')}

### Design Patterns
${overview.architecture.patterns.map(p => `- ${p}`).join('\n')}

## 🔑 Key Components

${overview.keyComponents.slice(0, 10).map(comp => `
### ${comp.name}
- **Type**: ${comp.type}
- **Path**: \`${comp.path}\`
- **Complexity**: ${comp.complexity}
- **Dependencies**: ${comp.dependencies.length}
`).join('\n')}

## 📈 Health Metrics

| Metric | Score |
|--------|-------|
| Code Quality | ${overview.healthMetrics.codeQuality}/100 |
| Test Coverage | ${overview.healthMetrics.testCoverage}/100 |
| Documentation | ${overview.healthMetrics.documentation}/100 |
| Maintainability | ${overview.healthMetrics.maintainability}/100 |

## 🔗 Dependency Graph

- **Total Nodes**: ${overview.dependencyGraph.nodes.length}
- **Total Links**: ${overview.dependencyGraph.links.length}
- **Average Dependencies per File**: ${(overview.dependencyGraph.links.length / overview.dependencyGraph.nodes.length).toFixed(2)}

---

*Generated by ArchLens Strategic Systems*
`;
  }
}

export const projectOverviewService = ProjectOverviewService.getInstance();
