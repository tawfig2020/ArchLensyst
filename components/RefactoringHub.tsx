/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { RocketIcon, ShieldIcon, AlertIcon, CpuIcon, LinkIcon, ChevronRight } from './Icons';
import { SyntheticFix, RuleViolation } from '../types';

interface Props {
  suggestions: { violation: RuleViolation; fix?: SyntheticFix }[];
  onApplyFix: (violation: RuleViolation, fix: SyntheticFix) => void;
  onGenerateFix: (violation: RuleViolation) => void;
  isProcessing: boolean;
}

const RefactoringHub: React.FC<Props> = ({ suggestions, onApplyFix, onGenerateFix, isProcessing }) => {
  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Refactoring <span className="text-[#3fb950]">Hub</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4">Strategic architectural improvements prioritized by the RAG knowledge graph. Align your implementation with the logical core.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#3fb95011] border border-[#3fb95033] px-8 py-4 rounded-[30px] flex flex-col items-end">
              <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest">Active Suggestions</div>
              <div className="text-2xl font-black text-white italic">{suggestions.length}</div>
           </div>
        </div>
      </header>

      {suggestions.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[3] text-[#30363d]"><RocketIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Knowledge Graph is optimized. No urgent refactors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           {suggestions.map((s, i) => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[40px] flex flex-col lg:flex-row gap-10 items-center hover:border-white/10 transition-all relative group overflow-hidden">
                 <div className="absolute left-0 top-0 w-1.5 h-full bg-[#3fb950]"></div>
                 
                 <div className="lg:w-1/3 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-[#3fb950] bg-[#3fb95011] px-2 py-1 rounded border border-[#3fb95022] uppercase tracking-widest">{s.violation.ruleId}</span>
                       <span className="text-xs font-bold text-white uppercase italic">{s.violation.file?.split('/').pop()}</span>
                    </div>
                    <h3 className="text-lg font-black text-white italic tracking-tight">{s.violation.message}</h3>
                    <p className="text-[11px] text-[#8b949e] leading-relaxed italic">"{s.violation.suggestion}"</p>
                 </div>

                 <div className="flex-1 flex flex-col gap-4">
                    {s.fix ? (
                       <div className="bg-[#0d1117] p-6 rounded-3xl border border-white/5 space-y-4 animate-in slide-in-from-right-4">
                          <div className="flex justify-between items-center border-b border-white/5 pb-3">
                             <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest flex items-center gap-2">
                                <CpuIcon className="w-3 h-3" /> AI-Proposed Refactor ({s.fix.safetyScore}% Safety)
                             </div>
                             <button 
                                onClick={() => onApplyFix(s.violation, s.fix!)}
                                className="bg-[#3fb950] text-white px-6 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#3fb95022]"
                             >
                                APPLY FIX
                             </button>
                          </div>
                          <div className="font-mono text-[11px] text-[#c9d1d9] whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                             {s.fix.diff}
                          </div>
                          <div className="text-[10px] text-[#8b949e] font-medium leading-relaxed italic border-t border-white/5 pt-3 text-left">
                             <span className="text-white font-bold block mb-1">RAG Reasoning:</span>
                             {s.fix.explanation}
                          </div>
                       </div>
                    ) : (
                       <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#30363d] rounded-3xl p-10 space-y-6">
                          <p className="text-[10px] font-black text-[#484f58] uppercase tracking-widest">Synthetic Refactoring Available</p>
                          <button 
                             onClick={() => onGenerateFix(s.violation)}
                             disabled={isProcessing}
                             className="bg-white text-black px-10 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                          >
                             {isProcessing ? 'PROCESSING...' : 'GENERATE AI PROPOSAL'}
                          </button>
                       </div>
                    )}
                 </div>
              </div>
           ))}
        </div>
      )}

      <div className="p-12 bg-[#3fb95005] border border-[#3fb95022] rounded-[60px] space-y-6 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-full bg-[#3fb95011] flex items-center justify-center text-[#3fb950] shrink-0 border border-[#3fb95033]">
            <LinkIcon />
         </div>
         <div className="space-y-4 text-center md:text-left">
            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">The Refactoring <br /> <span className="text-[#3fb950]">Constitution</span></h4>
            <p className="text-sm text-[#8b949e] leading-relaxed max-w-2xl">
               Every refactor proposed here is cross-referenced with your **Developer DNA** and **Architectural Tiers**. We prioritize decoupling and backward compatibility to ensure that high-criticality files remain stable.
            </p>
         </div>
      </div>
    </div>
  );
};

export default RefactoringHub;