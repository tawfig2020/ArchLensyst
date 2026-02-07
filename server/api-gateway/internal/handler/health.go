package handler

import (
	"github.com/archlens/api-gateway/internal/config"
	"github.com/gofiber/fiber/v2"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
)

func HealthCheck(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "api-gateway",
			"version": "1.0.0",
			"env":     cfg.Env,
		})
	}
}

func ReadinessCheck(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: check downstream dependencies (postgres, redis, kafka)
		return c.JSON(fiber.Map{
			"status": "ready",
		})
	}
}

func PrometheusMetrics() fiber.Handler {
	handler := fasthttpadaptor.NewFastHTTPHandler(promhttp.Handler())
	return func(c *fiber.Ctx) error {
		handler(c.Context())
		return nil
	}
}

func GlobalErrorHandler(logger interface{ Errorw(string, ...interface{}) }) fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError
		message := "internal server error"

		if e, ok := err.(*fiber.Error); ok {
			code = e.Code
			message = e.Message
		}

		logger.Errorw("unhandled error",
			"error", err.Error(),
			"status", code,
			"path", c.Path(),
			"method", c.Method(),
		)

		return c.Status(code).JSON(fiber.Map{
			"error":   message,
			"status":  code,
			"request": c.Locals("requestid"),
		})
	}
}
