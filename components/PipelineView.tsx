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
    <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto pb-44">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">CONTINUITY <span className="text-[#3fb950]">GUARD</span></h2>
          <p className="text-gray-500 text-sm">GitOps Governance. Automatically enforcing architectural invariants on every PR.</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg text-right">
           <div className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Pipeline Health</div>
           <div className="text-lg font-black text-white">99.4% UPTIME</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            {/* Live Pipeline Steps */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                 <RocketIcon className="w-3 h-3" /> Active Deployment Stages
              </h3>
              <div className="space-y-2">
                {steps.map((step) => (
                  <div key={step.id} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between hover:border-[#58a6ff]/50 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                         step.status === 'success' ? 'bg-green-500/20 text-green-400' :
                         step.status === 'running' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
                         'bg-[#21262d] text-gray-600'
                       }`}>
                          {step.status === 'success' ? <ShieldIcon className="w-4 h-4" /> : <CpuIcon className="w-4 h-4" />}
                       </div>
                       <div>
                          <div className="text-xs font-bold text-white">{step.name}</div>
                          <div className="text-[10px] text-gray-500">Stage {step.id} • {step.status}</div>
                       </div>
                    </div>
                    {step.duration && <div className="text-[10px] font-mono text-gray-600">{step.duration}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Action Snippet */}
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                     <TerminalIcon className="w-3 h-3" /> GitHub Action Configuration
                  </h3>
                  <button 
                    onClick={handleCopyYaml}
                    className="text-[10px] font-semibold text-[#58a6ff] uppercase tracking-wider hover:underline"
                  >
                    COPY WORKFLOW YAML
                  </button>
               </div>
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 overflow-hidden">
                  <pre className="font-mono text-[10px] text-gray-400 leading-relaxed overflow-x-auto">
                     {GITHUB_ACTION_YAML}
                  </pre>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 space-y-4">
               <h3 className="text-sm font-bold text-white">Integration Guide</h3>
               
               <div className="space-y-4">
                  <div className="space-y-1">
                     <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                        <LinkIcon className="w-3 h-3" /> 1. Generate API Key
                     </div>
                     <p className="text-xs text-gray-400">Create a project-scoped key in the ArchLens dashboard.</p>
                  </div>
                  
                  <div className="space-y-1">
                     <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                        <LockIcon className="w-3 h-3" /> 2. Set GitHub Secret
                     </div>
                     <p className="text-xs text-gray-400">Add <code className="text-[#58a6ff]">ARCHLENS_API_KEY</code> to your repository secrets.</p>
                  </div>

                  <div className="space-y-1">
                     <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                        <RocketIcon className="w-3 h-3" /> 3. Deploy Workflow
                     </div>
                     <p className="text-xs text-gray-400">Commit the YAML to <code className="text-[#58a6ff]">.github/workflows/</code></p>
                  </div>
               </div>

               <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg space-y-1">
                  <div className="flex items-center gap-2 text-red-400">
                     <AlertIcon className="w-3 h-3" />
                     <span className="text-[10px] font-bold uppercase">Failure Threshold</span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                     Builds fail if any "Error" level invariant is violated.
                  </p>
               </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-2">
               <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2">
                  <ShieldIcon className="w-3 h-3" /> SOC2 Audit Proof
               </div>
               <p className="text-[10px] text-gray-500">
                  Pipeline logs are cryptographically signed and archived for audits.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PipelineView;