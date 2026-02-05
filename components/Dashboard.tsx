import React, { useMemo } from 'react';
import { DashboardStats, AnalysisRule, UserProfile, Activity, PlanType, PlanConfig, SandboxInstance, DepartmentSector } from '../types';
import { RocketIcon, AlertIcon, GraphIcon, LockIcon, CpuIcon, ShieldIcon, UserIcon, BuildingIcon, TrendingUpIcon, ChevronRight, UserGroupIcon, GlobeIcon } from './Icons';
import { PLAN_CONFIGS } from '../constants';

interface Props {
  stats: DashboardStats;
  rules: AnalysisRule[];
  user: UserProfile;
  activities: Activity[];
  sandboxes: SandboxInstance[];
  onNavigate: (tab: any) => void;
  onUpgrade?: (plan: PlanType) => void;
  onDrillDown?: (path: string, line?: number) => void;
}

const Dashboard: React.FC<Props> = ({ stats, user, activities, sandboxes, onNavigate, onUpgrade }) => {
  const currentPlanConfig = useMemo(() => 
    PLAN_CONFIGS.find(p => p.type === user.membership.plan) || PLAN_CONFIGS[0]
  , [user.membership.plan]);

  const sectors: DepartmentSector[] = useMemo(() => [
    { id: 'sec-1', name: 'Accounts Core', integrityScore: 98, activeViolations: 0, leadArchitect: 'R. Rivera' },
    { id: 'sec-2', name: 'Payments Gateway', integrityScore: 94, activeViolations: 1, leadArchitect: 'M. Chen' },
    { id: 'sec-3', name: 'Shipping Edge', integrityScore: 82, activeViolations: 4, leadArchitect: 'D. Smith' },
  ], []);

  const personaColor = useMemo(() => {
     if (user.membership.plan === 'Enterprise') return 'text-[#d29922]';
     if (user.membership.plan === 'Pro' || user.membership.plan === 'Team') return 'text-[#3fb950]';
     return 'text-[#2f81f7]';
  }, [user.membership.plan]);

  return (
    <div className="flex-1 bg-[#020202] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-20 selection:bg-[#2f81f733] border-t border-white/5 relative">
      {/* HUD Watermark */}
      <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none">
        <BuildingIcon className="w-96 h-96" />
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase glow-text-blue">
               {user.membership.plan} Control
            </h1>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] ${personaColor} animate-pulse-sentinel`}>
               <ShieldIcon className="w-3 h-3" /> Squadron Protocol Active
            </div>
          </div>
          <p className="text-[#8b949e] font-medium italic text-lg">Multi-departmental architectural command for <span className="text-white font-bold">{user.organization?.name || 'Enterprise Engineering'}</span></p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#161b22]/80 px-8 py-5 rounded-[2rem] text-right flex flex-col border border-white/10 shadow-2xl glass-card">
              <span className="text-[9px] font-black text-[#8b949e] uppercase tracking-[0.3em] mb-1">Fleet RAG Capacity</span>
              <span className={`text-3xl font-black italic ${personaColor}`}>
                {currentPlanConfig.limits.credits - (stats.creditsUsed || 0)} <span className="text-xs opacity-50 uppercase not-italic">Credits</span>
              </span>
           </div>
           <button onClick={() => onUpgrade?.('Enterprise')} className="bg-white text-black px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10">ESCALE ORG UNITS</button>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {[
          { label: 'Global Knowledge RAG', val: `${stats.creditsUsed || 0} / ${currentPlanConfig.limits.credits}`, color: personaColor, icon: <RocketIcon />, tab: 'vault', desc: 'Enterprise wide index depth' },
          { label: 'Org-wide Integrity', val: '92%', color: 'text-[#3fb950]', icon: <GlobeIcon />, tab: 'dna', desc: 'Cross-department sync factor' },
          { label: 'Unchecked Breaches', val: `${stats.activeViolations || 0}`, color: (stats.activeViolations || 0) > 0 ? 'text-[#f85149]' : 'text-[#3fb950]', icon: <AlertIcon />, tab: 'audit', desc: 'Blocked PRs in fleet' },
          { label: 'Audit Provenance', val: '100%', color: 'text-[#2f81f7]', icon: <LockIcon />, tab: 'citadel', desc: 'ADR Compliance Score' }
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.tab as any)}
            className="p-10 rounded-[3rem] relative group overflow-hidden border border-white/5 bg-[#161b22]/30 text-left hover:border-[#2f81f766] transition-all hover:translate-y-[-4px] glass-card"
          >
             <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#2f81f722] to-transparent" />
             <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.2em] mb-6 flex items-center gap-3 group-hover:text-white transition-colors">
                <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
                {stat.label}
             </div>
             <div className={`text-3xl font-black italic tracking-tighter ${stat.color} mb-2`}>{stat.val}</div>
             <p className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest">{stat.desc}</p>
          </button>
        ))}
      </div>

      {/* Enterprise Sector HUD */}
      <div className="space-y-6 relative z-10">
         <div className="flex justify-between items-center px-4">
            <h3 className="text-[15px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
               <BuildingIcon className="w-5 h-5 text-[#2f81f7]" /> Sector Sovereignty HUD
            </h3>
            <span className="text-[10px] font-black text-[#484f58] uppercase italic">Monitoring independent codebases</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectors.map(sector => (
               <div key={sector.id} className="bg-[#0d1117] border border-[#30363d] p-8 rounded-[3.5rem] space-y-6 group hover:border-[#2f81f744] transition-all shadow-xl glass-card">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{sector.name}</h4>
                        <div className="text-[9px] font-bold text-[#484f58] uppercase">Lead: {sector.leadArchitect}</div>
                     </div>
                     <div className={`w-3 h-3 rounded-full animate-pulse ${sector.integrityScore > 90 ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-[#8b949e]">Integrity Baseline</span>
                        <span className={sector.integrityScore > 90 ? 'text-[#3fb950]' : 'text-[#f85149]'}>{sector.integrityScore}%</span>
                     </div>
                     <div className="h-1.5 bg-[#161b22] rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full rounded-full transition-all duration-[2000ms] ${sector.integrityScore > 90 ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} style={{ width: `${sector.integrityScore}%` }} />
                     </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-[#484f58] uppercase">Active Drift</span>
                        <span className="text-sm font-black text-white">{sector.activeViolations} Blockers</span>
                     </div>
                     <button onClick={() => onNavigate('citadel')} className="text-[9px] font-black text-[#2f81f7] uppercase hover:underline">Pivot to sector →</button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Dynamic Squad Intel Feed */}
        <div className="lg:col-span-2 space-y-10">
           <div className="rounded-[4rem] overflow-hidden flex flex-col h-[650px] border border-white/5 bg-[#0d1117] glass-card">
              <div className="px-10 py-8 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]/40">
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#3fb950] animate-pulse"></div>
                    <h3 className="text-[14px] font-black text-white uppercase tracking-[0.4em]">Org-wide Continuity Feed</h3>
                 </div>
                 <span className="text-[10px] font-black text-[#484f58] uppercase italic">Real-time cross-sector monitoring</span>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                 {activities.map(act => (
                   <div key={act.id} className="border border-white/5 bg-[#161b22]/20 hover:bg-[#1c2128]/40 p-8 rounded-[2.5rem] flex gap-8 transition-all hover:border-[#2f81f744] cursor-pointer group" onClick={() => onNavigate('explorer')}>
                      <div className="shrink-0 pt-1">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                            act.impact === 'positive' ? 'text-[#3fb950] border-[#3fb95022] bg-[#3fb9500a]' :
                            act.impact === 'negative' ? 'text-[#f85149] border-[#f8514922] bg-[#f851490a]' :
                            'text-[#2f81f7] border-[#2f81f722] bg-[#2f81f70a]'
                         }`}>
                            {act.impact === 'positive' ? <ShieldIcon /> : <UserIcon />}
                         </div>
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                               <span className="text-[14px] font-black text-white italic group-hover:text-[#2f81f7] transition-colors">{act.user}</span>
                               <span className="text-[9px] font-black text-[#484f58] uppercase tracking-widest">{act.timestamp}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#30363d] group-hover:text-white group-hover:translate-x-1 transition-all" />
                         </div>
                         <p className="text-lg text-[#c9d1d9] leading-tight font-medium italic tracking-tight uppercase">
                           "{act.action}"
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Fleet HUD */}
        <div className="space-y-10">
           <div className="rounded-[4rem] p-12 flex flex-col bg-[#0d1117] border border-white/5 glass-card relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-[3000ms]">
                 <UserGroupIcon className="w-64 h-64 text-[#3fb950]" />
              </div>
              <h3 className="text-[13px] font-black text-white uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                 <RocketIcon className="text-[#3fb950]" /> Collective Capacity
              </h3>
              <div className="space-y-14 flex-1 relative z-10">
                 {[
                   { label: 'Multi-Repo Sync Depth', used: 92, color: 'bg-[#3fb950]' },
                   { label: 'Constitution Adherence', used: 98, color: 'bg-[#2f81f7]' },
                   { label: 'Fleet Logic Burn', used: (stats.creditsUsed || 0) / currentPlanConfig.limits.credits * 100, color: 'bg-[#d29922]' }
                 ].map(quota => (
                   <div key={quota.label} className="space-y-5">
                      <div className="flex justify-between items-end">
                         <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest">{quota.label}</span>
                         <span className={`text-xl font-black italic ${quota.used > 80 ? 'text-[#f85149]' : 'text-white'}`}>{Math.round(quota.used)}%</span>
                      </div>
                      <div className="h-2.5 bg-[#161b22] rounded-full overflow-hidden border border-white/5 p-0.5">
                         <div className={`h-full rounded-full transition-all duration-[2000ms] ${quota.used > 90 ? 'bg-[#f85149]' : quota.color} shadow-[0_0_15px_rgba(63,185,80,0.3)]`} style={{ width: `${Math.min(100, quota.used)}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-16 p-8 bg-[#3fb9500a] border border-[#3fb95022] rounded-[3rem] space-y-4 shadow-inner relative overflow-hidden group/alert">
                 <div className="absolute top-0 left-0 w-1 h-full bg-[#3fb950] opacity-40" />
                 <div className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <ShieldIcon className="w-4 h-4 text-[#3fb950]" /> Institutional Verdict
                 </div>
                 <p className="text-[12px] text-[#8b949e] leading-relaxed italic font-medium">
                    "Cross-sector drift is **decreasing**. Shared patterns are currently 98% consistent across all enterprise logical fragments."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;