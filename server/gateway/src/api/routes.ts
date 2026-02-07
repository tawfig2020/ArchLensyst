import type { Express, Request, Response } from 'express';

export function setupAPIRoutes(app: Express): void {
  // ─── Codebase ───────────────────────────────────────────────────────
  app.get('/api/codebase', (_req: Request, res: Response) => {
    res.json({ files: [], message: 'Connect to your codebase provider' });
  });

  app.get('/api/codebase/:filePath', (req: Request, res: Response) => {
    res.json({ path: req.params.filePath, content: '', message: 'File not found' });
  });

  // ─── Analysis ───────────────────────────────────────────────────────
  app.post('/api/analysis/impact', (req: Request, res: Response) => {
    const { filePath, content } = req.body as { filePath: string; content: string };
    res.json({
      safe: true,
      score: 85,
      affectedNodes: [],
      ruleViolations: [],
      rationale: `Impact analysis for ${filePath} — connect AI service for real analysis`,
    });
  });

  app.get('/api/analysis/audit/:projectId', (req: Request, res: Response) => {
    res.json({
      score: 90,
      issues: [],
      toxicity: { godObjectProbability: 0, cyclicDepth: 0, logicLeakageCount: 0, entanglementFactor: 0 },
    });
  });

  // ─── Dependency Graph ───────────────────────────────────────────────
  app.get('/api/graph/dependencies/:projectId', (req: Request, res: Response) => {
    res.json({ nodes: [], links: [] });
  });

  // ─── Fixes ──────────────────────────────────────────────────────────
  app.post('/api/fixes/apply', (req: Request, res: Response) => {
    const { filePath, fixId } = req.body as { filePath: string; fixId: string };
    res.json({ success: true, updatedFile: { path: filePath, content: '', lastModified: new Date().toISOString() }, appliedFix: { id: fixId } });
  });

  // ─── Web Vitals ─────────────────────────────────────────────────────
  app.post('/api/vitals', (req: Request, res: Response) => {
    console.log('[Vitals]', req.body);
    res.status(204).end();
  });
}
