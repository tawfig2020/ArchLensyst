
import React, { useState, useEffect, useRef } from 'react';
import { MonitorLog, ImpactAnalysis, SyntheticFix } from '../types';
import { TerminalIcon, AlertIcon } from './Icons';

interface TerminalProps {
  logs: MonitorLog[];
  impactData: ImpactAnalysis | null;
  activeFix: SyntheticFix | null;
  onApplyFix: (fix: string) => void;
  onDrillDown: (path: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ logs, impactData, activeFix, onApplyFix, onDrillDown }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#0d1117] border-t border-[#30363d] transition-all z-[100] ${isMinimized ? 'h-8' : 'h-64'}`}>
      <div className="flex items-center justify-between px-4 h-8 bg-[#161b22] border-b border-[#30363d] cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          <TerminalIcon />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">System Sentinel Output</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono">
          {impactData && (
            <div className={`flex items-center gap-1 ${impactData.safe ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
              <AlertIcon />
              <span>SENSITIVITY SCORE: {impactData.score}%</span>
            </div>
          )}
          <span className="text-[#484f58]">{isMinimized ? 'EXPAND' : 'COLLAPSE'}</span>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex h-[calc(100%-32px)] overflow-hidden font-mono text-[11px]">
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#050505]">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 flex gap-4">
                <span className="text-[#484f58] shrink-0">[{log.timestamp}]</span>
                <span className={`font-bold shrink-0 w-24 ${log.level === 'error' ? 'text-[#f85149]' : log.level === 'success' ? 'text-[#3fb950]' : 'text-[#2f81f7]'}`}>
                  {log.event}
                </span>
                <span className="text-[#8b949e]">{log.details}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          
          {impactData && (
            <div className="w-80 border-l border-[#30363d] p-4 bg-[#0d1117] overflow-y-auto">
              <h4 className="text-[10px] font-black uppercase mb-3 text-[#2f81f7]">Strategic Impact Window</h4>
              <p className="text-[#8b949e] leading-relaxed mb-4">{impactData.rationale}</p>
              <div className="space-y-2">
                {impactData.affectedNodes.map(node => (
                  <button 
                    key={node}
                    onClick={() => onDrillDown(node)}
                    className="w-full text-left px-2 py-1 bg-[#161b22] border border-[#30363d] rounded text-[10px] text-[#2f81f7] hover:border-[#2f81f7]"
                  >
                    → {node}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Terminal;
