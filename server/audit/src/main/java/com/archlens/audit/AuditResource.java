package com.archlens.audit;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;

@Path("/api/v1/audit")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuditResource {

    @Inject
    Driver neo4jDriver;

    @GET
    @Path("/health")
    public Response health() {
        return Response.ok(Map.of(
            "status", "healthy",
            "service", "audit-service",
            "timestamp", Instant.now().toString()
        )).build();
    }

    @POST
    @Path("/dependencies/ingest")
    public Response ingestDependencies(DependencyBatch batch) {
        try (Session session = neo4jDriver.session()) {
            for (DependencyEdge edge : batch.edges) {
                session.run("""
                    MERGE (s:File {path: $sourcePath, repoId: $repoId})
                    MERGE (t:File {path: $targetPath, repoId: $repoId})
                    MERGE (s)-[r:DEPENDS_ON {type: $depType}]->(t)
                    SET r.weight = $weight,
                        r.analysisId = $analysisId,
                        r.updatedAt = datetime()
                    """,
                    Map.of(
                        "sourcePath", edge.sourcePath,
                        "targetPath", edge.targetPath,
                        "repoId", batch.repoId,
                        "depType", edge.depType,
                        "weight", edge.weight,
                        "analysisId", batch.analysisId
                    )
                );
            }
        }
        return Response.accepted(Map.of(
            "message", "dependencies ingested",
            "count", batch.edges.size()
        )).build();
    }

    @GET
    @Path("/dependencies/{repoId}")
    public Response getDependencyGraph(@PathParam("repoId") String repoId) {
        try (Session session = neo4jDriver.session()) {
            var result = session.run("""
                MATCH (s:File {repoId: $repoId})-[r:DEPENDS_ON]->(t:File {repoId: $repoId})
                RETURN s.path AS source, t.path AS target, r.type AS type, r.weight AS weight
                LIMIT 1000
                """,
                Map.of("repoId", repoId)
            );

            var edges = result.list(record -> Map.of(
                "source", record.get("source").asString(),
                "target", record.get("target").asString(),
                "type", record.get("type").asString(),
                "weight", record.get("weight").asDouble(1.0)
            ));

            return Response.ok(Map.of("edges", edges, "total", edges.size())).build();
        }
    }

    @GET
    @Path("/impact/{repoId}")
    public Response getImpactAnalysis(
        @PathParam("repoId") String repoId,
        @QueryParam("filePath") String filePath,
        @QueryParam("depth") @DefaultValue("3") int depth
    ) {
        try (Session session = neo4jDriver.session()) {
            var result = session.run("""
                MATCH path = (s:File {path: $filePath, repoId: $repoId})-[:DEPENDS_ON*1..%d]->(t:File)
                RETURN DISTINCT t.path AS affected, length(path) AS distance
                ORDER BY distance
                """.formatted(Math.min(depth, 5)),
                Map.of("filePath", filePath, "repoId", repoId)
            );

            var affected = result.list(record -> Map.of(
                "path", record.get("affected").asString(),
                "distance", record.get("distance").asInt()
            ));

            return Response.ok(Map.of(
                "source", filePath,
                "affected_files", affected,
                "total_impact", affected.size(),
                "max_depth", depth
            )).build();
        }
    }

    @GET
    @Path("/circular/{repoId}")
    public Response detectCircularDependencies(@PathParam("repoId") String repoId) {
        try (Session session = neo4jDriver.session()) {
            var result = session.run("""
                MATCH path = (f:File {repoId: $repoId})-[:DEPENDS_ON*2..6]->(f)
                RETURN [node IN nodes(path) | node.path] AS cycle
                LIMIT 50
                """,
                Map.of("repoId", repoId)
            );

            var cycles = result.list(record ->
                record.get("cycle").asList(val -> val.asString())
            );

            return Response.ok(Map.of(
                "cycles", cycles,
                "total", cycles.size()
            )).build();
        }
    }

    @GET
    @Path("/hotspots/{repoId}")
    public Response getArchitecturalHotspots(@PathParam("repoId") String repoId) {
        try (Session session = neo4jDriver.session()) {
            var result = session.run("""
                MATCH (f:File {repoId: $repoId})
                OPTIONAL MATCH (f)-[:DEPENDS_ON]->(out)
                OPTIONAL MATCH (in)-[:DEPENDS_ON]->(f)
                WITH f, count(DISTINCT out) AS outDegree, count(DISTINCT in) AS inDegree
                RETURN f.path AS path, outDegree, inDegree, outDegree + inDegree AS totalDegree
                ORDER BY totalDegree DESC
                LIMIT 20
                """,
                Map.of("repoId", repoId)
            );

            var hotspots = result.list(record -> Map.of(
                "path", record.get("path").asString(),
                "out_degree", record.get("outDegree").asInt(),
                "in_degree", record.get("inDegree").asInt(),
                "total_degree", record.get("totalDegree").asInt()
            ));

            return Response.ok(Map.of("hotspots", hotspots)).build();
        }
    }

    // ── DTOs ──

    public static class DependencyBatch {
        public String repoId;
        public String analysisId;
        public List<DependencyEdge> edges;
    }

    public static class DependencyEdge {
        public String sourcePath;
        public String targetPath;
        public String depType;
        public double weight = 1.0;
    }
}
