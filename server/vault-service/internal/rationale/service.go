package rationale

import (
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
	store  map[string]*Rationale
}

type Rationale struct {
	ID           string    `json:"id"`
	OrgID        string    `json:"org_id"`
	RepoID       string    `json:"repo_id"`
	Title        string    `json:"title"`
	Rationale    string    `json:"rationale"`
	Category     string    `json:"category"`
	Tags         []string  `json:"tags"`
	RelatedFiles []string  `json:"related_files"`
	Signature    string    `json:"signature"`
	CreatedBy    string    `json:"created_by"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func NewService(cfg *config.Config, logger *zap.SugaredLogger, signer *crypto.Ed25519Signer) *Service {
	return &Service{
		cfg:    cfg,
		logger: logger,
		signer: signer,
		store:  make(map[string]*Rationale),
	}
}

func (s *Service) ListHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		orgID := c.Query("org_id")
		repoID := c.Query("repo_id")
		var results []*Rationale
		for _, r := range s.store {
			if orgID != "" && r.OrgID != orgID {
				continue
			}
			if repoID != "" && r.RepoID != repoID {
				continue
			}
			results = append(results, r)
		}
		if results == nil {
			results = []*Rationale{}
		}
		return c.JSON(fiber.Map{"data": results, "total": len(results)})
	}
}

func (s *Service) CreateHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			OrgID        string   `json:"org_id"`
			RepoID       string   `json:"repo_id"`
			Title        string   `json:"title"`
			Rationale    string   `json:"rationale"`
			Category     string   `json:"category"`
			Tags         []string `json:"tags"`
			RelatedFiles []string `json:"related_files"`
			CreatedBy    string   `json:"created_by"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
		}

		now := time.Now().UTC()
		r := &Rationale{
			ID:           uuid.New().String(),
			OrgID:        req.OrgID,
			RepoID:       req.RepoID,
			Title:        req.Title,
			Rationale:    req.Rationale,
			Category:     req.Category,
			Tags:         req.Tags,
			RelatedFiles: req.RelatedFiles,
			CreatedBy:    req.CreatedBy,
			CreatedAt:    now,
			UpdatedAt:    now,
		}
		r.Signature = s.signer.SignHex([]byte(r.ID + r.Rationale))

		s.store[r.ID] = r
		s.logger.Infow("rationale created", "id", r.ID, "title", r.Title)

		// TODO: also append to sovereign ledger and persist to MongoDB
		return c.Status(fiber.StatusCreated).JSON(r)
	}
}

func (s *Service) GetHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		r, ok := s.store[id]
		if !ok {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "rationale not found"})
		}
		return c.JSON(r)
	}
}

func (s *Service) UpdateHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		r, ok := s.store[id]
		if !ok {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "rationale not found"})
		}

		var req struct {
			Title     string   `json:"title"`
			Rationale string   `json:"rationale"`
			Category  string   `json:"category"`
			Tags      []string `json:"tags"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
		}

		if req.Title != "" {
			r.Title = req.Title
		}
		if req.Rationale != "" {
			r.Rationale = req.Rationale
		}
		if req.Category != "" {
			r.Category = req.Category
		}
		if req.Tags != nil {
			r.Tags = req.Tags
		}
		r.UpdatedAt = time.Now().UTC()
		r.Signature = s.signer.SignHex([]byte(r.ID + r.Rationale))

		return c.JSON(r)
	}
}
