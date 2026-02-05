/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SEARCH-UI-SENTINEL-V5-PREMIUM
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  SearchIcon, RocketIcon, GraphIcon, ChevronRight, 
  FilterIcon, TrashIcon, LightbulbIcon, ShieldIcon, CpuIcon 
} from './Icons';
import { CodeFile } from '../types';
import { ragService } from '../services/ragService';

interface Props {
  codebase: CodeFile[];
  initialQuery?: string;
  onNavigateToFile?: (path: string, line?: number) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Trace authentication logic flow",
  "Identify potential memory leak risks",
  "Summarize database schema logic",
  "Explain architectural boundaries",
  "Locate core API integration points"
];

const SemanticSearch: React.FC<Props> = ({ codebase, initialQuery, onNavigateToFile }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>(() => {
    const saved = localStorage.getItem('ARCHLENS_FILTER_EXTS');
    return saved ? JSON.parse(saved) : [];
  });
  const [minRelevanceScore, setMinRelevanceScore] = useState<number>(() => {
    const saved = localStorage.getItem('ARCHLENS_FILTER_SCORE');
    return saved ? parseInt(saved) : 35;
  });
  
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ARCHLENS_FILTER_EXTS', JSON.stringify(selectedExtensions));
    localStorage.setItem('ARCHLENS_FILTER_SCORE', minRelevanceScore.toString());
  }, [selectedExtensions, minRelevanceScore]);

  useEffect(() => {
    const saved = localStorage.getItem('ARCHLENS_HISTORY_LOG_V5');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.warn("History Ledger Corrupted, resetting sync.");
      }
    }

    if (initialQuery) {
      setQuery(initialQuery);
      handleExecuteSearch(initialQuery);
    }
  }, [initialQuery]);

  const proactiveSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    const toxicFiles = codebase.filter(f => (f.toxicity?.godObjectProbability || 0) > 60);
    if (toxicFiles.length > 0) {
      suggestions.push(`Audit structural toxicity in ${toxicFiles[0].name}`);
    }
    const archNodes = codebase.filter(f => f.tier === 'Architectural');
    if (archNodes.length > 0) {
      suggestions.push(`Trace data flow from ${archNodes[0].name}`);
    }
    return [...suggestions, ...DEFAULT_SUGGESTIONS].slice(0, 6);
  }, [codebase]);

  const handleExecuteSearch = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    
    setIsSearching(true);
    setIsInputFocused(false);
    setQuery(trimmed);

    const newHistory = [trimmed, ...searchHistory.filter(h => h !== trimmed)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('ARCHLENS_HISTORY_LOG_V5', JSON.stringify(newHistory));

    try {
      const synthesisData = await ragService.searchCodebase(trimmed, codebase);
      setResults(synthesisData);
    } catch (err) {
      console.error("Strategic Synthesis System Breach:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(query);
  };

  const clearLedger = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('ARCHLENS_HISTORY_LOG_V5');
  };

  const fileExtensions = useMemo(() => {
    const exts = new Set<string>();
    codebase.forEach(f => {
      const parts = f.path.split('.');
      if (parts.length > 1) exts.add(`.${parts.pop()}`);
    });
    return Array.from(exts).sort();
  }, [codebase]);

  const toggleExtension = (ext: string) => {
    setSelectedExtensions(prev => 
      prev.includes(ext) ? prev.filter(e => e !== ext) : [...prev, ext]
    );
  };

  const finalFilteredResults = useMemo(() => {
    if (!results) return [];
    const list = Array.isArray(results) ? results : (results.relevantFiles || []);
    return list.filter((item: any) => {
      const path = item.filePath || item.path;
      const score = item.score || 100;
      const ext = `.${path.split('.').pop()}`;
      const passExt = selectedExtensions.length === 0 || selectedExtensions.includes(ext);
      const passScore = score >= minRelevanceScore;
      return passExt && passScore;
    }).sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
  }, [results, selectedExtensions, minRelevanceScore]);

  return (
    <div className="flex flex-col h-full bg-[#050505] animate-in fade-in duration-700 overflow-hidden relative" ref={containerRef}>
      <div className="p-10 border-b border-[#30363d] bg-[#0d1117]/80 backdrop-blur-3xl shrink-0 z-[60]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-10">
          <div>
            <h2 className="text-[12px] font-black text-[#2f81f7] uppercase tracking-[0.5em] mb-1">Synthesis Command Center</h2>
            <p className="text-[10px] text-[#484f58] font-black uppercase tracking-widest italic">V5-PREMIUM • Zero-Trust RAG Indexing</p>
          </div>
          <div className="flex flex-wrap items-center gap-10 bg-[#050505] p-5 rounded-[2.5rem] border border-[#30363d] shadow-2xl ring-1 ring-white/5">
             <div className="flex items-center gap-4 border-r border-[#30363d] pr-10">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><ShieldIcon className="w-3 h-3 text-[#3fb950]" /> Threshold</span>
                   <div className="flex items-center gap-4">
                     <input type="range" min="0" max="100" value={minRelevanceScore} onChange={(e) => setMinRelevanceScore(parseInt(e.target.value))} className="w-32 accent-[#2f81f7] h-1 bg-[#161b22] rounded-lg cursor-pointer appearance-none" />
                     <span className="text-[11px] font-mono text-white w-10 text-right font-black">{minRelevanceScore}%</span>
                   </div>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><FilterIcon className="w-3 h-3" /> Logical Scopes</span>
                <div className="flex gap-2">
                  {fileExtensions.map(ext => (
                    <button key={ext} onClick={() => toggleExtension(ext)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${selectedExtensions.includes(ext) ? 'bg-[#2f81f722] text-[#2f81f7] border-[#2f81f744] shadow-[0_0_15px_#2f81f722]' : 'bg-[#161b22] text-[#484f58] border-[#30363d] hover:border-[#8b949e]'}`}>{ext}</button>
                  ))}
                  {selectedExtensions.length > 0 && <button onClick={() => setSelectedExtensions([])} className="ml-2 text-[9px] font-black text-[#f85149] uppercase hover:underline">Reset</button>}
                </div>
             </div>
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <form onSubmit={handleFormSubmit} className="relative group">
            <div className={`absolute inset-0 bg-[#2f81f7] opacity-0 group-focus-within:opacity-5 blur-[50px] transition-opacity duration-1000 pointer-events-none`} />
            <input type="text" value={query} onFocus={() => setIsInputFocused(true)} onChange={(e) => setQuery(e.target.value)} placeholder="Query institutional memory... (Esc to close)" onKeyDown={(e) => e.key === 'Escape' && setIsInputFocused(false)} className="w-full bg-[#050505] border border-[#30363d] rounded-[3rem] py-8 pl-16 pr-44 text-2xl text-white font-medium focus:outline-none focus:border-[#2f81f7] focus:ring-4 focus:ring-[#2f81f70a] transition-all shadow-2xl placeholder:text-[#1c2128] placeholder:italic" />
            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#484f58] group-focus-within:text-[#2f81f7] transition-all duration-300"><SearchIcon className="w-8 h-8" /></div>
            <button type="submit" disabled={isSearching} className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#2f81f7] text-white px-10 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-[#2f81f733]">{isSearching ? 'ANALYZING...' : 'SYNTHESIZE'}</button>
          </form>
          {isInputFocused && (
            <div className="absolute top-[calc(100%+20px)] left-0 right-0 bg-[#0d1117] border border-[#30363d] rounded-[3.5rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] p-12 space-y-10 animate-in slide-in-from-top-6 duration-500 z-[100] ring-1 ring-white/10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                       <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.5em]">Audit Ledger</span>
                       {searchHistory.length > 0 && <button onClick={clearLedger} className="text-[10px] font-black text-[#f85149] uppercase hover:underline flex items-center gap-2 opacity-60 hover:opacity-100 transition-all"><TrashIcon className="w-3.5 h-3.5" /> Clear History</button>}
                    </div>
                    <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-4">
                       {searchHistory.length > 0 ? searchHistory.map((h, i) => (
                         <button key={i} onClick={() => handleExecuteSearch(h)} className="w-full text-left px-6 py-5 text-sm text-[#8b949e] hover:text-white hover:bg-white/5 rounded-[2rem] transition-all flex items-center gap-5 group border border-transparent hover:border-white/5">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#484f58] group-hover:text-[#2f81f7] transition-all"><SearchIcon className="w-4 h-4" /></div>
                            <span className="font-semibold truncate flex-1 tracking-tight">{h}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#484f58] group-hover:translate-x-1" />
                         </button>
                       )) : <div className="p-16 text-center border-2 border-dashed border-[#30363d] rounded-[2.5rem] opacity-30 italic text-xs uppercase tracking-widest text-[#484f58]">No recent logical audits.</div>}
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="px-4">
                       <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.5em]">Heuristic Strategies</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                       {proactiveSuggestions.map((s, i) => (
                         <button key={i} onClick={() => handleExecuteSearch(s)} className="text-left px-6 py-5 text-xs text-[#8b949e] hover:text-white hover:bg-[#3fb9500a] border border-white/5 hover:border-[#3fb95044] rounded-[2rem] transition-all flex items-center gap-5 group">
                            <div className="p-3.5 rounded-2xl bg-[#3fb95011] text-[#484f58] group-hover:text-[#3fb950] transition-colors"><LightbulbIcon className="w-5 h-5" /></div>
                            <span className="font-black italic truncate leading-none uppercase tracking-[0.05em]">{s}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
        {isInputFocused && <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl z-40 transition-opacity duration-1000" onClick={() => setIsInputFocused(false)} />}
        {isSearching ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-12 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-28 h-28 border-[10px] border-[#2f81f7]/10 border-t-[#2f81f7] rounded-full animate-spin shadow-[0_0_80px_#2f81f722]" />
              <div className="absolute inset-0 flex items-center justify-center text-[#2f81f7] animate-pulse"><CpuIcon className="w-10 h-10" /></div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-[18px] font-black text-white uppercase tracking-[0.8em] animate-pulse">Consulting Logical Graph...</p>
              <p className="text-[11px] text-[#484f58] uppercase font-black tracking-[0.3em]">Cross-referencing Fragments against Institutional ADRs</p>
            </div>
          </div>
        ) : results ? (
          <div className="max-w-6xl mx-auto space-y-24 animate-in slide-in-from-bottom-16 duration-1000 pb-48">
            {results.summary && (
              <div className="glass-card p-14 rounded-[5rem] bg-gradient-to-br from-[#2f81f70a] to-transparent border border-[#2f81f722] relative overflow-hidden group shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)]">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-5000 pointer-events-none"><RocketIcon className="w-80 h-80" /></div>
                <div className="flex items-center gap-8 mb-14 text-[#58a6ff]">
                  <div className="p-6 bg-[#2f81f715] rounded-[2.5rem] border border-[#2f81f733] shadow-2xl shadow-[#2f81f711]"><GraphIcon className="w-12 h-12" /></div>
                  <div>
                     <span className="text-[12px] font-black uppercase tracking-[0.6em] block opacity-40 mb-2 text-white">Synthesis Intelligence</span>
                     <h3 className="text-5xl font-black italic uppercase text-white tracking-tighter">Architectural Summary</h3>
                  </div>
                </div>
                <p className="text-3xl text-[#c9d1d9] leading-relaxed italic font-medium max-w-4xl selection:bg-[#2f81f7] selection:text-white">"{results.summary}"</p>
              </div>
            )}
            <div className="space-y-16">
              <div className="flex justify-between items-center px-12">
                <h3 className="text-[15px] font-black text-[#484f58] uppercase tracking-[0.7em] flex items-center gap-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2f81f7] animate-pulse" />Correlated Logic Nodes
                </h3>
                <span className="text-[#2f81f7] text-[11px] font-black uppercase tracking-[0.3em] border border-[#2f81f733] px-6 py-2.5 rounded-full bg-[#2f81f70a]">{finalFilteredResults.length} Fragments Scrutinized</span>
              </div>
              {finalFilteredResults.length === 0 ? (
                <div className="p-48 text-center border-2 border-dashed border-[#30363d] rounded-[6rem] opacity-30 flex flex-col items-center gap-12">
                   <div className="text-[#30363d] scale-[3]"><FilterIcon /></div>
                   <div className="space-y-6">
                     <p className="text-[16px] font-black uppercase tracking-[0.5em] text-[#484f58]">Governance Constraints Engaged</p>
                     <p className="text-[11px] uppercase font-bold text-[#30363d] max-w-sm mx-auto leading-relaxed">Adjust relevance threshold or scope filters to widen synthesis perimeter.</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {finalFilteredResults.map((item: any, i: number) => {
                    const path = item.filePath || item.path;
                    const score = item.score || 0;
                    const rationale = item.rationale || item.context;
                    const tier = item.tier || 'Logical Fragment';
                    return (
                      <button key={i} onClick={() => onNavigateToFile?.(path)} className="group bg-[#0d1117]/90 border border-[#30363d] hover:border-[#2f81f766] p-12 rounded-[4.5rem] transition-all cursor-pointer relative overflow-hidden text-left shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] hover:shadow-[0_50px_100px_-25px_rgba(47,129,247,0.2)] active:scale-[0.98]">
                        <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-b from-[#2f81f733] to-transparent group-hover:from-[#2f81f788] transition-all" />
                        <div className="flex justify-between items-start mb-12">
                          <div className="flex flex-col gap-4">
                            <span className="text-3xl font-black text-white italic group-hover:text-[#58a6ff] transition-colors tracking-tighter leading-none">{path.split('/').pop()}</span>
                            <span className="text-[11px] font-mono text-[#484f58] uppercase font-bold tracking-[0.25em] truncate max-w-[280px]">{path}</span>
                          </div>
                          <div className="flex flex-col items-end gap-5">
                             <span className="text-[10px] bg-[#2f81f715] text-[#2f81f7] px-7 py-3 rounded-full border border-[#2f81f733] uppercase font-black tracking-[0.4em] shadow-inner group-hover:bg-[#2f81f722] transition-all">{tier}</span>
                             <div className="flex items-center gap-4 bg-[#050505] px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner">
                                <div className={`w-3 h-3 rounded-full shadow-[0_0_20px_currentColor] animate-pulse ${score > 80 ? 'text-[#3fb950]' : score > 50 ? 'text-[#d29922]' : 'text-[#f85149]'}`} />
                                <span className={`text-[15px] font-mono font-black ${score > 80 ? 'text-[#3fb950]' : score > 50 ? 'text-[#d29922]' : 'text-[#f85149]'}`}>{score}% Correlation</span>
                             </div>
                          </div>
                        </div>
                        <div className="bg-[#050505] p-10 rounded-[3.5rem] border border-white/5 group-hover:border-[#2f81f733] transition-all shadow-inner relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#2f81f715] to-transparent" />
                           <div className="text-[10px] font-black text-[#484f58] uppercase tracking-[0.5em] mb-8 flex items-center gap-4"><RocketIcon className="w-5 h-5 text-[#2f81f7]" /> Synthesis Rationale</div>
                           <p className="text-[16px] text-[#8b949e] leading-relaxed italic font-medium selection:bg-[#2f81f7] selection:text-white">"{rationale}"</p>
                        </div>
                        <div className="mt-12 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.5em]">
                           <span className="text-[#2f81f7] opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all flex items-center gap-4">Examine Logic Tier <ChevronRight className="w-6 h-6" /></span>
                           <span className="text-[#484f58] group-hover:text-[#8b949e] transition-colors">Fragment Index #{(i + 1).toString().padStart(3, '0')}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-24 space-y-20 opacity-30 group hover:opacity-100 transition-opacity duration-2000">
            <div className="relative">
               <div className="absolute inset-0 bg-[#2f81f7] blur-[120px] opacity-15 group-hover:opacity-40 transition-opacity duration-3000" />
               <div className="text-[#30363d] scale-[8] group-hover:text-[#2f81f7] transition-all duration-2000 group-hover:rotate-[360deg] relative z-10"><SearchIcon /></div>
            </div>
            <div className="space-y-10 max-w-3xl relative z-10">
              <h4 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Strategic Knowledge <br /><span className="text-[#2f81f7]">Synthesis</span></h4>
              <p className="text-2xl text-[#8b949e] leading-relaxed font-medium italic max-w-2xl mx-auto">Access the multi-node RAG layer to correlate architectural memory. Every response is anchored to live code invariants and human-authored ADR provenance.</p>
            </div>
            <div className="pt-10 flex gap-16 relative z-10">
               {[ { label: 'Sub-ms Access', icon: <CpuIcon /> }, { label: 'Deep RAG Tier', icon: <ShieldIcon /> }, { label: 'Logic Sync', icon: <GraphIcon /> } ].map((b, i) => (
                 <div key={i} className="flex items-center gap-5 text-[11px] font-black text-[#484f58] uppercase tracking-[0.6em] hover:text-white transition-colors cursor-default group/item">
                   <div className="p-4 rounded-3xl bg-white/5 group-hover/item:bg-[#2f81f711] transition-all">{b.icon}</div> {b.label}
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemanticSearch;
