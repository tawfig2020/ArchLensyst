import React, { useState } from 'react';
import { CodeFile, RuleViolation, SyntheticFix } from '../types';
import { FilesIcon, AlertIcon, ShieldIcon, RocketIcon, CpuIcon, ChevronRight } from './Icons';

interface CodeEditorProps {
  file: CodeFile;
  violations: RuleViolation[];
  onTriggerFix: (v: RuleViolation) => void;
  onApplySyntheticFix: (f: SyntheticFix) => void;
  onCodeChange: (content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, violations, onTriggerFix, onApplySyntheticFix, onCodeChange }) => {
  const [activeProposal, setActiveProposal] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col bg-[#020202] overflow-hidden relative selection:bg-[#2f81f733]">
      {/* Editor HUD Overlay */}
      <div className="absolute top-12 left-16 z-10 pointer-events-none opacity-[0.03]">
        <CpuIcon className="w-96 h-96" />
      </div>

      <div className="h-14 bg-[#0d1117] border-b border-[#30363d] flex items-center px-8 gap-6 shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <FilesIcon className="text-[#2f81f7] w-4 h-4" />
          <span className="text-[12px] font-black tracking-tighter text-white italic uppercase">{file.path}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-[#484f58] uppercase tracking-[0.3em]">Language Core</span>
            <span className="text-[10px] font-black text-white uppercase italic">{file.language}</span>
          </div>
          <div className="w-px h-6 bg-[#30363d]" />
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-[#484f58] uppercase tracking-[0.3em]">Last Logic Sync</span>
            <span className="text-[10px] font-black text-white uppercase italic">{new Date(file.lastModified).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden relative z-20">
        <div className="w-14 bg-[#020202] border-r border-[#30363d] flex flex-col items-center pt-6 font-mono text-[#30363d] text-[11px] select-none font-black italic">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-7 flex items-center">{i + 1}</div>
          ))}
        </div>
        
        <textarea 
          className="flex-1 bg-transparent text-[#e6edf3] p-8 font-mono text-[14px] leading-7 outline-none resize-none overflow-y-auto custom-scrollbar caret-[#2f81f7] focus:ring-0"
          value={file.content}
          spellCheck={false}
          onChange={(e) => onCodeChange(e.target.value)}
        />
        
        {/* Authoritative Sidebar for Violations */}
        {violations.length > 0 && (
          <div className="w-96 border-l border-[#30363d] bg-[#0d1117]/50 backdrop-blur-3xl p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar glass-card">
            <header className="space-y-2 border-b border-white/5 pb-6">
              <h3 className="text-[12px] font-black uppercase text-[#f85149] flex items-center gap-3 tracking-[0.3em]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f85149] animate-pulse"></div>
                Architectural Drift
              </h3>
              <p className="text-[10px] text-[#484f58] font-black uppercase tracking-widest italic">Intercepted Logic Invariants</p>
            </header>

            <div className="space-y-6">
              {violations.map((v, i) => (
                <div key={i} className="p-6 bg-[#f851490a] border border-[#f8514922] rounded-[2.5rem] group hover:border-[#f8514966] transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <AlertIcon className="w-12 h-12" />
                  </div>
                  <div className="text-[10px] font-black text-[#f85149] mb-3 uppercase tracking-widest flex justify-between">
                    <span>{v.ruleId}</span>
                    <span className="italic">Line {v.line}</span>
                  </div>
                  <h4 className="text-sm font-black text-white italic mb-4 leading-tight">{v.message}</h4>
                  <div className="bg-[#020202] p-4 rounded-2xl border border-white/5 text-[11px] text-[#8b949e] mb-6 font-medium italic">
                    "{v.suggestion}"
                  </div>
                  <button 
                    onClick={() => {
                      setActiveProposal(v.ruleId);
                      onTriggerFix(v);
                    }}
                    disabled={activeProposal === v.ruleId}
                    className="w-full bg-white text-black py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    {activeProposal === v.ruleId ? (
                      <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <>PROPOSE SYNTHETIC FIX <RocketIcon className="w-3 h-3" /></>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <div className="flex items-center gap-4 p-6 bg-[#3fb9500a] border border-[#3fb95022] rounded-[2rem]">
                 <ShieldIcon className="w-4 h-4 text-[#3fb950]" />
                 <div>
                    <div className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest">Sovereign Guard</div>
                    <p className="text-[10px] text-[#8b949e] italic font-medium">Protecting logic sovereignty in {file.path}</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;