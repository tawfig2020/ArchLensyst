import React from 'react';
import { RocketIcon, ShieldIcon, AlertIcon, TrendingUpIcon } from './Icons';

interface Props {
  onNavigate: (tab: string) => void;
}

const HeroLanding: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0a0a12] flex flex-col">
      {/* Top Status Badge */}
      <div className="pt-8 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-medium tracking-wider uppercase">
            PRE-COMMIT DEFENSE PROTOCOL ACTIVE
          </span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center">
          {/* Main Headline - Exact match to Image 3 */}
          <h1 className="mb-6">
            <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-white italic leading-tight">
              BEYOND THE
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-[#3b82f6] italic leading-tight">
              PROMPT.
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-white italic leading-tight">
              ARCHITECTURAL
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-gray-500 italic leading-tight">
              IMMUNITY.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed italic">
            Neutralizing the 45% AI vulnerability gap and the 11-hour "Senior Review
            Tax" with a persistent, strategic knowledge graph that enforces architectural
            integrity.
          </p>

          {/* CTA Buttons - Match Image 3 exactly */}
          <div className="flex gap-4 justify-center items-center">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-full font-semibold text-sm bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            >
              INITIALIZE STRATEGIC CITADEL
              <RocketIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('specs')}
              className="px-6 py-3 rounded-full font-semibold text-sm bg-transparent border border-white/30 text-white hover:bg-white/5 transition-colors"
            >
              VIEW DEFENSE SPECS
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards - Match Image 3 exactly */}
      <div className="pb-12 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <AlertIcon className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-xs font-bold uppercase">DESTRUCTION FIREWALL</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Intercepts dangerous "Silent Bugs" and destructive CLI suggestions before execution.
            </p>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-bold uppercase">ADR PROVENANCE</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Enforces human-written Architectural Decision Records against AI-driven logic spread.
            </p>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <ShieldIcon className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase">FUZZING IMMUNITY</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Self-secured AST fuzzing identifies security leaks in AI suggestions in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
