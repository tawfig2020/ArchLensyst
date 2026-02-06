/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SENTINEL-PROTOCOL-V2-SECURE
 */

import { GoogleGenAI, Type } from "@google/genai";
import { 
  ImpactAnalysis, CodeFile, RuleViolation, 
  ParsedMetadata, IndexTier,
  AuditReport, AnalysisRule, CloudAuditReport,
  DependencyAuditReport, RuntimeTarget, DeveloperPersona,
  DriftAnalysisResult, DueDiligenceReport, FairnessReport,
  ImmuneReport, SignalDensityReport, ROIIntegrityReport,
  LegalAuditReport, LibraryAnalysis, RedundancyReport,
  NewcomerGuide, SocraticChallenge, ProductivityAuditReport, 
  SyntheticFix, ReliabilityReport, PerformanceAuditReport,
  SecurityAuditReport, StrategicOversightReport,
  DestructionSentinelReport, ContextConfidenceReport,
  StructuralAuditReport, FederatedAuditReport
} from "../types";

// Use import.meta.env for Vite (browser-compatible)
// If no API key is set, use a placeholder to prevent initialization errors
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null as any;

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    if (retries > 0 && isRateLimit) {
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function performFederatedMeshAudit(files: CodeFile[]): Promise<FederatedAuditReport> {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform Federated Mesh Audit. Analyze cross-service API boundaries and identify breaking change risks in the microservice topology. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallMeshIntegrity: { type: Type.NUMBER },
            breakingChangeRisk: { type: Type.NUMBER },
            activeContracts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  serviceId: { type: Type.STRING },
                  endpoint: { type: Type.STRING },
                  method: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["stable", "deprecated", "breaking", "internal"] },
                  complianceScore: { type: Type.NUMBER },
                  driftReason: { type: Type.STRING }
                }
              }
            },
            unprotectedEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
}

export async function runSimulatedTestSuite(files: CodeFile[], proposal: string): Promise<any> {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a High-Fidelity Test Scrutiny for the following architectural delta.
      PROPOSAL: ${proposal}
      NODES: ${files.map(f => f.path).join(', ')}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalTestsRun: { type: Type.NUMBER },
            passRate: { type: Type.NUMBER },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  suite: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["passed", "failed", "skipped"] },
                  coverage: { type: Type.NUMBER },
                  error: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
}

export async function indexFile(file: CodeFile): Promise<{ metadata: ParsedMetadata, tier: IndexTier, criticality: number }> {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze high-stakes logic node. Identify exports, imports, and core architectural intent.
      FILE: ${file.path}
      LANGUAGE: ${file.language}
      CONTENT: ${file.content}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metadata: {
              type: Type.OBJECT,
              properties: {
                exports: { type: Type.ARRAY, items: { type: Type.STRING } },
                imports: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      source: { type: Type.STRING }
                    }
                  }
                },
                functions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      line: { type: Type.NUMBER }
                    }
                  }
                },
                roleSummary: { type: Type.STRING },
                securityVulnerabilityCount: { type: Type.NUMBER }
              }
            },
            tier: { type: Type.STRING, enum: ["Architectural", "Module", "Implementation", "Infrastructure"] },
            criticality: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
}

