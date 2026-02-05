/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { FairnessReport, CodeFile } from '../types';
import { ShieldIcon, AlertIcon, RocketIcon, GraphIcon, LockIcon, CpuIcon, UserIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
  onAuditComplete?: () => void;
}

const FairnessGuardView: React.FC<Props> = ({ codebase, onAuditComplete }) => {
  const [report, setReport] = useState<FairnessReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleStartAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await gemini.performFairnessAudit(codebase);
      setReport(result);
      if (onAuditComplete) onAuditComplete();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Ethics <span className="text-[#d29922]">Guard</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Algorithmic fairness monitor for AI-driven logic. Detect unintended exclusion and proxy discrimination.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleStartAudit}
            className="bg-[#d29922] text-black px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#d2992233]"
          >
            INITIALIZE FAIRNESS SCAN
          </button>
        )}
      </header>

      {!report && !isAuditing ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-10">
           <div className="w-24 h-24 rounded-full bg-[#d2992211] flex items-center justify-center text-[#d29922] border border-[#d2992233] scale-150 mb-10">
              <UserIcon className="w-12 h-12" />
           </div>
           <div className="max-w-xl space-y-4">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Guard Your Algorithmic Integrity</h3>
              <p className="text-[#8b949e] leading-relaxed">
                 AI-generated logic inherits statistical biases. Ethics Guard parses your decision-making code to find "Proxy Variables" that could lead to illegal discrimination or demographic skew.
              </p>
           </div>
        </div>
      ) : isAuditing ? (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#d29922]/30 border-t-[#d29922] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#d29922] uppercase tracking-[0.4em] animate-pulse">Scanning Socio-Technical Debt...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Volume: Analyzing Logic Nodes & Proxy Variables</p>
           </div>
        </div>
      ) : report ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[40px] bg-[#d2992205] border border-[#d2992222]">
                 <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest mb-4 flex items-center gap-2"><GraphIcon /> Equality Index</div>
                 <div className="text-5xl font-black italic text-white">{report.equalityIndex}%</div>
                 <div className="mt-4 h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#f85149] to-[#3fb950]" style={{ width: `${report.equalityIndex}%` }}></div>
                 </div>
              </div>
              <div className="glass-card p-8 rounded-[40px] bg-[#d2992205] border border-[#d2992222]">
                 <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldIcon /> Fairness Score</div>
                 <div className="text-5xl font-black italic text-[#3fb950]">{report.overallScore}%</div>
                 <div className="text-[10px] font-bold text-[#484f58] uppercase mt-4">Protected Characteristic Coverage</div>
              </div>
              <div className="glass-card p-8 rounded-[40px] bg-[#d2992205] border border-[#d2992222]">
                 <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest mb-4 flex items-center gap-2"><AlertIcon /> Bias Alerts</div>
                 <div className="text-5xl font-black italic text-[#f85149]">{report.detectedBiases.length}</div>
                 <div className="text-[10px] font-bold text-[#484f58] uppercase mt-4">Potential Discrimination Vectors</div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Socio-Technical Audit Findings</h3>
              <div className="grid grid-cols-1 gap-6">
                 {report.detectedBiases.map((bias) => (
                    <div key={bias.id} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] hover:border-[#d2992244] transition-all group relative overflow-hidden">
                       <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase tracking-widest ${
                         bias.impactLevel === 'Critical' ? 'bg-[#f85149] text-white' : 'bg-[#d29922] text-black'
                       }`}>
                          {bias.type}
                       </div>
                       <h4 className="text-lg font-black text-white italic mb-4 tracking-tight">{bias.description}</h4>
                       
                       {bias.proxyVariables && bias.proxyVariables.length > 0 && (
                          <div className="mb-6 space-y-2">
                             <div className="text-[9px] font-black text-[#8b949e] uppercase tracking-widest">Proxy Variables Detected</div>
                             <div className="flex flex-wrap gap-2">
                                {bias.proxyVariables.map(v => (
                                   <span key={v} className="px-3 py-1 bg-[#f8514911] text-[#f85149] border border-[#f8514922] rounded-lg text-[10px] font-bold font-mono">
                                      {v}
                                   </span>
                                ))}
                             </div>
                          </div>
                       )}

                       <div className="bg-[#0d1117] p-6 rounded-3xl border border-white/5">
                          <p className="text-[#8b949e] text-sm leading-relaxed italic">
                             <span className="text-white font-bold uppercase text-[10px] block mb-2 underline decoration-[#d29922] decoration-2">Neutralization Strategy:</span>
                             "{bias.recommendation}"
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="p-12 bg-gradient-to-br from-[#161b22] to-[#050505] border border-[#d2992222] rounded-[60px] text-center space-y-6 shadow-2xl">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter underline decoration-[#d29922] decoration-8 underline-offset-16">The Ethics Verdict</h3>
              <p className="text-lg text-[#c9d1d9] max-w-3xl mx-auto leading-relaxed italic">"{report.verdict}"</p>
              <div className="pt-8">
                 <p className="text-[9px] font-black text-[#484f58] uppercase tracking-[0.5em]">System compliant with socio-technical invariants</p>
              </div>
           </div>
        </div>
      ) : null}
    </div>
  );
};

export default FairnessGuardView;
