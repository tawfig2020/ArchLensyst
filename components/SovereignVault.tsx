/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SOVEREIGN-VAULT-UI
 */

import React from 'react';
import { UserProfile, BillingEvent } from '../types';
// Added missing RocketIcon import
import { ShieldIcon, LockIcon, CreditCardIcon, AlertIcon, TerminalIcon, CpuIcon, CheckCircleIcon, TrendingUpIcon, ChevronRight, RocketIcon } from './Icons';
import { membershipService } from '../services/membershipService';

interface Props {
  user: UserProfile;
  onUpgrade: () => void;
}

const SovereignVault: React.FC<Props> = ({ user, onUpgrade }) => {
  const daysLeft = membershipService.calculateDaysRemaining(user.membership.billingCycleEnd);
  const ledger = membershipService.getLedger();
  const tokenUsage = (user.membership.tokens.consumed / user.membership.tokens.total) * 100;

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#2f81f733]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Sovereign <span className="text-[#2f81f7]">Vault</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Cryptographic resource management. Vigilant monitoring of token leakage and session integrity.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${user.membership.status === 'Active' ? 'bg-[#3fb95011] border-[#3fb95033] text-[#3fb950]' : 'bg-[#f8514911] border-[#f8514933] text-[#f85149]'}`}>
              <ShieldIcon />
              <span className="text-[10px] font-black uppercase tracking-widest">{user.membership.status} PROTOCOL ACTIVE</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-12">
            {/* Token Allocation Monitor */}
            <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[50px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                  <TrendingUpIcon className="w-40 h-40" />
               </div>
               <div className="space-y-10 relative z-10">
                  <div className="flex justify-between items-start">
                     <div className="space-y-2">
                        <div className="text-[10px] font-black text-[#2f81f7] uppercase tracking-widest flex items-center gap-2">TOKEN ALLOCATION STATUS</div>
                        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">{user.membership.tokens.total - user.membership.tokens.consumed} Tokens Available</h3>
                     </div>
                     <div className="text-right">
                        <div className="text-[9px] font-black text-[#8b949e] uppercase tracking-widest mb-1">Renewal Confidence</div>
                        <div className="text-2xl font-black text-[#3fb950] italic">99.9%</div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between text-[11px] font-black text-[#8b949e] uppercase tracking-widest">
                        <span>Utilization Velocity</span>
                        <span className={tokenUsage > 80 ? 'text-[#f85149]' : 'text-white'}>{Math.round(tokenUsage)}%</span>
                     </div>
                     <div className="h-4 bg-[#0d1117] rounded-full overflow-hidden border border-white/5 p-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${tokenUsage > 90 ? 'bg-[#f85149]' : 'bg-[#2f81f7]'}`} 
                          style={{ width: `${Math.min(100, tokenUsage)}%` }} 
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                     <div>
                        <div className="text-[9px] font-black text-[#484f58] uppercase tracking-widest mb-1">Allocated Total</div>
                        <div className="text-xl font-black text-white italic">{user.membership.tokens.total.toLocaleString()}</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-[#484f58] uppercase tracking-widest mb-1">Current Burn</div>
                        <div className="text-xl font-black text-white italic">{user.membership.tokens.consumed.toLocaleString()}</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-[#484f58] uppercase tracking-widest mb-1">Expiration Depth</div>
                        <div className="text-xl font-black text-[#2f81f7] italic">{daysLeft} Days</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Identity Seal */}
            <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[50px] space-y-8">
               <div className="flex items-center gap-4 text-[#2f81f7] border-b border-white/5 pb-6">
                  <div className="p-3 bg-[#2f81f711] rounded-xl border border-[#2f81f722]">
                     <LockIcon />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Identity Anchor</h3>
               </div>
               <div className="space-y-6">
                  <div className="p-8 bg-[#0d1117] rounded-3xl border border-white/5 space-y-3 relative group">
                     <div className="text-[9px] font-black text-[#8b949e] uppercase tracking-[0.3em]">Immutable Logic Signature</div>
                     <code className="text-[11px] text-[#2f81f7] font-mono break-all leading-relaxed block">{user.membership.signature.logicHash}</code>
                     <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity"><CheckCircleIcon className="w-5 h-5 text-[#3fb950]" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-8 bg-[#0d1117] rounded-3xl border border-white/5 space-y-2">
                        <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Issued At</div>
                        <div className="text-lg font-black text-white italic">{new Date(user.membership.signature.issuedAt).toLocaleDateString()}</div>
                     </div>
                     <div className="p-8 bg-[#0d1117] rounded-3xl border border-white/5 space-y-2">
                        <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Global Expiry</div>
                        <div className="text-lg font-black text-[#f85149] italic">{new Date(user.membership.signature.expiresAt).toLocaleDateString()}</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Transaction Ledger */}
            <div className="space-y-8">
               <h3 className="text-[13px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                  <TerminalIcon className="text-[#2f81f7]" /> TRANSACTION LEDGER (SOC2)
               </h3>
               <div className="space-y-4">
                  {ledger.length > 0 ? ledger.map((event) => (
                    <div key={event.id} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[40px] flex items-center justify-between group hover:border-[#2f81f744] transition-all relative overflow-hidden">
                       <div className="absolute left-0 top-0 w-1 h-full bg-[#2f81f711] text-[#2f81f7]" />
                       <div className="flex items-center gap-8">
                          <div className="w-14 h-14 rounded-2xl bg-[#050505] flex items-center justify-center text-[#8b949e] border border-white/5 group-hover:text-[#2f81f7] transition-colors">
                             <CreditCardIcon className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="text-[9px] font-black text-[#2f81f7] uppercase tracking-widest mb-1">{event.type.replace('_', ' ')}</div>
                             <div className="text-lg font-black text-white italic tracking-tight uppercase leading-none mb-1">{event.description}</div>
                             <div className="text-[10px] text-[#484f58] font-bold uppercase tracking-widest">{new Date(event.timestamp).toLocaleString()}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-xl font-black italic tracking-tighter mb-1 ${event.credits < 0 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                             {event.credits > 0 ? '+' : ''}{event.credits} Tokens
                          </div>
                          <div className="text-[9px] font-mono text-[#484f58] uppercase font-bold">SHA-256: {event.ledgerSignature.slice(0, 16)}...</div>
                       </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center border-2 border-dashed border-[#30363d] rounded-[60px] opacity-40">
                       <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#484f58]">No transaction history detected in the vault.</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="space-y-10">
            <div className="glass-card p-10 rounded-[60px] bg-[#161b22]/50 border border-white/5 space-y-10 sticky top-10">
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter underline decoration-[#2f81f7] decoration-8 underline-offset-[12px]">Vault Status</h3>
               
               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.3em]">Tier Escalation</div>
                     <button 
                       onClick={onUpgrade}
                       className="w-full bg-[#2f81f7] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 shadow-2xl shadow-[#2f81f744] transition-all flex items-center justify-center gap-3"
                     >
                       INITIATE UPGRADE <RocketIcon />
                     </button>
                  </div>

                  <div className="p-8 bg-[#0d1117] rounded-[3rem] border border-white/5 space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest">Auto-Renewal</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${user.membership.autoRenew ? 'bg-[#3fb95011] border-[#3fb95033] text-[#3fb950]' : 'bg-[#f8514911] border-[#f8514933] text-[#f85149]'}`}>
                           {user.membership.autoRenew ? 'ARMED' : 'DISARMED'}
                        </span>
                     </div>
                     <p className="text-xs text-[#8b949e] italic leading-relaxed font-medium">
                        Automatic logic-signature renewal is set for **{new Date(user.membership.billingCycleEnd).toLocaleDateString()}**.
                     </p>
                  </div>
               </div>

               <div className="bg-[#f8514905] border border-[#f8514922] p-8 rounded-[3rem] space-y-4">
                  <div className="flex items-center gap-3 text-[#f85149]">
                     <AlertIcon className="w-5 h-5" />
                     <span className="text-[11px] font-black uppercase tracking-[0.2em]">Anti-Penetration Guard</span>
                  </div>
                  <p className="text-[11px] text-[#8b949e] italic leading-relaxed font-medium">
                     ArchLens employs a zero-trust gateway. Session verification occurs every 120s against your hardware-anchored identity seal. 
                  </p>
               </div>

               <div className="flex flex-col items-center gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Sentinel System Secure</span>
                  </div>
                  <p className="text-[9px] text-[#484f58] font-bold uppercase">VERSION: 2.5.0-STABLE</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SovereignVault;