import { gql } from '@apollo/client';

// ─── Codebase Queries ───────────────────────────────────────────────────────

export const GET_CODEBASE = gql`
  query GetCodebase($projectId: ID!) {
    codebase(projectId: $projectId) {
      files {
        path
        name
        content
        language
        lastModified
        tier
        metadata {
          exports
          imports {
            name
            source
          }
          functions {
            name
            line
          }
          roleSummary
        }
        toxicity {
          godObjectProbability
          logicLeakageCount
          cyclicDepth
          entanglementFactor
        }
      }
    }
  }
`;

export const GET_FILE_ANALYSIS = gql`
  query GetFileAnalysis($filePath: String!) {
    fileAnalysis(filePath: $filePath) {
      safe
      score
      affectedNodes
      ruleViolations {
        ruleId
        severity
        message
        line
        file
        suggestion
      }
      rationale
      cycleDetected
      toxicityDelta
    }
  }
`;

// ─── Dependency Graph ───────────────────────────────────────────────────────

export const GET_DEPENDENCY_GRAPH = gql`
  query GetDependencyGraph($projectId: ID!) {
    dependencyGraph(projectId: $projectId) {
      nodes {
        id
        label
        type
        group
        tier
        toxicity
      }
      links {
        source
        target
        relationship
        isCircular
      }
    }
  }
`;

// ─── Audit Queries ──────────────────────────────────────────────────────────

export const GET_AUDIT_REPORT = gql`
  query GetAuditReport($projectId: ID!, $type: AuditType!) {
    auditReport(projectId: $projectId, type: $type) {
      score
      issues {
        id
        category
        message
        impact
        recommendation
        file
        line
      }
      toxicity {
        godObjectProbability
        cyclicDepth
        logicLeakageCount
        entanglementFactor
      }
    }
  }
`;

// ─── Mutations ──────────────────────────────────────────────────────────────

export const APPLY_SYNTHETIC_FIX = gql`
  mutation ApplySyntheticFix($input: SyntheticFixInput!) {
    applySyntheticFix(input: $input) {
      success
      updatedFile {
        path
        content
        lastModified
      }
      appliedFix {
        id
        description
        safetyScore
      }
    }
  }
`;

export const RUN_IMPACT_ANALYSIS = gql`
  mutation RunImpactAnalysis($input: ImpactAnalysisInput!) {
    runImpactAnalysis(input: $input) {
      safe
      score
      affectedNodes
      ruleViolations {
        ruleId
        severity
        message
        line
      }
      rationale
    }
  }
`;
