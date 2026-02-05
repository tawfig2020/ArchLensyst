/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { 
  ShieldIcon, AlertIcon, LockIcon, CpuIcon, 
  TerminalIcon, GraphIcon, GlobeIcon, 
  TrendingUpIcon, LinkIcon, RocketIcon 
} from './Icons';

interface Props {
  onBack: () => void;
  onInitialize: () => void;
}

const SpecsView: React.FC<Props> = ({ onBack, onInitialize }) => {
  const specs = [
    {
      id: 'S-001',
      title: 'Structural Forge Engine',
      icon: <CpuIcon className="text-[#2f81f7]" />,
      desc: 'Real-time AST deconstruction of AI suggestions. Re-aligns "Stiff" imperative code into functional, strategic patterns.',
      stats: '4.2ms avg latency'
    },
    {
      id: 'S-002',
      title: 'Pre-Commit Defense',
      icon: <ShieldIcon className="text-[#3fb950]" />,
      desc: 'Intercepts suggestion-level vulnerabilities (SQLi, XSS) before they reach the editor. 1,000+ edge-cases per logic block.',
      stats: 'Zero-Leak verified'
    },
    {
      id: 'S-003',
      title: 'Rationale Mirror',
      icon: <GraphIcon className="text-[#d29922]" />,
      desc: 'Synchronizes AI context with existing ADRs (Architectural Decision Records). Prevents terminal design drift.',
      stats: '100% Invariant Compliance'
    }
  ];

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto selection:bg-[#2f81f7] selection:text-white animate-in slide-in-from-right-10 duration-700">
      <div className="max-w-6xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-12">
          <div>
            <button 
              onClick={onBack}
              className="text-[10px] font-black text-[#484f58] uppercase tracking-[0.3em] hover:text-[#2f81f7] transition-colors mb-6 flex items-center gap-2"
            >
              ← RETURN TO COMMAND
            </button>
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Defense <span className="text-[#2f81f7]">Specifications</span>
            </h2>
            <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">
              ArchLens Strategic: Technical White-Paper. Proving architectural immunity through persistent RAG-First surveillance.
            </p>
          </div>
          <button 
            onClick={onInitialize}
            className="bg-white text-black px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ffffff22]"
          >
            INITIALIZE CITADEL
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specs.map((spec) => (
            <div key={spec.id} className="bg-[#161b22] border border-[#30363d] p-10 rounded-[50px] space-y-6 group hover:border-[#2f81f744] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-[#484f58]">{spec.id}</div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                {spec.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{spec.title}</h3>
                <p className="text-xs text-[#8b949e] leading-relaxed italic">"{spec.desc}"</p>
              </div>
              <div className="pt-6 border-t border-white/5">
                <span className="text-[10px] font-black text-[#484f58] uppercase tracking-widest">Perf: {spec.stats}</span>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-[#0d1117] border border-[#30363d] rounded-[60px] p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2f81f7 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4">
            <div className="text-[#2f81f7]"><TerminalIcon /></div>
            Architectural Invariants
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-[11px] font-black text-[#3fb950] uppercase tracking-widest flex items-center gap-2">
                  <LockIcon className="w-4 h-4" /> Global Integrity Ledger
                </div>
                <p className="text-sm text-[#8b949e] leading-relaxed italic">
                  ArchLens maintains a sub-second hash of your entire dependency tree. If an AI agent suggests an unverified package or a "phantom" import, the suggestion is neutralized before compilation.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-[11px] font-black text-[#2f81f7] uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Traceability Graph
                </div>
                <p className="text-sm text-[#8b949e] leading-relaxed italic">
                  Every AI suggestion is anchored to a human-authored ADR. If no rationale exists for a proposed design pattern, ArchLens flags the "Pattern Gap" and prompts for an architectural session.
                </p>
              </div>
            </div>

            <div className="bg-[#050505] p-8 rounded-[40px] border border-white/5 space-y-6">
              <div className="text-[10px] font-black text-[#f85149] uppercase tracking-widest">Institutional ROI Verification</div>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#8b949e]">PR Noise Reduction</span>
                    <span className="text-xl font-black text-white italic">40%</span>
                 </div>
                 <div className="h-1.5 bg-[#161b22] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f85149]" style={{ width: '40%' }}></div>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#8b949e]">Vulnerability Neutralization</span>
                    <span className="text-xl font-black text-white italic">100%</span>
                 </div>
                 <div className="h-1.5 bg-[#161b22] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3fb950]" style={{ width: '100%' }}></div>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#8b949e]">Senior Review Efficiency</span>
                    <span className="text-xl font-black text-white italic">10x</span>
                 </div>
                 <div className="h-1.5 bg-[#161b22] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2f81f7]" style={{ width: '90%' }}></div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SpecsView;