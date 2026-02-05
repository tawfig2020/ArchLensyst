/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { StructuralAuditReport, CodeFile } from '../types';
import { CpuIcon, GraphIcon, AlertIcon, ShieldIcon, RocketIcon, LinkIcon, TerminalIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const StructuralForge: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<StructuralAuditReport | null>(null);
  const [isForging, setIsForging] = useState(false);

  const handleRunAudit = async () => {
    setIsForging(true);
    try {
      const result = await gemini.performStructuralAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsForging(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#2f81f733]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Structural <span className="text-[#2f81f7]">Forge</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Architectural Diversity Control. Detecting 'Stiff' logic and injecting high-level abstractions to prevent AI-driven decay.</p>
        </div>
        {!report && !isForging && (
          <button 
            onClick={handleRunAudit}
            className="bg-[#2f81f7] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2f81f733]"
          >
            FORGE ARCHITECTURAL DEPTH
          </button>
        )}
        {report && !isForging && (
          <button 
            onClick={handleRunAudit}
            className="border border-[#30363d] text-[#8b949e] px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white transition-all"
          >
            RE-FORGE PATTERNS
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
          {/* Top Level Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#f8514933] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><AlertIcon className="w-3 h-3" /> Stiffness Index</div>
               <div className={`text-5xl font-black italic ${report.stiffnessScore > 60 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                  {report.stiffnessScore}%
               </div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Resistance to refactoring</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#2f81f733] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GraphIcon className="w-3 h-3" /> Diversity Score</div>
               <div className="text-5xl font-black italic text-[#2f81f7]">{report.diversityIndex}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Design Pattern Saturation</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#d2992233] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LinkIcon className="w-3 h-3" /> Logic Clones</div>
               <div className="text-5xl font-black italic text-[#d29922]">{report.redundancyHeatmap?.length || 0}</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Repetitive AI Chains</div>
            </div>
             <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-white/10 transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><CpuIcon className="w-3 h-3" /> Maintenance Health</div>
               <div className="text-5xl font-black italic text-white">Stable</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Extensibility Confidence</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Enrichment Proposals */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><RocketIcon className="w-4 h-4 text-[#2f81f7]" /> Structural Enrichment Forge</h3>
                <div className="space-y-4">
                   {report.enrichmentProposals.length === 0 ? (
                     <div className="p-10 border border-dashed border-[#30363d] rounded-[35px] text-center opacity-40 uppercase font-black text-xs text-[#484f58]">Codebase is structurally diverse. No simplistic traps found.</div>
                   ) : report.enrichmentProposals.map((p, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] hover:border-[#2f81f766] transition-all group relative overflow-hidden">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="text-[10px] font-black text-[#2f81f7] uppercase mb-1 tracking-widest">{p.file} • Line {p.line}</div>
                               <h4 className="text-lg font-black text-white italic tracking-tight uppercase">Evolve Logic to High-Tier Pattern</h4>
                            </div>
                            <span className="bg-[#2f81f711] text-[#2f81f7] px-3 py-1 rounded-full text-[8px] font-black uppercase border border-[#2f81f722]">Recommendation</span>
                         </div>
                         <p className="text-xs text-[#8b949e] leading-relaxed mb-6 italic">"{p.explanation}"</p>
                         
                         <div className="grid grid-cols-1 gap-4 mb-6">
                            <div className="space-y-2">
                               <div className="text-[9px] font-black text-[#484f58] uppercase tracking-widest">Original (Stiff Syntax)</div>
                               <div className="bg-[#0d1117] p-4 rounded-xl border border-white/5 text-[10px] font-mono text-[#f85149] opacity-70 truncate shadow-inner">
                                  $ {p.originalSnippet}
                               </div>
                            </div>
                            <div className="space-y-2">
                               <div className="text-[9px] font-black text-[#3fb950] uppercase tracking-widest">Forged (Strategic Abstraction)</div>
                               <div className="bg-[#0d1117] p-4 rounded-xl border border-[#3fb95022] text-[10px] font-mono text-[#3fb950] whitespace-pre-wrap shadow-inner leading-relaxed">
                                  {p.forgedAbstraction}
                               </div>
                            </div>
                         </div>
                         
                         <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all shadow-xl">IMPLEMENT ABSTRACTION</button>
                      </div>
                   ))}
                </div>
             </div>

             {/* Stiffness Map & Risks */}
             <div className="space-y-10">
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><AlertIcon className="w-4 h-4 text-[#f85149]" /> Stiffness Analysis (Long-term Risk)</h3>
                   <div className="grid grid-cols-1 gap-4">
                      {report.maintenanceRisks.map((risk, i) => (
                         <div key={i} className={`p-6 rounded-[30px] border flex gap-6 group hover:scale-[1.02] transition-all relative overflow-hidden ${
                            risk.impact === 'High' ? 'bg-[#f851490a] border-[#f8514933]' : 'bg-[#161b22] border-[#30363d]'
                         }`}>
                            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border ${
                               risk.impact === 'High' ? 'text-[#f85149] border-[#f8514933] bg-[#f8514911]' : 'text-[#8b949e] border-[#30363d] bg-white/5'
                            }`}>
                               <ShieldIcon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                  <span className={`text-[9px] font-black uppercase tracking-widest ${risk.impact === 'High' ? 'text-[#f85149]' : 'text-[#8b949e]'}`}>{risk.category}</span>
                                  <span className="text-[8px] font-bold text-[#484f58] uppercase bg-white/5 px-2 py-0.5 rounded tracking-tighter">Predictive Debt: {risk.impact}</span>
                               </div>
                               <h5 className="text-sm font-black text-white uppercase italic tracking-tight">{risk.id}</h5>
                               <p className="text-xs text-[#8b949e] leading-snug font-medium italic">"{risk.description}"</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 text-[#d29922] group-hover:scale-110 transition-transform duration-1000"><GraphIcon className="w-32 h-32" /></div>
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#d29922] decoration-4 underline-offset-8">Diversity RAG Injection</h3>
                   <p className="text-sm text-[#8b949e] leading-relaxed italic font-medium">
                     ArchLens has detected a pattern loop. Next time you prompt for a new handler, we will explicitly inject high-diversity design patterns from our **Institutional Knowledge Layer** to break the repetitivity cycle.
                   </p>
                   <div className="flex items-center gap-4 p-5 bg-[#d299220a] border border-[#d2992222] rounded-3xl shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-[#d29922] animate-pulse"></div>
                      <span className="text-[10px] font-black text-[#d29922] uppercase tracking-widest">Diversity Pulse: ACTIVE MONITORING</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : isForging ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#2f81f7] uppercase tracking-[0.4em] animate-pulse">Analyzing Pattern Entropy...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Scanning cross-file logic for repetitivity and abstraction stiffness</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40 group hover:opacity-100 transition-opacity">
           <div className="scale-[5] text-[#30363d] group-hover:text-[#2f81f7] transition-colors duration-500"><CpuIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize Forge to refine simplistic AI logic and prevent architectural decay.</p>
        </div>
      )}
    </div>
  );
};

export default StructuralForge;
