/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { DeveloperPersona } from '../types';
import { UserIcon, RocketIcon, GraphIcon, ShieldIcon, LinkIcon, LockIcon, CpuIcon } from './Icons';

interface Props {
  persona?: DeveloperPersona;
  onSync: () => void;
  isSyncing?: boolean;
}

const DeveloperPersonaMirror: React.FC<Props> = ({ persona, onSync, isSyncing }) => {
  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4 border-b border-[#30363d] pb-10">
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Developer <span className="text-[#2f81f7]">DNA</span></h2>
        <p className="text-[#8b949e] max-w-2xl font-medium italic">Your coding style is your signature. ArchLens indexes your historical logic to ensure the AI's RAG context feels like a natural extension of your best self.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="glass-card p-10 rounded-[50px] bg-[#2f81f705] border border-[#2f81f722] flex flex-col justify-between">
            <div className="space-y-8">
               <div className="w-16 h-16 rounded-3xl bg-[#2f81f722] flex items-center justify-center text-[#2f81f7] shadow-2xl">
                  <UserIcon />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Logic Mirror Protocol</h3>
                  <p className="text-[#8b949e] text-sm leading-relaxed italic">
                     When you use an AI IDE, it often suggests code that "works" but isn't "yours". DNA sync analyzes your past PRs to align the RAG with your naming conventions, safety level, and modular philosophy.
                  </p>
               </div>
            </div>
            <button 
               onClick={onSync}
               disabled={isSyncing}
               className="mt-10 bg-white text-black px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ffffff11] disabled:opacity-50"
            >
               {isSyncing ? 'EXTRACTING DNA...' : persona?.syncStatus === 'synced' ? 'RE-SYNC DNA BASELINE' : 'INITIALIZE DNA SYNC'}
            </button>
         </div>

         <div className="space-y-6">
            <h4 className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.3em] flex items-center gap-2">
               <GraphIcon /> Active Persona Traits
            </h4>
            
            {persona?.syncStatus === 'synced' ? (
               <div className="space-y-4 animate-in slide-in-from-right-4">
                  <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-[40px] space-y-6">
                     <div className="flex flex-wrap gap-3">
                        {persona.traits.map((trait, i) => (
                           <span key={i} className="px-4 py-1.5 rounded-full bg-[#2f81f711] text-[#2f81f7] text-[10px] font-black uppercase tracking-widest border border-[#2f81f722]">
                              {trait}
                           </span>
                        ))}
                     </div>
                     <div className="space-y-2">
                        <div className="text-[10px] font-black text-white uppercase opacity-50">Architectural Philosophy</div>
                        <p className="text-sm text-[#c9d1d9] leading-relaxed italic font-medium">"{persona.philosophy}"</p>
                     </div>
                     <div className="space-y-3 pt-4 border-t border-[#30363d]">
                        <div className="text-[10px] font-black text-white uppercase opacity-50">Preferred Patterns</div>
                        <div className="flex flex-wrap gap-4">
                           {persona.preferredPatterns.map((p, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-[#8b949e] font-bold italic">
                                 <div className="w-1 h-1 rounded-full bg-[#2f81f7]"></div> {p}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="text-[10px] text-[#484f58] font-black uppercase tracking-widest text-center italic">
                     Last synchronized: {persona.lastSync}
                  </div>
               </div>
            ) : isSyncing ? (
               <div className="h-64 flex flex-col items-center justify-center p-10 bg-[#161b22]/30 border border-dashed border-[#30363d] rounded-[40px] text-center space-y-6">
                  <div className="w-12 h-12 border-4 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin"></div>
                  <p className="text-[11px] font-black text-[#2f81f7] uppercase tracking-widest animate-pulse">Consulting Strategic Index...</p>
               </div>
            ) : (
               <div className="h-64 flex flex-col items-center justify-center p-10 bg-[#161b22]/30 border border-dashed border-[#30363d] rounded-[40px] text-center space-y-4">
                  <div className="text-[#30363d] scale-[2]"><LockIcon /></div>
                  <p className="text-[11px] font-black text-[#484f58] uppercase">DNA Baseline not yet established.</p>
               </div>
            )}
         </div>
      </div>

      <section className="bg-[#161b22]/30 p-12 rounded-[50px] border border-[#30363d] space-y-10">
         <h4 className="text-xl font-black text-white italic uppercase tracking-tighter text-center">Persona Benefits</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
               <div className="text-[#3fb950]"><ShieldIcon /></div>
               <div className="text-[10px] font-black text-white uppercase tracking-widest">Consistency</div>
               <p className="text-xs text-[#8b949e] leading-relaxed italic">AI suggestions automatically adopt your specific error-handling and logging standards.</p>
            </div>
            <div className="space-y-3">
               <div className="text-[#2f81f7]"><LinkIcon /></div>
               <div className="text-[10px] font-black text-white uppercase tracking-widest">Confidence</div>
               <p className="text-xs text-[#8b949e] leading-relaxed italic">RAG results are filtered to match the "Best version" of your historical logic.</p>
            </div>
            <div className="space-y-3">
               <div className="text-[#d29922]"><CpuIcon /></div>
               <div className="text-[10px] font-black text-white uppercase tracking-widest">Automation</div>
               <p className="text-xs text-[#8b949e] leading-relaxed italic">Reduces the friction of "Instruction Drift" by anchoring AI to your DNA baseline.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default DeveloperPersonaMirror;