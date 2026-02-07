package pipeline

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

// Stage represents a single step in the data flow pipeline
type Stage string

const (
	StageUpload       Stage = "upload"
	StageAuth         Stage = "authentication"
	StageParse        Stage = "wasm_parsing"
	StageAST          Stage = "structural_ast"
	StageAIAnalysis   Stage = "gemini_analysis"
	StageRuleEngine   Stage = "rule_evaluation"
	StageAuditTrail   Stage = "audit_trail"
	StageLedger       Stage = "sovereign_ledger"
	StageDashboard    Stage = "dashboard_update"
	StageSecAlerts    Stage = "security_alerts"
	StageCompliance   Stage = "compliance_reports"
	StageInsights     Stage = "strategic_insights"
)

// PipelineStatus tracks the state of a pipeline run
type PipelineStatus string

const (
	StatusPending    PipelineStatus = "pending"
	StatusRunning    PipelineStatus = "running"
	StatusCompleted  PipelineStatus = "completed"
	StatusFailed     PipelineStatus = "failed"
	StatusCancelled  PipelineStatus = "cancelled"
)

// StageResult holds the outcome of a single stage
type StageResult struct {
	Stage     Stage          `json:"stage"`
	Status    PipelineStatus `json:"status"`
	StartedAt time.Time     `json:"started_at"`
	EndedAt   *time.Time    `json:"ended_at,omitempty"`
	Duration  float64       `json:"duration_ms"`
	Output    interface{}   `json:"output,omitempty"`
	Error     string        `json:"error,omitempty"`
}

// PipelineRun represents a full pipeline execution
type PipelineRun struct {
	ID           string            `json:"id"`
	RepoID       string            `json:"repo_id"`
	OrgID        string            `json:"org_id"`
	CommitSHA    string            `json:"commit_sha,omitempty"`
	Branch       string            `json:"branch"`
	Status       PipelineStatus    `json:"status"`
	Stages       []StageResult     `json:"stages"`
	CreatedAt    time.Time         `json:"created_at"`
	CompletedAt  *time.Time        `json:"completed_at,omitempty"`
	TotalDuration float64          `json:"total_duration_ms"`
	Metadata     map[string]string `json:"metadata,omitempty"`
}

// ServiceEndpoints holds URLs for downstream services
type ServiceEndpoints struct {
	CognitiveURL string
	CitadelURL   string
	VaultURL     string
	ParserAddr   string
	AuditURL     string
}

// Orchestrator coordinates the full data flow pipeline
type Orchestrator struct {
	logger    *zap.SugaredLogger
	endpoints ServiceEndpoints
	runs      map[string]*PipelineRun
	mu        sync.RWMutex
	listeners []func(run *PipelineRun, stage StageResult)
}

func NewOrchestrator(logger *zap.SugaredLogger, endpoints ServiceEndpoints) *Orchestrator {
	return &Orchestrator{
		logger:    logger,
		endpoints: endpoints,
		runs:      make(map[string]*PipelineRun),
	}
}

// OnStageComplete registers a callback for stage completion events
func (o *Orchestrator) OnStageComplete(fn func(run *PipelineRun, stage StageResult)) {
	o.listeners = append(o.listeners, fn)
}

func (o *Orchestrator) notifyListeners(run *PipelineRun, stage StageResult) {
	for _, fn := range o.listeners {
		go fn(run, stage)
	}
}

// StartPipeline initiates a full codebase analysis pipeline
//
// Flow: Upload → Auth → WASM Parser → AST → Gemini AI → Rule Engine →
//
//	Audit Trail → Sovereign Ledger → Dashboard Update
//	                                  ↘ Security Alerts
//	                                  ↘ Compliance Reports
//	                                  ↘ Strategic Insights
func (o *Orchestrator) StartPipeline(ctx context.Context, repoID, orgID, commitSHA, branch string) (*PipelineRun, error) {
	run := &PipelineRun{
		ID:        uuid.New().String(),
		RepoID:    repoID,
		OrgID:     orgID,
		CommitSHA: commitSHA,
		Branch:    branch,
		Status:    StatusRunning,
		Stages:    []StageResult{},
		CreatedAt: time.Now().UTC(),
		Metadata:  map[string]string{},
	}

	o.mu.Lock()
	o.runs[run.ID] = run
	o.mu.Unlock()

	o.logger.Infow("pipeline started",
		"pipeline_id", run.ID,
		"repo_id", repoID,
		"org_id", orgID,
		"commit", commitSHA,
	)

	go o.executePipeline(ctx, run)
	return run, nil
}

