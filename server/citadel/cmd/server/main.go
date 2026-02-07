package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/archlens/citadel/internal/config"
	"github.com/archlens/citadel/internal/drift"
	"github.com/archlens/citadel/internal/mesh"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"go.uber.org/zap"
)

func main() {
	cfg := config.Load()

	var logger *zap.Logger
	var err error
	if cfg.Env == "production" {
		logger, err = zap.NewProduction()
	} else {
		logger, err = zap.NewDevelopment()
	}
	if err != nil {
		panic(fmt.Sprintf("failed to init logger: %v", err))
	}
	defer logger.Sync()
	sugar := logger.Sugar()

	// ── Drift Detector ──
	driftDetector := drift.NewDetector(cfg, sugar)

	// ── Mesh Monitor ──
	meshMonitor := mesh.NewMonitor(cfg, sugar)

	app := fiber.New(fiber.Config{
		AppName:               "ArchLens Strategic Citadel",
		ReadTimeout:           15 * time.Second,
		WriteTimeout:          15 * time.Second,
		DisableStartupMessage: cfg.Env == "production",
	})

	app.Use(recover.New())
	app.Use(cors.New())

	// ── Health ──
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "healthy", "service": "citadel"})
	})

	// ── Drift Detection API ──
	driftGroup := app.Group("/api/v1/drift")
	driftGroup.Post("/scan", driftDetector.ScanHandler())
	driftGroup.Get("/status/:scanId", driftDetector.StatusHandler())
	driftGroup.Get("/report/:repoId", driftDetector.ReportHandler())

	// ── Mesh Integrity API ──
	meshGroup := app.Group("/api/v1/mesh")
	meshGroup.Get("/health", meshMonitor.HealthHandler())
	meshGroup.Get("/topology", meshMonitor.TopologyHandler())
	meshGroup.Post("/verify", meshMonitor.VerifyHandler())

	// ── WebSocket for real-time updates ──
	app.Get("/ws/drift", driftDetector.WebSocketHandler())
	app.Get("/ws/mesh", meshMonitor.WebSocketHandler())

	// ── Start Kafka consumers in background ──
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go driftDetector.ConsumeAnalysisEvents(ctx)
	go meshMonitor.ConsumeHealthEvents(ctx)

	// ── Graceful shutdown ──
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		addr := fmt.Sprintf(":%s", cfg.Port)
		sugar.Infow("starting citadel service", "port", cfg.Port)
		if err := app.Listen(addr); err != nil {
			sugar.Fatalw("server failed", "error", err)
		}
	}()

	<-quit
	sugar.Info("shutting down citadel...")
	cancel()
	_ = app.Shutdown()
	sugar.Info("citadel stopped")
}
