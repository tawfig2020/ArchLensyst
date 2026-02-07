# ── Build Stage ──
FROM golang:1.22-alpine AS builder
RUN apk add --no-cache git ca-certificates
WORKDIR /app
COPY go.mod ./
COPY go.sum* ./
RUN go mod download || true
COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /api-gateway ./cmd/server

# ── Runtime Stage (distroless) ──
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /api-gateway /api-gateway
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
USER nonroot:nonroot
EXPOSE 8000
ENTRYPOINT ["/api-gateway"]
