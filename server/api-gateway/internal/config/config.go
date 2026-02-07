package config

import "os"

type Config struct {
	Env              string
	Port             string
	PostgresDSN      string
	RedisAddr        string
	KafkaBrokers     string
	KeycloakURL      string
	VaultAddr        string
	OTELEndpoint     string
	CORSOrigins      string
	JWTSecret        string
	CognitiveURL     string
	CitadelURL       string
	VaultServiceURL  string
}

func Load() *Config {
	return &Config{
		Env:              getEnv("APP_ENV", "development"),
		Port:             getEnv("APP_PORT", "8000"),
		PostgresDSN:      getEnv("POSTGRES_DSN", "postgres://archlens:archlens_dev@localhost:5432/archlens?sslmode=disable"),
		RedisAddr:        getEnv("REDIS_ADDR", "localhost:6379"),
		KafkaBrokers:     getEnv("KAFKA_BROKERS", "localhost:9092"),
		KeycloakURL:      getEnv("KEYCLOAK_URL", "http://localhost:8080"),
		VaultAddr:        getEnv("VAULT_ADDR", "http://localhost:8200"),
		OTELEndpoint:     getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"),
		CORSOrigins:      getEnv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001"),
		JWTSecret:        getEnv("JWT_SECRET", "archlens-dev-secret-change-in-production"),
		CognitiveURL:     getEnv("COGNITIVE_SERVICE_URL", "http://localhost:8100"),
		CitadelURL:       getEnv("CITADEL_SERVICE_URL", "http://localhost:8200"),
		VaultServiceURL:  getEnv("VAULT_SERVICE_URL", "http://localhost:8300"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
