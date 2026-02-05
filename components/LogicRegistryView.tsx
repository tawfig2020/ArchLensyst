/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { RedundancyReport, CodeFile } from '../types';
import { CpuIcon, GraphIcon, RocketIcon, LinkIcon, AlertIcon, ShieldIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const LogicRegistryView: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<RedundancyReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunDedupe = async () => {
    setIsAnalyzing(true);
    try {
      const result = await gemini.performRedundancyAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Pattern <span className="text-[#3fb950]">Registry</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Anti-Sprawl Governance. Identifying and consolidating duplicate logic clones before they become technical debt.</p>
        </div>
        {!report && !isAnalyzing && (
          <button 
            onClick={handleRunDedupe}
            className="bg-white text-black px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ffffff22]"
          >
            TRIGGER DEDUPLICATION
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12">
          {/* Dedupe Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LinkIcon /> Redundant Clones</div>
               <div className="text-4xl font-black italic text-white">{report.clones.length}</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Semantic duplicates found</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><CpuIcon /> Potential Reduction</div>
               <div className="text-4xl font-black italic text-[#3fb950]">{report.potentialLinesSaved} Lines</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Logic abstraction potential</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><ShieldIcon /> DRY Score</div>
               <div className="text-4xl font-black italic text-[#2f81f7]">{report.deduplicationScore}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Codebase reusability metric</div>
            </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><AlertIcon /> Identity Collisions</h3>
             <div className="grid grid-cols-1 gap-6">
                {report.clones.map((clone) => (
                   <div key={clone.id} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] hover:border-[#3fb95044] transition-all group overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest mb-1">Duplicate Pattern Detected</div>
                            <h4 className="text-xl font-black text-white italic tracking-tighter">Probable Logic Mirroring</h4>
                         </div>
                         <div className="text-[10px] font-black text-[#8b949e] uppercase bg-[#0d1117] px-3 py-1 rounded-full border border-white/5">
                            {clone.similarity}% Semantic Match
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         {clone.files.map((file, idx) => (
                            <div key={idx} className="p-5 bg-[#0d1117] rounded-3xl border border-white/5 space-y-2">
                               <div className="text-[10px] font-bold text-[#2f81f7] uppercase font-mono">{file.path} (L{file.line})</div>
                               <code className="text-[11px] text-[#484f58] block truncate font-mono">{file.snippet}</code>
                            </div>
                         ))}
                      </div>

                      <div className="p-6 bg-[#3fb9500a] border border-[#3fb95022] rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex-1">
                            <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest flex items-center gap-2"><RocketIcon /> Consolidation Strategy</div>
                            <p className="text-sm text-[#c9d1d9] leading-relaxed italic mt-2">"{clone.suggestedAbstraction}"</p>
                         </div>
                         <button className="bg-[#3fb950] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0">CONSOLIDATE NOW</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      ) : isAnalyzing ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#3fb950]/30 border-t-[#3fb950] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#3fb950] uppercase tracking-[0.4em] animate-pulse">Hashing Logic Nodes...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Comparing logic fragments for semantic collisions</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[3] text-[#30363d]"><GraphIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Audit codebase for logic redundancy to begin.</p>
        </div>
      )}
    </div>
  );
};

export default LogicRegistryView;
