package resilience

import (
	"encoding/json"
	"sync"
	"time"

	"go.uber.org/zap"
)

// DeadLetterMessage represents a failed message that needs reprocessing
type DeadLetterMessage struct {
	ID            string                 `json:"id"`
	OriginalTopic string                 `json:"original_topic"`
	Payload       json.RawMessage        `json:"payload"`
	Error         string                 `json:"error"`
	RetryCount    int                    `json:"retry_count"`
	MaxRetries    int                    `json:"max_retries"`
	FirstFailed   time.Time              `json:"first_failed"`
	LastFailed    time.Time              `json:"last_failed"`
	Metadata      map[string]string      `json:"metadata,omitempty"`
}

// DeadLetterQueue manages failed messages for retry or manual inspection
type DeadLetterQueue struct {
	logger   *zap.SugaredLogger
	mu       sync.RWMutex
	messages map[string]*DeadLetterMessage
	maxSize  int
}

func NewDeadLetterQueue(logger *zap.SugaredLogger, maxSize int) *DeadLetterQueue {
	if maxSize == 0 {
		maxSize = 10000
	}
	return &DeadLetterQueue{
		logger:   logger,
		messages: make(map[string]*DeadLetterMessage),
		maxSize:  maxSize,
	}
}

// Enqueue adds a failed message to the DLQ
func (q *DeadLetterQueue) Enqueue(msg *DeadLetterMessage) {
	q.mu.Lock()
	defer q.mu.Unlock()

	if len(q.messages) >= q.maxSize {
		q.logger.Warnw("DLQ at capacity, dropping oldest message", "max_size", q.maxSize)
		q.evictOldest()
	}

	msg.LastFailed = time.Now().UTC()
	if msg.FirstFailed.IsZero() {
		msg.FirstFailed = msg.LastFailed
	}
	msg.RetryCount++

	q.messages[msg.ID] = msg
	q.logger.Infow("message added to DLQ",
		"id", msg.ID,
		"topic", msg.OriginalTopic,
		"retry_count", msg.RetryCount,
		"error", msg.Error,
	)
}

// Dequeue removes and returns a message for reprocessing
func (q *DeadLetterQueue) Dequeue(id string) (*DeadLetterMessage, bool) {
	q.mu.Lock()
	defer q.mu.Unlock()
	msg, ok := q.messages[id]
	if ok {
		delete(q.messages, id)
	}
	return msg, ok
}

// List returns all messages in the DLQ
func (q *DeadLetterQueue) List() []*DeadLetterMessage {
	q.mu.RLock()
	defer q.mu.RUnlock()
	msgs := make([]*DeadLetterMessage, 0, len(q.messages))
	for _, m := range q.messages {
		msgs = append(msgs, m)
	}
	return msgs
}

// Size returns the number of messages in the DLQ
func (q *DeadLetterQueue) Size() int {
	q.mu.RLock()
	defer q.mu.RUnlock()
	return len(q.messages)
}

// Stats returns DLQ statistics
func (q *DeadLetterQueue) Stats() map[string]interface{} {
	q.mu.RLock()
	defer q.mu.RUnlock()

	topicCounts := make(map[string]int)
	for _, m := range q.messages {
		topicCounts[m.OriginalTopic]++
	}

	return map[string]interface{}{
		"total_messages": len(q.messages),
		"max_size":       q.maxSize,
		"by_topic":       topicCounts,
	}
}

func (q *DeadLetterQueue) evictOldest() {
	var oldest *DeadLetterMessage
	for _, m := range q.messages {
		if oldest == nil || m.FirstFailed.Before(oldest.FirstFailed) {
			oldest = m
		}
	}
	if oldest != nil {
		delete(q.messages, oldest.ID)
	}
}
