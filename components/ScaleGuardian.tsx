/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { PerformanceAuditReport, CodeFile } from '../types';
import { CpuIcon, AlertIcon, RocketIcon, GraphIcon, TerminalIcon, ShieldIcon, LinkIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const ScaleGuardian: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<PerformanceAuditReport | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunStressSimulation = async () => {
    setIsSimulating(true);
    try {
      const result = await gemini.performPerformanceAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Scale <span className="text-[#3fb950]">Guardian</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Predictive Load Scrutiny. Detecting Algorithmic Friction and Resource Leaks before they hit production.</p>
        </div>
        {!report && !isSimulating && (
          <button 
            onClick={handleRunStressSimulation}
            className="bg-[#3fb950] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#3fb95033]"
          >
            SIMULATE 10K CONCURRENCY
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
          {/* Performance Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#3fb95033] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><CpuIcon /> Efficiency Baseline</div>
               <div className="text-5xl font-black italic text-[#3fb950]">{report.overallEfficiencyScore}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Composite NFR Compliance</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#f8514933] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><AlertIcon /> Bottlenecks</div>
               <div className="text-5xl font-black italic text-[#f85149]">{report.projections.length}</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">O(n^2) or higher detected</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#d2992233] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><ShieldIcon /> Leak Risks</div>
               <div className="text-5xl font-black italic text-[#d29922]">{report.resourceLeaks.length}</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Dangling Connections</div>
            </div>
             <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#2f81f733] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GraphIcon /> Scale Ceiling</div>
               <div className="text-5xl font-black italic text-[#2f81f7]">High</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Based on O-notation RAG</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Complexity Projections */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><GraphIcon /> Algorithmic Complexity Log</h3>
                <div className="space-y-4">
                   {report.projections.map((p, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] hover:border-[#3fb95066] transition-all group relative overflow-hidden">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="text-[10px] font-black text-[#3fb950] uppercase mb-1">{p.file} • Line {p.line}</div>
                               <h4 className="text-lg font-black text-white italic">Complexity: {p.projection.complexity}</h4>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                              p.projection.resourceDrain === 'critical' ? 'bg-[#f85149] text-white' : 'bg-[#3fb95022] text-[#3fb950]'
                            }`}>
                               {p.projection.resourceDrain} Drain
                            </div>
                         </div>
                         <p className="text-xs text-[#8b949e] leading-relaxed mb-6 italic">"{p.projection.bottleneckReason}"</p>
                         <div className="bg-[#0d1117] p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-[#484f58] font-bold uppercase tracking-widest">Max Safe Concurrency</span>
                            <span className="text-sm font-black text-white italic">{p.projection.maxSafeConcurrency.toLocaleString()} Users</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Resource Leaks & Infrastructure */}
             <div className="space-y-10">
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><AlertIcon /> Resource Management Violations</h3>
                   <div className="space-y-4">
                      {report.resourceLeaks.map((l, i) => (
                         <div key={i} className="bg-[#161b22] border border-[#f8514933] p-6 rounded-[30px] space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black text-[#f85149] uppercase">
                               <span>{l.type} DETECTED</span>
                               <span className="font-mono">{l.file}:{l.line}</span>
                            </div>
                            <p className="text-xs text-[#c9d1d9] leading-relaxed italic">"{l.message}"</p>
                            <button className="w-full bg-[#f8514911] text-[#f85149] border border-[#f8514933] py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#f85149] hover:text-white transition-all">
                               GENERATE CLEANUP PR
                            </button>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#2f81f7] opacity-5 blur-3xl" />
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#2f81f7] decoration-4 underline-offset-8">Phantom Simulation Logic</h3>
                   <p className="text-sm text-[#8b949e] leading-relaxed italic font-medium">
                     ArchLens hallucinates an extreme "Cyber Monday" workload against your logical graph to find silent failure points.
                   </p>
                   <div className="flex items-center gap-4 p-4 bg-[#2f81f70a] border border-[#2f81f722] rounded-3xl">
                      <div className="w-2 h-2 rounded-full bg-[#2f81f7] animate-pulse"></div>
                      <span className="text-[10px] font-black text-[#2f81f7] uppercase tracking-widest">Simulating: 50,000 req/min spike</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : isSimulating ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#3fb950]/30 border-t-[#3fb950] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#3fb950] uppercase tracking-[0.4em] animate-pulse">Hashing Runtime Scenarios...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Projecting O-notation against memory limits</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[4] text-[#30363d] animate-bounce duration-[3000ms]"><CpuIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize scale simulation to stress-test your architecture.</p>
        </div>
      )}
    </div>
  );
};

export default ScaleGuardian;
