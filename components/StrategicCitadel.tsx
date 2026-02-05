/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { StrategicOversightReport, DestructionSentinelReport, ContextConfidenceReport, CodeFile, FederatedAuditReport } from '../types';
import { ShieldIcon, AlertIcon, RocketIcon, GraphIcon, LockIcon, BuildingIcon, CpuIcon, TerminalIcon, UserGroupIcon, GlobeIcon, LinkIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const StrategicCitadel: React.FC<Props> = ({ codebase }) => {
  const [oversight, setOversight] = useState<StrategicOversightReport | null>(null);
  const [destruction, setDestruction] = useState<DestructionSentinelReport | null>(null);
  const [confidence, setConfidence] = useState<ContextConfidenceReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeSector, setActiveSector] = useState<'Global' | 'Deployment Perimeter' | 'Federated Mesh' | 'Accounts' | 'Payments' | 'Shipping'>('Global');

  const handleRunStrategicAudit = async () => {
    setIsAuditing(true);
    try {
      const results = await Promise.all([
        gemini.performStrategicOversight(codebase),
        gemini.performDestructionAudit(codebase),
        gemini.performContextConfidenceAudit(codebase),
        gemini.performFederatedMeshAudit(codebase)
      ]);
      setOversight({
        ...results[0],
        departmentalDrift: [
          { departmentId: 'Accounts', driftFactor: 2, status: 'nominal' },
          { departmentId: 'Payments', driftFactor: 8, status: 'divergent' },
          { departmentId: 'Shipping', driftFactor: 18, status: 'critical' }
        ],
        federatedMesh: {
          ...results[3],
          deploymentPerimeter: {
            overallRiskScore: 12,
            unscopedEnvironmentVariables: [
              { team: 'Shipping', key: 'S3_ACCESS_KEY', file: 'infra/terraform/shipping.tf' }
            ],
            scalingPolicyDrift: [
              { service: 'Payments Core', driftFactor: 22, recommendation: 'Adjust scale-down cooldown to 300s to avoid flapping.' }
            ],
            lastBlastRadiusCheck: new Date().toISOString()
          }
        }
      });
      setDestruction(results[1]);
      setConfidence(results[2]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#2f81f733]">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Strategic <span className="text-[#2f81f7]">Citadel</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">The Federated Overseer Protocol. Monitoring microservice contracts and decentralized logic sovereignty.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#161b22] p-1.5 rounded-2xl border border-[#30363d] flex flex-wrap gap-1">
              {(['Global', 'Deployment Perimeter', 'Federated Mesh', 'Accounts', 'Payments', 'Shipping'] as const).map(sector => (
                 <button 
                   key={sector}
                   onClick={() => setActiveSector(sector)}
                   className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeSector === sector ? 'bg-[#2f81f7] text-white shadow-lg shadow-[#2f81f733]' : 'text-[#484f58] hover:text-white'
                   }`}
                 >
                   {sector}
                 </button>
              ))}
           </div>
           {!oversight && !isAuditing && (
             <button 
               onClick={handleRunStrategicAudit}
               className="bg-[#2f81f7] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2f81f733]"
             >
               AUDIT FLEET TOPOLOGY
             </button>
           )}
        </div>
      </header>

      {oversight && destruction && confidence ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
          {/* Top Level Oversight Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#3fb95033] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><UserGroupIcon className="w-3 h-3" /> Mesh Integrity</div>
               <div className="text-5xl font-black italic text-[#3fb950]">{oversight.federatedMesh?.overallMeshIntegrity || 0}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Contractual Adherence</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#f8514933] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><AlertIcon className="w-3 h-3" /> Breaking Risks</div>
               <div className="text-5xl font-black italic text-[#f85149]">{oversight.federatedMesh?.breakingChangeRisk || 0}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Cross-Service Impact factor</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#2f81f733] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LinkIcon className="w-3 h-3" /> API Contracts</div>
               <div className="text-5xl font-black italic text-[#2f81f7]">{oversight.federatedMesh?.activeContracts.length || 0}</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Sovereign Entry points</div>
            </div>
             <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#d2992233] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GlobeIcon className="w-3 h-3" /> Deployment Risk</div>
               <div className="text-5xl font-black italic text-[#d29922]">{oversight.federatedMesh?.deploymentPerimeter?.overallRiskScore || 0}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Blast Radius metric</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Federated Contract Monitoring / Deployment Scrutiny */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                   {activeSector === 'Deployment Perimeter' ? <RocketIcon className="w-4 h-4 text-[#3fb950]" /> : <CpuIcon className="w-4 h-4 text-[#2f81f7]" />}
                   {activeSector === 'Deployment Perimeter' ? 'Sovereign Deployment Audit' : 'Sovereign API Scrutiny'}
                </h3>
                <div className="space-y-4">
                   {activeSector === 'Deployment Perimeter' ? (
                      oversight.federatedMesh?.deploymentPerimeter?.scalingPolicyDrift.map((drift, i) => (
                        <div key={i} className="bg-[#161b22] border border-[#d2992233] p-8 rounded-[35px] transition-all group relative overflow-hidden shadow-2xl">
                           <div className="absolute top-0 right-0 px-6 py-2 bg-[#d2992211] text-[#d29922] text-[9px] font-black uppercase tracking-widest border-l border-b border-white/5">Infrastructure Drift</div>
                           <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                 <div className="text-[10px] font-black text-[#d29922] uppercase tracking-widest">Service: {drift.service}</div>
                                 <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Scaling Invariant Violation</h4>
                              </div>
                              <div className="bg-[#050505] p-3 rounded-2xl border border-white/5 text-xl font-black italic text-[#d29922]">{drift.driftFactor}%</div>
                           </div>
                           <p className="text-sm text-[#8b949e] leading-relaxed italic mb-8">"{drift.recommendation}"</p>
                           <button className="w-full py-4 bg-[#d29922] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#d2992222]">ALIGN SCALING POLICY</button>
                        </div>
                      ))
                   ) : (
                      oversight.federatedMesh?.activeContracts.map((contract, i) => (
                        <div key={i} className={`bg-[#161b22] border p-8 rounded-[35px] transition-all group relative overflow-hidden ${
                           contract.status === 'breaking' ? 'border-[#f8514966]' : contract.status === 'deprecated' ? 'border-[#d2992266]' : 'border-[#30363d]'
                        }`}>
                           <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                 <div className={`text-[10px] font-black uppercase tracking-widest ${
                                    contract.status === 'breaking' ? 'text-[#f85149]' : contract.status === 'stable' ? 'text-[#3fb950]' : 'text-[#d29922]'
                                 }`}>Service: {contract.serviceId} • {contract.status.toUpperCase()}</div>
                                 <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{contract.method} {contract.endpoint}</h4>
                              </div>
                              <div className="text-right">
                                 <div className="text-[9px] font-black text-[#8b949e] uppercase">Compliance</div>
                                 <div className={`text-2xl font-black italic ${
                                    contract.complianceScore > 90 ? 'text-[#3fb950]' : 'text-[#f85149]'
                                 }`}>{contract.complianceScore}%</div>
                              </div>
                           </div>
                           <p className="text-xs text-[#8b949e] leading-relaxed italic mb-8">
                              {contract.status === 'breaking' ? `Critical: ${contract.driftReason}` : 
                              contract.status === 'deprecated' ? '"Endpoint scheduled for removal in v4. RAG suggests migrating to /v3/core."' : 
                              '"Endpoint strictly adheres to organizational OpenTelemetry and Security mandates."'}
                           </p>
                           <div className="flex gap-3">
                              <button className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                 contract.status === 'breaking' ? 'bg-[#f85149] text-white shadow-xl shadow-[#f8514933]' : 'bg-white/5 text-[#8b949e] border border-white/5 hover:text-white'
                              }`}>
                                 {contract.status === 'breaking' ? 'EXECUTE EMERGENCY CONTRACT FIX' : 'VIEW CONSUMER GRAPH'}
                              </button>
                           </div>
                        </div>
                      ))
                   )}
                </div>
             </div>

             {/* Mesh Risks & Shadow APIs / Unscoped Env Vars */}
             <div className="space-y-10">
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><LockIcon className="w-4 h-4 text-[#f85149]" /> Boundary Violations</h3>
                   <div className="bg-[#161b22] border border-[#f8514933] p-10 rounded-[50px] relative overflow-hidden group shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-[#f85149] rotate-12"><AlertIcon className="w-32 h-32" /></div>
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4 underline decoration-[#f85149] decoration-4 underline-offset-8">Sovereign Breach Intercepted</h4>
                      <p className="text-sm text-[#8b949e] leading-relaxed italic font-medium mb-8">
                        {activeSector === 'Deployment Perimeter' 
                          ? '"A deployment for the **Shipping** team attempted to use a global S3 access key instead of its scoped team IAM role. Deployment neutralized."'
                          : '"The **Payments** service logic contains 3 endpoints not registered in the organization\'s Unified Gateway specification. Access blocked to prevent architectural fragmentation."'
                        }
                      </p>
                      <div className="bg-[#050505] p-6 rounded-3xl border border-[#f8514922] space-y-4 shadow-inner">
                         {activeSector === 'Deployment Perimeter' ? (
                            oversight.federatedMesh?.deploymentPerimeter?.unscopedEnvironmentVariables.map((v, i) => (
                               <div key={i} className="flex items-center justify-between text-[11px] font-mono text-[#f85149]">
                                  <span>$ {v.key}</span>
                                  <span className="text-[9px] font-black uppercase text-[#484f58]">{v.team} SCOPE MISSING</span>
                               </div>
                            ))
                         ) : (
                            oversight.federatedMesh?.unprotectedEndpoints.map((ep, i) => (
                               <div key={i} className="flex items-center justify-between text-[11px] font-mono text-[#f85149]">
                                  <span>$ {ep}</span>
                                  <span className="text-[9px] font-black uppercase text-[#484f58]">UNREGISTERED</span>
                               </div>
                            ))
                         )}
                      </div>
                   </div>
                </div>

                <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden group shadow-2xl">
                   <div className="absolute top-0 right-0 p-8 opacity-5 text-[#3fb950] group-hover:scale-110 transition-transform duration-1000"><GlobeIcon className="w-32 h-32" /></div>
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#3fb950] decoration-4 underline-offset-8">Infrastructure RAG Sync</h3>
                   <p className="text-sm text-[#8b949e] leading-relaxed italic font-medium">
                     ArchLens has correlated your Terraform state with Application logic. We identified that the **Payments** service IAM role has 14% privilege overhang based on real logic traversal.
                   </p>
                   <div className="flex items-center gap-4 p-5 bg-[#3fb9500a] border border-[#3fb95022] rounded-3xl shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
                      <span className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest">Platform Sync: SECURE</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : isAuditing ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#2f81f7] uppercase tracking-[0.4em] animate-pulse">Scanning Mesh Topology...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Verifying cross-service contracts and distributed invariants</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40 group hover:opacity-80 transition-opacity">
           <div className="scale-[5] text-[#30363d] group-hover:text-[#2f81f7] transition-colors duration-500"><BuildingIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize Citadel to provision Federated Gateway oversight.</p>
        </div>
      )}
    </div>
  );
};

export default StrategicCitadel;