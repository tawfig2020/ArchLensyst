module github.com/archlens/api-gateway

go 1.22

require (
	github.com/gofiber/fiber/v2 v2.52.0
	github.com/gofiber/contrib/otelfiber/v2 v2.1.0
	github.com/gofiber/contrib/websocket v1.3.0
	github.com/gofiber/swagger v1.0.0
	github.com/jackc/pgx/v5 v5.5.3
	github.com/redis/go-redis/v9 v9.4.0
	github.com/segmentio/kafka-go v0.4.47
	github.com/golang-jwt/jwt/v5 v5.2.0
	github.com/google/uuid v1.6.0
	go.opentelemetry.io/otel v1.23.0
	go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc v1.23.0
	go.opentelemetry.io/otel/sdk v1.23.0
	go.uber.org/zap v1.27.0
	github.com/prometheus/client_golang v1.18.0
)