func (o *Orchestrator) executePipeline(ctx context.Context, run *PipelineRun) {
	// Sequential stages (each depends on the previous)
	sequentialStages := []struct {
		stage Stage
		fn    func(ctx context.Context, run *PipelineRun) (interface{}, error)
	}{
		{StageUpload, o.stageUpload},
		{StageAuth, o.stageAuth},
		{StageParse, o.stageParse},
		{StageAST, o.stageAST},
		{StageAIAnalysis, o.stageAIAnalysis},
		{StageRuleEngine, o.stageRuleEngine},
		{StageAuditTrail, o.stageAuditTrail},
		{StageLedger, o.stageLedger},
	}

	for _, s := range sequentialStages {
		if ctx.Err() != nil {
			o.failPipeline(run, "pipeline cancelled")
			return
		}

		result := o.executeStage(ctx, run, s.stage, s.fn)
		if result.Status == StatusFailed {
			o.failPipeline(run, fmt.Sprintf("stage %s failed: %s", s.stage, result.Error))
			return
		}
	}

	// Parallel fan-out stages after ledger
	var wg sync.WaitGroup
	parallelStages := []struct {
		stage Stage
		fn    func(ctx context.Context, run *PipelineRun) (interface{}, error)
	}{
		{StageDashboard, o.stageDashboard},
		{StageSecAlerts, o.stageSecurityAlerts},
		{StageCompliance, o.stageCompliance},
		{StageInsights, o.stageInsights},
	}

	for _, s := range parallelStages {
		wg.Add(1)
		go func(stage Stage, fn func(ctx context.Context, run *PipelineRun) (interface{}, error)) {
			defer wg.Done()
			o.executeStage(ctx, run, stage, fn)
		}(s.stage, s.fn)
	}
	wg.Wait()

	// Mark complete
	now := time.Now().UTC()
	run.CompletedAt = &now
	run.Status = StatusCompleted
	run.TotalDuration = now.Sub(run.CreatedAt).Seconds() * 1000

	o.logger.Infow("pipeline completed",
		"pipeline_id", run.ID,
		"duration_ms", run.TotalDuration,
		"stages", len(run.Stages),
	)
}

func (o *Orchestrator) executeStage(ctx context.Context, run *PipelineRun, stage Stage, fn func(ctx context.Context, run *PipelineRun) (interface{}, error)) StageResult {
	start := time.Now()
	result := StageResult{
		Stage:     stage,
		Status:    StatusRunning,
		StartedAt: start,
	}

	o.logger.Debugw("stage started", "pipeline_id", run.ID, "stage", stage)

	output, err := fn(ctx, run)
	now := time.Now()
	result.EndedAt = &now
	result.Duration = now.Sub(start).Seconds() * 1000

	if err != nil {
		result.Status = StatusFailed
		result.Error = err.Error()
		o.logger.Warnw("stage failed", "pipeline_id", run.ID, "stage", stage, "error", err)
	} else {
		result.Status = StatusCompleted
		result.Output = output
		o.logger.Debugw("stage completed", "pipeline_id", run.ID, "stage", stage, "duration_ms", result.Duration)
	}

	o.mu.Lock()
	run.Stages = append(run.Stages, result)
	o.mu.Unlock()

	o.notifyListeners(run, result)
	return result
}

