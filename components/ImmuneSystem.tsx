/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { ImmuneReport, SignalDensityReport, ROIIntegrityReport, CodeFile } from '../types';
import { ShieldIcon, AlertIcon, RocketIcon, GraphIcon, LinkIcon, LockIcon, CpuIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const ImmuneSystem: React.FC<Props> = ({ codebase }) => {
  const [immune, setImmune] = useState<ImmuneReport | null>(null);
  const [signal, setSignal] = useState<SignalDensityReport | null>(null);
  const [roi, setRoi] = useState<ROIIntegrityReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunImmuneAudit = async () => {
    setIsAnalyzing(true);
    try {
      const results = await Promise.all([
        gemini.performImmuneAudit(codebase),
        gemini.performSignalAudit(codebase),
        gemini.performROIIntegrityAudit(codebase)
      ]);
      setImmune(results[0]);
      setSignal(results[1]);
      setRoi(results[2]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">The <span className="text-[#3fb950]">Immune</span> System</h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Suggestion-Level Security Fuzzing & PR Noise Control. Neutralizing the 45% AI vulnerability risk.</p>
        </div>
        {!immune && !isAnalyzing && (
          <button 
            onClick={handleRunImmuneAudit}
            className="bg-[#3fb950] text-black px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#3fb95033]"
          >
            INITIALIZE DEFENSE PROTOCOL
          </button>
        )}
      </header>

      {immune && signal && roi ? (
        <div className="space-y-12">
          {/* Main Defense Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><ShieldIcon /> Fuzzing Pass Rate</div>
               <div className="text-5xl font-black italic text-[#3fb950]">{immune.fuzzingPassRate}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Validation resilience level</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><AlertIcon /> PR Noise (Signal)</div>
               <div className="text-5xl font-black italic text-[#2f81f7]">{signal.aiIssueDensity}</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Human parity target: 6.4</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><RocketIcon /> Stability Score</div>
               <div className="text-5xl font-black italic text-[#d29922]">{roi.integrationStabilityScore}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">7-Day Code Survival Rate</div>
            </div>
             <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LockIcon /> Blocked Risks</div>
               <div className="text-5xl font-black italic text-white">{immune.vulnerabilitiesBlocked}</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Vulnerabilities neutralised</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Security Immunity Detail */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><ShieldIcon /> Suggesion-Level Fuzzing Log</h3>
                <div className="space-y-4">
                   {immune.unvalidatedInputs.map((v, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#f8514933] p-8 rounded-[35px] hover:border-[#f8514966] transition-all group relative overflow-hidden">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="text-[10px] font-black text-[#f85149] uppercase mb-1">{v.file} • Line {v.line}</div>
                               <h4 className="text-lg font-black text-white italic tracking-tight">Intercepted Vulnerability: {v.type}</h4>
                            </div>
                            <span className="bg-[#f8514911] text-[#f85149] px-3 py-1 rounded-full text-[8px] font-black uppercase border border-[#f8514922]">Blocked</span>
                         </div>
                         <p className="text-xs text-[#8b949e] leading-relaxed mb-6">"AI suggested a raw string concatenation for a database query. Immune System intercepted the suggestion and applied a prepared statement wrapper."</p>
                         <div className="bg-[#0d1117] p-4 rounded-xl border border-[#3fb95022] text-[10px] font-mono text-[#3fb950] whitespace-pre-wrap">
                            {v.fix}
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* PR Stability & ROI Section */}
             <div className="space-y-10">
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><GraphIcon /> Institutional Stability Heatmap</h3>
                   <div className="grid grid-cols-1 gap-4">
                      {roi.failureHotspots.map((hotspot, i) => (
                         <div key={i} className="bg-[#161b22] border border-[#30363d] p-6 rounded-[30px] flex items-center justify-between group hover:border-[#d2992244] transition-all">
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 rounded-2xl bg-[#d2992211] text-[#d29922] flex items-center justify-center border border-[#d2992233]">
                                  <AlertIcon />
                               </div>
                               <div>
                                  <div className="text-sm font-black text-white uppercase italic">{hotspot.module}</div>
                                  <div className="text-[9px] text-[#8b949e] font-bold uppercase tracking-widest">Stability Risk: {hotspot.reason}</div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] font-black text-[#f85149] uppercase">Instability Alert</div>
                               <span className="text-[8px] font-bold text-[#484f58] uppercase">90% Failure Probability</span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6">
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#2f81f7] decoration-4 underline-offset-8">PR Signal Compression</h3>
                   <p className="text-sm text-[#8b949e] leading-relaxed italic">
                     ArchLens has suppressed **{signal.noiseSuppressionEvents}** instances of AI logic-sprawl in your latest PR. Your review density is now at **{signal.aiIssueDensity}**, aligning with your senior human engineers.
                   </p>
                   <div className="flex items-center gap-4 p-4 bg-[#2f81f70a] border border-[#2f81f722] rounded-3xl">
                      <div className="w-2 h-2 rounded-full bg-[#2f81f7] animate-pulse"></div>
                      <span className="text-[10px] font-black text-[#2f81f7] uppercase tracking-widest">Signal-to-Noise: OPTIMIZED</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : isAnalyzing ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#3fb950]/30 border-t-[#3fb950] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#3fb950] uppercase tracking-[0.4em] animate-pulse">Fuzzing Suggesions...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Generating 1,000 edge-case inputs for AI logic blocks</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[4] text-[#30363d]"><ShieldIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize Immune System to protect your codebase.</p>
        </div>
      )}
    </div>
  );
};

export default ImmuneSystem;
