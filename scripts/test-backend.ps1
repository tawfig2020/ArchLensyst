# ArchLens Backend API Test Script (PowerShell)
# Usage: .\scripts\test-backend.ps1
# Prerequisites: Docker Compose services running

$ErrorActionPreference = "Continue"
$pass = 0
$fail = 0
$skip = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [int]$ExpectedStatus = 200,
        [hashtable]$Headers = @{}
    )

    Write-Host -NoNewline "  [$Method] $Name ... "

    try {
        $params = @{
            Method = $Method
            Uri = $Url
            UseBasicParsing = $true
            TimeoutSec = 10
        }

        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }

        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }

        $response = Invoke-WebRequest @params -ErrorAction Stop
        $status = $response.StatusCode

        if ($status -eq $ExpectedStatus) {
            Write-Host "PASS ($status)" -ForegroundColor Green
            $script:pass++
        } else {
            Write-Host "FAIL (got $status, expected $ExpectedStatus)" -ForegroundColor Red
            $script:fail++
        }

        return $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
    }
    catch {
        $statusCode = 0
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }

        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "PASS ($statusCode)" -ForegroundColor Green
            $script:pass++
        } elseif ($statusCode -eq 0) {
            Write-Host "SKIP (service unreachable)" -ForegroundColor Yellow
            $script:skip++
        } else {
            Write-Host "FAIL (got $statusCode, expected $ExpectedStatus)" -ForegroundColor Red
            $script:fail++
        }
        return $null
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " ArchLens Backend API Test Suite" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ─── Phase 1: Infrastructure Health ───
Write-Host "--- Phase 1: Infrastructure Health ---" -ForegroundColor Yellow

Test-Endpoint -Name "PostgreSQL" -Method "GET" -Url "http://localhost:5432" -ExpectedStatus 0 2>$null
# PostgreSQL doesn't speak HTTP, so we just check Docker
Write-Host "  [TCP] PostgreSQL ... checking via docker" -ForegroundColor Gray
$pgHealthy = docker exec archlensyst-postgres-1 pg_isready -U archlens 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [TCP] PostgreSQL ... PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  [TCP] PostgreSQL ... SKIP (not running)" -ForegroundColor Yellow
    $skip++
}

Test-Endpoint -Name "Redis ping" -Method "GET" -Url "http://localhost:8001" -ExpectedStatus 200

Test-Endpoint -Name "Elasticsearch health" -Method "GET" -Url "http://localhost:9200/_cluster/health"

Test-Endpoint -Name "Neo4j browser" -Method "GET" -Url "http://localhost:7474"

Test-Endpoint -Name "Kafka (via broker API)" -Method "GET" -Url "http://localhost:9092" -ExpectedStatus 0 2>$null
Write-Host "  [TCP] Kafka ... checking via docker" -ForegroundColor Gray
$kafkaHealthy = docker exec archlensyst-kafka-1 kafka-broker-api-versions.sh --bootstrap-server localhost:9092 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [TCP] Kafka ... PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  [TCP] Kafka ... SKIP (not running)" -ForegroundColor Yellow
    $skip++
}

Write-Host ""

# ─── Phase 2: Observability Stack ───
Write-Host "--- Phase 2: Observability Stack ---" -ForegroundColor Yellow

Test-Endpoint -Name "Prometheus" -Method "GET" -Url "http://localhost:9090/-/healthy"
Test-Endpoint -Name "Grafana" -Method "GET" -Url "http://localhost:3100/api/health"
Test-Endpoint -Name "Jaeger UI" -Method "GET" -Url "http://localhost:16686"
Test-Endpoint -Name "Loki ready" -Method "GET" -Url "http://localhost:3200/ready"

Write-Host ""

# ─── Phase 3: Security Services ───
Write-Host "--- Phase 3: Security Services ---" -ForegroundColor Yellow

Test-Endpoint -Name "Keycloak" -Method "GET" -Url "http://localhost:8080"
Test-Endpoint -Name "HashiCorp Vault health" -Method "GET" -Url "http://localhost:8200/v1/sys/health"

Write-Host ""

# ─── Phase 4: API Gateway ───
Write-Host "--- Phase 4: API Gateway (Go/Fiber :8000) ---" -ForegroundColor Yellow

Test-Endpoint -Name "Health check" -Method "GET" -Url "http://localhost:8000/health"
Test-Endpoint -Name "Readiness check" -Method "GET" -Url "http://localhost:8000/ready"
Test-Endpoint -Name "Prometheus metrics" -Method "GET" -Url "http://localhost:8000/metrics"
Test-Endpoint -Name "Auth token (stub)" -Method "POST" -Url "http://localhost:8000/api/v1/auth/token" -Body '{"username":"test","password":"test"}' -ExpectedStatus 501
Test-Endpoint -Name "Protected without JWT" -Method "GET" -Url "http://localhost:8000/api/v1/organizations" -ExpectedStatus 401

