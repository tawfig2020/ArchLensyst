/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { CodeFile, DriftAnalysisResult } from '../types';
// Fixed: Added TrendingUpIcon to the imports
import { RocketIcon, AlertIcon, ShieldIcon, GraphIcon, LinkIcon, LockIcon, CpuIcon, TrendingUpIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  selectedFile: CodeFile;
  isLive: boolean;
}

const DriftView: React.FC<Props> = ({ selectedFile, isLive }) => {
  const [driftData, setDriftData] = useState<DriftAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Initial simulated/cached data for the file
    const initialData: DriftAnalysisResult = {
      driftScore: 24,
      patternFragmentation: [
        {
          pattern: "Mixed Async Paradigms",
          consistencyScore: 62,
          locations: [
            { file: selectedFile.path, line: 4, snippet: "new Promise((res) => ...)" },
            { file: selectedFile.path, line: 12, snippet: "async login()..." }
          ],
          recommendation: "Standardize on Async/Await to restore system cohesion."
        }
      ],
      paradigmClashes: [
        {
          dominantPattern: "Async/Await",
          divergentPattern: "Callbacks (isolated)",
          fileCount: 3,
          impact: "Medium"
        }
      ],
      seniorReview: {
        historicalPerspective: "The original design prioritizes decoupling via EventEmitters.",
        modernPerspective: "Recent AI-generated modules are introducing direct Observer patterns, diverging from the core logic.",
        rationaleErosion: "HIGH RISK. The 'Stateless Protocol' mandate is being eroded by local storage caching.",
        recommendation: "Enforce Constitution Mandate M003 to prevent terminal design decay."
      },
      incompatibilityRisks: [
        { type: 'Structural', description: 'Proposed changes break manual unit test mocking layers.', fix: 'Re-align with Interface Mocking pattern.' }
      ]
    };
    
    setDriftData(initialData);
    
    if (isLive) {
      handleAnalyzeDrift(selectedFile.content);
    }
  }, [selectedFile.path, isLive]);

  const handleAnalyzeDrift = async (current: string) => {
    setIsAnalyzing(true);
    try {
      const result = await gemini.compareCodebaseVersions("", current, selectedFile.path);
      setDriftData(result);
    } catch (err) {
      console.error("Drift analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0d1117] flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-[#30363d] flex flex-col md:flex-row justify-between items-start md:items-center bg-[#161b22]/50 gap-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter italic mb-1 uppercase">Drift & Fragmentation Audit</h2>
          <p className="text-[#8b949e] text-[10px] font-black uppercase tracking-[0.2em]">Detecting Rationale Erosion & Paradigm Clash</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#f8514911] border border-[#f8514933] px-6 py-3 rounded-2xl flex flex-col items-end min-w-[140px]">
              <div className="text-[10px] font-black text-[#f85149] uppercase tracking-widest">Rationale Erosion</div>
              <div className="text-xl font-black text-white italic tracking-tight">{driftData?.driftScore && driftData.driftScore > 50 ? 'TERMINAL' : 'CRITICAL'}</div>
           </div>
           <div className="bg-[#2f81f711] border border-[#2f81f733] px-6 py-3 rounded-2xl flex flex-col items-end min-w-[140px]">
              <div className="text-[10px] font-black text-[#2f81f7] uppercase tracking-widest">Fragmentation</div>
              <div className="text-xl font-black text-white font-mono">{driftData?.driftScore || 0}%</div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-12">
        {isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin"></div>
            <div className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.3em] animate-pulse">Scanning Interpretive Invariants...</div>
          </div>
        ) : driftData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <div className="lg:col-span-2 space-y-10">
                {/* Fragmentation Heatmap */}
                <div className="space-y-6">
                   <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                      <GraphIcon className="w-4 h-4 text-[#2f81f7]" /> Fragmentation Analysis
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {driftData.paradigmClashes?.map((clash, i) => (
                        <div key={i} className="bg-[#161b22] border border-[#f8514922] p-6 rounded-[32px] relative overflow-hidden group hover:border-[#f8514944] transition-all">
                           <div className="text-[9px] font-black text-[#f85149] uppercase mb-4 tracking-widest flex items-center gap-2">
                             <AlertIcon className="w-3 h-3" /> Paradigm Clash Detected
                           </div>
                           <div className="flex justify-between items-center bg-[#0d1117] p-4 rounded-2xl">
                              <div className="space-y-1">
                                 <div className="text-[9px] text-[#8b949e] uppercase font-bold">Dominant</div>
                                 <div className="text-sm font-black text-white italic">{clash.dominantPattern}</div>
                              </div>
                              <div className="text-[#484f58] font-mono text-xs">VS</div>
                              <div className="space-y-1 text-right">
                                 <div className="text-[9px] text-[#f85149] uppercase font-bold italic">Divergent</div>
                                 <div className="text-sm font-black text-[#f85149] italic">{clash.divergentPattern}</div>
                              </div>
                           </div>
                           <div className="mt-6 flex justify-between items-center">
                              <span className="text-[9px] font-black text-[#484f58] uppercase tracking-widest">Impact: {clash.impact}</span>
                              <span className="text-[9px] font-black text-[#484f58] uppercase tracking-widest">Files: {clash.fileCount}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Senior Review Section */}
                <div className="glass-card p-10 rounded-[50px] bg-[#f8514905] border border-[#f8514922] space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 text-[#f85149]">
                      <ShieldIcon className="w-32 h-32" />
                   </div>
                   <div className="flex items-center gap-4 border-b border-[#f8514911] pb-6">
                      <div className="w-12 h-12 bg-[#f8514911] rounded-2xl text-[#f85149] flex items-center justify-center border border-[#f8514922]">
                         <LockIcon />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Senior Interpretive Review</h3>
                         <div className="text-[9px] font-black text-[#f85149] uppercase tracking-widest">Strategic Rationale Defense</div>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2">Historical Perspective</div>
                         <div className="bg-[#0d1117] p-6 rounded-3xl border border-white/5">
                            <p className="text-sm text-[#c9d1d9] leading-relaxed italic">"{driftData.seniorReview.historicalPerspective}"</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="text-[10px] font-black text-[#f85149] uppercase tracking-widest flex items-center gap-2">Rationale Erosion Warning</div>
                         <div className="bg-[#f851490a] p-6 rounded-3xl border border-[#f8514922]">
                            <p className="text-sm text-[#f85149] leading-relaxed italic font-bold">"{driftData.seniorReview.rationaleErosion}"</p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mt-6">
                      <div className="text-[9px] font-black text-[#2f81f7] uppercase tracking-widest mb-2">Senior Recommendation</div>
                      <p className="text-xs text-[#8b949e] italic leading-relaxed">"{driftData.seniorReview.recommendation}"</p>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[45px] flex flex-col h-full relative group">
                   <div className="absolute top-10 right-10 text-[#d29922] opacity-20">
                      <TrendingUpIcon className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6 underline decoration-[#d29922] decoration-4 underline-offset-8">Constitution Realignment</h3>
                   <div className="flex-1 space-y-6">
                      <p className="text-[#8b949e] leading-relaxed italic text-sm">
                        Prompt-isolated AI cycles are eroding your core invariants. Restore interpretive control by applying Re-Alignment PRs.
                      </p>
                      <div className="space-y-4">
                        {driftData.incompatibilityRisks.map((risk, i) => (
                          <div key={i} className="p-6 bg-[#0d1117] border border-[#30363d] rounded-3xl space-y-3 hover:border-[#2f81f7] transition-all cursor-pointer group/item shadow-2xl">
                             <div className="text-xs font-black text-[#2f81f7] uppercase flex justify-between items-center tracking-widest">
                                {risk.type} Fix Available
                                <CpuIcon className="w-4 h-4" />
                             </div>
                             <p className="text-[11px] text-[#8b949e] leading-relaxed font-medium">"{risk.description}"</p>
                             <div className="pt-2 flex justify-between items-center">
                                <span className="text-[9px] font-black text-white uppercase group-hover/item:text-[#2f81f7] transition-colors">DECODE & DEPLOY</span>
                                <span className="text-[9px] font-black text-[#484f58] uppercase">98% Accuracy</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <button className="mt-10 w-full py-4 bg-[#2f81f7] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2f81f733]">
                      EXECUTE GLOBAL RE-ALIGNMENT
                   </button>
                </div>
             </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DriftView;