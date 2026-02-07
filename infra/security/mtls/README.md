# Zero-Trust mTLS Configuration (SPIFFE/SPIRE)

## Overview
ArchLens uses SPIFFE/SPIRE for mutual TLS between all services.
Every service gets a unique SPIFFE ID and short-lived X.509 certificate.

## SPIFFE IDs
```
spiffe://archlens.io/service/api-gateway
spiffe://archlens.io/service/citadel
spiffe://archlens.io/service/vault-service
spiffe://archlens.io/service/cognitive
spiffe://archlens.io/service/parser
spiffe://archlens.io/service/audit
```

## Local Development
For local dev, mTLS is **disabled** — services communicate over plain HTTP.
mTLS is enforced in staging and production via SPIRE agents.

## Production Setup
1. Deploy SPIRE Server to the cluster
2. Register each service workload
3. Services automatically receive SVID certificates
4. Certificates rotate every 1 hour (configurable)

## Configuration
See `spire-server.yaml` and `spire-agent.yaml` for Kubernetes manifests.