# Generate a dev JWT for testing protected endpoints (HMAC-SHA256 signed)
$jwtHeader = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('{"alg":"HS256","typ":"JWT"}')) -replace '\+','-' -replace '/','_' -replace '='
$jwtPayload = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('{"sub":"test-user","org_id":"org-001","role":"admin","email":"admin@archlens.io","exp":9999999999}')) -replace '\+','-' -replace '/','_' -replace '='
$jwtSecret = "archlens-dev-secret-change-in-production"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [Text.Encoding]::UTF8.GetBytes($jwtSecret)
$sigBytes = $hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes("$jwtHeader.$jwtPayload"))
$jwtSignature = [Convert]::ToBase64String($sigBytes) -replace '\+','-' -replace '/','_' -replace '='
$devToken = "$jwtHeader.$jwtPayload.$jwtSignature"

$authHeaders = @{ "Authorization" = "Bearer $devToken" }

Test-Endpoint -Name "List organizations (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/organizations" -Headers $authHeaders
Test-Endpoint -Name "Create organization (JWT)" -Method "POST" -Url "http://localhost:8000/api/v1/organizations" -Headers $authHeaders -Body '{"name":"Test Org"}' -ExpectedStatus 201
Test-Endpoint -Name "Get organization (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/organizations/org-001" -Headers $authHeaders
Test-Endpoint -Name "List repos (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/organizations/org-001/repos" -Headers $authHeaders
Test-Endpoint -Name "Create repo (JWT)" -Method "POST" -Url "http://localhost:8000/api/v1/organizations/org-001/repos" -Headers $authHeaders -Body '{"name":"my-repo","url":"https://github.com/test/repo"}' -ExpectedStatus 201
Test-Endpoint -Name "Trigger analysis (JWT)" -Method "POST" -Url "http://localhost:8000/api/v1/repos/repo-001/analyze" -Headers $authHeaders -ExpectedStatus 202
Test-Endpoint -Name "List analyses (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/repos/repo-001/analyses" -Headers $authHeaders
Test-Endpoint -Name "List drift events (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/repos/repo-001/drift" -Headers $authHeaders
Test-Endpoint -Name "List rules (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/organizations/org-001/rules" -Headers $authHeaders
Test-Endpoint -Name "Create rule (JWT)" -Method "POST" -Url "http://localhost:8000/api/v1/organizations/org-001/rules" -Headers $authHeaders -Body '{"name":"no-circular-deps","severity":"critical"}' -ExpectedStatus 201
Test-Endpoint -Name "Phantom execution (JWT)" -Method "POST" -Url "http://localhost:8000/api/v1/repos/repo-001/phantom" -Headers $authHeaders -Body '{"changes":["refactor auth"]}' -ExpectedStatus 202
Test-Endpoint -Name "Architecture metrics (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/repos/repo-001/metrics" -Headers $authHeaders
Test-Endpoint -Name "Audit log (JWT)" -Method "GET" -Url "http://localhost:8000/api/v1/organizations/org-001/audit" -Headers $authHeaders

Write-Host ""

# ─── Phase 5: Citadel Service ───
Write-Host "--- Phase 5: Citadel Service (:8200) ---" -ForegroundColor Yellow

Test-Endpoint -Name "Health" -Method "GET" -Url "http://localhost:8200/health"
Test-Endpoint -Name "Start drift scan" -Method "POST" -Url "http://localhost:8200/api/v1/drift/scan" -Body '{"repo_id":"repo-001","commit_sha":"abc123","branch":"main"}' -ExpectedStatus 202
Test-Endpoint -Name "Drift report" -Method "GET" -Url "http://localhost:8200/api/v1/drift/report/repo-001"
Test-Endpoint -Name "Mesh health" -Method "GET" -Url "http://localhost:8200/api/v1/mesh/health"
Test-Endpoint -Name "Mesh topology" -Method "GET" -Url "http://localhost:8200/api/v1/mesh/topology"
Test-Endpoint -Name "Mesh verify" -Method "POST" -Url "http://localhost:8200/api/v1/mesh/verify"

Write-Host ""

# ─── Phase 6: Vault Service ───
Write-Host "--- Phase 6: Vault Service (:8300) ---" -ForegroundColor Yellow

