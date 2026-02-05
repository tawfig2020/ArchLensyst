/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { ArchitecturalMandate, ADR } from '../types';
import { ShieldIcon, LockIcon, RocketIcon, CpuIcon, AlertIcon, TerminalIcon, LinkIcon } from './Icons';

const MOCK_MANDATES: ArchitecturalMandate[] = [
  {
    id: 'M001',
    philosophy: 'Functional Over Imperative',
    rationale: 'Functional logic is easier for RAG to index as deterministic transforms. State mutations obscure the causality graph.',
    forbiddenPatterns: ['class variable mutation', 'global state outside of store'],
    enforcementLevel: 'Hard'
  },
  {
    id: 'M002',
    philosophy: 'Async/Await Continuity',
    rationale: 'Mixing Promises and Callbacks leads to "Pattern Drift" which makes predictive impact analysis unreliable.',
    forbiddenPatterns: ['new Promise((res, rej) => ...)', 'callback(null, data)'],
    enforcementLevel: 'Hard'
  }
];

const MOCK_ADRS: ADR[] = [
  {
    id: 'ADR-001',
    timestamp: '2025-05-10',
    title: 'Migration to RAG-First Service Layer',
    author: 'Alex Rivera',
    context: 'Standard API calls lacked metadata for the guardian analysis.',
    decision: 'All services must include explicit interface definitions and signature metadata.',
    consequences: 'Improved blast-radius accuracy by 42% but increased boilerplate slightly.'
  }
];

const ConstitutionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MANDATES' | 'ADR_LOG'>('MANDATES');

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Architect's <span className="text-[#2f81f7]">Constitution</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">The "Why" behind the code. Hard-coded philosophies that prevent architectural drift and preserve interpretive control.</p>
        </div>
        <div className="flex bg-[#161b22] p-1.5 rounded-2xl border border-[#30363d] gap-2">
           <button 
            onClick={() => setActiveTab('MANDATES')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MANDATES' ? 'bg-[#2f81f7] text-white' : 'text-[#484f58] hover:text-white'}`}
           >
            Mandates
           </button>
           <button 
            onClick={() => setActiveTab('ADR_LOG')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ADR_LOG' ? 'bg-[#2f81f7] text-white' : 'text-[#484f58] hover:text-white'}`}
           >
            ADR Ledger
           </button>
        </div>
      </header>

      {activeTab === 'MANDATES' ? (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MOCK_MANDATES.map(mandate => (
                <div key={mandate.id} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[40px] hover:border-[#2f81f7] transition-all relative overflow-hidden group">
                   <div className="absolute top-0 right-0 px-4 py-1 bg-[#2f81f722] text-[#2f81f7] text-[8px] font-black uppercase tracking-widest border-l border-b border-[#30363d]">
                      {mandate.enforcementLevel} Enforcement
                   </div>
                   <h3 className="text-xl font-black text-white italic mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2f81f711] flex items-center justify-center text-[#2f81f7] border border-[#2f81f733]">
                         <LockIcon />
                      </div>
                      {mandate.philosophy}
                   </h3>
                   <div className="bg-[#0d1117] p-6 rounded-3xl border border-white/5 space-y-4">
                      <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Shared Logic / The "Why"</div>
                      <p className="text-sm text-[#c9d1d9] leading-relaxed italic">"{mandate.rationale}"</p>
                   </div>
                   <div className="mt-6 space-y-3">
                      <div className="text-[9px] font-black text-[#f85149] uppercase tracking-widest">Forbidden Drifts</div>
                      <div className="flex flex-wrap gap-2">
                         {mandate.forbiddenPatterns.map(pattern => (
                            <span key={pattern} className="px-3 py-1 bg-[#f8514911] text-[#f85149] border border-[#f8514922] rounded-lg text-[10px] font-bold font-mono">
                               {pattern}
                            </span>
                         ))}
                      </div>
                   </div>
                </div>
              ))}
              <div className="border-2 border-dashed border-[#30363d] rounded-[40px] flex flex-col items-center justify-center p-10 text-center space-y-6 hover:bg-white/5 transition-all cursor-pointer">
                 <div className="text-[#30363d] scale-[2]"><RocketIcon /></div>
                 <div>
                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">Propose New Mandate</h4>
                    <p className="text-[11px] text-[#484f58] uppercase font-bold mt-2">Anchor a new design philosophy in the RAG brain.</p>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-6">
           {MOCK_ADRS.map(adr => (
              <div key={adr.id} className="bg-[#161b22] border border-[#30363d] p-10 rounded-[50px] space-y-6 relative overflow-hidden group">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none underline decoration-[#2f81f7] decoration-4 underline-offset-8 mb-4">
                          {adr.title}
                       </h3>
                       <div className="text-[10px] text-[#484f58] font-bold uppercase tracking-[0.3em]">
                          {adr.id} • Authorized by {adr.author} • {adr.timestamp}
                       </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl text-[#2f81f7] group-hover:scale-110 transition-transform">
                       <TerminalIcon />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                    <div className="space-y-3">
                       <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2">
                          <LinkIcon /> Context / Problem
                       </div>
                       <p className="text-sm text-[#c9d1d9] leading-relaxed">{adr.context}</p>
                    </div>
                    <div className="space-y-3">
                       <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest flex items-center gap-2">
                          <ShieldIcon /> The Decision
                       </div>
                       <p className="text-sm text-[#c9d1d9] leading-relaxed">{adr.decision}</p>
                    </div>
                 </div>

                 <div className="bg-[#050505] p-6 rounded-3xl border border-white/5">
                    <div className="text-[9px] font-black text-[#d29922] uppercase tracking-widest mb-2 flex items-center gap-2">
                       <AlertIcon /> Consequences
                    </div>
                    <p className="text-xs text-[#8b949e] italic leading-relaxed">"{adr.consequences}"</p>
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default ConstitutionView;
