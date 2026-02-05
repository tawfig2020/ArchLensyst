import React, { useState } from 'react';
import { RocketIcon, ShieldIcon, CpuIcon, LockIcon, AlertIcon, LightbulbIcon, TrendingUpIcon } from './Icons';

interface LandingProps {
  onGetStarted: () => void;
  onViewSpecs: () => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onGetStarted, onViewSpecs }) => {
  const [activeTier, setActiveTier] = useState<'individual' | 'team' | 'enterprise'>('individual');

  return (
    <div className="flex-1 bg-[#050505] text-white overflow-y-auto selection:bg-[#2f81f7] selection:text-white relative">
      {/* Strategic Grid Background */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #484f58 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Top Protocol Status Badge */}
        <div className="mb-16 flex items-center gap-2 px-4 py-1 border border-[#f85149] rounded-full bg-[#f851490a] animate-pulse">
           <ShieldIcon className="w-3 h-3 text-[#f85149]" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f85149]">Pre-Commit Defense Protocol Active</span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10 w-full max-w-5xl">
          <h1 className="text-7xl md:text-[7rem] font-black italic tracking-tighter leading-[0.85] flex flex-col items-center">
            <span className="text-white">BEYOND THE</span>
            <span className="text-[#2f81f7]">PROMPT.</span>
            <span className="text-white opacity-90">ARCHITECTURAL</span>
            <span className="text-[#8b949e]">IMMUNITY.</span>
          </h1>
          <p className="mt-10 text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium italic">
            Neutralizing the 45% AI vulnerability gap and the 11-hour "Senior Review Tax" with a persistent, strategic knowledge graph that enforces architectural integrity.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-28">
          <button 
            onClick={onGetStarted}
            className="bg-[#2f81f7] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_-5px_#2f81f766]"
          >
            Initialize Strategic Citadel <RocketIcon />
          </button>
          <button 
            onClick={onViewSpecs}
            className="border border-[#30363d] text-gray-400 px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
          >
            View Defense Specs
          </button>
        </div>

        {/* Top-Tier Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mb-32 border-t border-[#30363d] pt-12">
          {[
            { label: 'Destruction Firewall', desc: "Intercepts dangerous 'Silent flags' and destructive CLI suggestions before execution.", icon: <AlertIcon />, color: '#f85149' },
            { label: 'ADR Provenance', desc: "Enforces human-written Architectural Decision Records against AI-driven logic sprawl.", icon: <ShieldIcon />, color: '#3fb950' },
            { label: 'Fuzzing Immunity', desc: "Sub-second AST fuzzing identifies security leaks in AI suggestions in real-time.", icon: <CpuIcon />, color: '#2f81f7' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div style={{ color: item.color }}>{item.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: item.color }}>{item.label}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold italic">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stability Gap Section */}
        <div className="w-full mb-40">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
              Solving the <span className="text-[#ff4400]">Stability Gap</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4 font-bold italic text-lg leading-tight opacity-80">
              Standard AI tools perform well on simple tasks but fail catastrophically in ambiguous, interdependent architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* The Problem column */}
            <div className="space-y-16">
              <div className="flex items-center gap-5">
                 <div className="text-[#f85149] p-3 bg-[#f8514915] rounded-xl"><AlertIcon /></div>
                 <h3 className="text-3xl font-black italic uppercase">The Problem</h3>
              </div>
              
              <div className="space-y-12">
                {[
                  { stat: '45%', label: 'Percentage of AI-generated code containing critical security vulnerabilities in enterprise environments.' },
                  { stat: '11h', label: 'Weekly hours senior engineers spend correcting or rewriting "messy" AI output.' },
                  { stat: '90%', label: 'Integration failure rate of autonomous AI agents when interacting with legacy micro-architectures.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 items-start">
                    <span className="text-[#f85149] text-4xl font-black font-mono shrink-0 w-24 tracking-tighter">{item.stat}</span>
                    <p className="text-sm text-gray-400 leading-relaxed font-bold italic opacity-80">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Cure column */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
               <div className="absolute top-8 right-8 text-[#3fb950] opacity-10"><ShieldIcon className="w-16 h-16" /></div>
               <div className="flex items-center gap-4 mb-12">
                  <div className="text-[#3fb950]"><ShieldIcon className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black italic uppercase">The ArchLens Cure</h3>
               </div>

               <div className="space-y-10">
                  {[
                    { title: 'Structural Forge', desc: 'AI logic is analyzed for "Stiffness". Simple syntax is automatically evolved into high-fidelity design patterns (Strategy, Command, Factory).' },
                    { title: 'Immune Sandbox', desc: 'Suggestions are stress-tested against 1,000 hallucinated edge-cases before you see them. We fix the security gap before the prompt finishes.' },
                    { title: 'PR Signal Normalization', desc: 'ArchLens flattens AI noise. It suppresses the "issue density" of AI code to match senior human engineers, saving 11 hours of review time.' },
                  ].map((cure, i) => (
                    <div key={i} className="bg-[#0d1117] p-8 rounded-3xl border border-[#30363d] hover:border-[#2f81f7] transition-all group cursor-default">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2f81f7] mb-3 group-hover:translate-x-1 transition-transform">{cure.title}</h4>
                      <p className="text-xs text-gray-400 italic leading-relaxed font-bold opacity-75">{cure.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Intelligence Layers Section */}
        <div className="w-full mb-40 bg-[#0d1117]/50 py-24 rounded-[4rem] border border-[#30363d] px-10">
          <div className="flex flex-col items-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-center">
              Intelligence <span className="text-[#2f81f7]">Layers</span>
            </h2>
            <p className="text-gray-500 mt-3 font-bold italic text-lg">Bespoke strategic services for every organizational tier.</p>
            
            {/* Tier Switcher */}
            <div className="mt-12 bg-[#050505] p-1.5 rounded-full border border-[#30363d] flex gap-1">
              {['individual', 'team', 'enterprise'].map(tier => (
                <button 
                  key={tier}
                  onClick={() => setActiveTier(tier as any)}
                  className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTier === tier ? 'bg-[#2f81f7] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { title: 'Destruction Interceptor', icon: <LockIcon />, desc: 'Prevents Anti-Gravity accidents. Intercepts suggested "rm -rf" or destructive flags in the CLI before data loss occurs.' },
              { title: 'The Academy Drills', icon: <LightbulbIcon />, desc: 'Prevents skill atrophy. ArchLens generates Socratic challenges from your code, forcing you to remain the superior intellect.' },
              { title: 'Zero-Trust Suggestion', icon: <CpuIcon />, desc: 'Treats all AI input as "suspect". Every line is fuzzed for XSS and SQLi before appearing in your editor.' },
            ].map((layer, i) => (
              <div key={i} className="bg-[#050505] border border-[#30363d] p-12 rounded-[3rem] hover:border-[#2f81f7] transition-all group flex flex-col items-center text-center">
                 <div className="text-[#2f81f7] mb-8 p-4 bg-[#2f81f715] rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform">{layer.icon}</div>
                 <h4 className="text-xl font-black italic uppercase mb-5 tracking-tight">{layer.title}</h4>
                 <p className="text-sm text-gray-500 leading-relaxed font-bold italic opacity-80">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Branding & CTA */}
        <div className="w-full flex flex-col items-center mb-32">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-center leading-none mb-20">
            STOP REVIEWING.<br />
            <span className="text-[#2f81f7]">START ENGINEERING.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-24">
            <div className="bg-[#0d1117] p-12 rounded-[3rem] border border-[#30363d] flex flex-col items-center text-center relative overflow-hidden">
               <div className="text-[#3fb950] text-7xl font-black italic mb-4 tracking-tighter">+11h</div>
               <div className="text-[12px] font-black uppercase tracking-[0.3em] text-white mb-6">Weekly Velocity Gain</div>
               <p className="text-sm text-gray-500 font-bold italic opacity-75 leading-relaxed">Average senior engineer time reclaimed from AI review tax per week.</p>
               <div className="absolute -bottom-10 -right-10 text-[#3fb9500a]"><TrendingUpIcon className="w-48 h-48" /></div>
            </div>
            <div className="bg-[#0d1117] p-12 rounded-[3rem] border border-[#30363d] flex flex-col items-center text-center relative overflow-hidden">
               <div className="text-[#2f81f7] text-7xl font-black italic mb-4 tracking-tighter">100%</div>
               <div className="text-[12px] font-black uppercase tracking-[0.3em] text-white mb-6">IP Sovereignty</div>
               <p className="text-sm text-gray-500 font-bold italic opacity-75 leading-relaxed">Certainty that AI output respects local mandates and regulatory constraints.</p>
               <div className="absolute -bottom-10 -right-10 text-[#2f81f70a]"><ShieldIcon className="w-48 h-48" /></div>
            </div>
          </div>

          <button 
            onClick={onGetStarted}
            className="bg-white text-black px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[13px] flex items-center gap-4 hover:scale-105 transition-all shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)]"
          >
            Enter the Citadel
            <span className="text-2xl leading-none">›</span>
          </button>
        </div>

        {/* Final Footer */}
        <div className="w-full mt-10 border-t border-[#30363d] py-16 flex flex-wrap justify-between items-center gap-8 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <div className="text-white font-black italic text-2xl tracking-tighter">ARCHLENS <span className="text-[#2f81f7]">STRATEGIC</span></div>
          </div>
          <div className="flex flex-wrap gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <a href="#" className="hover:text-[#2f81f7] transition-colors">Security Maturity Baseline</a>
            <a href="#" className="hover:text-[#2f81f7] transition-colors">Zero-Trust RAG</a>
            <span>© 2025 Engineering Excellence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;