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
    <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto pb-44">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">DEEP <span className="text-[#f85149]">SCRUTINY</span></h2>
          <p className="text-gray-500 text-sm">Structural Scrutiny. Flagging Monoliths, Cycles, and God Objects before they commit.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleStartAudit}
            className="bg-[#f85149] hover:bg-[#da3633] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            SCAN MONOLITH RISKS
          </button>
        )}
      </header>

      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-red-500/30 transition-all">
               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <ShieldIcon className="w-3 h-3" /> Structural Toxicity
               </h3>
               <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="35" stroke="#30363d" strokeWidth="6" fill="transparent" />
                        <circle cx="40" cy="40" r="35" stroke="#f85149" strokeWidth="6" fill="transparent" 
                                strokeDasharray={220} strokeDashoffset={220 * (1 - (report.toxicity?.godObjectProbability || 0) / 100)} className="transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">{report.toxicity?.godObjectProbability || 0}%</div>
                  </div>
                  <div className="flex-1 space-y-1">
                     <div className="text-sm font-bold text-white">God Object Risk</div>
                     <p className="text-xs text-gray-500 leading-relaxed">System complexity is concentrating in too few nodes.</p>
                  </div>
               </div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 space-y-4">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Spaghetti Factor</span>
                  <span className="text-red-400 font-bold">{report.toxicity?.cyclicDepth || 0} Cycles</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Logic Leakage</span>
                  <span className="text-amber-400 font-bold">{report.toxicity?.logicLeakageCount || 0} Bleeds</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Entanglement</span>
                  <span className="text-blue-400 font-bold">{report.toxicity?.entanglementFactor?.toFixed(2) || '0.00'}</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><AlertIcon className="w-3 h-3" /> Findings Ledger</h3>
             <div className="grid grid-cols-1 gap-3">
                {report.issues.map((issue) => (
                   <button 
                     key={issue.id} 
                     onClick={() => issue.file && onDrillDown?.(issue.file, issue.line)}
                     className="w-full text-left bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2 hover:border-red-500/30 transition-all"
                   >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{issue.category}</span>
                        {issue.file && <span className="text-[10px] text-gray-600 font-mono">{issue.file}</span>}
                      </div>
                      <h4 className="text-sm font-bold text-white">{issue.message}</h4>
                      <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] text-xs text-gray-400">
                         "{issue.recommendation}"
                      </div>
                   </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {isAuditing && (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
           <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
           <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Running Structural Scrutiny...</p>
        </div>
      )}
    </div>
  );
};

export default AuditView;