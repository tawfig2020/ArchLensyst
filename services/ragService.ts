/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-RAG-ENGINE-SENTINEL
 */

import { 
  CodeFile, DependencyNode, DependencyLink, ImpactAnalysis, 
  ToxicityMetrics, CacheMetadata, ParsedMetadata, Language, RuleViolation 
} from "../types";
import * as gemini from "./geminiService";
import { wasmParser } from "./wasmParserService";

export class CodebaseRAGService {
  private static instance: CodebaseRAGService | undefined;
  private graphNodes: DependencyNode[];
  private graphLinks: DependencyLink[];
  private isIndexing: boolean;
  
  private blastRadiusCache: Map<string, CacheMetadata>;
  private metadataCache: Map<string, CacheMetadata>;
  
  private constructor() {
    this.graphNodes = [];
    this.graphLinks = [];
    this.isIndexing = false;
    this.blastRadiusCache = new Map();
    this.metadataCache = new Map();
  }

  public static getInstance(): CodebaseRAGService {
    if (!CodebaseRAGService.instance) {
      CodebaseRAGService.instance = new CodebaseRAGService();
    }
    return CodebaseRAGService.instance;
  }

  private generateContentHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private calculateToxicity(file: CodeFile, metadata: ParsedMetadata): ToxicityMetrics {
    let leakage = 0;
    const isUI = file.path.includes('components') || file.path.includes('View');
    const importsDB = metadata.imports?.some((i: any) => i.source.includes('db') || i.source.includes('connection'));
    if (isUI && importsDB) leakage += 40;

    const entanglement = (metadata.imports?.length || 0) / (metadata.exports?.length || 1);

    return {
      godObjectProbability: file.content.length > 5000 ? 80 : 20,
      logicLeakageCount: leakage > 0 ? 1 : 0,
      cyclicDepth: 0,
      entanglementFactor: entanglement,
      redundancyFactor: 0,
      observabilityGap: metadata.observabilityGap || 0,
      dependencyRiskScore: metadata.dependencyRiskScore || 0,
      cloudSecurityGap: metadata.cloudSecurityGap || 0,
      securityVulnerabilityCount: metadata.securityVulnerabilityCount || 0
    };
  }

  /**
   * HYBRID INDEXING ORCHESTRATOR:
   * 1. Uses WASM layer for instantaneous structural analysis and static rule heuristics.
   * 2. Uses Gemini AI for semantic synthesis on new or modified files.
   */
  public async indexCodebase(files: CodeFile[], onProgress?: (p: number, msg: string) => void) {
    if (this.isIndexing) return;
    this.isIndexing = true;

    await wasmParser.initialize();

    const nodes: DependencyNode[] = [];
    const links: DependencyLink[] = [];

    const CHUNK_SIZE = 3;
    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      const chunk = files.slice(i, i + CHUNK_SIZE);
      
      await Promise.all(chunk.map(async (file) => {
        const currentHash = this.generateContentHash(file.content);
        const cached = this.metadataCache.get(file.path);

        if (!(cached && cached.hash === currentHash)) {
          try {
            // STEP 1: Fast Structural WASM Parse + Local Rule Scanning
            const { metadata: structuralMetadata, localViolations } = await wasmParser.parseStructuralMetadata(file.content, file.language as Language);
            
            // STEP 2: Semantic Enrichment
            const result = await gemini.indexFile(file);

            file.metadata = { ...structuralMetadata, ...result.metadata };
            file.tier = result.tier;
            file.toxicity = this.calculateToxicity(file, file.metadata);

            // Note: In a real system, localViolations would be merged into the file's issue tracking state
            
            this.metadataCache.set(file.path, {
              hash: currentHash,
              timestamp: Date.now(),
              dependencies: file.metadata.imports?.map((imp: any) => imp.source) || []
            });
          } catch (e) {
            console.error(`ArchLens Sentinel: Indexing Error in ${file.path}.`, e);
          }
        }

        nodes.push({
          id: file.path,
          label: file.name,
          type: 'file',
          group: file.language === 'typescript' ? 1 : 2,
          tier: file.tier || 'Implementation',
          toxicity: file.toxicity?.godObjectProbability || 0
        });

        if (file.metadata?.imports) {
          file.metadata.imports.forEach((imp: any) => {
            const target = files.find(f => f.path.includes(imp.source))?.path;
            if (target) {
              links.push({ source: file.path, target, relationship: 'import' });
            }
          });
        }
      }));

      if (onProgress) {
        onProgress(((i + chunk.length) / files.length) * 100, `Synchronizing Strategic Knowledge Layer... [${Math.min(i + chunk.length, files.length)}/${files.length}]`);
      }
    }

    this.graphNodes = nodes;
    this.graphLinks = links;
    this.isIndexing = false;
    return { nodes, links };
  }

  public getImpactWindow(targetPath: string, allFiles: CodeFile[], maxDepth: number = 2): CodeFile[] {
    const cached = this.blastRadiusCache.get(targetPath);
    const contentHash = this.generateContentHash(allFiles.find(f => f.path === targetPath)?.content || "");

    if (cached && cached.hash === contentHash) {
       return allFiles.filter(f => cached.blastRadius?.includes(f.path));
    }

    const window = new Set<string>([targetPath]);
    const queue = [{ id: targetPath, d: 0 }];
    while (queue.length > 0) {
      const { id, d } = queue.shift()!;
      if (d >= maxDepth) continue;
      this.graphLinks.forEach(l => {
        const s = typeof l.source === 'string' ? l.source : l.source.id;
        const t = typeof l.target === 'string' ? l.target : l.target.id;
        if (t === id && !window.has(s)) {
          window.add(s);
          queue.push({ id: s, d: d + 1 });
        }
      });
    }

    const resultPaths = Array.from(window);
    this.blastRadiusCache.set(targetPath, {
      hash: contentHash,
      timestamp: Date.now(),
      dependencies: [],
      blastRadius: resultPaths
    });

    return allFiles.filter(f => window.has(f.path));
  }

  public async validateProposedChange(file: CodeFile, newContent: string, window: CodeFile[], rules: any): Promise<ImpactAnalysis> {
    // Merge Local Static Analysis with Deep AI Analysis
    const { localViolations } = await wasmParser.parseStructuralMetadata(newContent, file.language as Language);
    
    const [base, tests] = await Promise.all([
      gemini.analyzeCodeImpact(file.name, newContent, rules),
      gemini.runSimulatedTestSuite(window, newContent)
    ]);
    
    // Deduplicate and merge violations
    const allViolations = [...localViolations];
    base.ruleViolations.forEach(v => {
        if (!allViolations.some(lv => lv.ruleId === v.ruleId && lv.line === v.line)) {
            allViolations.push(v);
        }
    });

    return {
      ...base,
      ruleViolations: allViolations,
      cycleDetected: false,
      toxicityDelta: newContent.length > file.content.length ? 5 : -2,
      testValidation: tests,
      cacheHit: false
    };
  }

  /**
   * Performs semantic lookup through the RAG context.
   */
  public async searchCodebase(query: string, codebase: CodeFile[]) {
    return gemini.performSemanticSearch(query, codebase);
  }
}

export const ragService = CodebaseRAGService.getInstance();
