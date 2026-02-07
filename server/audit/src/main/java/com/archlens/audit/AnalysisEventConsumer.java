package com.archlens.audit;

import java.util.logging.Logger;

import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.reactive.messaging.Incoming;

@ApplicationScoped
public class AnalysisEventConsumer {

    private static final Logger LOG = Logger.getLogger(AnalysisEventConsumer.class.getName());

    @Incoming("analysis-events")
    public void consume(String event) {
        LOG.info("Received analysis event: " + event);
        // TODO: parse event JSON, extract dependency edges, ingest into Neo4j
    }
}
