/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { LibraryAnalysis, AnalysisRule, PlanType } from '../types';
import { LinkIcon, ShieldIcon, AlertIcon, LockIcon, RocketIcon, GraphIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  projectRules: AnalysisRule[];
  onUpgrade: () => void;
  plan: PlanType;
}

const LibraryAuditView: React.FC<Props> = ({ projectRules, onUpgrade, plan }) => {
  const [libs, setLibs] = useState<LibraryAnalysis[]>([
    {
      packageName: 'express',
      version: '4.18.2',
      structuralRisk: 'Low',
      invariantsCheck: { memorySafety: true, concurrencySafe: true, ragIndexable: true },
      aiRecommendation: 'Standard industry middleware. Safe for architectural core usage.'
    }
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [searchLib, setSearchLib] = useState('');

  const handleDeepScan = async () => {
    if (plan === 'Free') {
       onUpgrade();
       return;
    }
    setIsScanning(true);
    try {
      const result = await gemini.analyzeLibraryInvariants(searchLib || 'lodash', 'latest', projectRules);
      setLibs(prev => [result, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#30363d] pb-10">
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Universal <span className="text-[#d29922]">RAG</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Don't treat `node_modules` as a black box. Deep-Scan parses the Full AST of external dependencies to ensure they don't violate project safety invariants.</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
           <input 
              type="text" 
              value={searchLib}
              onChange={(e) => setSearchLib(e.target.value)}
              placeholder="Package name..." 
              className="bg-[#161b22] border border-[#30363d] rounded-2xl px-6 py-3 text-xs text-white focus:outline-none focus:border-[#d29922] transition-all flex-1 lg:w-64"
           />
           <button 
              onClick={handleDeepScan}
              disabled={isScanning}
              className="bg-[#d29922] text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#d2992222] shrink-0"
           >
              {isScanning ? 'DEEP SCANNING...' : 'TRIGGER DEEP-SCAN'}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
         {libs.map((lib, i) => (
            <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[40px] flex flex-col lg:flex-row gap-10 items-center group hover:border-[#d29922] transition-all relative overflow-hidden">
               <div className={`absolute left-0 top-0 w-2 h-full ${lib.structuralRisk === 'Low' ? 'bg-[#3fb950]' : 'bg-[#d29922]'}`}></div>
               <div className="flex items-center gap-6 lg:w-1/3">
                  <div className="w-16 h-16 rounded-3xl bg-[#0d1117] flex items-center justify-center text-[#d29922] border border-[#30363d] shadow-2xl">
                     <LinkIcon />
                  </div>
                  <div>
                     <div className="text-xl font-black text-white italic uppercase tracking-tighter">{lib.packageName}</div>
                     <div className="text-[10px] text-[#8b949e] font-mono uppercase">Version: {lib.version}</div>
                  </div>
               </div>

               <div className="flex-1 grid grid-cols-3 gap-6">
                  {[
                    { label: 'Memory Safety', ok: lib.invariantsCheck.memorySafety },
                    { label: 'Concurrency', ok: lib.invariantsCheck.concurrencySafe },
                    { label: 'RAG Indexable', ok: lib.invariantsCheck.ragIndexable }
                  ].map((check, j) => (
                    <div key={j} className="text-center space-y-2">
                       <div className="text-[9px] font-black text-[#484f58] uppercase tracking-widest">{check.label}</div>
                       <div className={check.ok ? 'text-[#3fb950]' : 'text-[#f85149]'}><ShieldIcon /></div>
                       <div className="text-[10px] font-black uppercase tracking-widest">{check.ok ? 'SAFE' : 'RISK'}</div>
                    </div>
                  ))}
               </div>

               <div className="lg:w-1/4 bg-[#0d1117] p-6 rounded-3xl border border-white/5 space-y-3">
                  <div className="text-[10px] font-black text-[#d29922] uppercase tracking-widest flex items-center gap-2">
                     <RocketIcon /> AI INSIGHT
                  </div>
                  <p className="text-[11px] text-[#8b949e] leading-relaxed italic font-medium">"{lib.aiRecommendation}"</p>
               </div>
            </div>
         ))}
      </div>

      <div className="glass-card p-10 rounded-[50px] border-[#d2992222] bg-[#d2992205] text-center space-y-6">
         <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Why Library Deep-Scan?</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left max-w-4xl mx-auto">
            <div className="space-y-2">
               <div className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2 text-[#d29922]"><ShieldIcon /> SECURITY PROACTIVITY</div>
               <p className="text-xs text-[#8b949e] leading-relaxed">Identify structural vulnerabilities in packages before they are imported. Detect unsafe memory patterns that standard linters miss.</p>
            </div>
            <div className="space-y-2">
               <div className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2 text-[#d29922]"><GraphIcon /> RAG FIDELITY</div>
               <p className="text-xs text-[#8b949e] leading-relaxed">Ensures external code can be indexed correctly. If a library uses too much "magic" (reflection), we warn you it will be a blind spot for AI RAG.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LibraryAuditView;
