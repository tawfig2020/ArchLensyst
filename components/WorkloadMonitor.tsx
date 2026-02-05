import React from 'react';
import { SandboxInstance } from '../types';
import { ShieldIcon, GlobeIcon, CpuIcon, UserGroupIcon, RocketIcon } from './Icons';

interface Props {
  sandboxes: SandboxInstance[];
  throughput: number;
}

const WorkloadMonitor: React.FC<Props> = ({ sandboxes, throughput }) => {
  return (
    <div className="flex-1 bg-[#050505] flex flex-col overflow-hidden animate-in fade-in duration-500 pb-20 selection:bg-[#2f81f733]">
      <div className="p-8 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]/50">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic mb-1 uppercase leading-none">Infrastructure <span className="text-[#2f81f7]">Workloads</span></h2>
          <p className="text-[#8b949e] text-[10px] font-black uppercase tracking-[0.4em] mt-2">Global Sandbox Hub • Sovereign Platform Orchestration</p>
        </div>
        <div className="bg-[#1f6feb22] border border-[#1f6feb44] px-8 py-4 rounded-3xl flex items-center gap-6 shadow-2xl">
           <div className="text-right">
              <div className="text-[9px] font-black text-[#1f6feb] uppercase tracking-widest">Fleet Throughput</div>
              <div className="text-2xl font-black text-white italic tracking-tighter font-mono">{throughput.toLocaleString()} <span className="text-xs opacity-50 uppercase not-italic font-sans">Ops/s</span></div>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-[#1f6feb] flex items-center justify-center text-white shadow-xl shadow-[#1f6feb33] border border-white/10">
              <CpuIcon className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {sandboxes.length === 0 ? (
            <div className="col-span-full py-60 text-center border-2 border-dashed border-[#30363d] rounded-[4rem] opacity-30">
               <div className="text-[#484f58] uppercase font-black tracking-[0.6em] italic">No active compute instances detected in fleet.</div>
            </div>
          ) : sandboxes.map((s) => (
            <div key={s.id} className="bg-[#161b22]/40 border border-[#30363d] rounded-[4rem] p-10 flex flex-col hover:border-[#2f81f766] transition-all group glass-card relative overflow-hidden">
              {/* Ownership Badge */}
              <div className="absolute top-10 right-10 flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                 <UserGroupIcon className="w-3.5 h-3.5 text-[#2f81f7]" />
                 <span className="text-[9px] font-black text-[#8b949e] uppercase tracking-widest">{s.ownerTeam || 'CORE PLATFORM'}</span>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center ${
                  s.provider === 'AWS' ? 'bg-[#ff990011] text-[#ff9900]' : 
                  s.provider === 'GCP' ? 'bg-[#4285f411] text-[#4285f4]' : 
                  'bg-[#00a1f111] text-[#00a1f1]'
                } border border-current shadow-inner group-hover:scale-110 transition-transform`}>
                  <GlobeIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{s.workload}</div>
                  <div className="text-[10px] text-[#484f58] font-bold uppercase tracking-[0.2em]">{s.provider} • {s.region} • <span className="text-[#2f81f7]">{s.id}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                    <span>Compute Saturation</span>
                    <span className={s.computeLoad > 80 ? 'text-[#f85149]' : 'text-white'}>{s.computeLoad}%</span>
                  </div>
                  <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div className={`h-full rounded-full bg-gradient-to-r from-[#2f81f7] to-[#58a6ff] transition-all duration-1000 shadow-[0_0_10px_rgba(47,129,247,0.3)]`} style={{ width: `${s.computeLoad}%` }} />
                  </div>
                  <p className="text-[10px] text-[#484f58] italic leading-relaxed font-medium">Auto-scaling logic active for **{s.ownerTeam || 'System'}** perimeter.</p>
                </div>

                <div className="bg-[#050505] p-6 rounded-[2.5rem] border border-white/5 flex flex-col justify-center gap-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-[#8b949e] uppercase tracking-widest">Deployment Status</span>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                        s.deploymentStatus === 'nominal' ? 'bg-[#3fb95011] text-[#3fb950] border border-[#3fb95033]' :
                        s.deploymentStatus === 'scaling' ? 'bg-[#2f81f711] text-[#2f81f7] border border-[#2f81f733] animate-pulse' :
                        'bg-[#f8514911] text-[#f85149] border border-[#f8514933]'
                      }`}>
                         {s.deploymentStatus || 'NOMINAL'}
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/5 text-[#2f81f7] border border-white/10">
                         <RocketIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                         <div className="text-[10px] font-black text-white uppercase tracking-tight">Active Canary</div>
                         <div className="text-[9px] text-[#484f58] font-bold uppercase">v2.4.1-rc3 • Traffic: 5%</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#30363d] flex justify-between items-center text-[10px] font-black text-[#484f58] uppercase tracking-widest">
                <span>UPTIME: {s.uptime}</span>
                <div className="flex items-center gap-4">
                   <button className="text-[#2f81f7] hover:underline">Provision Logs →</button>
                   <span className="text-[#3fb950] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_10px_#3fb950]" />
                      ENCRYPTED VPC
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkloadMonitor;