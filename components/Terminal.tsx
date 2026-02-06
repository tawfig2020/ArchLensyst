
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
    <div className={`fixed bottom-0 left-0 right-0 bg-[#010409] border-t border-[#30363d] transition-all duration-200 z-[9999] ${isMinimized ? 'h-8' : 'h-32'}`} style={{ marginLeft: '224px' }}>
      <div className="flex items-center justify-between px-4 h-8 cursor-pointer border-b border-[#30363d]/50" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">›_ SYSTEM OUTPUT</span>
        </div>
        <div className="flex items-center gap-4">
          {impactData && (
            <div className={`flex items-center gap-1 ${impactData.safe ? 'text-green-400' : 'text-red-400'}`}>
              <AlertIcon className="w-3 h-3" />
              <span className="text-[10px] font-semibold">Score: {impactData.score}%</span>
            </div>
          )}
          <span className="text-[10px] text-gray-600">{isMinimized ? '▲ Expand' : '▼ Collapse'}</span>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex h-[calc(100%-32px)] overflow-hidden font-mono text-[11px]">
          <div className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar space-y-0.5">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                <span className={`font-bold shrink-0 uppercase ${log.level === 'error' ? 'text-red-400' : log.level === 'success' ? 'text-green-400' : 'text-cyan-400'}`}>
                  {log.event}
                </span>
                <span className="text-gray-400">{log.details}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          
          {impactData && (
            <div className="w-56 border-l border-[#30363d] p-3 overflow-y-auto bg-[#0d1117]">
              <h4 className="text-[10px] font-bold mb-2 text-gray-500 uppercase tracking-wider">Impact Analysis</h4>
              <p className="text-gray-500 text-[10px] leading-relaxed mb-3">{impactData.rationale}</p>
              <div className="space-y-1">
                {impactData.affectedNodes.slice(0, 3).map(node => (
                  <button 
                    key={node}
                    onClick={() => onDrillDown(node)}
                    className="w-full text-left px-2 py-1 bg-[#161b22] border border-[#30363d] rounded text-[10px] text-cyan-400 hover:border-cyan-500/50 transition-all truncate"
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
