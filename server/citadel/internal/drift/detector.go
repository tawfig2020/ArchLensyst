package drift

import (
	"context"
	"encoding/json"
	"time"

	"github.com/archlens/citadel/internal/config"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

type Detector struct {
	cfg    *config.Config
	logger *zap.SugaredLogger
	scans  map[string]*ScanResult
}

type ScanResult struct {
	ID         string    `json:"id"`
	RepoID     string    `json:"repo_id"`
	Status     string    `json:"status"`
	Violations int       `json:"violations"`
	StartedAt  time.Time `json:"started_at"`
	Details    []Drift   `json:"details,omitempty"`
}

type Drift struct {
	RuleID      string `json:"rule_id"`
	Severity    string `json:"severity"`
	Category    string `json:"category"`
	Title       string `json:"title"`
	Description string `json:"description"`
	FilePath    string `json:"file_path,omitempty"`
	LineNumber  int    `json:"line_number,omitempty"`
}

func NewDetector(cfg *config.Config, logger *zap.SugaredLogger) *Detector {
	return &Detector{
		cfg:    cfg,
		logger: logger,
		scans:  make(map[string]*ScanResult),
	}
}

func (d *Detector) ScanHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		type request struct {
			RepoID    string `json:"repo_id"`
			CommitSHA string `json:"commit_sha"`
			Branch    string `json:"branch"`
		}
		var req request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		scanID := uuid.New().String()
		scan := &ScanResult{
			ID:        scanID,
			RepoID:    req.RepoID,
			Status:    "running",
			StartedAt: time.Now(),
		}
		d.scans[scanID] = scan

		// TODO: trigger actual drift detection pipeline via Kafka
		d.logger.Infow("drift scan started", "scan_id", scanID, "repo_id", req.RepoID)

		return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
			"scan_id": scanID,
			"status":  "running",
		})
	}
}

func (d *Detector) StatusHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		scanID := c.Params("scanId")
		scan, ok := d.scans[scanID]
		if !ok {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "scan not found"})
		}
		return c.JSON(scan)
	}
}

func (d *Detector) ReportHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		repoID := c.Params("repoId")
		// TODO: query PostgreSQL for drift events
		return c.JSON(fiber.Map{
			"repo_id":    repoID,
			"violations": 0,
			"details":    []interface{}{},
		})
	}
}

func (d *Detector) WebSocketHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: implement WebSocket for real-time drift notifications
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"error": "websocket not yet implemented",
		})
	}
}

func (d *Detector) ConsumeAnalysisEvents(ctx context.Context) {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{d.cfg.KafkaBrokers},
		Topic:    "archlens.analysis.completed",
		GroupID:  "citadel-drift-detector",
		MaxWait:  3 * time.Second,
	})
	defer reader.Close()

	d.logger.Info("drift detector consuming analysis events...")

	for {
		select {
		case <-ctx.Done():
			d.logger.Info("drift detector consumer shutting down")
			return
		default:
			msg, err := reader.ReadMessage(ctx)
			if err != nil {
				if ctx.Err() != nil {
					return
				}
				d.logger.Warnw("error reading kafka message", "error", err)
				time.Sleep(time.Second)
				continue
			}

			var event map[string]interface{}
			if err := json.Unmarshal(msg.Value, &event); err != nil {
				d.logger.Warnw("error unmarshalling event", "error", err)
				continue
			}

			d.logger.Infow("received analysis event", "event", event)
			// TODO: process event and run drift detection
		}
	}
}