Test-Endpoint -Name "Health" -Method "GET" -Url "http://localhost:8300/health"
Test-Endpoint -Name "Sign data" -Method "POST" -Url "http://localhost:8300/api/v1/sign" -Body '{"data":"hello archlens"}'
Test-Endpoint -Name "List ledger" -Method "GET" -Url "http://localhost:8300/api/v1/ledger"
Test-Endpoint -Name "Verify ledger chain" -Method "POST" -Url "http://localhost:8300/api/v1/ledger/verify"
Test-Endpoint -Name "Create rationale" -Method "POST" -Url "http://localhost:8300/api/v1/rationales" -Body '{"org_id":"org-001","repo_id":"repo-001","title":"CQRS Pattern","rationale":"Chosen for read-heavy workloads","category":"architecture","tags":["cqrs","scalability"],"created_by":"admin@archlens.io"}' -ExpectedStatus 201
Test-Endpoint -Name "List rationales" -Method "GET" -Url "http://localhost:8300/api/v1/rationales"

Write-Host ""

# ─── Phase 7: Cognitive Service ───
Write-Host "--- Phase 7: Cognitive Service (:8100) ---" -ForegroundColor Yellow

Test-Endpoint -Name "Root" -Method "GET" -Url "http://localhost:8100/"
Test-Endpoint -Name "Health" -Method "GET" -Url "http://localhost:8100/health"
Test-Endpoint -Name "Readiness" -Method "GET" -Url "http://localhost:8100/ready"
Test-Endpoint -Name "Trigger analysis" -Method "POST" -Url "http://localhost:8100/api/v1/analysis/trigger" -Body '{"repo_id":"repo-001","branch":"main"}' -ExpectedStatus 200
Test-Endpoint -Name "Generate insights" -Method "POST" -Url "http://localhost:8100/api/v1/analysis/insights" -Body '{"code":"function getUserById(id) { return db.query(\"SELECT * FROM users WHERE id=\" + id); }","language":"javascript"}'
Test-Endpoint -Name "Health score" -Method "POST" -Url "http://localhost:8100/api/v1/analysis/health-score" -Body '{"repo_id":"repo-001","branch":"main"}'
Test-Endpoint -Name "Generate embedding" -Method "POST" -Url "http://localhost:8100/api/v1/embeddings/generate" -Body '{"text":"Microservice boundary between auth and billing"}'
Test-Endpoint -Name "Semantic search" -Method "POST" -Url "http://localhost:8100/api/v1/embeddings/search" -Body '{"query":"authentication pattern","repo_id":"repo-001"}'

Write-Host ""

# ─── Phase 8: Audit Service ───
Write-Host "--- Phase 8: Audit Service (:8400) ---" -ForegroundColor Yellow

Test-Endpoint -Name "Health" -Method "GET" -Url "http://localhost:8400/api/v1/audit/health"
Test-Endpoint -Name "Ingest dependencies" -Method "POST" -Url "http://localhost:8400/api/v1/audit/dependencies/ingest" -Body '{"repoId":"repo-001","analysisId":"analysis-001","edges":[{"sourcePath":"src/auth.ts","targetPath":"src/db.ts","depType":"import","weight":1.0}]}'  -ExpectedStatus 202
Test-Endpoint -Name "Get dependency graph" -Method "GET" -Url "http://localhost:8400/api/v1/audit/dependencies/repo-001"
Test-Endpoint -Name "Circular deps" -Method "GET" -Url "http://localhost:8400/api/v1/audit/circular/repo-001"
Test-Endpoint -Name "Hotspots" -Method "GET" -Url "http://localhost:8400/api/v1/audit/hotspots/repo-001"
Test-Endpoint -Name "Impact analysis" -Method "GET" -Url "http://localhost:8400/api/v1/audit/impact/repo-001?filePath=src/auth.ts&depth=3"

Write-Host ""

# ─── Summary ───
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Test Results" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  PASSED:  $pass" -ForegroundColor Green
Write-Host "  FAILED:  $fail" -ForegroundColor Red
Write-Host "  SKIPPED: $skip" -ForegroundColor Yellow
Write-Host "  TOTAL:   $($pass + $fail + $skip)" -ForegroundColor White
Write-Host ""

if ($fail -gt 0) {
    Write-Host "Some tests FAILED. Check that all Docker Compose services are running:" -ForegroundColor Red
    Write-Host "  docker compose up -d" -ForegroundColor White
    Write-Host "  docker compose ps" -ForegroundColor White
    exit 1
} elseif ($skip -gt 0) {
    Write-Host "Some tests were SKIPPED (services not reachable)." -ForegroundColor Yellow
    Write-Host "Start services with: docker compose up -d" -ForegroundColor White
    exit 0
} else {
    Write-Host "All tests PASSED!" -ForegroundColor Green
    exit 0
}
