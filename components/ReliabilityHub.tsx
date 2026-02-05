/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { ReliabilityReport, CodeFile } from '../types';
import { RocketIcon, ShieldIcon, AlertIcon, GraphIcon, LinkIcon, LockIcon, CpuIcon, TerminalIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const ReliabilityHub: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<ReliabilityReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await gemini.performReliabilityAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">System <span className="text-[#f78166]">Pulse</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">NFR Governance (The Ilities). Auditing for Observability, Idempotency, and Scale Ceilings.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleRunAudit}
            className="bg-[#f78166] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f7816633]"
          >
            RUN RELIABILITY PROBE
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
          {/* Main Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-6">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GraphIcon /> Observability Coverage</div>
               <div className="text-5xl font-black italic text-white">{report.metrics.observabilityCoverage}%</div>
               <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f78166]" style={{ width: `${report.metrics.observabilityCoverage}%` }}></div>
               </div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-6">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LockIcon /> Idempotency Safety</div>
               <div className="text-5xl font-black italic text-[#3fb950]">{report.metrics.idempotencySafety}%</div>
               <div className="text-[10px] font-bold text-[#484f58] uppercase">Critical Paths Verified</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-6">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><CpuIcon /> Silent Nodes</div>
               <div className="text-5xl font-black italic text-[#d29922]">{report.metrics.silentNodesCount}</div>
               <div className="text-[10px] font-bold text-[#484f58] uppercase">Files lacking telemetry</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Scale Projections */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><RocketIcon /> Scale Projections</h3>
                <div className="space-y-4">
                   {report.scaleProjections.map((p, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] hover:border-[#2f81f744] transition-all group">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="text-[10px] font-black text-[#2f81f7] uppercase mb-1">{p.file}</div>
                               <h4 className="text-lg font-black text-white italic tracking-tighter">Bottleneck: {p.projection.complexity} Complexity</h4>
                            </div>
                            <div className="bg-[#0d1117] px-4 py-2 rounded-2xl border border-white/5 text-right">
                               <div className="text-[8px] font-black text-[#8b949e] uppercase">Ceiling</div>
                               <div className="text-sm font-black text-white">{p.projection.currentCeiling.toLocaleString()} rows</div>
                            </div>
                         </div>
                         <p className="text-xs text-[#8b949e] leading-relaxed italic">"{p.projection.bottleneckReason}"</p>
                      </div>
                   ))}
                </div>
             </div>

             {/* Risks & Mitigation */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><AlertIcon /> Critical Warnings</h3>
                <div className="space-y-4">
                   {report.warnings.map((w, i) => (
                      <div key={i} className={`p-6 rounded-[30px] border flex gap-6 ${
                        w.severity === 'error' ? 'bg-[#f851490a] border-[#f8514933]' : 'bg-[#d299220a] border-[#d2992233]'
                      }`}>
                         <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
                            w.severity === 'error' ? 'text-[#f85149]' : 'text-[#d29922]'
                         }`}>
                            <ShieldIcon />
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-black uppercase">{w.type} Risk</span>
                               <span className="text-[9px] text-[#484f58] uppercase font-bold">{w.file}</span>
                            </div>
                            <p className="text-sm text-[#c9d1d9] font-medium leading-snug">{w.message}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : isAuditing ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#f78166]/30 border-t-[#f78166] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#f78166] uppercase tracking-[0.4em] animate-pulse">Probing System Resilience...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Scanning for Idempotency Chains & Scale Ceilings</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[4] text-[#30363d]"><TerminalIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize reliability probe to view system health.</p>
        </div>
      )}
    </div>
  );
};

export default ReliabilityHub;
