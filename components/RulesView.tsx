/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { AnalysisRule, CodeFile, RuleViolation } from '../types';
import { ShieldIcon, AlertIcon, LockIcon, RocketIcon, ChevronRight, CpuIcon } from './Icons';

interface Props {
  rules: AnalysisRule[];
  codebase: CodeFile[];
  activeViolations: RuleViolation[];
  onTriggerFix: (v: RuleViolation) => void;
}

const RulesView: React.FC<Props> = ({ rules, codebase, activeViolations, onTriggerFix }) => {
  return (
    <div className="flex-1 bg-[#0d1117] flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]/50">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter italic mb-1 uppercase leading-none">Architecture <span className="text-[#f85149]">Audit</span></h2>
          <p className="text-[#8b949e] text-xs font-medium uppercase tracking-widest mt-2">Invariant Guard & Self-Healing Service</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#f8514922] border border-[#f8514944] px-6 py-3 rounded-2xl flex flex-col items-end">
              <div className="text-[10px] font-black text-[#f85149] uppercase">Active Blockers</div>
              <div className="text-xl font-black text-[#c9d1d9] font-mono">{activeViolations.length}</div>
           </div>
           <div className="bg-[#3fb95022] border border-[#3fb95044] px-6 py-3 rounded-2xl flex flex-col items-end">
              <div className="text-[10px] font-black text-[#3fb950] uppercase">Healing Potential</div>
              <div className="text-xl font-black text-[#c9d1d9] font-mono">100%</div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 pb-32">
        {/* Proactive Fixing Section */}
        <section className="space-y-6">
           <div className="glass-card p-10 rounded-[40px] bg-[#3fb95005] border-[#3fb95022] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3fb950] opacity-5 blur-[100px] pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-[#3fb95022] flex items-center justify-center text-[#3fb950]">
                 <CpuIcon />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">The Self-Healing Graph</h3>
                 <p className="text-[#8b949e] text-sm leading-relaxed max-w-2xl font-medium italic">
                    ArchLens proactively monitors architectural drift. When an invariant is broken, we generate <strong>Synthetic Refactorings</strong> that align your code with the project's logic baseline.
                 </p>
              </div>
              <button 
                onClick={() => {
                  if (activeViolations.length > 0) onTriggerFix(activeViolations[0]);
                }}
                className="bg-[#3fb950] text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#3fb95022]"
              >
                 AUTO-FIX FIRST BLOCKER
              </button>
           </div>
        </section>

        {/* Violations List */}
        <div className="space-y-6">
           <h3 className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.3em] flex items-center gap-2">
              <AlertIcon className="w-3 h-3 text-[#f85149]" /> Live Violations
           </h3>
           {activeViolations.length === 0 ? (
             <div className="text-[#484f58] italic p-10 bg-[#161b22]/30 rounded-[30px] border border-[#30363d] text-center uppercase font-black text-sm">
                No active invariant violations detected. System is safe.
             </div>
           ) : (
             activeViolations.map((v, i) => (
               <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] flex flex-col md:flex-row gap-8 items-center group hover:border-[#f85149] transition-all">
                  <div className="flex-1 space-y-2 text-left">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-[#f85149] bg-[#f8514911] px-2 py-1 rounded border border-[#f8514922] uppercase tracking-widest">{v.ruleId}</span>
                        <span className="text-xs font-bold text-white uppercase italic">{v.file?.split('/').pop()}</span>
                     </div>
                     <p className="text-sm text-[#c9d1d9] leading-relaxed font-medium">{v.message}</p>
                     <p className="text-[11px] text-[#8b949e] italic font-medium">Suggestion: {v.suggestion}</p>
                  </div>
                  <button 
                    onClick={() => onTriggerFix(v)}
                    className="shrink-0 bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#3fb950] hover:text-white transition-all flex items-center gap-2 shadow-xl"
                  >
                     <RocketIcon className="w-3 h-3" /> Synthetic Fix <ChevronRight className="w-3 h-3" />
                  </button>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default RulesView;
