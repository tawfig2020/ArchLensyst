/**
 * @license
 * Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SENTINEL-PROTOCOL-V3-TYPES
 */

// ─── Enums & Literals ───────────────────────────────────────────────────────

export type Language = 'typescript' | 'python' | 'java' | 'terraform' | 'dockerfile';
export type IndexTier = 'Architectural' | 'Module' | 'Implementation' | 'Infrastructure';
export type Severity = 'error' | 'warning' | 'info';
export type RuntimeTarget = 'AWS_Lambda' | 'Vercel_Edge' | 'Cloudflare_Workers' | 'Docker_Standard' | 'Browser_Only';
export type PlanType = 'Free' | 'Pro' | 'Team' | 'Enterprise';
export type BillingStatus = 'Active' | 'Grace_Period' | 'Suspended' | 'Expired';
export type PhantomStatus = 'idle' | 'compiling' | 'testing' | 'checking_invariants' | 'success' | 'failed';

// ─── Core Domain Models ─────────────────────────────────────────────────────

export interface TokenAllocation {
  total: number;
  consumed: number;
  reserved: number;
  lastUpdated: string;
}

export interface MembershipSignature {
  logicHash: string;
  issuedAt: string;
  expiresAt: string;
  verifiedBy: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  membership: {
    plan: PlanType;
    status: BillingStatus;
    signature: MembershipSignature;
    tokens: TokenAllocation;
    billingCycleStart: string;
    billingCycleEnd: string;
    autoRenew: boolean;
    lastPaymentId: string;
    unlockedFeatures: string[];
    dbSynced?: boolean;
  };
  runtimeTarget: RuntimeTarget;
  organization?: {
    name: string;
    departments: DepartmentSector[];
  };
}

export interface DepartmentSector {
  id: string;
  name: string;
  integrityScore: number;
  activeViolations: number;
  leadArchitect: string;
}

// ─── Code & Analysis ────────────────────────────────────────────────────────

export interface CodeFile {
  path: string;
  name: string;
  content: string;
  language: string;
  lastModified: string;
  metadata?: ParsedMetadata;
  tier?: IndexTier;
  toxicity?: ToxicityMetrics;
  departmentId?: string;
}

export interface ParsedMetadata {
  exports: string[];
  imports: { name?: string; source: string }[];
  functions: { name: string; line: number }[];
  roleSummary?: string;
  observabilityGap?: number;
  dependencyRiskScore?: number;
  cloudSecurityGap?: number;
  securityVulnerabilityCount?: number;
  reflectionUsage?: string[];
}

export interface ToxicityMetrics {
  godObjectProbability: number;
  logicLeakageCount: number;
  cyclicDepth: number;
  entanglementFactor: number;
  redundancyFactor: number;
  observabilityGap: number;
  dependencyRiskScore: number;
  cloudSecurityGap: number;
  securityVulnerabilityCount: number;
}

export interface DependencyNode {
  id: string;
  label: string;
  type: string;
  group: number;
  tier: IndexTier;
  toxicity?: number;
}

export interface DependencyLink {
  source: string | DependencyNode;
  target: string | DependencyNode;
  relationship: string;
  isCircular?: boolean;
}

export interface RuleViolation {
  ruleId: string;
  severity: Severity;
  message: string;
  line: number;
  file?: string;
  suggestion?: string;
}

export interface ImpactAnalysis {
  safe: boolean;
  score: number;
  affectedNodes: string[];
  ruleViolations: RuleViolation[];
  rationale: string;
  cycleDetected?: boolean;
  toxicityDelta?: number;
  testValidation?: unknown;
  cacheHit?: boolean;
  testResults?: { passed: boolean; count: number; failedTests: string[] };
}

export interface SyntheticFix {
  id: string;
  description: string;
  diff: string;
  safetyScore?: number;
  explanation?: string;
}

// ─── Monitoring & Logs ──────────────────────────────────────────────────────

export interface MonitorLog {
  timestamp: string;
  event: string;
  details: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  impact: 'neutral' | 'positive' | 'negative';
}

export interface AnalysisRule {
  id: string;
  name: string;
  severity: Severity;
}

// ─── Infrastructure ─────────────────────────────────────────────────────────

export interface SandboxInstance {
  id: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  status: 'isolated' | 'executing' | 'idle';
  computeLoad: number;
  uptime: string;
  workload: string;
  region: string;
  ownerTeam?: string;
  deploymentStatus?: 'nominal' | 'degraded' | 'scaling';
}

