/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { ProductivityAuditReport, CodeFile } from '../types';
import { RocketIcon, AlertIcon, ShieldIcon, UserIcon, GraphIcon, CpuIcon, LightbulbIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const ProductivityOracle: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<ProductivityAuditReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAudit = async () => {
    setIsAnalyzing(true);
    try {
      const result = await gemini.performProductivityAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Productivity <span className="text-[#2f81f7]">Oracle</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Debunking the "Line Count" illusion. Measuring real velocity vs. AI-induced churn and skill erosion.</p>
        </div>
        {!report && !isAnalyzing && (
          <button 
            onClick={handleRunAudit}
            className="bg-[#2f81f7] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2f81f733]"
          >
            AUDIT REAL VELOCITY
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
          {/* Main Velocity Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#f8514933] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><AlertIcon /> AI-Churn Rate</div>
               <div className="text-5xl font-black italic text-[#f85149]">{report.metrics.fixToGenRatio}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Code rewritten within 48h</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#3fb95033] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><RocketIcon /> Real ROI</div>
               <div className="text-5xl font-black italic text-[#3fb950]">+{report.metrics.aiEfficiencyGain}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Net shipping acceleration</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#2f81f733] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><UserIcon /> Human Edge</div>
               <div className="text-5xl font-black italic text-[#2f81f7]">{report.growth.unassistedProblemSolvingScore}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Cognitive independence level</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#d2992233] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LightbulbIcon /> Socratic Sync</div>
               <div className="text-5xl font-black italic text-[#d29922]">{report.socraticHealth}%</div>
               <div className="text-[9px] font-bold text-[#484f58] uppercase">Interactive learning factor</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Skill Growth Section */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><GraphIcon /> Senior Leadership Roadmap</h3>
                <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[50px] space-y-8 relative overflow-hidden">
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <div className="text-xl font-black text-white italic uppercase tracking-tighter">Human Intuition Tracking</div>
                         <span className="text-[10px] font-black text-[#3fb950] uppercase px-3 py-1 bg-[#3fb95011] rounded-full border border-[#3fb95022]">Trending Up</span>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Mental Model Sync</div>
                         <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-[#2f81f7] to-[#3fb950]" style={{ width: `${report.growth.mentalModelSync}%` }} />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 pt-6">
                         <div className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">Verified Human Breakthroughs</div>
                         {report.growth.identifiedPatterns.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-[#0d1117] rounded-2xl border border-white/5 group hover:border-[#3fb95033] transition-all">
                               <div className="text-[#3fb950]"><ShieldIcon /></div>
                               <span className="text-sm font-medium text-[#c9d1d9] italic">"{p}"</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             {/* Velocity Friction section */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><AlertIcon /> AI-Friction Heatmap</h3>
                <div className="space-y-4">
                   {report.highChurnFiles.map((f, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#f8514933] p-8 rounded-[35px] hover:bg-[#1c2128] transition-all relative group overflow-hidden">
                         <div className="absolute top-0 right-0 px-4 py-1 bg-[#f8514922] text-[#f85149] text-[8px] font-black uppercase">Churn: {f.churnRate}%</div>
                         <div className="text-[10px] font-black text-[#f85149] uppercase mb-1 tracking-widest">{f.file}</div>
                         <h4 className="text-lg font-black text-white italic mb-3">Logical Divergence Detected</h4>
                         <p className="text-xs text-[#8b949e] leading-relaxed italic">"{f.reason}"</p>
                         <div className="mt-6 flex gap-4">
                            <button className="flex-1 bg-[#f8514911] text-[#f85149] py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#f85149] hover:text-white transition-all">FLAG AS AI BLINDSPOT</button>
                            <button className="flex-1 bg-[#2f81f711] text-[#2f81f7] py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2f81f7] hover:text-white transition-all">RUN SOCRATIC DRILL</button>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-8 bg-[#d299220a] border border-[#d2992222] rounded-[40px] space-y-4">
                   <h4 className="text-[11px] font-black text-[#d29922] uppercase tracking-[0.2em] flex items-center gap-2"><LightbulbIcon /> The Junior-Safety Mandate</h4>
                   <p className="text-xs text-[#8b949e] leading-relaxed italic">
                     ArchLens has detected that total reliance on "Code Suggestions" is reducing unassisted problem-solving capacity by 12%. **Socratic Mentorship Mode** has been prioritized for the current sprint.
                   </p>
                </div>
             </div>
          </div>
        </div>
      ) : isAnalyzing ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#2f81f7] uppercase tracking-[0.4em] animate-pulse">Calculating RAG ROI...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Scanning commit history for AI rewrites and cognitive friction</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[4] text-[#30363d]"><CpuIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize productivity audit to view real ROI metrics.</p>
        </div>
      )}
    </div>
  );
};

export default ProductivityOracle;
