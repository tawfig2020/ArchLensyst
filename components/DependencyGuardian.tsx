/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { DependencyAuditReport, CodeFile, RuntimeTarget } from '../types';
import { RocketIcon, ShieldIcon, AlertIcon, LinkIcon, GlobeIcon, CpuIcon, LockIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
  runtime: RuntimeTarget;
}

const DependencyGuardian: React.FC<Props> = ({ codebase, runtime }) => {
  const [report, setReport] = useState<DependencyAuditReport | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRunAudit = async () => {
    setIsVerifying(true);
    try {
      const result = await gemini.performDependencySupplyChainAudit(codebase, runtime);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Supply <span className="text-[#2f81f7]">Guardian</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Hallucination & Runtime Governance. Intercepting fake packages and outdated vulnerable versions.</p>
        </div>
        <button 
          onClick={handleRunAudit}
          disabled={isVerifying}
          className="bg-[#2f81f7] text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2f81f733]"
        >
          {isVerifying ? 'VERIFYING REGISTRIES...' : 'AUDIT SUPPLY CHAIN'}
        </button>
      </header>

      {report ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LockIcon /> Ghost Packages Detected</div>
               <div className="text-4xl font-black italic text-[#f85149]">{report.packages.filter(p => p.isHallucination).length}</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GlobeIcon /> Runtime Drift</div>
               <div className="text-4xl font-black italic text-[#d29922]">{report.packages.filter(p => !p.runtimeCompatible).length} Incompatible</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><CpuIcon /> Health Baseline</div>
               <div className="text-4xl font-black italic text-[#3fb950]">{Math.round(report.packages.reduce((acc, p) => acc + (p.healthScore || 0), 0) / (report.packages.length || 1))}%</div>
            </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><AlertIcon /> Inventory Scrutiny</h3>
             <div className="grid grid-cols-1 gap-6">
                {report.packages.map((pkg, i) => (
                   <div key={i} className={`bg-[#161b22] border p-8 rounded-[35px] transition-all group relative overflow-hidden ${
                      pkg.isHallucination ? 'border-[#f8514944]' : pkg.runtimeCompatible ? 'border-[#30363d]' : 'border-[#d2992244]'
                   }`}>
                      {pkg.isHallucination && (
                         <div className="absolute top-0 right-0 bg-[#f85149] text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest">
                            PHANTOM DETECTED
                         </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                               pkg.isHallucination ? 'bg-[#f8514911] text-[#f85149] border-[#f8514933]' : 'bg-[#2f81f711] text-[#2f81f7] border-[#2f81f733]'
                            }`}>
                               <LinkIcon />
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-white italic tracking-tighter">{pkg.name}@{pkg.version}</h4>
                               <div className="text-[9px] text-[#8b949e] font-bold uppercase tracking-widest flex items-center gap-2">
                                  {pkg.exists ? 'Verified in NPM Registry' : 'Not found in upstream'} • {pkg.vulnerabilities} Vulnerabilities
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[10px] font-black text-[#8b949e] uppercase">Runtime Check</div>
                            <div className={`text-sm font-black uppercase italic ${pkg.runtimeCompatible ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                               {pkg.runtimeCompatible ? 'COMPATIBLE' : 'TARGET MISMATCH'}
                            </div>
                         </div>
                      </div>

                      {!pkg.runtimeCompatible && (
                         <div className="p-6 bg-[#d299220a] border border-[#d2992222] rounded-[30px] flex justify-between items-center gap-6">
                            <div className="flex-1">
                               <div className="text-[10px] font-black text-[#d29922] uppercase tracking-widest flex items-center gap-2"><RocketIcon /> Compatibility Bridge</div>
                               <p className="text-sm text-[#c9d1d9] leading-relaxed italic mt-2">
                                  "{pkg.name}" uses native APIs incompatible with {runtime.replace('_', ' ')}. 
                                  {pkg.alternatives && pkg.alternatives.length > 0 && ` Try using: ${pkg.alternatives.join(', ')}`}
                               </p>
                            </div>
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
        </div>
      ) : isVerifying ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#2f81f7] uppercase tracking-[0.4em] animate-pulse">Hashing Remote Registries...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Verifying existence and scanning CVE databases</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[4] text-[#30363d]"><GlobeIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize supply chain audit to secure your stack.</p>
        </div>
      )}
    </div>
  );
};

export default DependencyGuardian;