export interface DatabaseStatus {
  connected: boolean;
  lastSync: string;
  pendingTransactions: number;
  clusterHealth: 'optimal' | 'degraded' | 'offline';
  clusterId?: string;
}

// ─── Persona & Onboarding ───────────────────────────────────────────────────

export interface DeveloperPersona {
  type: string;
  traits: string[];
  philosophy: string;
  preferredPatterns: string[];
  lastSync: string;
  syncStatus: 'idle' | 'synced' | 'outdated';
}

export interface NewcomerGuide {
  roleSummary: string;
  evolutionContext: string;
  usagePatterns: string[];
  proactiveSuggestions: string[];
  impactSummary: string;
}

// ─── Audit Reports ──────────────────────────────────────────────────────────

export interface APIContract {
  serviceId: string;
  endpoint: string;
  method: string;
  status: 'stable' | 'deprecated' | 'breaking' | 'internal';
  complianceScore: number;
  driftReason?: string;
}

export interface DeploymentRiskReport {
  overallRiskScore: number;
  unscopedEnvironmentVariables: { team: string; key: string; file: string }[];
  scalingPolicyDrift: { service: string; driftFactor: number; recommendation: string }[];
  lastBlastRadiusCheck: string;
}

export interface FederatedAuditReport {
  overallMeshIntegrity: number;
  breakingChangeRisk: number;
  activeContracts: APIContract[];
  unprotectedEndpoints: string[];
  deploymentPerimeter?: DeploymentRiskReport;
}

export interface SecurityAuditReport {
  score: number;
  vulnerabilities: { id: string; type: string; severity: Severity; message: string; file: string; line?: number; cwe?: string; recommendation: string; blastRadius?: number }[];
  leakedSecrets: { type: string; keyName: string; line: number; redactedValue: string }[];
}

export interface AuditReport {
  score: number;
  issues: { id: string; category: string; message: string; impact: string; recommendation: string; file?: string; line?: number }[];
  toxicity: { godObjectProbability: number; cyclicDepth: number; logicLeakageCount: number; entanglementFactor: number };
}

export interface ReliabilityReport {
  metrics: { observabilityCoverage: number; idempotencySafety: number; silentNodesCount: number };
  scaleProjections: { file: string; projection: unknown }[];
  warnings: { type: string; file: string; message: string; severity: Severity }[];
}

export interface LegalAuditReport {
  ipHealthScore: number;
  regulatoryComplianceScore: number;
  contaminationIncidents: { file: string; line: number; pedigree: { matchedLicense: string; similarityScore: number; matchedSource: string } }[];
  piiDataFlows: { entity: string; source: string; sinks: string[]; encryptionLevel: string }[];
}

export interface PerformanceAuditReport {
  overallEfficiencyScore: number;
  projections: { file: string; line: number; projection: unknown }[];
  resourceLeaks: { file: string; line: number; type: string; message: string }[];
}

export interface CloudAuditReport {
  score: number;
  resources: { name: string; type: string; isPublic: boolean; permissions: string[]; privilegeOverhang: number }[];
  vulnerabilities: { type: string; resourceId: string; message: string; severity: 'error' | 'warning' }[];
}

export interface DependencyAuditReport {
  packages: { name: string; version: string; isHallucination: boolean; exists: boolean; vulnerabilities: number; runtimeCompatible: boolean; healthScore: number; alternatives?: string[] }[];
}

export interface StructuralAuditReport {
  stiffnessScore: number;
  diversityIndex: number;
  redundancyHeatmap: unknown[];
  enrichmentProposals: { file: string; line: number; explanation: string; originalSnippet: string; forgedAbstraction: string }[];
  maintenanceRisks: { id: string; category: string; impact: 'Low' | 'Medium' | 'High'; description: string }[];
}

export interface ProductivityAuditReport {
  metrics: { fixToGenRatio: number; aiEfficiencyGain: number };
  growth: { unassistedProblemSolvingScore: number; mentalModelSync: number; identifiedPatterns: string[] };
  socraticHealth: number;
  highChurnFiles: { file: string; churnRate: number; reason: string }[];
}

export interface FairnessReport {
  overallScore: number;
  equalityIndex: number;
  detectedBiases: { id: string; type: string; description: string; impactLevel: 'Low' | 'Medium' | 'High' | 'Critical'; proxyVariables: string[]; recommendation: string }[];
  verdict: string;
}

export interface DueDiligenceReport {
  overallInvestabilityScore: number;
  reusabilityIndex: number;
  documentationCoverage: number;
  architecturalCompliance: number;
  riskAreas: { category: string; description: string; impact: 'Low' | 'Medium' | 'High' | 'Critical'; file: string; line: number }[];
  auditProofLedger: { file: string; adrLink: string; reviewer: string; timestamp: string; line: number }[];
}

