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
    <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto pb-44">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">RELIABILITY <span className="text-[#f78166]">PULSE</span></h2>
          <p className="text-gray-500 text-sm">NFR Governance (The Ilities). Auditing for Observability, Idempotency, and Scale Ceilings.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleRunAudit}
            className="bg-[#f78166] hover:bg-[#ea6c52] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            RUN RELIABILITY PROBE
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-6">
          {/* Main Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3"><GraphIcon className="w-3 h-3" /> Observability Coverage</div>
               <div className="text-3xl font-black text-white mb-2">{report.metrics.observabilityCoverage}%</div>
               <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f78166]" style={{ width: `${report.metrics.observabilityCoverage}%` }}></div>
               </div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3"><LockIcon className="w-3 h-3" /> Idempotency Safety</div>
               <div className="text-3xl font-black text-green-400 mb-2">{report.metrics.idempotencySafety}%</div>
               <div className="text-[10px] text-gray-600">Critical Paths Verified</div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3"><CpuIcon className="w-3 h-3" /> Silent Nodes</div>
               <div className="text-3xl font-black text-amber-400 mb-2">{report.metrics.silentNodesCount}</div>
               <div className="text-[10px] text-gray-600">Files lacking telemetry</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Scale Projections */}
             <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><RocketIcon className="w-3 h-3" /> Scale Projections</h3>
                <div className="space-y-3">
                   {report.scaleProjections.map((p, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/50 transition-all">
                         <div className="flex justify-between items-start mb-2">
                            <div>
                               <div className="text-[10px] font-semibold text-[#58a6ff] mb-1">{p.file}</div>
                               <h4 className="text-sm font-bold text-white">Bottleneck: {p.projection.complexity} Complexity</h4>
                            </div>
                            <div className="bg-[#0d1117] px-3 py-1.5 rounded-lg border border-[#30363d] text-right">
                               <div className="text-[8px] font-bold text-gray-500 uppercase">Ceiling</div>
                               <div className="text-xs font-bold text-white">{p.projection.currentCeiling.toLocaleString()} rows</div>
                            </div>
                         </div>
                         <p className="text-xs text-gray-500 leading-relaxed">"{p.projection.bottleneckReason}"</p>
                      </div>
                   ))}
                </div>
             </div>

             {/* Risks & Mitigation */}
             <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><AlertIcon className="w-3 h-3" /> Critical Warnings</h3>
                <div className="space-y-3">
                   {report.warnings.map((w, i) => (
                      <div key={i} className={`p-4 rounded-lg border flex gap-4 ${
                        w.severity === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'
                      }`}>
                         <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            w.severity === 'error' ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10'
                         }`}>
                            <ShieldIcon className="w-4 h-4" />
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold uppercase text-gray-400">{w.type} Risk</span>
                               <span className="text-[10px] text-gray-600">{w.file}</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-snug">{w.message}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : isAuditing ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
           <div className="w-10 h-10 border-2 border-[#f78166]/30 border-t-[#f78166] rounded-full animate-spin" />
           <div className="text-center space-y-1">
              <div className="text-xs font-semibold text-[#f78166] uppercase tracking-wider">Probing System Resilience...</div>
              <p className="text-[10px] text-gray-600">Scanning for Idempotency Chains & Scale Ceilings</p>
           </div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
           <TerminalIcon className="w-12 h-12 text-gray-700" />
           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Initialize reliability probe to view system health.</p>
        </div>
      )}
    </div>
  );
};

export default ReliabilityHub;
