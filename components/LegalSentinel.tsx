/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { LegalAuditReport, CodeFile } from '../types';
import { ShieldIcon, LockIcon, AlertIcon, LinkIcon, RocketIcon, BuildingIcon, GlobeIcon, CheckCircleIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const LegalSentinel: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<LegalAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunLegalAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await gemini.performLegalAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#020202] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#d2992233]">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#30363d] pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-[#d2992211] text-[#d29922] px-4 py-1 rounded-full border border-[#d2992233] text-[10px] font-black uppercase tracking-[0.3em]">Jurisprudence Engine</div>
             <div className="bg-[#050505] text-[#8b949e] px-4 py-1 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-[0.3em]">IP Watch Active</div>
          </div>
          <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Legal <span className="text-[#d29922]">Sentinel</span></h2>
          <p className="text-[#8b949e] max-w-3xl font-medium mt-6 italic text-lg leading-relaxed">Automated IP Pedigree Scrutiny. Ensuring institutional immunity from license contamination and regional regulatory breaches (GDPR/SOC2).</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleRunLegalAudit}
            className="bg-[#d29922] text-black px-12 py-5 rounded-[40px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#d2992233]"
          >
            SCRUTINIZE JURISPRUDENCE
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-700">
          {/* Institutional Compliance Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group glass-card shadow-2xl">
               <div className="absolute top-0 right-0 w-1 h-full bg-[#3fb95011]" />
               <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] flex items-center gap-3"><BuildingIcon className="text-[#3fb950]" /> IP Health Score</div>
               <div className="text-6xl font-black italic text-[#3fb950] tracking-tighter">{report.ipHealthScore}%</div>
               <div className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest">Verified License Provenance</div>
            </div>
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group glass-card shadow-2xl">
               <div className="absolute top-0 right-0 w-1 h-full bg-[#2f81f711]" />
               <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] flex items-center gap-3"><ShieldIcon className="text-[#2f81f7]" /> Regulatory Confidence</div>
               <div className="text-6xl font-black italic text-[#2f81f7] tracking-tighter">{report.regulatoryComplianceScore}%</div>
               <div className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest">GDPR / HIPAA Logic Check</div>
            </div>
            <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group glass-card shadow-2xl">
               <div className="absolute top-0 right-0 w-1 h-full bg-[#f8514911]" />
               <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em] flex items-center gap-3"><AlertIcon className="text-[#f85149]" /> IP Contaminations</div>
               <div className={`text-6xl font-black italic tracking-tighter ${report.contaminationIncidents.length > 0 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                  {report.contaminationIncidents.length}
               </div>
               <div className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest">GPL Similarity Incidents</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             {/* IP Pedigree Scrutiny */}
             <div className="space-y-8">
                <h3 className="text-[14px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 px-4"><LinkIcon className="w-5 h-5 text-[#d29922]" /> IP Pedigree Scrutiny</h3>
                <div className="space-y-4">
                   {report.contaminationIncidents.length === 0 ? (
                      <div className="p-20 border-2 border-dashed border-[#30363d] rounded-[50px] text-center opacity-30">
                         <CheckCircleIcon className="w-16 h-16 mx-auto mb-6 text-[#3fb950]" />
                         <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#484f58]">Institution is license-clean.</p>
                      </div>
                   ) : report.contaminationIncidents.map((incident, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#f8514933] p-10 rounded-[45px] hover:border-[#f8514966] transition-all group relative overflow-hidden shadow-2xl shadow-[#f8514905]">
                         <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                               <div className="text-[11px] font-black text-[#f85149] uppercase tracking-widest bg-[#f8514911] px-3 py-1 rounded-full border border-[#f8514922] inline-block mb-3">IP Leak: {incident.pedigree.matchedLicense}</div>
                               <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">External Pattern Infiltrated</h4>
                               <div className="text-[10px] text-[#484f58] font-bold uppercase mt-2">{incident.file} • Line {incident.line}</div>
                            </div>
                            <div className="bg-[#050505] border border-[#f8514933] text-[#f85149] px-6 py-3 rounded-3xl text-xl font-black italic tracking-tighter">
                               {incident.pedigree.similarityScore}%
                            </div>
                         </div>
                         <p className="text-[15px] text-[#c9d1d9] leading-relaxed mb-10 font-medium italic">"Logic block matches restricted source found in <strong>{incident.pedigree.matchedSource}</strong>. Deploying this code creates a high-stakes licensing liability."</p>
                         <div className="flex gap-4">
                            <button className="flex-1 bg-[#f85149] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f8514933]">INITIALIZE CLEAN-ROOM REWRITE</button>
                            <button className="px-8 bg-white/5 text-[#8b949e] py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all border border-white/5">DISMISS (LOGGED)</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Regulatory Hub */}
             <div className="space-y-12">
                <div className="space-y-8">
                   <h3 className="text-[14px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 px-4"><GlobeIcon className="w-5 h-5 text-[#2f81f7]" /> Regulatory Compliance Map</h3>
                   <div className="grid grid-cols-1 gap-6">
                      {report.piiDataFlows.map((flow, i) => (
                         <div key={i} className="bg-[#0d1117] border border-[#30363d] p-8 rounded-[40px] space-y-6 shadow-xl hover:border-[#2f81f744] transition-all group">
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 rounded-2xl bg-[#2f81f711] text-[#2f81f7] flex items-center justify-center border border-[#2f81f733] shadow-inner group-hover:scale-110 transition-transform">
                                     <LockIcon className="w-6 h-6" />
                                  </div>
                                  <div>
                                     <div className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">{flow.entity}</div>
                                     <div className="text-[9px] text-[#484f58] font-bold uppercase tracking-widest">Global PII Identification</div>
                                  </div>
                               </div>
                               <span className="text-[10px] font-black text-[#3fb950] uppercase bg-[#3fb95011] px-5 py-2 rounded-full border border-[#3fb95033] shadow-inner">Protocol: {flow.encryptionLevel}</span>
                            </div>
                            <div className="flex items-center gap-6 bg-[#050505] p-6 rounded-3xl border border-white/5">
                               <span className="text-[11px] font-mono font-bold text-[#8b949e] uppercase">{flow.source}</span>
                               <div className="flex-1 h-0.5 bg-[#30363d] relative">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-2 text-[#2f81f7]"><RocketIcon className="w-4 h-4" /></div>
                               </div>
                               <span className="text-[11px] font-mono font-bold text-[#58a6ff] uppercase">{flow.sinks.join(' / ')}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] p-12 rounded-[60px] border border-white/5 space-y-8 relative overflow-hidden group shadow-2xl glass-card">
                   <div className="absolute top-0 right-0 p-12 opacity-5 text-[#3fb950] group-hover:rotate-12 transition-transform duration-1000"><ShieldIcon className="w-40 h-40" /></div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter underline decoration-[#d29922] decoration-8 underline-offset-[16px]">Audit Integrity Ledger</h3>
                   <p className="text-lg text-[#8b949e] leading-relaxed italic font-medium">
                     "Every institutional sign-off on license risks is **cryptographically signed** and immutable. ArchLens provides the 'Chain of Rationale' required for IPO-grade technical audits."
                   </p>
                   <div className="flex items-center gap-6 p-6 bg-[#3fb9500a] border border-[#3fb95022] rounded-[2.5rem] shadow-inner">
                      <div className="w-3 h-3 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_15px_#3fb950]"></div>
                      <span className="text-[12px] font-black text-[#3fb950] uppercase tracking-[0.4em]">Witness Signature: VERIFIED</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : isAuditing ? (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-10">
           <div className="relative">
              <div className="w-24 h-24 border-[10px] border-[#d29922]/10 border-t-[#d29922] rounded-full animate-spin shadow-[0_0_60px_#d2992211]" />
              <div className="absolute inset-0 flex items-center justify-center text-[#d29922] animate-pulse"><BuildingIcon className="w-8 h-8" /></div>
           </div>
           <div className="text-center space-y-3">
              <p className="text-[18px] font-black text-white uppercase tracking-[0.8em] animate-pulse">Hashing Jurisprudence Data...</p>
              <p className="text-[11px] text-[#484f58] uppercase font-black tracking-[0.4em]">Verifying institutional logic against 450,000 legal mandates</p>
           </div>
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-10 opacity-30 group hover:opacity-100 transition-opacity duration-1000">
           <div className="scale-[6] text-[#30363d] group-hover:text-[#d29922] transition-colors duration-700"><BuildingIcon /></div>
           <p className="text-[12px] font-black uppercase tracking-[0.6em] text-[#484f58]">Initialize Legal Audit to anchor IP baseline.</p>
        </div>
      )}
    </div>
  );
};

export default LegalSentinel;