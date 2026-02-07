package resilience

import (
	"context"
	"math"
	"math/rand"
	"time"

	"go.uber.org/zap"
)

// RetryConfig configures exponential backoff retry behavior
type RetryConfig struct {
	MaxAttempts   int
	InitialDelay  time.Duration
	MaxDelay      time.Duration
	Multiplier    float64
	JitterFactor  float64
}

// DefaultRetryConfig returns sensible defaults for AI service calls
func DefaultRetryConfig() RetryConfig {
	return RetryConfig{
		MaxAttempts:  5,
		InitialDelay: 200 * time.Millisecond,
		MaxDelay:     30 * time.Second,
		Multiplier:   2.0,
		JitterFactor: 0.3,
	}
}

// RetryWithBackoff executes fn with exponential backoff and jitter
func RetryWithBackoff(ctx context.Context, cfg RetryConfig, logger *zap.SugaredLogger, operation string, fn func() error) error {
	var lastErr error

	for attempt := 0; attempt < cfg.MaxAttempts; attempt++ {
		if ctx.Err() != nil {
			return ctx.Err()
		}

		lastErr = fn()
		if lastErr == nil {
			if attempt > 0 {
				logger.Infow("retry succeeded",
					"operation", operation,
					"attempt", attempt+1,
				)
			}
			return nil
		}

		if attempt < cfg.MaxAttempts-1 {
			delay := calculateDelay(attempt, cfg)
			logger.Warnw("operation failed, retrying",
				"operation", operation,
				"attempt", attempt+1,
				"max_attempts", cfg.MaxAttempts,
				"delay", delay.String(),
				"error", lastErr.Error(),
			)

			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(delay):
			}
		}
	}

	logger.Errorw("all retry attempts exhausted",
		"operation", operation,
		"attempts", cfg.MaxAttempts,
		"error", lastErr.Error(),
	)
	return lastErr
}

func calculateDelay(attempt int, cfg RetryConfig) time.Duration {
	delay := float64(cfg.InitialDelay) * math.Pow(cfg.Multiplier, float64(attempt))
	if delay > float64(cfg.MaxDelay) {
		delay = float64(cfg.MaxDelay)
	}
	// Add jitter
	jitter := delay * cfg.JitterFactor * (rand.Float64()*2 - 1)
	delay += jitter
	if delay < 0 {
		delay = float64(cfg.InitialDelay)
	}
	return time.Duration(delay)
}
