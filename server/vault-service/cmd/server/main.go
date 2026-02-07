package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/archlens/vault-service/internal/config"
	"github.com/archlens/vault-service/internal/crypto"
	"github.com/archlens/vault-service/internal/ledger"
	"github.com/archlens/vault-service/internal/rationale"
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

	// ── Crypto Engine (Ed25519) ──
	signer, err := crypto.NewEd25519Signer()
	if err != nil {
		sugar.Fatalw("failed to init crypto signer", "error", err)
	}
	sugar.Infow("crypto signer initialized", "public_key", signer.PublicKeyHex())

	// ── Service Layers ──
	ledgerService := ledger.NewService(cfg, sugar, signer)
	rationaleService := rationale.NewService(cfg, sugar, signer)

	app := fiber.New(fiber.Config{
		AppName:               "ArchLens Sovereign Vault",
		ReadTimeout:           15 * time.Second,
		WriteTimeout:          15 * time.Second,
		DisableStartupMessage: cfg.Env == "production",
	})

	app.Use(recover.New())
	app.Use(cors.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "healthy", "service": "vault-service"})
	})

	// ── Rationale API ──
	rGroup := app.Group("/api/v1/rationales")
	rGroup.Get("/", rationaleService.ListHandler())
	rGroup.Post("/", rationaleService.CreateHandler())
	rGroup.Get("/:id", rationaleService.GetHandler())
	rGroup.Put("/:id", rationaleService.UpdateHandler())

	// ── Ledger API ──
	lGroup := app.Group("/api/v1/ledger")
	lGroup.Get("/", ledgerService.ListHandler())
	lGroup.Get("/:hash", ledgerService.GetByHashHandler())
	lGroup.Post("/verify", ledgerService.VerifyChainHandler())

	// ── Crypto API ──
	app.Post("/api/v1/sign", func(c *fiber.Ctx) error {
		var body struct {
			Data string `json:"data"`
		}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
		}
		sig := signer.Sign([]byte(body.Data))
		return c.JSON(fiber.Map{
			"signature":  fmt.Sprintf("%x", sig),
			"public_key": signer.PublicKeyHex(),
		})
	})

	app.Post("/api/v1/verify", func(c *fiber.Ctx) error {
		var body struct {
			Data      string `json:"data"`
			Signature string `json:"signature"`
		}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
		}
		valid := signer.VerifyHex([]byte(body.Data), body.Signature)
		return c.JSON(fiber.Map{"valid": valid})
	})

	// ── Graceful shutdown ──
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		addr := fmt.Sprintf(":%s", cfg.Port)
		sugar.Infow("starting vault service", "port", cfg.Port)
		if err := app.Listen(addr); err != nil {
			sugar.Fatalw("server failed", "error", err)
		}
	}()

	<-quit
	sugar.Info("shutting down vault service...")
	_ = app.Shutdown()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = ctx
	sugar.Info("vault service stopped")
}
