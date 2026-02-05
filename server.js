/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-PRODUCTION-STATIC-SERVER
 */

const express = require('express');
const path = require('path');
const app = express();

// The port must be read from the environment variable PORT for Cloud Run compatibility
const PORT = process.env.PORT || 8080;

// Serve static files from the current directory
app.use(express.static(__dirname));

// For Single Page Applications (SPA), redirect all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`---------------------------------------------------`);
  console.log(`ArchLens Strategic Systems | Engineering Citadel`);
  console.log(`Status: SECURE - Gateway Active on port ${PORT}`);
  console.log(`---------------------------------------------------`);
});