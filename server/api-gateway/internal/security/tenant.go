package security

import (
	"github.com/gofiber/fiber/v2"
)

// TenantIsolation middleware enforces multi-tenant data isolation
// Extracts org_id from JWT claims and enforces it on every request
func TenantIsolation() fiber.Handler {
	return func(c *fiber.Ctx) error {
		orgID, _ := c.Locals("org_id").(string)
		if orgID == "" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "tenant context missing — org_id not found in token",
			})
		}

		// Enforce param-level isolation: if route has :orgId, it must match token
		paramOrgID := c.Params("orgId")
		if paramOrgID != "" && paramOrgID != orgID {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "cross-tenant access denied",
			})
		}

		// Set tenant context header for downstream services
		c.Set("X-Tenant-ID", orgID)
		c.Locals("tenant_id", orgID)

		return c.Next()
	}
}

// RoleGuard restricts access based on JWT role claim
func RoleGuard(allowedRoles ...string) fiber.Handler {
	roleSet := make(map[string]bool, len(allowedRoles))
	for _, r := range allowedRoles {
		roleSet[r] = true
	}

	return func(c *fiber.Ctx) error {
		role, _ := c.Locals("role").(string)
		if !roleSet[role] {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error":          "insufficient permissions",
				"required_roles": allowedRoles,
			})
		}
		return c.Next()
	}
}
