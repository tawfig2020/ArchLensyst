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
    <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto pb-44">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">PERSONA <span className="text-[#58a6ff]">MIRROR</span></h2>
        <p className="text-gray-500 text-sm">Your coding style is your signature. ArchLens indexes your historical logic to ensure the AI's RAG context feels like a natural extension of your best self.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-lg bg-[#58a6ff]/20 flex items-center justify-center text-[#58a6ff]">
                  <UserIcon className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-white">Logic Mirror Protocol</h3>
                  <p className="text-[10px] text-gray-500">DNA Sync Engine</p>
               </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
               When you use an AI IDE, it often suggests code that "works" but isn't "yours". DNA sync analyzes your past PRs to align the RAG with your naming conventions, safety level, and modular philosophy.
            </p>
            <button 
               onClick={onSync}
               disabled={isSyncing}
               className="w-full bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
               {isSyncing ? 'EXTRACTING DNA...' : persona?.syncStatus === 'synced' ? 'RE-SYNC DNA BASELINE' : 'INITIALIZE DNA SYNC'}
            </button>
         </div>

         <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
               <GraphIcon className="w-3 h-3" /> Active Persona Traits
            </h4>
            
            {persona?.syncStatus === 'synced' ? (
               <div className="space-y-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 space-y-4">
                     <div className="flex flex-wrap gap-2">
                        {persona.traits.map((trait, i) => (
                           <span key={i} className="px-3 py-1 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] text-[10px] font-semibold uppercase border border-[#58a6ff]/20">
                              {trait}
                           </span>
                        ))}
                     </div>
                     <div className="space-y-1">
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Architectural Philosophy</div>
                        <p className="text-sm text-gray-300 leading-relaxed">"{persona.philosophy}"</p>
                     </div>
                     <div className="space-y-2 pt-3 border-t border-[#30363d]">
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Preferred Patterns</div>
                        <div className="flex flex-wrap gap-3">
                           {persona.preferredPatterns.map((p, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                 <div className="w-1 h-1 rounded-full bg-[#58a6ff]"></div> {p}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="text-[10px] text-gray-600 text-center">
                     Last synchronized: {persona.lastSync}
                  </div>
               </div>
            ) : isSyncing ? (
               <div className="h-48 flex flex-col items-center justify-center bg-[#161b22] border border-dashed border-[#30363d] rounded-lg text-center space-y-4">
                  <div className="w-8 h-8 border-2 border-[#58a6ff]/30 border-t-[#58a6ff] rounded-full animate-spin"></div>
                  <p className="text-[10px] font-semibold text-[#58a6ff] uppercase tracking-wider">Consulting Strategic Index...</p>
               </div>
            ) : (
               <div className="h-48 flex flex-col items-center justify-center bg-[#161b22] border border-dashed border-[#30363d] rounded-lg text-center space-y-3">
                  <LockIcon className="w-6 h-6 text-gray-600" />
                  <p className="text-[10px] font-semibold text-gray-600 uppercase">DNA Baseline not yet established.</p>
               </div>
            )}
         </div>
      </div>

      <section className="mt-6 bg-[#161b22] border border-[#30363d] rounded-lg p-6">
         <h4 className="text-sm font-bold text-white mb-4">Persona Benefits</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
               <ShieldIcon className="w-5 h-5 text-green-400" />
               <div className="text-xs font-bold text-white uppercase">Consistency</div>
               <p className="text-xs text-gray-500 leading-relaxed">AI suggestions automatically adopt your specific error-handling and logging standards.</p>
            </div>
            <div className="space-y-2">
               <LinkIcon className="w-5 h-5 text-blue-400" />
               <div className="text-xs font-bold text-white uppercase">Confidence</div>
               <p className="text-xs text-gray-500 leading-relaxed">RAG results are filtered to match the "Best version" of your historical logic.</p>
            </div>
            <div className="space-y-2">
               <CpuIcon className="w-5 h-5 text-amber-400" />
               <div className="text-xs font-bold text-white uppercase">Automation</div>
               <p className="text-xs text-gray-500 leading-relaxed">Reduces the friction of "Instruction Drift" by anchoring AI to your DNA baseline.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default DeveloperPersonaMirror;