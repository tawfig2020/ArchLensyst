/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { UserProfile, PlanType, PlanConfig } from '../types';
import { LockIcon, RocketIcon, ShieldIcon, BuildingIcon } from './Icons';
import { PLAN_CONFIGS } from '../constants';
import PayPalPayment from './PayPalPayment';

interface UpgradeModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onUpgradeSuccess: (target: PlanType, paymentDetails: any) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, user, onClose, onUpgradeSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanConfig | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0d1117] border border-[#30363d] w-full max-w-5xl rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-300 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="p-10 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]/50">
          <div>
            <h2 className="text-3xl font-black tracking-tighter italic uppercase text-white">Provision Strategic Credits</h2>
            <p className="text-[#8b949e] text-sm italic font-medium">ArchLens Citadel: Access high-fidelity RAG and pre-commit defense.</p>
          </div>
          <button onClick={() => { setSelectedPlan(null); onClose(); }} className="text-[#484f58] hover:text-white font-black text-2xl transition-colors">×</button>
        </div>
        
        <div className="p-12">
          {!selectedPlan ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLAN_CONFIGS.map(config => (
                <div 
                  key={config.type} 
                  className={`p-10 rounded-[3rem] border flex flex-col transition-all relative group overflow-hidden ${
                    user.membership.plan === config.type 
                      ? 'bg-[#2f81f711] border-[#2f81f7] scale-105' 
                      : 'bg-[#050505] border-[#30363d] hover:border-[#484f58]'
                  }`}
                >
                  <div className="text-[#2f81f7] mb-6">
                    {config.type === 'Free' && <LockIcon className="w-8 h-8" />}
                    {config.type === 'Pro' && <RocketIcon className="w-8 h-8" />}
                    {config.type === 'Enterprise' && <BuildingIcon className="w-8 h-8" />}
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">{config.type}</h3>
                  <div className="text-4xl font-black text-white mb-8 italic">
                    ${config.price}<span className="text-sm font-bold text-[#484f58] uppercase">/cycle</span>
                  </div>
                  <div className="flex-1 space-y-4 mb-12">
                    {config.features.map(f => (
                      <div key={f} className="flex items-center gap-3 text-[11px] text-[#8b949e] font-bold uppercase tracking-wider">
                        <ShieldIcon className="w-3 h-3 text-[#2f81f7]" /> {f}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => config.type !== 'Free' && setSelectedPlan(config)}
                    disabled={user.membership.plan === config.type}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      user.membership.plan === config.type 
                        ? 'bg-[#30363d] text-[#484f58] cursor-not-allowed' 
                        : 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl'
                    }`}
                  >
                    {user.membership.plan === config.type ? 'ACTIVE VAULT' : 'PROVISION'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-10 animate-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="text-[10px] font-black text-[#484f58] uppercase hover:text-[#2f81f7] mb-6"
                >
                  ← Select Different Tier
                </button>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Secure Checkout</h3>
                <p className="text-sm text-[#8b949e] font-medium italic">Upgrading to {selectedPlan.type} Edition</p>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-xs font-black text-[#8b949e] uppercase">Total Due</span>
                  <span className="text-2xl font-black text-white italic">${selectedPlan.price}.00</span>
                </div>
                <PayPalPayment 
                  plan={selectedPlan} 
                  onSuccess={(details) => onUpgradeSuccess(selectedPlan.type, details)}
                  onError={(err) => console.error('Payment Error', err)}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="px-10 py-8 bg-[#050505] text-center border-t border-white/5">
            <p className="text-[9px] text-[#484f58] font-black uppercase tracking-[0.4em]">
                All logic credits are non-transferable • Transaction security: ARCH-SENTINEL-SSL-V3
            </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;