/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { DataSchema } from '../types';
import { LockIcon, ShieldIcon, AlertIcon, RocketIcon } from './Icons';

const MOCK_SCHEMAS: DataSchema[] = [
  { entity: 'User', property: 'createdAt', format: 'ISO-8601', sourceFile: 'src/services/AuthService.ts', isMandatory: true },
  { entity: 'Order', property: 'amount', format: 'Minor Units (Integer)', sourceFile: 'src/services/BillingService.ts', isMandatory: true },
  { entity: 'System', property: 'timestamp', format: 'Unix (ms)', sourceFile: 'src/utils/Logger.ts', isMandatory: false }
];

const DataSentinelView: React.FC = () => {
  const [schemas] = useState<DataSchema[]>(MOCK_SCHEMAS);

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Data <span className="text-[#2f81f7]">Sentinel</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Enforcing global data consistency. No more Unix vs. ISO-8601 corruption.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.3em] flex items-center gap-2"><LockIcon /> Active Schema Mandates</h3>
            <div className="grid grid-cols-1 gap-4">
               {schemas.map((s, i) => (
                  <div key={i} className="bg-[#161b22] border border-[#30363d] p-6 rounded-[30px] flex items-center justify-between group hover:border-[#2f81f744] transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-2xl bg-[#2f81f711] text-[#2f81f7] flex items-center justify-center border border-[#2f81f733]">
                           <ShieldIcon />
                        </div>
                        <div>
                           <div className="text-sm font-black text-white uppercase italic">{s.entity}.{s.property}</div>
                           <div className="text-[9px] text-[#8b949e] font-bold uppercase tracking-widest">Format: {s.format} • Defined in {s.sourceFile}</div>
                        </div>
                     </div>
                     {s.isMandatory && (
                        <span className="text-[8px] font-black bg-[#2f81f722] text-[#2f81f7] px-3 py-1 rounded-full uppercase border border-[#2f81f733]">Strict Enforcement</span>
                     )}
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#2f81f7] decoration-4 underline-offset-8">Conflict Alert</h3>
               <div className="p-6 bg-[#f851490a] border border-[#f8514922] rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-[#f85149]">
                     <AlertIcon />
                     <span className="text-[10px] font-black uppercase tracking-widest">Format Mismatch</span>
                  </div>
                  <p className="text-xs text-[#c9d1d9] leading-relaxed italic">
                     "Proposed change in `StatsView.tsx` uses **Unix Timestamp** for `User.createdAt`, but global mandate requires **ISO-8601**."
                  </p>
                  <button className="w-full py-3 bg-[#f85149] text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all">RESOLVE FORMAT CONFLICT</button>
               </div>
            </div>
            
            <div className="p-8 bg-[#2f81f705] border border-[#2f81f722] rounded-[40px] space-y-4">
               <div className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><RocketIcon /> RAG Context Injector</div>
               <p className="text-[11px] text-[#8b949e] leading-relaxed italic">
                  * All data mandates are automatically injected into the AI's generation prompt, ensuring new modules respect your established modeling patterns.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DataSentinelView;