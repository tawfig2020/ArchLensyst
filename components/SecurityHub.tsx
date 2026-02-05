/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 * PROVENANCE: ARCH-SECURITY-SHIELD-UI
 */

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SecurityAuditReport, CodeFile } from '../types';
import { ShieldIcon, AlertIcon, LockIcon, RocketIcon, GraphIcon, TerminalIcon, CpuIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const SecurityHub: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleRunSecurityAudit = async () => {
    setIsScanning(true);
    try {
      const result = await gemini.performSecurityAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error('Security Scan Breach:', e);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (report && svgRef.current) {
      const width = 600;
      const height = 400;
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const nodes = codebase.map(f => ({ id: f.path, type: 'file' }));
      const vulnNodes = report.vulnerabilities.map(v => ({ id: v.id, type: 'vuln', severity: v.severity }));
      
      const allNodes = [...nodes, ...vulnNodes];
      const links = report.vulnerabilities.map(v => ({ source: v.id, target: v.file }));

      const simulation = d3.forceSimulation(allNodes as any)
        .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const g = svg.append("g");

      const link = g.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#f8514933")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,2");

      const node = g.append("g")
        .selectAll("circle")
        .data(allNodes)
        .join("circle")
        .attr("r", (d: any) => d.type === 'vuln' ? 8 : 4)
        .attr("fill", (d: any) => {
          if (d.type === 'file') return "#2f81f7";
          return d.severity === 'error' ? "#f85149" : "#d29922";
        })
        .attr("class", "cursor-pointer")
        .append("title")
        .text((d: any) => d.id);

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        g.selectAll("circle")
          .attr("cx", (d: any) => d.x)
          .attr("cy", (d: any) => d.y);
      });
    }
  }, [report, codebase]);

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-[#f8514933]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Security <span className="text-[#f85149]">Shield</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4 italic">Zero-Trust Suggestion Guard. Intercepting SQLi, XSS, and hardcoded secrets before they commit to the logical graph.</p>
        </div>
        {!report && !isScanning && (
          <button 
            onClick={handleRunSecurityAudit}
            className="bg-[#f85149] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f8514933]"
          >
            RUN DEEP SECURITY SCAN
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#3fb95033] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><ShieldIcon className="w-3 h-3" /> Trust Baseline</div>
               <div className="text-5xl font-black italic text-[#3fb950]">{report.score}%</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#d2992233] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LockIcon className="w-3 h-3" /> Secrets Intercepted</div>
               <div className="text-5xl font-black italic text-[#d29922]">{report.leakedSecrets.length}</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#f8514933] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><AlertIcon className="w-3 h-3" /> Critical Breaches</div>
               <div className="text-5xl font-black italic text-[#f85149]">{report.vulnerabilities.filter(v => v.severity === 'error').length}</div>
            </div>
             <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-[#2f81f733] transition-all">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><GraphIcon className="w-3 h-3" /> Attack Surface</div>
               <div className="text-5xl font-black italic text-[#2f81f7]">Visualized</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><GraphIcon className="w-4 h-4 text-[#2f81f7]" /> Attack Surface Mesh</h3>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-[40px] p-6 flex justify-center overflow-hidden">
                   <svg ref={svgRef} width="600" height="400" className="opacity-80" />
                </div>
                
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mt-10"><AlertIcon className="w-4 h-4 text-[#f85149]" /> Vulnerability Ledger</h3>
                <div className="space-y-4">
                   {report.vulnerabilities.map((v, i) => (
                      <div key={i} className={`p-8 rounded-[35px] border flex flex-col gap-4 relative overflow-hidden transition-all hover:bg-white/5 ${
                        v.severity === 'error' ? 'bg-[#f851490a] border-[#f8514933]' : 'bg-[#d299220a] border-[#d2992233]'
                      }`}>
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                                  v.severity === 'error' ? 'text-[#f85149] bg-[#f8514911] border-[#f8514922]' : 'text-[#d29922] bg-[#d2992211] border-[#d2992222]'
                               }`}>
                                  <ShieldIcon />
                               </div>
                               <div>
                                  <div className="text-[9px] font-black uppercase tracking-widest opacity-60">{v.type} • CWE-{v.cwe || 'Unknown'}</div>
                                  <h4 className="text-lg font-black text-white italic tracking-tight">{v.message}</h4>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-[8px] font-black text-[#8b949e] uppercase">Blast Radius</div>
                               <div className={`text-sm font-black italic ${v.blastRadius && v.blastRadius > 50 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                                  {v.blastRadius || 'N/A'}/100
                               </div>
                            </div>
                         </div>
                         <p className="text-xs text-[#8b949e] leading-relaxed italic">Location: <span className="text-[#c9d1d9] font-mono uppercase font-bold">{v.file}:{v.line || '??'}</span></p>
                         <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 flex gap-4 items-center group">
                            <div className="text-[#3fb950] shrink-0 group-hover:scale-110 transition-transform"><RocketIcon className="w-4 h-4" /></div>
                            <div className="text-[11px] text-[#3fb950] font-bold italic leading-tight">FIX: "{v.recommendation}"</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="space-y-10">
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><LockIcon className="w-4 h-4 text-[#d29922]" /> Shadow Secret Interceptor</h3>
                   <div className="space-y-4">
                      {report.leakedSecrets.map((s, i) => (
                         <div key={i} className="bg-[#161b22] border border-[#30363d] p-6 rounded-[30px] space-y-4 group hover:border-[#d2992266] transition-all">
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-[#d29922] bg-[#d2992211] px-2 py-1 rounded border border-[#d2992233] uppercase">Identity: {s.type}</span>
                                  <span className="text-[11px] font-black text-white italic tracking-tighter">{s.keyName}</span>
                               </div>
                               <span className="text-[10px] font-mono text-[#484f58] font-bold">Line {s.line}</span>
                            </div>
                            <div className="bg-[#050505] p-4 rounded-xl border border-white/5 font-mono text-[11px] text-[#f85149] tracking-[0.3em] overflow-x-auto custom-scrollbar">
                               {s.redactedValue}
                            </div>
                            <button className="w-full bg-[#2f81f7] text-white py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#2f81f722]">
                               REFACTOR TO VAULT
                            </button>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#3fb950] opacity-5 blur-3xl" />
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#f85149] decoration-4 underline-offset-8">Zero-Trust Suggestion Core</h3>
                   <p className="text-sm text-[#8b949e] leading-relaxed italic font-medium">
                     The Immune System is currently scanning for **high-entropy logic blips**. Any suggestion containing regex with catastrophic backtracking risk or raw database drivers is automatically isolated.
                   </p>
                   <div className="flex items-center gap-4 p-4 bg-[#3fb9500a] border border-[#3fb95022] rounded-3xl">
                      <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
                      <span className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest">Enclave Status: SECURE</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : isScanning ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#f85149]/30 border-t-[#f85149] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#f85149] uppercase tracking-[0.4em] animate-pulse">Scanning Code Entropy...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Verifying logical nodes against OWASP L3 compliance</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40 group">
           <div className="scale-[4] text-[#30363d] group-hover:text-[#f85149] transition-colors duration-500 animate-bounce duration-[3000ms]"><ShieldIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize deep security audit to anchor your defense baseline.</p>
        </div>
      )}
    </div>
  );
};

export default SecurityHub;
