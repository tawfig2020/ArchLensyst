import React, { useMemo } from 'react';
import { DashboardStats, AnalysisRule, UserProfile, Activity, PlanType, SandboxInstance } from '../types';
import { RocketIcon, AlertIcon, LockIcon, ShieldIcon, GlobeIcon, ChevronRight } from './Icons';
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

const Dashboard: React.FC<Props> = ({ stats, user, activities, onNavigate, onUpgrade }) => {
  const currentPlanConfig = useMemo(() => 
    PLAN_CONFIGS.find(p => p.type === user.membership.plan) || PLAN_CONFIGS[0]
  , [user.membership.plan]);

  const creditsRemaining = currentPlanConfig.limits.credits - (stats.creditsUsed || 0);

  return (
    <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto pb-48">
      {/* Header - Match Image 4 exactly */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              ENTERPRISE CONTROL
            </h1>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-semibold border border-green-500/30 uppercase tracking-wider">
              ● SQUADRON PROTOCOL ACTIVE
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Multi-departmental architectural command for <span className="text-white font-medium">{user.organization?.name || 'Enterprise Engineering'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-center">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Fleet RAG Capacity</div>
            <div className="text-lg font-black text-cyan-400">{creditsRemaining} <span className="text-xs text-gray-500 font-normal">Credits</span></div>
          </div>
          <button onClick={() => onUpgrade?.('Enterprise')} className="bg-[#161b22] hover:bg-[#21262d] text-white px-4 py-2 rounded-lg text-xs font-semibold border border-[#30363d] transition-colors uppercase tracking-wider">
            ESCALE ORG UNITS
          </button>
        </div>
      </div>

      {/* Metrics Cards - Match Image 4 exactly */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-[#58a6ff]/50 transition-colors" onClick={() => onNavigate('vault')}>
          <div className="flex items-center gap-2 mb-2">
            <RocketIcon className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">GLOBAL KNOWLEDGE RAG</span>
          </div>
          <div className="text-xl font-black text-amber-400 mb-1">{stats.creditsUsed || 120} / {currentPlanConfig.limits.credits}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider">Enterprise wide index depth</div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-[#58a6ff]/50 transition-colors" onClick={() => onNavigate('dna')}>
          <div className="flex items-center gap-2 mb-2">
            <GlobeIcon className="w-4 h-4 text-green-400" />
            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">ORG-WIDE INTEGRITY</span>
          </div>
          <div className="text-xl font-black text-green-400 mb-1">92%</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider">Cross-department sync factor</div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-[#58a6ff]/50 transition-colors" onClick={() => onNavigate('audit')}>
          <div className="flex items-center gap-2 mb-2">
            <AlertIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">UNCHECKED BREACHES</span>
          </div>
          <div className="text-xl font-black text-yellow-400 mb-1">{stats.activeViolations || 0}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider">Blocked PRs in fleet</div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-[#58a6ff]/50 transition-colors" onClick={() => onNavigate('citadel')}>
          <div className="flex items-center gap-2 mb-2">
            <LockIcon className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">AUDIT PROVENANCE</span>
          </div>
          <div className="text-xl font-black text-purple-400 mb-1">100%</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider">ADR Compliance Score</div>
        </div>
      </div>

      {/* Activity Feed - Match Image 4 exactly */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#30363d] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">ORG-WIDE CONTINUITY FEED</h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {activities.slice(0, 3).map(act => (
            <div 
              key={act.id} 
              className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex items-center gap-4 hover:border-[#58a6ff]/50 transition-all cursor-pointer group"
              onClick={() => onNavigate('explorer')}
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-sm font-bold">{act.user.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">{act.user}</span>
                  <span className="text-[10px] text-gray-500">{act.timestamp}</span>
                </div>
                <p className="text-xs text-gray-400">"{act.action}"</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;