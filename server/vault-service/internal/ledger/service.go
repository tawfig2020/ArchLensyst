package ledger

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"time"

	"github.com/archlens/vault-service/internal/config"
	"github.com/archlens/vault-service/internal/crypto"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type Service struct {
	cfg    *config.Config
	logger *zap.SugaredLogger
	signer *crypto.Ed25519Signer
	chain  []Entry
}

type Entry struct {
	ID           string                 `json:"id"`
	EntryType    string                 `json:"entry_type"`
	Payload      map[string]interface{} `json:"payload"`
	Signature    string                 `json:"signature"`
	PublicKey    string                 `json:"public_key"`
	PreviousHash string                `json:"previous_hash"`
	Hash         string                 `json:"hash"`
	Timestamp    time.Time              `json:"timestamp"`
}

func NewService(cfg *config.Config, logger *zap.SugaredLogger, signer *crypto.Ed25519Signer) *Service {
	// Genesis entry
	genesis := Entry{
		ID:           uuid.New().String(),
		EntryType:    "genesis",
		Payload:      map[string]interface{}{"message": "ArchLens Sovereign Ledger initialized"},
		PreviousHash: "0000000000000000000000000000000000000000000000000000000000000000",
		Timestamp:    time.Now().UTC(),
	}
	genesis.Hash = computeHash(genesis)
	genesis.Signature = signer.SignHex([]byte(genesis.Hash))
	genesis.PublicKey = signer.PublicKeyHex()

	return &Service{
		cfg:    cfg,
		logger: logger,
		signer: signer,
		chain:  []Entry{genesis},
	}
}

func computeHash(e Entry) string {
	data, _ := json.Marshal(map[string]interface{}{
		"entry_type":    e.EntryType,
		"payload":       e.Payload,
		"previous_hash": e.PreviousHash,
		"timestamp":     e.Timestamp.Unix(),
	})
	h := sha256.Sum256(data)
	return hex.EncodeToString(h[:])
}

func (s *Service) Append(entryType string, payload map[string]interface{}) Entry {
	prev := s.chain[len(s.chain)-1]
	entry := Entry{
		ID:           uuid.New().String(),
		EntryType:    entryType,
		Payload:      payload,
		PreviousHash: prev.Hash,
		Timestamp:    time.Now().UTC(),
	}
	entry.Hash = computeHash(entry)
	entry.Signature = s.signer.SignHex([]byte(entry.Hash))
	entry.PublicKey = s.signer.PublicKeyHex()
	s.chain = append(s.chain, entry)
	s.logger.Infow("ledger entry appended", "hash", entry.Hash, "type", entryType)
	return entry
}

func (s *Service) VerifyChain() (bool, int) {
	for i := 1; i < len(s.chain); i++ {
		if s.chain[i].PreviousHash != s.chain[i-1].Hash {
			return false, i
		}
		expected := computeHash(s.chain[i])
		if s.chain[i].Hash != expected {
			return false, i
		}
	}
	return true, -1
}

func (s *Service) ListHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"entries": s.chain, "total": len(s.chain)})
	}
}

func (s *Service) GetByHashHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		hash := c.Params("hash")
		for _, e := range s.chain {
			if e.Hash == hash {
				return c.JSON(e)
			}
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "entry not found"})
	}
}

func (s *Service) VerifyChainHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		valid, failedAt := s.VerifyChain()
		result := fiber.Map{"valid": valid, "entries": len(s.chain)}
		if !valid {
			result["failed_at_index"] = failedAt
		}
		return c.JSON(result)
	}
}
