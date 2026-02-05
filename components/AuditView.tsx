/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { AuditReport, CodeFile, AnalysisRule } from '../types';
import { ShieldIcon, AlertIcon, RocketIcon, GraphIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
  rules: AnalysisRule[];
  onAuditStarted: (credits: number) => void;
  onDrillDown?: (path: string, line?: number) => void;
}

const AuditView: React.FC<Props> = ({ codebase, rules, onAuditStarted, onDrillDown }) => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleStartAudit = async () => {
    setIsAuditing(true);
    onAuditStarted(50);
    try {
      const result = await gemini.performCodebaseAudit(codebase, rules);
      if (result.issues) {
        result.issues = result.issues.map((issue, idx) => ({
          ...issue,
          file: codebase[idx % codebase.length].path,
          line: 1
        }));
      }
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Deep <span className="text-[#f85149]">Audit</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4">Structural Scrutiny. Flagging Monoliths, Cycles, and God Objects before they commit.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleStartAudit}
            className="bg-[#f85149] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f8514933]"
          >
            SCAN MONOLITH RISKS
          </button>
        )}
      </header>

      {report && (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-8 group hover:border-[#f8514933] transition-all">
               <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldIcon /> Structural Toxicity
               </h3>
               <div className="flex items-center gap-10">
                  <div className="relative w-32 h-32">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="#30363d" strokeWidth="12" fill="transparent" />
                        <circle cx="64" cy="64" r="58" stroke="#f85149" strokeWidth="12" fill="transparent" 
                                strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - (report.toxicity?.godObjectProbability || 0) / 100)} className="transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white">{report.toxicity?.godObjectProbability || 0}%</div>
                  </div>
                  <div className="flex-1 space-y-2">
                     <div className="text-xl font-black text-white italic">God Object Risk</div>
                     <p className="text-sm text-[#8b949e] leading-relaxed">System complexity is concentrating in too few nodes.</p>
                  </div>
               </div>
            </div>
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 flex flex-col justify-center">
               <div className="flex justify-between items-center text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                  <span>Spaghetti Factor</span>
                  <span className="text-[#f85149] font-mono">{report.toxicity?.cyclicDepth || 0} Cycles</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                  <span>Logic Leakage</span>
                  <span className="text-[#d29922] font-mono">{report.toxicity?.logicLeakageCount || 0} Bleeds</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                  <span>Entanglement</span>
                  <span className="text-[#2f81f7] font-mono">{report.toxicity?.entanglementFactor?.toFixed(2) || '0.00'}</span>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><AlertIcon /> Findings Ledger</h3>
             <div className="grid grid-cols-1 gap-4">
                {report.issues.map((issue) => (
                   <button 
                     key={issue.id} 
                     onClick={() => issue.file && onDrillDown?.(issue.file, issue.line)}
                     className="w-full text-left bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] space-y-4 hover:border-[#f8514966] transition-all group relative overflow-hidden"
                   >
                      <div className="flex justify-between">
                         <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-[#f85149] uppercase bg-[#f8514911] px-2 py-1 rounded border border-[#f8514922]">{issue.category}</span>
                           {issue.file && <span className="text-[9px] text-[#484f58] font-mono uppercase tracking-widest">{issue.file}</span>}
                         </div>
                      </div>
                      <h4 className="text-lg font-black text-white italic">{issue.message}</h4>
                      <div className="bg-[#0d1117] p-4 rounded-2xl border border-white/5 text-xs text-[#8b949e]">
                         "{issue.recommendation}"
                      </div>
                   </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {isAuditing && (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#f85149]/30 border-t-[#f85149] rounded-full animate-spin" />
           <p className="text-[12px] font-black text-[#f85149] uppercase tracking-[0.4em] animate-pulse">Running Structural Scrutiny...</p>
        </div>
      )}
    </div>
  );
};

export default AuditView;