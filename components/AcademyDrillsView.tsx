/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { CodeFile, DeveloperPersona, SocraticChallenge } from '../types';
import { LightbulbIcon, ShieldIcon, RocketIcon, AlertIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  selectedFile: CodeFile;
  persona: DeveloperPersona;
}

const AcademyDrillsView: React.FC<Props> = ({ selectedFile, persona }) => {
  const [challenge, setChallenge] = useState<SocraticChallenge | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateDrill = async () => {
    setIsGenerating(true);
    setShowResult(false);
    setSelectedOption(null);
    try {
      const result = await gemini.generateSocraticChallenge(selectedFile, persona);
      setChallenge(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateDrill();
  }, [selectedFile.path]);

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">The <span className="text-[#2f81f7]">Academy</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Socratic Drills. Preventing skill atrophy by challenging your architectural assumptions based on live code.</p>
        </div>
        <button 
          onClick={generateDrill}
          disabled={isGenerating}
          className="bg-white text-black px-10 py-4 rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {isGenerating ? 'CRAFTING DRILL...' : 'REFRESH CHALLENGE'}
        </button>
      </header>

      {isGenerating ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
          <div className="w-16 h-16 border-4 border-[#2f81f7]/30 border-t-[#2f81f7] rounded-full animate-spin" />
          <div className="text-center space-y-2">
            <div className="text-[12px] font-black text-[#2f81f7] uppercase tracking-[0.4em] animate-pulse">Analyzing Logic Nuance...</div>
            <p className="text-[10px] text-[#484f58] uppercase font-bold italic">Synthesizing Socratic feedback loop for {selectedFile.name}</p>
          </div>
        </div>
      ) : challenge ? (
        <div className="max-w-4xl mx-auto space-y-10">
           <div className="bg-[#161b22] border border-[#30363d] p-12 rounded-[50px] space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-6 py-2 bg-[#2f81f722] text-[#2f81f7] text-[10px] font-black uppercase tracking-[0.2em] border-l border-b border-[#30363d]">
                 {challenge.complexity} Complexity
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-[#2f81f711] text-[#2f81f7] flex items-center justify-center border border-[#2f81f733]">
                    <LightbulbIcon className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">{challenge.question}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {challenge.options.map((option, i) => (
                    <button 
                       key={i}
                       onClick={() => !showResult && setSelectedOption(i)}
                       className={`p-6 rounded-3xl border text-left transition-all ${
                          selectedOption === i 
                            ? 'bg-[#2f81f722] border-[#2f81f7] shadow-lg scale-[1.02]' 
                            : 'bg-[#0d1117] border-[#30363d] hover:border-[#484f58]'
                       } ${showResult && i === challenge.correctAnswer ? 'border-[#3fb950] bg-[#3fb95011]' : ''}
                         ${showResult && selectedOption === i && i !== challenge.correctAnswer ? 'border-[#f85149] bg-[#f8514911]' : ''}`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs ${
                             selectedOption === i ? 'bg-[#2f81f7] text-white border-transparent' : 'border-[#30363d] text-[#484f58]'
                          }`}>
                             {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-[13px] font-medium text-[#c9d1d9] leading-relaxed">{option}</span>
                       </div>
                    </button>
                 ))}
              </div>

              {!showResult ? (
                 <button 
                    onClick={() => setSelectedOption(selectedOption) !== null && setShowResult(true)}
                    disabled={selectedOption === null}
                    className="w-full bg-[#2f81f7] text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2f81f733] disabled:opacity-30"
                 >
                    SUBMIT ARCHITECTURAL VERDICT
                 </button>
              ) : (
                 <div className={`p-8 rounded-[40px] border animate-in slide-in-from-top-4 ${
                    selectedOption === challenge.correctAnswer ? 'bg-[#3fb9500a] border-[#3fb95033]' : 'bg-[#f851490a] border-[#f8514933]'
                 }`}>
                    <div className="flex items-center gap-4 mb-6">
                       {selectedOption === challenge.correctAnswer ? (
                          <div className="text-[#3fb950] flex items-center gap-2 font-black uppercase text-xs">
                             <ShieldIcon /> Logic Purity Verified
                          </div>
                       ) : (
                          <div className="text-[#f85149] flex items-center gap-2 font-black uppercase text-xs">
                             <AlertIcon /> Rationale Breach Detected
                          </div>
                       )}
                    </div>
                    <p className="text-sm text-[#8b949e] leading-relaxed italic font-medium">"{challenge.explanation}"</p>
                 </div>
              )}
           </div>

           <div className="bg-[#0d1117] p-8 rounded-[35px] border border-white/5 flex items-center gap-6">
              <div className="p-4 bg-white/5 rounded-2xl text-[#d29922]">
                 <RocketIcon />
              </div>
              <p className="text-xs text-[#484f58] font-bold uppercase tracking-widest leading-loose">
                 * Drills are generated by cross-referencing your <span className="text-[#2f81f7]">Developer DNA</span> and the <span className="text-[#3fb950]">Architect's Constitution</span>.
              </p>
           </div>
        </div>
      ) : null}
    </div>
  );
};

export default AcademyDrillsView;