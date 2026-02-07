package resilience

import (
	"errors"
	"sync"
	"time"

	"go.uber.org/zap"
)

// State represents the circuit breaker state
type State int

const (
	StateClosed   State = iota // Normal — requests flow through
	StateOpen                   // Tripped — requests fail fast
	StateHalfOpen              // Testing — limited requests allowed
)

func (s State) String() string {
	switch s {
	case StateClosed:
		return "closed"
	case StateOpen:
		return "open"
	case StateHalfOpen:
		return "half_open"
	default:
		return "unknown"
	}
}

var (
	ErrCircuitOpen    = errors.New("circuit breaker is open")
	ErrTooManyFailures = errors.New("too many failures, circuit opened")
)

// CircuitBreakerConfig configures the circuit breaker behavior
type CircuitBreakerConfig struct {
	Name              string
	MaxFailures       int
	ResetTimeout      time.Duration
	HalfOpenMaxCalls  int
	OnStateChange     func(name string, from, to State)
}

// CircuitBreaker implements the circuit breaker pattern
type CircuitBreaker struct {
	config       CircuitBreakerConfig
	logger       *zap.SugaredLogger
	mu           sync.Mutex
	state        State
	failures     int
	successes    int
	lastFailure  time.Time
	halfOpenCalls int
}

func NewCircuitBreaker(cfg CircuitBreakerConfig, logger *zap.SugaredLogger) *CircuitBreaker {
	if cfg.MaxFailures == 0 {
		cfg.MaxFailures = 5
	}
	if cfg.ResetTimeout == 0 {
		cfg.ResetTimeout = 30 * time.Second
	}
	if cfg.HalfOpenMaxCalls == 0 {
		cfg.HalfOpenMaxCalls = 3
	}

	return &CircuitBreaker{
		config: cfg,
		logger: logger,
		state:  StateClosed,
	}
}

// Execute runs the given function through the circuit breaker
func (cb *CircuitBreaker) Execute(fn func() (interface{}, error)) (interface{}, error) {
	cb.mu.Lock()

	switch cb.state {
	case StateOpen:
		if time.Since(cb.lastFailure) > cb.config.ResetTimeout {
			cb.transitionTo(StateHalfOpen)
		} else {
			cb.mu.Unlock()
			return nil, ErrCircuitOpen
		}

	case StateHalfOpen:
		if cb.halfOpenCalls >= cb.config.HalfOpenMaxCalls {
			cb.mu.Unlock()
			return nil, ErrCircuitOpen
		}
		cb.halfOpenCalls++
	}

	cb.mu.Unlock()

	result, err := fn()

	cb.mu.Lock()
	defer cb.mu.Unlock()

	if err != nil {
		cb.onFailure()
		return result, err
	}

	cb.onSuccess()
	return result, nil
}

func (cb *CircuitBreaker) onSuccess() {
	cb.failures = 0
	cb.successes++

	if cb.state == StateHalfOpen {
		cb.transitionTo(StateClosed)
	}
}

func (cb *CircuitBreaker) onFailure() {
	cb.failures++
	cb.lastFailure = time.Now()

	if cb.state == StateHalfOpen {
		cb.transitionTo(StateOpen)
		return
	}

	if cb.failures >= cb.config.MaxFailures {
		cb.transitionTo(StateOpen)
	}
}

func (cb *CircuitBreaker) transitionTo(newState State) {
	old := cb.state
	cb.state = newState
	cb.halfOpenCalls = 0

	if newState == StateClosed {
		cb.failures = 0
		cb.successes = 0
	}

	cb.logger.Infow("circuit breaker state change",
		"name", cb.config.Name,
		"from", old.String(),
		"to", newState.String(),
	)

	if cb.config.OnStateChange != nil {
		go cb.config.OnStateChange(cb.config.Name, old, newState)
	}
}

// State returns the current state
func (cb *CircuitBreaker) State() State {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	return cb.state
}

// Stats returns current circuit breaker statistics
func (cb *CircuitBreaker) Stats() map[string]interface{} {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	return map[string]interface{}{
		"name":           cb.config.Name,
		"state":          cb.state.String(),
		"failures":       cb.failures,
		"successes":      cb.successes,
		"max_failures":   cb.config.MaxFailures,
		"reset_timeout":  cb.config.ResetTimeout.String(),
	}
}
