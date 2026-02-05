/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React from 'react';
import { PhantomStatus, PhantomExecutionResult } from '../types';
import { RocketIcon, ShieldIcon, CpuIcon, LockIcon } from './Icons';

interface Props {
  status: PhantomStatus;
  result: PhantomExecutionResult | null;
}

const PhantomExecutionOverlay: React.FC<Props> = ({ status, result }) => {
  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-40 right-8 z-[150] w-80 animate-in slide-in-from-right-10 duration-500">
      <div className={`glass-card p-6 rounded-[32px] border shadow-2xl backdrop-blur-3xl flex flex-col gap-4 overflow-hidden relative ${
        status === 'success' ? 'bg-[#2386360a] border-[#23863633]' : 
        status === 'failed' ? 'bg-[#f851490a] border-[#f8514933]' : 
        'bg-[#161b22]/90 border-[#30363d]'
      }`}>
        {/* Animated Glow Border */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none ${
          status === 'success' ? 'shadow-[inset_0_0_40px_#238636]' : 
          status === 'failed' ? 'shadow-[inset_0_0_40px_#f85149]' : 
          'shadow-[inset_0_0_40px_#2f81f7]'
        }`} />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              status === 'success' ? 'bg-[#23863622] text-[#3fb950]' : 
              status === 'failed' ? 'bg-[#f8514922] text-[#f85149]' : 
              'bg-[#2f81f722] text-[#2f81f7]'
            }`}>
              {status === 'testing' ? <RocketIcon /> : <CpuIcon />}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Phantom Execution</div>
              <div className={`text-[11px] font-black uppercase italic ${
                status === 'success' ? 'text-[#3fb950]' : 
                status === 'failed' ? 'text-[#f85149]' : 
                'text-white'
              }`}>
                {status.replace('_', ' ')}...
              </div>
            </div>
          </div>
          {status !== 'success' && status !== 'failed' && (
            <div className="w-4 h-4 border-2 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
          )}
        </div>

        {/* Progress Logic */}
        <div className="space-y-3 pt-2 relative z-10">
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${['compiling', 'testing', 'checking_invariants', 'success', 'failed'].includes(status) ? 'bg-[#3fb950]' : 'bg-[#30363d]'}`} />
              <span className="text-[9px] font-bold text-[#c9d1d9] uppercase">Provisioning</span>
           </div>
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${['testing', 'checking_invariants', 'success', 'failed'].includes(status) ? 'bg-[#3fb950]' : status === 'compiling' ? 'bg-[#2f81f7] animate-pulse' : 'bg-[#30363d]'}`} />
              <span className="text-[9px] font-bold text-[#c9d1d9] uppercase">Compilation</span>
           </div>
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${['checking_invariants', 'success', 'failed'].includes(status) ? 'bg-[#3fb950]' : status === 'testing' ? 'bg-[#2f81f7] animate-pulse' : 'bg-[#30363d]'}`} />
              <span className="text-[9px] font-bold text-[#c9d1d9] uppercase">Unit Tests</span>
           </div>
        </div>

        {result && (status === 'success' || status === 'failed') && (
          <div className="mt-2 p-4 bg-[#0d1117]/80 rounded-2xl border border-white/5 space-y-3 animate-in fade-in zoom-in-95 duration-300 relative z-10">
             <div className="flex justify-between items-center text-[10px] font-black">
                <span className="text-[#8b949e] uppercase">Tests Summary</span>
                <span className={status === 'success' ? 'text-[#3fb950]' : 'text-[#f85149]'}>
                   {result.testResults.passed}/{result.testResults.total} PASSED
                </span>
             </div>
             
             <div className="flex gap-2 items-start">
                <div className={result.invariantChecks.passed ? 'text-[#3fb950]' : 'text-[#f85149]'}>
                   <LockIcon className="w-3 h-3" />
                </div>
                <div className="flex-1">
                   <div className="text-[9px] font-black text-white uppercase">Invariants Check</div>
                   <p className="text-[9px] text-[#8b949e] leading-tight">{result.invariantChecks.details}</p>
                </div>
             </div>

             {result.testResults.errors.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                   <div className="text-[8px] font-black text-[#f85149] uppercase mb-1">Failures</div>
                   {result.testResults.errors.slice(0, 1).map((err, i) => (
                      <p key={i} className="text-[9px] text-[#f85149] font-mono line-clamp-2 italic">
                         {err}
                      </p>
                   ))}
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhantomExecutionOverlay;