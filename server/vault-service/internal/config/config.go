package config

import "os"

type Config struct {
	Env          string
	Port         string
	MongoURI     string
	VaultAddr    string
	VaultToken   string
	OTELEndpoint string
}

func Load() *Config {
	return &Config{
		Env:          getEnv("APP_ENV", "development"),
		Port:         getEnv("APP_PORT", "8300"),
		MongoURI:     getEnv("MONGO_URI", "mongodb://archlens:archlens_dev@localhost:27017/archlens?authSource=admin"),
		VaultAddr:    getEnv("VAULT_ADDR", "http://localhost:8200"),
		VaultToken:   getEnv("VAULT_TOKEN", "archlens-dev-token"),
		OTELEndpoint: getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
