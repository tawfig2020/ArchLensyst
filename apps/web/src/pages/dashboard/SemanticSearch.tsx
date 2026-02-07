import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Sparkles, FileCode, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const MOCK_RESULTS = [
  { file: 'src/api/gateway.ts', score: 0.96, snippet: 'The API gateway handles JWT authentication and routes requests to downstream microservices via gRPC and REST protocols.', lines: '45-67' },
  { file: 'src/services/auth.ts', score: 0.91, snippet: 'Authentication middleware validates bearer tokens using HMAC-SHA256 and extracts org_id claims for tenant isolation.', lines: '12-28' },
  { file: 'src/handlers/drift.go', score: 0.87, snippet: 'Drift detection compares current architecture snapshots against baseline invariants using graph diffing algorithms.', lines: '89-120' },
  { file: 'src/models/analysis.py', score: 0.82, snippet: 'The analysis model stores Gemini AI insights including health scores, coupling metrics, and refactoring suggestions.', lines: '34-56' },
  { file: 'src/parsers/ast.rs', score: 0.78, snippet: 'Tree-sitter parser extracts AST nodes for complexity analysis across TypeScript, Python, Rust, Go, and Java source files.', lines: '156-189' },
];

export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_RESULTS>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setHasSearched(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResults(MOCK_RESULTS);
    setSearching(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Search className="w-7 h-7 text-sentinel-blue" />
          Semantic Search
        </h1>
        <p className="text-gray-400 text-sm mt-1">AI-powered natural language search across your entire codebase</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your codebase... e.g. 'How does authentication work?'"
            className="w-full pl-12 pr-32 py-4 bg-citadel-surface border border-citadel-border rounded-2xl text-white placeholder-gray-500 focus:border-sentinel-blue focus:ring-1 focus:ring-sentinel-blue/50 outline-none transition-all text-sm"
          />
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Search
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['How does auth work?', 'Find circular dependencies', 'What handles drift detection?'].map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="text-xs px-3 py-1.5 bg-citadel-surface border border-citadel-border rounded-lg text-gray-400 hover:text-white hover:border-sentinel-blue/50 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      {searching && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sentinel-blue-glow flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-sentinel-blue" />
          </div>
          <p className="text-gray-400 text-sm">Searching with AI embeddings...</p>
        </div>
      )}

      {!searching && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">{results.length} results found</p>
          {results.map((result, i) => (
            <motion.div
              key={result.file}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-citadel-surface border border-citadel-border rounded-2xl p-5 hover:border-citadel-border-hover transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <FileCode className="w-4 h-4 text-sentinel-blue flex-shrink-0" />
                    <span className="text-sm font-mono text-sentinel-blue">{result.file}</span>
                    <span className="text-xs text-gray-500">L{result.lines}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{result.snippet}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn(
                    'text-xs font-bold px-2.5 py-1 rounded-full',
                    result.score >= 0.9 ? 'bg-invariant-green-glow text-invariant-green' :
                    result.score >= 0.8 ? 'bg-sentinel-blue-glow text-sentinel-blue' :
                    'bg-caution-amber-glow text-caution-amber'
                  )}>
                    {(result.score * 100).toFixed(0)}%
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-sentinel-blue transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!searching && hasSearched && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No results found. Try a different query.</p>
        </div>
      )}

      {!hasSearched && !searching && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-citadel-surface border border-citadel-border flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm">Enter a natural language query to search your codebase</p>
        </div>
      )}
    </div>
  );
}