export interface DriftAnalysisResult {
  driftScore: number;
  patternFragmentation: { pattern: string; consistencyScore: number; locations: { file: string; line: number; snippet: string }[]; recommendation: string }[];
  paradigmClashes: { dominantPattern: string; divergentPattern: string; fileCount: number; impact: string }[];
  seniorReview: { historicalPerspective: string; modernPerspective: string; rationaleErosion: string; recommendation: string };
  incompatibilityRisks: { type: string; description: string; fix: string }[];
}

// ─── Billing & Plans ────────────────────────────────────────────────────────

export interface BillingEvent {
  id: string;
  userEmail: string;
  type: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'success' | 'failure' | 'pending';
  credits: number;
  description: string;
  ledgerSignature: string;
}

export interface PlanConfig {
  type: PlanType;
  price: number;
  limits: { credits: number; apiRequests: number };
  features: string[];
}

export interface DashboardStats {
  creditsUsed: number;
  requestsUsed: number;
  activeViolations: number;
}

// ─── Architecture ───────────────────────────────────────────────────────────

export interface ArchitecturalMandate {
  id: string;
  philosophy: string;
  rationale: string;
  forbiddenPatterns: string[];
  enforcementLevel: 'Hard' | 'Soft';
}

export interface ADR {
  id: string;
  timestamp: string;
  title: string;
  author: string;
  context: string;
  decision: string;
  consequences: string;
}

export interface PhantomExecutionResult {
  testResults: { passed: number; total: number; errors: string[] };
  invariantChecks: { passed: boolean; details: string };
}

export interface PipelineStep {
  id: string;
  name: string;
  status: 'success' | 'running' | 'pending' | 'failed';
  duration?: string;
}

export interface SocraticChallenge {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  complexity: 'Junior' | 'Senior' | 'Architect';
}

export interface CacheMetadata {
  hash: string;
  timestamp: number;
  dependencies: string[];
  blastRadius?: string[];
}

export interface TestResult {
  suite: string;
  status: 'passed' | 'failed' | 'skipped';
  coverage: number;
  error?: string;
}

export interface DataSchema {
  entity: string;
  property: string;
  format: string;
  sourceFile: string;
  isMandatory: boolean;
}

export interface LibraryAnalysis {
  packageName: string;
  version: string;
  structuralRisk: 'Low' | 'Medium' | 'High';
  invariantsCheck: { memorySafety: boolean; concurrencySafe: boolean; ragIndexable: boolean };
  aiRecommendation: string;
}

export interface RedundancyReport {
  clones: { id: string; similarity: number; files: { path: string; line: number; snippet: string }[]; suggestedAbstraction: string }[];
  potentialLinesSaved: number;
  deduplicationScore: number;
}

export interface ImmuneReport {
  fuzzingPassRate: number;
  vulnerabilitiesBlocked: number;
  unvalidatedInputs: { file: string; line: number; type: string; fix: string }[];
}

export interface ContextConfidenceReport {
  seniorReviewTaxForecast: number;
  lowConfidenceZones: { module: string; reason: string; reviewPriority: 'Critical' | 'High' | 'Medium' | 'Low' }[];
}

export interface StrategicOversightReport {
  decisionAlignmentScore: number;
  roiStabilityIndex: number;
  departmentalDrift?: { departmentId: string; driftFactor: number; status: 'nominal' | 'divergent' | 'critical' }[];
  federatedMesh?: FederatedAuditReport;
}

export interface SignalDensityReport {
  aiIssueDensity: number;
  noiseSuppressionEvents: number;
}

export interface ROIIntegrityReport {
  integrationStabilityScore: number;
  failureHotspots: { module: string; reason: string }[];
}

export interface DestructionSentinelReport {
  interceptedDestructiveCommands: { command: string }[];
}

// ─── Real-time Event Types ──────────────────────────────────────────────────

export interface RealtimeEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
}

export interface AuditStreamEvent {
  eventId: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface CollaborativeSession {
  sessionId: string;
  participants: string[];
  fileId: string;
  startedAt: string;
  status: 'active' | 'paused' | 'ended';
}

// ─── GraphQL Schema Types ───────────────────────────────────────────────────

export interface GraphQLCodeFileInput {
  path: string;
  content: string;
  language: string;
}

export interface GraphQLAnalysisResponse {
  analysis: ImpactAnalysis;
  cachedAt?: string;
}
