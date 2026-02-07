package config

import "os"

type Config struct {
	Env          string
	Port         string
	PostgresDSN  string
	RedisAddr    string
	KafkaBrokers string
	OTELEndpoint string
}

func Load() *Config {
	return &Config{
		Env:          getEnv("APP_ENV", "development"),
		Port:         getEnv("APP_PORT", "8200"),
		PostgresDSN:  getEnv("POSTGRES_DSN", "postgres://archlens:archlens_dev@localhost:5432/archlens?sslmode=disable"),
		RedisAddr:    getEnv("REDIS_ADDR", "localhost:6379"),
		KafkaBrokers: getEnv("KAFKA_BROKERS", "localhost:9092"),
		OTELEndpoint: getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
