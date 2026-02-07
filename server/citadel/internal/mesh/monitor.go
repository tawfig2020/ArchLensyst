package mesh

import (
	"context"
	"encoding/json"
	"time"

	"github.com/archlens/citadel/internal/config"
	"github.com/gofiber/fiber/v2"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

type Monitor struct {
	cfg    *config.Config
	logger *zap.SugaredLogger
}

type ServiceNode struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Status   string   `json:"status"`
	Latency  float64  `json:"latency_ms"`
	Upstream []string `json:"upstream"`
}

func NewMonitor(cfg *config.Config, logger *zap.SugaredLogger) *Monitor {
	return &Monitor{cfg: cfg, logger: logger}
}

func (m *Monitor) HealthHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: aggregate health from all services via Redis
		services := []ServiceNode{
			{ID: "api-gateway", Name: "API Gateway", Status: "healthy", Latency: 2.1, Upstream: []string{}},
			{ID: "cognitive", Name: "Cognitive Service", Status: "healthy", Latency: 45.3, Upstream: []string{"api-gateway"}},
			{ID: "parser", Name: "Parser Service", Status: "healthy", Latency: 12.7, Upstream: []string{"api-gateway"}},
			{ID: "vault", Name: "Vault Service", Status: "healthy", Latency: 8.4, Upstream: []string{"api-gateway"}},
			{ID: "audit", Name: "Audit Service", Status: "healthy", Latency: 15.2, Upstream: []string{"api-gateway"}},
		}
		return c.JSON(fiber.Map{
			"status":   "healthy",
			"services": services,
			"checked":  time.Now().UTC(),
		})
	}
}

func (m *Monitor) TopologyHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: build real topology from service registry
		return c.JSON(fiber.Map{
			"nodes": []fiber.Map{
				{"id": "api-gateway", "type": "gateway", "layer": 3},
				{"id": "cognitive", "type": "service", "layer": 2},
				{"id": "parser", "type": "service", "layer": 1},
				{"id": "vault", "type": "service", "layer": 0},
				{"id": "audit", "type": "service", "layer": 2},
				{"id": "citadel", "type": "orchestrator", "layer": 3},
			},
			"edges": []fiber.Map{
				{"from": "api-gateway", "to": "cognitive", "protocol": "http"},
				{"from": "api-gateway", "to": "parser", "protocol": "grpc"},
				{"from": "api-gateway", "to": "vault", "protocol": "http"},
				{"from": "api-gateway", "to": "audit", "protocol": "http"},
				{"from": "citadel", "to": "api-gateway", "protocol": "http"},
				{"from": "cognitive", "to": "parser", "protocol": "kafka"},
			},
		})
	}
}

func (m *Monitor) VerifyHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: verify mesh integrity — check all services are reachable and healthy
		return c.JSON(fiber.Map{
			"verified": true,
			"issues":   []interface{}{},
			"checked":  time.Now().UTC(),
		})
	}
}

func (m *Monitor) WebSocketHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"error": "mesh websocket not yet implemented",
		})
	}
}

func (m *Monitor) ConsumeHealthEvents(ctx context.Context) {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{m.cfg.KafkaBrokers},
		Topic:   "archlens.service.health",
		GroupID: "citadel-mesh-monitor",
		MaxWait: 3 * time.Second,
	})
	defer reader.Close()

	m.logger.Info("mesh monitor consuming health events...")

	for {
		select {
		case <-ctx.Done():
			m.logger.Info("mesh monitor consumer shutting down")
			return
		default:
			msg, err := reader.ReadMessage(ctx)
			if err != nil {
				if ctx.Err() != nil {
					return
				}
				m.logger.Warnw("error reading kafka health message", "error", err)
				time.Sleep(time.Second)
				continue
			}

			var event map[string]interface{}
			if err := json.Unmarshal(msg.Value, &event); err != nil {
				m.logger.Warnw("error unmarshalling health event", "error", err)
				continue
			}

			m.logger.Debugw("received health event", "event", event)
		}
	}
}
