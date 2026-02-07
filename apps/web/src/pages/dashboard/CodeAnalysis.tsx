import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, FileCode, AlertCircle, CheckCircle2, Clock, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const MOCK_FILES = [
  { path: 'src/api/gateway.ts', language: 'TypeScript', lines: 342, complexity: 12, health: 94 },
  { path: 'src/services/auth.ts', language: 'TypeScript', lines: 189, complexity: 8, health: 87 },
  { path: 'src/models/user.py', language: 'Python', lines: 156, complexity: 5, health: 96 },
  { path: 'src/handlers/drift.go', language: 'Go', lines: 278, complexity: 15, health: 72 },
  { path: 'src/parsers/ast.rs', language: 'Rust', lines: 445, complexity: 22, health: 68 },
  { path: 'src/audit/neo4j.java', language: 'Java', lines: 312, complexity: 18, health: 81 },
];

export default function CodeAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const runAnalysis = async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Code2 className="w-7 h-7 text-sentinel-blue" />
            Code Analysis
          </h1>
          <p className="text-gray-400 text-sm mt-1">AI-powered deep structural analysis of your codebase</p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-glow-blue"
        >
          {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {analyzing ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Files Analyzed', value: '1,247', icon: FileCode, color: 'text-sentinel-blue' },
          { label: 'Issues Found', value: '23', icon: AlertCircle, color: 'text-caution-amber' },
          { label: 'Clean Files', value: '1,224', icon: CheckCircle2, color: 'text-invariant-green' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-citadel-surface border border-citadel-border rounded-2xl p-5"
          >
            <card.icon className={cn('w-5 h-5 mb-3', card.color)} />
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* File List */}
      <div className="bg-citadel-surface border border-citadel-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-citadel-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Source Files</h2>
          <span className="text-xs text-gray-500">{MOCK_FILES.length} files</span>
        </div>

        <div className="divide-y divide-citadel-border/50">
          {MOCK_FILES.map((file) => (
            <motion.div
              key={file.path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedFile(selectedFile === file.path ? null : file.path)}
              className={cn(
                'px-6 py-4 cursor-pointer transition-all hover:bg-citadel-elevated',
                selectedFile === file.path && 'bg-citadel-elevated'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <FileCode className="w-5 h-5 text-sentinel-blue flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-mono truncate">{file.path}</p>
                    <p className="text-xs text-gray-500">{file.language} &middot; {file.lines} lines &middot; Complexity: {file.complexity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-bold',
                    file.health >= 90 ? 'bg-invariant-green-glow text-invariant-green' :
                    file.health >= 75 ? 'bg-sentinel-blue-glow text-sentinel-blue' :
                    'bg-caution-amber-glow text-caution-amber'
                  )}>
                    {file.health}%
                  </div>
                  <ArrowRight className={cn('w-4 h-4 text-gray-500 transition-transform', selectedFile === file.path && 'rotate-90')} />
                </div>
              </div>

              {selectedFile === file.path && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 p-4 bg-citadel-bg rounded-xl border border-citadel-border"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-white">{file.lines}</p>
                      <p className="text-xs text-gray-500">Lines</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{file.complexity}</p>
                      <p className="text-xs text-gray-500">Complexity</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-invariant-green">{Math.floor(file.health * 0.9)}%</p>
                      <p className="text-xs text-gray-500">Test Coverage</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-sentinel-blue">{Math.floor(file.lines * 0.12)}</p>
                      <p className="text-xs text-gray-500">Dependencies</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-citadel-surface rounded-lg">
                    <p className="text-xs text-gray-400 font-mono">
                      AI Insight: {file.health >= 90
                        ? 'This file follows architectural best practices with excellent separation of concerns.'
                        : file.health >= 75
                        ? 'Minor coupling issues detected. Consider extracting shared logic into a utility module.'
                        : 'High cyclomatic complexity detected. Recommend splitting into smaller, focused modules.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
