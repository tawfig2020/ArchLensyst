// ArchLens MongoDB Initialization
// Sovereign Vault collections for rationale storage and change streams

// Initialize replica set for Change Streams support
try {
  rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "mongodb:27017" }] });
} catch (e) {
  print("Replica set already initiated or error: " + e.message);
}

// Wait for replica set to be ready
sleep(2000);

// Switch to archlens database
db = db.getSiblingDB("archlens");

// ──────────────────────────────────────────────
// Rationale Vault
// ──────────────────────────────────────────────
db.createCollection("architectural_rationales", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["orgId", "repoId", "title", "rationale", "createdBy", "createdAt"],
      properties: {
        orgId: { bsonType: "string" },
        repoId: { bsonType: "string" },
        title: { bsonType: "string" },
        rationale: { bsonType: "string" },
        category: { enum: ["design_decision", "trade_off", "constraint", "principle", "exception"] },
        context: { bsonType: "object" },
        relatedFiles: { bsonType: "array" },
        tags: { bsonType: "array" },
        signature: { bsonType: "string" },
        createdBy: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});

db.architectural_rationales.createIndex({ orgId: 1, repoId: 1 });
db.architectural_rationales.createIndex({ tags: 1 });
db.architectural_rationales.createIndex({ createdAt: -1 });
db.architectural_rationales.createIndex({ category: 1 });

// ──────────────────────────────────────────────
// Sovereign Ledger (Immutable Records)
// ──────────────────────────────────────────────
db.createCollection("sovereign_ledger", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["entryType", "payload", "signature", "previousHash", "timestamp"],
      properties: {
        entryType: { enum: ["rationale_created", "rationale_updated", "rule_changed", "analysis_completed", "fix_applied", "compliance_check"] },
        payload: { bsonType: "object" },
        signature: { bsonType: "string" },
        publicKey: { bsonType: "string" },
        previousHash: { bsonType: "string" },
        hash: { bsonType: "string" },
        timestamp: { bsonType: "date" },
      },
    },
  },
});

db.sovereign_ledger.createIndex({ timestamp: -1 });
db.sovereign_ledger.createIndex({ entryType: 1, timestamp: -1 });
db.sovereign_ledger.createIndex({ hash: 1 }, { unique: true });

// ──────────────────────────────────────────────
// Newcomer Guides
// ──────────────────────────────────────────────
db.createCollection("newcomer_guides");
db.newcomer_guides.createIndex({ orgId: 1, repoId: 1 });
db.newcomer_guides.createIndex({ generatedAt: -1 });

// ──────────────────────────────────────────────
// AI Analysis Artifacts
// ──────────────────────────────────────────────
db.createCollection("analysis_artifacts");
db.analysis_artifacts.createIndex({ repoId: 1, analysisId: 1 });
db.analysis_artifacts.createIndex({ artifactType: 1 });
db.analysis_artifacts.createIndex({ createdAt: -1 });

// ──────────────────────────────────────────────
// Embeddings Cache
// ──────────────────────────────────────────────
db.createCollection("embedding_cache");
db.embedding_cache.createIndex({ sourceId: 1, model: 1 }, { unique: true });
db.embedding_cache.createIndex({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days TTL

print("ArchLens MongoDB initialization complete.");
