/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { PipelineStep } from '../types';
import { RocketIcon, ShieldIcon, AlertIcon, LockIcon, TerminalIcon, LinkIcon, CpuIcon } from './Icons';
import { GITHUB_ACTION_YAML } from '../constants';

interface Props {
  isActive?: boolean;
}

const PipelineView: React.FC<Props> = ({ isActive }) => {
  const steps: PipelineStep[] = [
    { id: '1', name: 'Memory Seed Initialization', status: 'success', duration: '12s' },
    { id: '2', name: 'Global Dependency Graph Sync', status: 'success', duration: '45s' },
    { id: '3', name: 'Architectural Invariant Audit', status: 'running', duration: '5s' },
    { id: '4', name: 'Blast Radius Validation', status: 'pending' },
    { id: '5', name: 'Phantom PR Generation', status: 'pending' }
  ];

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(GITHUB_ACTION_YAML);
    alert('Workflow YAML copied to clipboard!');
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Continuity <span className="text-[#3fb950]">Guard</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4">GitOps Governance. Automatically enforcing architectural invariants on every PR.</p>
        </div>
        <div className="bg-[#3fb95011] border border-[#3fb95033] px-8 py-4 rounded-[30px] flex flex-col items-end">
           <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest">Pipeline Health</div>
           <div className="text-2xl font-black text-white italic tracking-tighter">99.4% UPTIME</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            {/* Live Pipeline Steps */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                 <RocketIcon /> Active Deployment Stages
              </h3>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.id} className="bg-[#0d1117] border border-[#30363d] p-6 rounded-[30px] flex items-center justify-between group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                         step.status === 'success' ? 'bg-[#3fb95022] text-[#3fb950]' :
                         step.status === 'running' ? 'bg-[#2f81f722] text-[#2f81f7] animate-pulse' :
                         'bg-[#161b22] text-[#484f58]'
                       }`}>
                          {step.status === 'success' ? <ShieldIcon /> : <CpuIcon />}
                       </div>
                       <div>
                          <div className="text-sm font-black text-white uppercase italic tracking-tight">{step.name}</div>
                          <div className="text-[9px] font-bold text-[#8b949e] uppercase tracking-widest">Stage {step.id} • {step.status}</div>
                       </div>
                    </div>
                    {step.duration && <div className="text-[10px] font-mono text-[#484f58]">{step.duration}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Action Snippet */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                     <TerminalIcon /> GitHub Action Configuration
                  </h3>
                  <button 
                    onClick={handleCopyYaml}
                    className="text-[9px] font-black text-[#2f81f7] uppercase tracking-widest hover:underline"
                  >
                    COPY WORKFLOW YAML
                  </button>
               </div>
               <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 relative group overflow-hidden">
                  <pre className="font-mono text-[11px] text-[#8b949e] leading-relaxed custom-scrollbar overflow-x-auto">
                     {GITHUB_ACTION_YAML}
                  </pre>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="glass-card p-10 rounded-[50px] bg-[#161b22]/50 border-white/5 space-y-8">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#3fb950] decoration-4 underline-offset-8">Integration Guide</h3>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2">
                        <LinkIcon /> 1. Generate API Key
                     </div>
                     <p className="text-xs text-[#c9d1d9] leading-relaxed">Create a project-scoped key in the ArchLens dashboard to anchor the memory.</p>
                  </div>
                  
                  <div className="space-y-2">
                     <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2">
                        <LockIcon /> 2. Set GitHub Secret
                     </div>
                     <p className="text-xs text-[#c9d1d9] leading-relaxed">Add <code>ARCHLENS_API_KEY</code> to your repository secrets.</p>
                  </div>

                  <div className="space-y-2">
                     <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2">
                        <RocketIcon /> 3. Deploy Workflow
                     </div>
                     <p className="text-xs text-[#c9d1d9] leading-relaxed">Commit the YAML above to <code>.github/workflows/</code> to start automated guarding.</p>
                  </div>
               </div>

               <div className="bg-[#f851490a] border border-[#f8514922] p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-[#f85149]">
                     <AlertIcon />
                     <span className="text-[9px] font-black uppercase">Failure Threshold</span>
                  </div>
                  <p className="text-[10px] text-[#8b949e] italic leading-relaxed">
                     By default, builds will fail if any "Error" level architectural invariant is violated.
                  </p>
               </div>
            </div>

            <div className="p-8 bg-[#2f81f70a] border border-[#2f81f722] rounded-[40px] space-y-4">
               <div className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <ShieldIcon /> SOC2 Audit Proof
               </div>
               <p className="text-[11px] text-[#8b949e] leading-relaxed italic">
                  * Pipeline logs are cryptographically signed and archived for technical due diligence audits.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PipelineView;