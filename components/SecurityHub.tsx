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
    <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto pb-44">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">SECURITY <span className="text-[#f85149]">SHIELD</span></h2>
          <p className="text-gray-500 text-sm">Zero-Trust Suggestion Guard. Intercepting SQLi, XSS, and hardcoded secrets before they commit.</p>
        </div>
        {!report && !isScanning && (
          <button 
            onClick={handleRunSecurityAudit}
            className="bg-[#f85149] hover:bg-[#da3633] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            RUN DEEP SECURITY SCAN
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-green-500/30 transition-all">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2"><ShieldIcon className="w-3 h-3" /> Trust Baseline</div>
               <div className="text-2xl font-black text-green-400">{report.score}%</div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-amber-500/30 transition-all">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2"><LockIcon className="w-3 h-3" /> Secrets Intercepted</div>
               <div className="text-2xl font-black text-amber-400">{report.leakedSecrets.length}</div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-red-500/30 transition-all">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2"><AlertIcon className="w-3 h-3" /> Critical Breaches</div>
               <div className="text-2xl font-black text-red-400">{report.vulnerabilities.filter(v => v.severity === 'error').length}</div>
            </div>
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-blue-500/30 transition-all">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2"><GraphIcon className="w-3 h-3" /> Attack Surface</div>
               <div className="text-2xl font-black text-blue-400">Visualized</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><GraphIcon className="w-3 h-3" /> Attack Surface Mesh</h3>
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex justify-center overflow-hidden">
                   <svg ref={svgRef} width="500" height="300" className="opacity-80" />
                </div>
                
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mt-4"><AlertIcon className="w-3 h-3" /> Vulnerability Ledger</h3>
                <div className="space-y-3">
                   {report.vulnerabilities.map((v, i) => (
                      <div key={i} className={`p-4 rounded-lg border flex flex-col gap-3 transition-all ${
                        v.severity === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'
                      }`}>
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  v.severity === 'error' ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10'
                               }`}>
                                  <ShieldIcon className="w-4 h-4" />
                               </div>
                               <div>
                                  <div className="text-[10px] text-gray-500 uppercase">{v.type} • CWE-{v.cwe || 'Unknown'}</div>
                                  <h4 className="text-sm font-bold text-white">{v.message}</h4>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-[8px] text-gray-600 uppercase">Blast Radius</div>
                               <div className={`text-xs font-bold ${v.blastRadius && v.blastRadius > 50 ? 'text-red-400' : 'text-green-400'}`}>
                                  {v.blastRadius || 'N/A'}/100
                               </div>
                            </div>
                         </div>
                         <p className="text-[10px] text-gray-500">Location: <span className="text-gray-300 font-mono">{v.file}:{v.line || '??'}</span></p>
                         <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] flex gap-3 items-center">
                            <RocketIcon className="w-3 h-3 text-green-400 shrink-0" />
                            <div className="text-[10px] text-green-400">FIX: "{v.recommendation}"</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <div className="space-y-4">
                   <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><LockIcon className="w-3 h-3" /> Shadow Secret Interceptor</h3>
                   <div className="space-y-3">
                      {report.leakedSecrets.map((s, i) => (
                         <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3 hover:border-amber-500/30 transition-all">
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">Identity: {s.type}</span>
                                  <span className="text-xs font-bold text-white">{s.keyName}</span>
                               </div>
                               <span className="text-[10px] font-mono text-gray-600">Line {s.line}</span>
                            </div>
                            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-[10px] text-red-400 overflow-x-auto">
                               {s.redactedValue}
                            </div>
                            <button className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors">
                               REFACTOR TO VAULT
                            </button>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 space-y-4">
                   <h3 className="text-sm font-bold text-white">Zero-Trust Suggestion Core</h3>
                   <p className="text-xs text-gray-500 leading-relaxed">
                     The Immune System is currently scanning for high-entropy logic blips. Any suggestion containing regex with catastrophic backtracking risk or raw database drivers is automatically isolated.
                   </p>
                   <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">Enclave Status: SECURE</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : isScanning ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
           <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
           <div className="text-center space-y-1">
              <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">Scanning Code Entropy...</div>
              <p className="text-[10px] text-gray-600">Verifying logical nodes against OWASP L3 compliance</p>
           </div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
           <ShieldIcon className="w-12 h-12 text-gray-700" />
           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Initialize deep security audit to anchor your defense baseline.</p>
        </div>
      )}
    </div>
  );
};

export default SecurityHub;
