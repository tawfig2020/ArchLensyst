package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func RequestLogger(logger *zap.SugaredLogger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		latency := time.Since(start)

		fields := []interface{}{
			"method", c.Method(),
			"path", c.Path(),
			"status", c.Response().StatusCode(),
			"latency_ms", latency.Milliseconds(),
			"ip", c.IP(),
			"request_id", c.Locals("requestid"),
		}

		if err != nil {
			fields = append(fields, "error", err.Error())
			logger.Errorw("request failed", fields...)
		} else if c.Response().StatusCode() >= 400 {
			logger.Warnw("request completed", fields...)
		} else {
			logger.Infow("request completed", fields...)
		}

		return err
	}
}
