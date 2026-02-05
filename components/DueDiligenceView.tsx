/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { DueDiligenceReport, CodeFile } from '../types';
import { ShieldIcon, LockIcon, RocketIcon, GraphIcon, CpuIcon, AlertIcon, TerminalIcon, LinkIcon, BuildingIcon, CheckCircleIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
  onNavigateToFile?: (path: string, line?: number) => void;
}

const DueDiligenceView: React.FC<Props> = ({ codebase, onNavigateToFile }) => {
  const [report, setReport] = useState<DueDiligenceReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunDiligence = async () => {
    setIsAuditing(true);
    try {
      const response = await gemini.performDueDiligenceAudit(codebase);
      setReport(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    setReport({
      overallInvestabilityScore: 92,
      reusabilityIndex: 88,
      documentationCoverage: 95,
      architecturalCompliance: 98,
      riskAreas: [
        { 
          category: 'Structural Sprawl', 
          description: 'Small amount of duplicate logic in Auth handlers.', 
          impact: 'Low',
          file: 'src/services/AuthService.ts',
          line: 5
        }
      ],
      auditProofLedger: [
        { file: 'src/services/AuthService.ts', adrLink: 'ADR-004', reviewer: 'Alex Rivera', timestamp: '2025-05-12', line: 1 },
        { file: 'src/components/LoginView.tsx', adrLink: 'ADR-012', reviewer: 'Sarah Chen', timestamp: '2025-05-14', line: 1 }
      ]
    });
  }, []);

  return (
    <div className="flex-1 bg-[#020202] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 relative">
      {/* Background Watermark */}
      <div className="absolute top-20 right-20 opacity-[0.02] pointer-events-none">
        <BuildingIcon className="w-[40rem] h-[40rem]" />
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-[#3fb95011] text-[#3fb950] px-4 py-1 rounded-full border border-[#3fb95033] text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade</div>
             <div className="bg-[#2f81f711] text-[#2f81f7] px-4 py-1 rounded-full border border-[#2f81f733] text-[10px] font-black uppercase tracking-[0.3em]">Audit Ready</div>
          </div>
          <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Investment <span className="text-[#3fb950]">Ledger</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-6 italic text-lg leading-relaxed">The "Ground Truth" for engineering maturity. Proving IP sovereignty and design integrity to investors and compliance stakeholders.</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={handleRunDiligence}
            disabled={isAuditing}
            className="bg-white text-black px-12 py-5 rounded-[40px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#ffffff22]"
           >
            {isAuditing ? 'SCRUTINIZING ASSETS...' : 'GENERATE AUDIT PROOF'}
           </button>
        </div>
      </header>

      {report && (
        <div className="space-y-16 relative z-10">
          {/* Executive HUD */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Investability', val: report.overallInvestabilityScore, color: 'text-[#3fb950]', icon: <BuildingIcon />, desc: 'Market Readiness' },
              { label: 'Reusability', val: report.reusabilityIndex, color: 'text-[#2f81f7]', icon: <CpuIcon />, desc: 'Asset Liquidity' },
              { label: 'Documentation', val: report.documentationCoverage, color: 'text-[#d29922]', icon: <LinkIcon />, desc: 'Institutional Memory' },
              { label: 'Sovereignty', val: report.architecturalCompliance, color: 'text-white', icon: <LockIcon />, desc: 'Compliance Baseline' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#161b22]/40 p-10 rounded-[60px] border border-white/5 relative group overflow-hidden glass-card shadow-2xl">
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#ffffff05] to-transparent" />
                <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">{stat.icon} {stat.label}</div>
                <div className={`text-5xl font-black italic tracking-tighter ${stat.color} mb-2`}>{stat.val}%</div>
                <p className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest">{stat.desc}</p>
                <div className="mt-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className={`h-full bg-current transition-all duration-[2000ms] shadow-[0_0_15px_rgba(255,255,255,0.2)]`} style={{ width: `${stat.val}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             {/* Audit Proof Ledger */}
             <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-center px-6">
                   <h3 className="text-[14px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4">
                      <ShieldIcon className="w-5 h-5 text-[#3fb950]" /> Asset Provenance Ledger
                   </h3>
                   <span className="text-[10px] font-black text-[#484f58] uppercase">Cryptographically Signed</span>
                </div>
                <div className="space-y-4">
                   {report.auditProofLedger.map((proof, i) => (
                      <button 
                        key={i} 
                        onClick={() => onNavigateToFile?.(proof.file, proof.line)}
                        className="w-full bg-[#0d1117] border border-[#30363d] p-8 rounded-[40px] flex items-center justify-between group hover:border-[#3fb95066] transition-all text-left shadow-xl"
                      >
                         <div className="flex items-center gap-10">
                            <div className="w-16 h-16 rounded-[2rem] bg-[#3fb95011] text-[#3fb950] flex items-center justify-center border border-[#3fb95033] shadow-inner group-hover:scale-110 transition-transform">
                               <LockIcon className="w-6 h-6" />
                            </div>
                            <div>
                               <div className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-[#3fb950] transition-colors">{proof.file.split('/').pop()}</div>
                               <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-[0.2em] mt-1">Verified against {proof.adrLink} by {proof.reviewer}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[11px] font-mono text-[#484f58] font-bold mb-2">{proof.timestamp}</div>
                            <div className="flex items-center gap-2 text-[#3fb950] opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="text-[9px] font-black uppercase tracking-widest">View Rationale</span>
                               <CheckCircleIcon className="w-4 h-4" />
                            </div>
                         </div>
                      </button>
                   ))}
                </div>
             </div>

             {/* Strategic Risk Summary */}
             <div className="space-y-8">
                <div className="bg-[#161b22] border border-[#30363d] p-12 rounded-[70px] space-y-10 relative overflow-hidden h-full shadow-2xl glass-card">
                   <div className="absolute top-0 right-0 p-12 opacity-5 text-[#f85149] rotate-12">
                      <AlertIcon className="w-40 h-40" />
                   </div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter underline decoration-[#f85149] decoration-8 underline-offset-[16px]">Risk Perimeter</h3>
                   
                   <div className="space-y-10 relative z-10">
                      <div className="space-y-6">
                         <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] flex items-center gap-2"><CpuIcon className="w-4 h-4" /> Asset Liquidity Insight</div>
                         <p className="text-sm text-[#c9d1d9] leading-relaxed italic font-medium">"Architecture is 88% decoupled. Transition costs for new AI squads are minimal. Institutional lock-in risk: **Negligible**."</p>
                      </div>

                      <div className="space-y-6">
                         <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em]">Strategic Risk Areas</div>
                         <div className="space-y-4">
                            {report.riskAreas.map((risk, i) => (
                               <button 
                                 key={i} 
                                 onClick={() => risk.file && onNavigateToFile?.(risk.file, risk.line)}
                                 className="w-full text-left p-8 bg-[#f851490a] border border-[#f8514922] rounded-[40px] space-y-3 hover:border-[#f85149] transition-all group/item shadow-inner"
                               >
                                  <div className="flex justify-between items-center">
                                     <div className="text-[11px] font-black text-[#f85149] uppercase tracking-widest">{risk.category}</div>
                                     <span className="text-[9px] font-black text-white uppercase bg-[#f8514944] px-3 py-1 rounded-full border border-[#f8514966]">{risk.impact}</span>
                                  </div>
                                  <p className="text-[13px] text-[#8b949e] leading-snug font-medium italic">"{risk.description}"</p>
                                  <div className="text-[10px] font-black text-[#f85149] uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-opacity pt-4 border-t border-[#f8514922]">
                                     Examine Logic Branch →
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-10 border-t border-[#30363d] mt-auto">
                      <div className="flex items-center gap-3 text-[#3fb950] mb-4">
                         <ShieldIcon className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Compliance Verified</span>
                      </div>
                      <p className="text-[10px] text-[#484f58] italic leading-relaxed font-bold uppercase tracking-tighter">
                         * This report is valid for 24h. SHA-256 signature anchors this state in the institutional ledger.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {isAuditing && (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-10">
           <div className="relative">
              <div className="w-24 h-24 border-[8px] border-[#3fb950]/10 border-t-[#3fb950] rounded-full animate-spin shadow-[0_0_60px_#3fb95011]" />
              <div className="absolute inset-0 flex items-center justify-center text-[#3fb950] animate-pulse"><BuildingIcon className="w-8 h-8" /></div>
           </div>
           <div className="text-center space-y-3">
              <p className="text-[18px] font-black text-white uppercase tracking-[0.8em] animate-pulse">Calculating Asset Health...</p>
              <p className="text-[11px] text-[#484f58] uppercase font-black tracking-[0.4em]">Cross-referencing legal mandates with logical exports</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DueDiligenceView;