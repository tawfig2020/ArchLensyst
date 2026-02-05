# ArchLens Strategic Systems 🛡️

**Beyond the Prompt. Architectural Immunity.**

ArchLens is a high-security, AI-driven codebase orchestration and strategic analysis platform designed for engineering leadership and senior architects.

## 🏗️ Framework Architecture

ArchLens is built on a three-layer "Citadel" architecture:

### 1. The Foundation: Sovereign Ledger
*   **Identity Anchoring:** Every logical transaction is cryptographically signed.
*   **Persistence:** MongoDB-backed "Vault" for historical rationale.

### 2. Layer 1: Structural Scrutiny (The Parser)
*   **WASM Parser:** High-performance structural extraction of code skeletons.

### 3. Layer 2: Semantic Synthesis (Intelligence)
*   **Gemini Cognitive Core:** Deep scrutiny of rationale and security entropy.

### 4. Layer 3: Strategic Orchestration (Command)
*   **Strategic Citadel:** Monitoring cross-departmental drift and mesh integrity.

## 🚀 Deployment (Google Cloud / Node.js Buildpacks)

This repository is configured for automated deployment via Google Cloud Buildpacks.

### Configuration Settings:
*   **Build Type**: `Node.js`
*   **Build Context**: `/`
*   **Entry Point**: `npm start`
*   **Environment Variables**: Ensure `API_KEY` (Gemini API) is set in your Cloud Run environment.

## 🛠️ Terminal Command Reference (Fixing Deployment Errors)

If you get an **"Author identity unknown"** or **"No branch matching"** error, run these commands:

```bash
# 1. Fix Identity Errors
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# 2. Align Branch to 'main'
git branch -M main

# 3. Commit and Push
git add .
git commit -m "deploy: architectural sync"
git push -u origin main
```

## 🛠️ Local Development
1. `npm install`
2. `npm start`
3. Access at `http://localhost:8080`

## ⚖️ License
Copyright (c) 2026 ArchLens Strategic Systems. All rights reserved.
PROVENANCE: ARCH-SENTINEL-PROTOCOL-V2-SECURE