func (o *Orchestrator) failPipeline(run *PipelineRun, reason string) {
	now := time.Now().UTC()
	run.Status = StatusFailed
	run.CompletedAt = &now
	run.TotalDuration = now.Sub(run.CreatedAt).Seconds() * 1000
	o.logger.Errorw("pipeline failed", "pipeline_id", run.ID, "reason", reason)
}

// GetRun returns a pipeline run by ID
func (o *Orchestrator) GetRun(id string) (*PipelineRun, bool) {
	o.mu.RLock()
	defer o.mu.RUnlock()
	run, ok := o.runs[id]
	return run, ok
}

// ListRuns returns all pipeline runs
func (o *Orchestrator) ListRuns() []*PipelineRun {
	o.mu.RLock()
	defer o.mu.RUnlock()
	runs := make([]*PipelineRun, 0, len(o.runs))
	for _, r := range o.runs {
		runs = append(runs, r)
	}
	return runs
}

// ── Stage Implementations ──

func (o *Orchestrator) stageUpload(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: fetch codebase from repo provider (GitHub, GitLab, etc.)
	time.Sleep(50 * time.Millisecond)
	return map[string]interface{}{"files_discovered": 42, "total_bytes": 1_250_000}, nil
}

func (o *Orchestrator) stageAuth(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: validate org permissions, tenant isolation
	time.Sleep(10 * time.Millisecond)
	return map[string]interface{}{"authorized": true, "org_id": run.OrgID}, nil
}

func (o *Orchestrator) stageParse(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: call Parser gRPC service for batch parsing
	time.Sleep(100 * time.Millisecond)
	return map[string]interface{}{"files_parsed": 42, "parse_time_ms": 95.3, "languages": []string{"typescript", "go", "python"}}, nil
}

func (o *Orchestrator) stageAST(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: extract structural AST and dependency graph
	time.Sleep(80 * time.Millisecond)
	return map[string]interface{}{"ast_nodes": 1_250, "dependency_edges": 89}, nil
}

func (o *Orchestrator) stageAIAnalysis(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: call Cognitive Service for Gemini analysis
	time.Sleep(200 * time.Millisecond)
	return map[string]interface{}{"insights_generated": 7, "model": "gemini-2.0-flash", "tokens_used": 12_500}, nil
}

func (o *Orchestrator) stageRuleEngine(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: evaluate architectural rules against analysis
	time.Sleep(60 * time.Millisecond)
	return map[string]interface{}{"rules_evaluated": 15, "violations": 3, "passed": 12}, nil
}

func (o *Orchestrator) stageAuditTrail(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: write immutable audit entry to PostgreSQL
	time.Sleep(30 * time.Millisecond)
	return map[string]interface{}{"audit_entry_id": uuid.New().String()}, nil
}

func (o *Orchestrator) stageLedger(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: call Vault Service to append to sovereign ledger
	time.Sleep(40 * time.Millisecond)
	return map[string]interface{}{"ledger_hash": "a1b2c3d4e5f6..."}, nil
}

func (o *Orchestrator) stageDashboard(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: push real-time update via WebSocket / SSE
	time.Sleep(20 * time.Millisecond)
	return map[string]interface{}{"dashboard_updated": true}, nil
}

func (o *Orchestrator) stageSecurityAlerts(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: generate security alerts from analysis results
	time.Sleep(30 * time.Millisecond)
	return map[string]interface{}{"alerts_generated": 1, "severity": "medium"}, nil
}

func (o *Orchestrator) stageCompliance(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: generate compliance report
	time.Sleep(25 * time.Millisecond)
	return map[string]interface{}{"compliance_score": 94.2, "frameworks": []string{"SOC2", "ISO27001"}}, nil
}

func (o *Orchestrator) stageInsights(ctx context.Context, run *PipelineRun) (interface{}, error) {
	// TODO: generate strategic insights summary
	time.Sleep(35 * time.Millisecond)
	return map[string]interface{}{"insights": 5, "health_score": 78.5}, nil
}

// ToJSON serializes a pipeline run to JSON bytes
func (r *PipelineRun) ToJSON() ([]byte, error) {
	return json.Marshal(r)
}