export const analyzeCodeImpact = async (fileName: string, content: string, rules: any[]): Promise<ImpactAnalysis> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a Senior Architect auditing a codebase. Analyze the deep-tier impact of proposed changes in ${fileName}. 
      
      SPECIFIC INSTRUCTIONS:
      1. Audit for Prop Drilling: Identify if data is being passed through too many layers without using context or stores.
      2. Enforce Layer Isolation: Ensure UI components do not handle side effects like DB calls or direct environment variable reads.
      3. Strict Types: Flag any use of 'any' or 'unknown' that masks architectural intent.
      
      Project Rules: ${JSON.stringify(rules)}
      Proposed Content: ${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            affectedNodes: { type: Type.ARRAY, items: { type: Type.STRING } },
            ruleViolations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ruleId: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  message: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  suggestion: { type: Type.STRING }
                }
              }
            },
            rationale: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performCodebaseAudit = async (files: CodeFile[], rules: AnalysisRule[]): Promise<AuditReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform high-stakes architectural audit. Targeted Files: ${files.map(f => f.path).join(', ')}. Logic Rules: ${JSON.stringify(rules)}`,
      config: {
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  message: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                }
              }
            },
            toxicity: {
              type: Type.OBJECT,
              properties: {
                godObjectProbability: { type: Type.NUMBER },
                cyclicDepth: { type: Type.NUMBER },
                logicLeakageCount: { type: Type.NUMBER },
                entanglementFactor: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generateSyntheticFix = async (
  file: CodeFile,
  violation: RuleViolation,
  codebase: CodeFile[],
  persona: string = 'Senior'
): Promise<SyntheticFix> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a ${persona} architect. Propose a non-destructive fix for ${violation.message} in ${file.path}. 
      Logic Violation Context: ${violation.suggestion || 'Align with architectural purity.'}
      Current Logic Block: ${file.content}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            diff: { type: Type.STRING },
            safetyScore: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          }
        }
      }
    });
    const result = JSON.parse(response.text || '{}');
    return {
      id: `fix-${Date.now()}`,
      description: result.description || 'Automated architectural realignment.',
      diff: result.diff || '',
      safetyScore: result.safetyScore || 85,
      explanation: result.explanation || 'Refactored to align with sovereign project invariants.'
    };
  });
};

export const performSemanticSearch = async (query: string, codebase: CodeFile[]) => {
  return withRetry(async () => {
    const context = codebase.map(f => `File: ${f.path}\nTier: ${f.tier}\nContent Snippet: ${f.content.substring(0, 500)}`).join('\n---\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Deep Semantic Scrutiny: "${query}" across institutional memory:\n${context}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              filePath: { type: Type.STRING },
              score: { type: Type.NUMBER },
              rationale: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const generateNewcomerGuide = async (file: CodeFile, codebase: CodeFile[]): Promise<NewcomerGuide> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate an authoritative onboarding briefing for ${file.path}. 
      Contextual Hierarchy: ${codebase.map(f => f.path).join(', ')}
      Logic Content:
      ${file.content}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleSummary: { type: Type.STRING },
            evolutionContext: { type: Type.STRING },
            usagePatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
            proactiveSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            impactSummary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
}

export const generateSocraticChallenge = async (file: CodeFile, persona: DeveloperPersona): Promise<SocraticChallenge> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Act as a ${persona.type} mentor. Scrutinize ${file.path} and generate a Socratic challenge that prevents logic atrophy.
      Target: Architectural Invariants and Logic Purity.
      
      SOURCE CODE:
      ${file.content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            complexity: { type: Type.STRING, enum: ["Junior", "Senior", "Architect"] }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
}

export const performStructuralAudit = async (files: CodeFile[]): Promise<StructuralAuditReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Forge analysis: Identify 'Stiff' logic patterns that resist extensibility. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stiffnessScore: { type: Type.NUMBER },
            diversityIndex: { type: Type.NUMBER },
            redundancyHeatmap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {} } },
            enrichmentProposals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                  originalSnippet: { type: Type.STRING },
                  forgedAbstraction: { type: Type.STRING }
                }
              }
            },
            maintenanceRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performSecurityAudit = async (files: CodeFile[]): Promise<SecurityAuditReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Deep Zero-Trust Scrutiny. Analyze files for injection risks, leaked credentials, insecure protocols, and lack of identity validation. Map Blast Radius (scale 1-100) for each finding. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["error", "warning", "info"] },
                  message: { type: Type.STRING },
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  cwe: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  blastRadius: { type: Type.NUMBER }
                }
              }
            },
            leakedSecrets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  keyName: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  redactedValue: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performStrategicOversight = async (files: CodeFile[]): Promise<StrategicOversightReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform Strategic Oversight: Decision alignment audit. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decisionAlignmentScore: { type: Type.NUMBER },
            roiStabilityIndex: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performDestructionAudit = async (files: CodeFile[]): Promise<DestructionSentinelReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Scan for lethal suggestion vectors or destructive command patterns. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interceptedDestructiveCommands: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  command: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performContextConfidenceAudit = async (files: CodeFile[]): Promise<ContextConfidenceReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit logic fidelity: Identify modules with low RAG confidence or rationale conflict. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seniorReviewTaxForecast: { type: Type.NUMBER },
            lowConfidenceZones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  module: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  reviewPriority: { type: Type.STRING, enum: ["\"Critical\"", "\"High\"", "\"Medium\"", "\"Low\""] }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const analyzeLibraryInvariants = async (pkg: string, version: string, rules: AnalysisRule[]): Promise<LibraryAnalysis> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Universal RAG: Scrutinize external package ${pkg}@${version} for project rule compliance: ${JSON.stringify(rules)}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            packageName: { type: Type.STRING },
            version: { type: Type.STRING },
            structuralRisk: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            invariantsCheck: {
              type: Type.OBJECT,
              properties: {
                memorySafety: { type: Type.BOOLEAN },
                concurrencySafe: { type: Type.BOOLEAN },
                ragIndexable: { type: Type.BOOLEAN }
              }
            },
            aiRecommendation: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performProductivityAudit = async (files: CodeFile[]): Promise<ProductivityAuditReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze productivity ROI: AI Efficiency Gain vs Skill Erosion. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.OBJECT,
              properties: {
                fixToGenRatio: { type: Type.NUMBER },
                aiEfficiencyGain: { type: Type.NUMBER }
              }
            },
            growth: {
              type: Type.OBJECT,
              properties: {
                unassistedProblemSolvingScore: { type: Type.NUMBER },
                mentalModelSync: { type: Type.NUMBER },
                identifiedPatterns: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            socraticHealth: { type: Type.NUMBER },
            highChurnFiles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  churnRate: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performReliabilityAudit = async (files: CodeFile[]): Promise<ReliabilityReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `System Pulse: NFR audit for observability, idempotency, and scale. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.OBJECT,
              properties: {
                observabilityCoverage: { type: Type.NUMBER },
                idempotencySafety: { type: Type.NUMBER },
                silentNodesCount: { type: Type.NUMBER }
              }
            },
            scaleProjections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  projection: {
                    type: Type.OBJECT,
                    properties: {
                      complexity: { type: Type.STRING },
                      currentCeiling: { type: Type.NUMBER },
                      bottleneckReason: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            warnings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  file: { type: Type.STRING },
                  message: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["error", "warning"] }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performPerformanceAudit = async (files: CodeFile[]): Promise<PerformanceAuditReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Predictive scale audit: Algorithmic complexity and leak detection. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallEfficiencyScore: { type: Type.NUMBER },
            projections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  projection: {
                    type: Type.OBJECT,
                    properties: {
                      complexity: { type: Type.STRING },
                      resourceDrain: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                      bottleneckReason: { type: Type.STRING },
                      maxSafeConcurrency: { type: Type.NUMBER }
                    }
                  }
                }
              }
            },
            resourceLeaks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  message: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performRedundancyAudit = async (files: CodeFile[]): Promise<RedundancyReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Logic Deduplication: Scanning for semantic logic clones. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  similarity: { type: Type.NUMBER },
                  files: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        path: { type: Type.STRING },
                        line: { type: Type.NUMBER },
                        snippet: { type: Type.STRING }
                      }
                    }
                  },
                  suggestedAbstraction: { type: Type.STRING }
                }
              }
            },
            potentialLinesSaved: { type: Type.NUMBER },
            deduplicationScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performLegalAudit = async (files: CodeFile[]): Promise<LegalAuditReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Jurisprudence Scrutiny: IP Pedigree and GDPR/HIPAA compliance flows. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ipHealthScore: { type: Type.NUMBER },
            regulatoryComplianceScore: { type: Type.NUMBER },
            contaminationIncidents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  pedigree: {
                    type: Type.OBJECT,
                    properties: {
                      matchedLicense: { type: Type.STRING },
                      similarityScore: { type: Type.NUMBER },
                      matchedSource: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            piiDataFlows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  entity: { type: Type.STRING },
                  source: { type: Type.STRING },
                  sinks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  encryptionLevel: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performFairnessAudit = async (files: CodeFile[]): Promise<FairnessReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Ethics Guard: Scan algorithmic decision nodes for unintended demographic exclusion or proxy variables. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            equalityIndex: { type: Type.NUMBER },
            detectedBiases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impactLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                  proxyVariables: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendation: { type: Type.STRING }
                }
              }
            },
            verdict: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performImmuneAudit = async (files: CodeFile[]): Promise<ImmuneReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Immune System: Suggestion-level security fuzzing for injection risks. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fuzzingPassRate: { type: Type.NUMBER },
            vulnerabilitiesBlocked: { type: Type.NUMBER },
            unvalidatedInputs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                  fix: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performSignalAudit = async (files: CodeFile[]): Promise<SignalDensityReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `PR Signal Normalization: Analyze issue density vs human standards. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiIssueDensity: { type: Type.NUMBER },
            noiseSuppressionEvents: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performROIIntegrityAudit = async (files: CodeFile[]): Promise<ROIIntegrityReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `ROI Integrity: Integration stability and 7-day survival probability. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            integrationStabilityScore: { type: Type.NUMBER },
            failureHotspots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  module: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performDueDiligenceAudit = async (files: CodeFile[]): Promise<DueDiligenceReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Due Diligence: Technical maturity and reusability audit for external stakeholders. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallInvestabilityScore: { type: Type.NUMBER },
            reusabilityIndex: { type: Type.NUMBER },
            documentationCoverage: { type: Type.NUMBER },
            architecturalCompliance: { type: Type.NUMBER },
            riskAreas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                  file: { type: Type.STRING },
                  line: { type: Type.NUMBER }
                }
              }
            },
            auditProofLedger: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  adrLink: { type: Type.STRING },
                  reviewer: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  line: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const compareCodebaseVersions = async (base: string, current: string, path: string): Promise<DriftAnalysisResult> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze architectural drift for ${path}. Compare historical rationale with current state.\n\nSOURCE:\n${current}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            driftScore: { type: Type.NUMBER },
            patternFragmentation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pattern: { type: Type.STRING },
                  consistencyScore: { type: Type.NUMBER },
                  locations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        file: { type: Type.STRING },
                        line: { type: Type.NUMBER },
                        snippet: { type: Type.STRING }
                      }
                    }
                  },
                  recommendation: { type: Type.STRING }
                }
              }
            },
            paradigmClashes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dominantPattern: { type: Type.STRING },
                  divergentPattern: { type: Type.STRING },
                  fileCount: { type: Type.NUMBER },
                  impact: { type: Type.STRING }
                }
              }
            },
            seniorReview: {
              type: Type.OBJECT,
              properties: {
                historicalPerspective: { type: Type.STRING },
                modernPerspective: { type: Type.STRING },
                rationaleErosion: { type: Type.STRING },
                recommendation: { type: Type.STRING }
              }
            },
            incompatibilityRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  fix: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const synchronizeDeveloperDNA = async (codebase: CodeFile[]): Promise<Partial<DeveloperPersona>> => {
  return withRetry(async () => {
    const context = codebase.map(f => f.content).join('\n').substring(0, 15000);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Synthesize sovereign developer DNA profile. Analyze style, invariants, and architectural bias.\n\nCODEBASE SAMPLES:\n${context}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            traits: { type: Type.ARRAY, items: { type: Type.STRING } },
            philosophy: { type: Type.STRING },
            preferredPatterns: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const performDependencySupplyChainAudit = async (files: CodeFile[], runtime: RuntimeTarget): Promise<DependencyAuditReport> => {
  return withRetry(async () => {
    // Strategic Enrichment: Filter for actual dependency manifests to provide Gemini with real Ground Truth.
    const manifestFiles = files.filter(f => 
      f.name.toLowerCase().includes('package.json') || 
      f.name.toLowerCase().includes('requirements.txt') || 
      f.name.toLowerCase().includes('go.mod') ||
      f.name.toLowerCase().includes('pom.xml') ||
      f.name.toLowerCase().includes('dockerfile')
    );

    const manifestContext = manifestFiles.length > 0 
      ? `MANIFEST CONTENT:\n${manifestFiles.map(f => `Path: ${f.path}\nContent:\n${f.content}`).join('\n---\n')}`
      : "No direct dependency manifests found in current context.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a Supply Chain Sentinel. Analyze the following project dependencies for known vulnerabilities (CVEs), 
      hallucinated packages (non-existent libraries suggested by AI), and ${runtime} compatibility gaps. 
      Identify potential safer alternatives for high-risk packages.
      
      ${manifestContext}
      
      PROJECT FILES MAP: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            packages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  version: { type: Type.STRING },
                  isHallucination: { type: Type.BOOLEAN, description: 'True if the package likely does not exist in public registries.' },
                  exists: { type: Type.BOOLEAN, description: 'Verified existence in known registries.' },
                  vulnerabilities: { type: Type.NUMBER, description: 'Count of known vulnerabilities in this version range.' },
                  runtimeCompatible: { type: Type.BOOLEAN, description: 'Verified compatibility with the target runtime.' },
                  healthScore: { type: Type.NUMBER, description: '0-100 score of maintainability and security hygiene.' },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Safer alternatives if risk is High.' }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"packages": []}');
  });
};

export const performCloudInfrastructureAudit = async (files: CodeFile[]): Promise<CloudAuditReport> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Deep Cloud Infrastructure & IaC Scrutiny. Auditing Terraform, Docker, and IAM roles for privilege overhang and public exposure. Files: ${files.map(f => f.path).join(', ')}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  isPublic: { type: Type.BOOLEAN },
                  permissions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  privilegeOverhang: { type: Type.NUMBER }
                }
              }
            },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING },
                    resourceId: { type: Type.STRING },
                    message: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ["error", "warning"] }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};
