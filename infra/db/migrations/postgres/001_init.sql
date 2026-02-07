-- ArchLens Foundation Schema
-- PostgreSQL 16 + TimescaleDB + Citus Extensions

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- TimescaleDB extension (only available if using timescale/timescaledb image)
-- CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- ──────────────────────────────────────────────
-- Core Identity
-- ──────────────────────────────────────────────
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    plan            TEXT NOT NULL DEFAULT 'starter',
    settings        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    external_id     TEXT UNIQUE,  -- Keycloak subject ID
    email           TEXT NOT NULL,
    display_name    TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'member',
    avatar_url      TEXT,
    preferences     JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, email)
);

-- ──────────────────────────────────────────────
-- Repository & Codebase
-- ──────────────────────────────────────────────
CREATE TABLE repositories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    provider        TEXT NOT NULL,  -- github, gitlab, bitbucket, azure_devops
    remote_url      TEXT NOT NULL,
    default_branch  TEXT NOT NULL DEFAULT 'main',
    last_synced_at  TIMESTAMPTZ,
    config          JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, remote_url)
);

CREATE TABLE code_files (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repo_id         UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    path            TEXT NOT NULL,
    language        TEXT NOT NULL,
    size_bytes      INTEGER NOT NULL DEFAULT 0,
    hash            TEXT NOT NULL,
    last_parsed_at  TIMESTAMPTZ,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(repo_id, path)
);

-- ──────────────────────────────────────────────
-- Architectural Analysis
-- ──────────────────────────────────────────────
CREATE TABLE architectural_rules (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    category        TEXT NOT NULL,  -- dependency, security, performance, convention
    severity        TEXT NOT NULL DEFAULT 'warning',  -- info, warning, error, critical
    rule_definition JSONB NOT NULL,  -- flexible rule storage
    enabled         BOOLEAN NOT NULL DEFAULT true,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analysis_results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repo_id         UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    commit_sha      TEXT NOT NULL,
    branch          TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending',  -- pending, running, completed, failed
    health_score    REAL,
    summary         JSONB NOT NULL DEFAULT '{}',
    violations      JSONB NOT NULL DEFAULT '[]',
    metrics         JSONB NOT NULL DEFAULT '{}',
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_analysis_repo_created ON analysis_results(repo_id, created_at DESC);

CREATE TABLE dependency_edges (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repo_id         UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    analysis_id     UUID NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
    source_file_id  UUID NOT NULL REFERENCES code_files(id) ON DELETE CASCADE,
    target_file_id  UUID NOT NULL REFERENCES code_files(id) ON DELETE CASCADE,
    dep_type        TEXT NOT NULL,  -- import, extends, implements, uses, calls
    weight          REAL NOT NULL DEFAULT 1.0,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_deps_analysis ON dependency_edges(analysis_id);
CREATE INDEX idx_deps_source ON dependency_edges(source_file_id);
CREATE INDEX idx_deps_target ON dependency_edges(target_file_id);

-- ──────────────────────────────────────────────
-- Drift & Violations
-- ──────────────────────────────────────────────
CREATE TABLE drift_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repo_id         UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    rule_id         UUID REFERENCES architectural_rules(id),
    severity        TEXT NOT NULL,
    category        TEXT NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    file_path       TEXT,
    line_number     INTEGER,
    suggested_fix   JSONB,
    status          TEXT NOT NULL DEFAULT 'open',  -- open, acknowledged, resolved, ignored
    resolved_by     UUID REFERENCES users(id),
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_drift_repo_status ON drift_events(repo_id, status);

-- ──────────────────────────────────────────────
-- Time-Series Metrics (TimescaleDB hypertable)
-- ──────────────────────────────────────────────
CREATE TABLE architecture_metrics (
    time            TIMESTAMPTZ NOT NULL,
    repo_id         UUID NOT NULL,
    metric_name     TEXT NOT NULL,
    metric_value    DOUBLE PRECISION NOT NULL,
    dimensions      JSONB NOT NULL DEFAULT '{}'
);
-- If TimescaleDB is available, uncomment:
-- SELECT create_hypertable('architecture_metrics', 'time');
CREATE INDEX idx_metrics_time ON architecture_metrics(time DESC);
CREATE INDEX idx_metrics_repo_name ON architecture_metrics(repo_id, metric_name, time DESC);

-- ──────────────────────────────────────────────
-- Phantom Execution
-- ──────────────────────────────────────────────
CREATE TABLE phantom_executions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repo_id         UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    initiated_by    UUID NOT NULL REFERENCES users(id),
    description     TEXT NOT NULL,
    diff_patch      TEXT NOT NULL,
    impact_analysis JSONB NOT NULL DEFAULT '{}',
    status          TEXT NOT NULL DEFAULT 'pending',
    result          JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

-- ──────────────────────────────────────────────
-- Synthetic Fixes
-- ──────────────────────────────────────────────
CREATE TABLE synthetic_fixes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drift_event_id  UUID NOT NULL REFERENCES drift_events(id) ON DELETE CASCADE,
    repo_id         UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    description     TEXT,
    patch           TEXT NOT NULL,
    confidence      REAL NOT NULL DEFAULT 0.0,
    status          TEXT NOT NULL DEFAULT 'proposed',  -- proposed, accepted, applied, rejected
    applied_by      UUID REFERENCES users(id),
    applied_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- Audit Log (append-only)
-- ──────────────────────────────────────────────
CREATE TABLE audit_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL,
    actor_id        UUID,
    action          TEXT NOT NULL,
    resource_type   TEXT NOT NULL,
    resource_id     UUID,
    details         JSONB NOT NULL DEFAULT '{}',
    ip_address      INET,
    signature       TEXT,  -- Ed25519 signature for immutability verification
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- If TimescaleDB is available, uncomment:
-- SELECT create_hypertable('audit_log', 'created_at');
CREATE INDEX idx_audit_org ON audit_log(org_id, created_at DESC);
CREATE INDEX idx_audit_actor ON audit_log(actor_id, created_at DESC);

-- ──────────────────────────────────────────────
-- Triggers for updated_at
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_repositories_updated_at BEFORE UPDATE ON repositories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_code_files_updated_at BEFORE UPDATE ON code_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_rules_updated_at BEFORE UPDATE ON architectural_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
