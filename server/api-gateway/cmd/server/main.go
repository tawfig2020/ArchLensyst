package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/archlens/api-gateway/internal/config"
	"github.com/archlens/api-gateway/internal/handler"
	"github.com/archlens/api-gateway/internal/middleware"
	"github.com/archlens/api-gateway/internal/telemetry"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"go.uber.org/zap"
)

func main() {
	// ── Configuration ──
	cfg := config.Load()

	// ── Logger ──
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

	// ── OpenTelemetry ──
	shutdown, err := telemetry.InitTracer(cfg.OTELEndpoint, "api-gateway")
	if err != nil {
		sugar.Warnw("failed to init tracer", "error", err)
	} else {
		defer shutdown(context.Background())
	}

	// ── Fiber App ──
	app := fiber.New(fiber.Config{
		AppName:               "ArchLens API Gateway",
		ReadTimeout:           15 * time.Second,
		WriteTimeout:          15 * time.Second,
		IdleTimeout:           60 * time.Second,
		DisableStartupMessage: cfg.Env == "production",
		ErrorHandler:          handler.GlobalErrorHandler(sugar),
	})

	// ── Global Middleware ──
	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(helmet.New())
	app.Use(compress.New(compress.Config{Level: compress.LevelBestSpeed}))
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization,X-Request-ID,X-Archlens-Client",
		AllowCredentials: true,
		MaxAge:           3600,
	}))
	app.Use(limiter.New(limiter.Config{
		Max:               100,
		Expiration:        1 * time.Minute,
		LimiterMiddleware: limiter.SlidingWindow{},
	}))
	app.Use(middleware.RequestLogger(sugar))
	app.Use(middleware.MetricsMiddleware())

	// ── Health & Metrics ──
	app.Get("/health", handler.HealthCheck(cfg))
	app.Get("/ready", handler.ReadinessCheck(cfg))
	app.Get("/metrics", handler.PrometheusMetrics())

	// ── API v1 ──
	v1 := app.Group("/api/v1")

	// Public
	v1.Post("/auth/token", handler.AuthToken(cfg))

	// Protected routes
	protected := v1.Group("", middleware.JWTAuth(cfg))

	// Organizations
	protected.Get("/organizations", handler.ListOrganizations())
	protected.Post("/organizations", handler.CreateOrganization())
	protected.Get("/organizations/:orgId", handler.GetOrganization())

	// Repositories
	protected.Get("/organizations/:orgId/repos", handler.ListRepositories())
	protected.Post("/organizations/:orgId/repos", handler.CreateRepository())
	protected.Get("/repos/:repoId", handler.GetRepository())
	protected.Post("/repos/:repoId/analyze", handler.TriggerAnalysis())

	// Analysis
	protected.Get("/repos/:repoId/analyses", handler.ListAnalyses())
	protected.Get("/analyses/:analysisId", handler.GetAnalysis())
	protected.Get("/analyses/:analysisId/dependencies", handler.GetDependencyGraph())

	// Drift & Violations
	protected.Get("/repos/:repoId/drift", handler.ListDriftEvents())
	protected.Patch("/drift/:driftId", handler.UpdateDriftEvent())

	// Architectural Rules
	protected.Get("/organizations/:orgId/rules", handler.ListRules())
	protected.Post("/organizations/:orgId/rules", handler.CreateRule())
	protected.Put("/rules/:ruleId", handler.UpdateRule())
	protected.Delete("/rules/:ruleId", handler.DeleteRule())

	// Phantom Execution
	protected.Post("/repos/:repoId/phantom", handler.CreatePhantomExecution())
	protected.Get("/phantom/:phantomId", handler.GetPhantomExecution())

	// Synthetic Fixes
	protected.Get("/drift/:driftId/fixes", handler.ListSyntheticFixes())
	protected.Post("/fixes/:fixId/apply", handler.ApplySyntheticFix())

	// Metrics
	protected.Get("/repos/:repoId/metrics", handler.GetArchitectureMetrics())

	// Audit Log
	protected.Get("/organizations/:orgId/audit", handler.ListAuditLog())

	// ── WebSocket ──
	app.Get("/ws", middleware.JWTAuth(cfg), handler.WebSocketUpgrade())

	// ── Graceful Shutdown ──
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		addr := fmt.Sprintf(":%s", cfg.Port)
		sugar.Infow("starting API gateway", "port", cfg.Port, "env", cfg.Env)
		if err := app.Listen(addr); err != nil {
			sugar.Fatalw("server failed", "error", err)
		}
	}()

	<-quit
	sugar.Info("shutting down gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = ctx
	if err := app.Shutdown(); err != nil {
		sugar.Errorw("shutdown error", "error", err)
	}
	sugar.Info("server stopped")
}
