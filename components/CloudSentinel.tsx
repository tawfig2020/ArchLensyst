/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useState } from 'react';
import { CloudAuditReport, CodeFile } from '../types';
import { ShieldIcon, AlertIcon, CloudIcon, LockIcon, CpuIcon } from './Icons';
import * as gemini from '../services/geminiService';

interface Props {
  codebase: CodeFile[];
}

const CloudSentinel: React.FC<Props> = ({ codebase }) => {
  const [report, setReport] = useState<CloudAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await gemini.performCloudInfrastructureAudit(codebase);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-[#30363d] pb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Cloud <span className="text-[#3fb950]">Sentinel</span></h2>
          <p className="text-[#8b949e] max-w-2xl font-medium mt-4">Zero-Trust Infrastructure Governance. Auditing Terraform, Docker, and IAM roles against real application usage.</p>
        </div>
        {!report && !isAuditing && (
          <button 
            onClick={handleRunAudit}
            className="bg-[#3fb950] text-white px-12 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#3fb95033]"
          >
            INITIALIZE CLOUD AUDIT
          </button>
        )}
      </header>

      {report ? (
        <div className="space-y-12">
          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-6">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><LockIcon /> Privilege Overhang</div>
               <div className="text-5xl font-black italic text-[#f85149]">
                  {Math.round(report.resources.reduce((acc, r) => acc + r.privilegeOverhang, 0) / (report.resources.length || 1))}%
               </div>
               <div className="text-[10px] font-bold text-[#484f58] uppercase">Granted vs. Required Permissions</div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-6">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><ShieldIcon /> Zero-Trust Score</div>
               <div className="text-5xl font-black italic text-[#3fb950]">{report.score}%</div>
               <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3fb950]" style={{ width: `${report.score}%` }}></div>
               </div>
            </div>
            <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 space-y-6">
               <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest flex items-center gap-2"><CloudIcon /> Exposed Resources</div>
               <div className="text-5xl font-black italic text-[#d29922]">
                  {report.resources.filter(r => r.isPublic).length}
               </div>
               <div className="text-[10px] font-bold text-[#484f58] uppercase">Public ACLs Detected</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Resource Inventory */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><CpuIcon /> Resource Inventory</h3>
                <div className="space-y-4">
                   {report.resources.map((res, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#30363d] p-8 rounded-[35px] hover:border-[#3fb95044] transition-all group relative overflow-hidden">
                         {res.isPublic && (
                           <div className="absolute top-0 right-0 bg-[#f85149] text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest">PUBLIC ACL</div>
                         )}
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="text-[10px] font-black text-[#3fb950] uppercase mb-1">{res.type}</div>
                               <h4 className="text-lg font-black text-white italic tracking-tighter">{res.name}</h4>
                            </div>
                         </div>
                         <div className="flex flex-wrap gap-2 mt-4">
                            {res.permissions.map((p, j) => (
                               <span key={j} className="px-2 py-1 bg-white/5 text-[9px] text-[#8b949e] rounded-lg border border-white/5 font-mono">{p}</span>
                            ))}
                         </div>
                         {res.privilegeOverhang > 50 && (
                            <div className="mt-6 p-4 bg-[#f851490a] border border-[#f8514922] rounded-2xl flex justify-between items-center">
                               <span className="text-[10px] text-[#f85149] font-black uppercase">Privilege Overhang: {res.privilegeOverhang}%</span>
                               <button className="text-[9px] font-black text-white uppercase hover:underline">Apply Narrowing PR</button>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>

             {/* Critical Misconfigurations */}
             <div className="space-y-6">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><AlertIcon /> Critical Findings</h3>
                <div className="space-y-4">
                   {report.vulnerabilities.map((v, i) => (
                      <div key={i} className={`p-6 rounded-[30px] border flex gap-6 ${
                        v.severity === 'error' ? 'bg-[#f851490a] border-[#f8514933]' : 'bg-[#d299220a] border-[#d2992233]'
                      }`}>
                         <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
                            v.severity === 'error' ? 'text-[#f85149]' : 'text-[#d29922]'
                         }`}>
                            <ShieldIcon />
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-black uppercase">{v.type} Breach</span>
                               <span className="text-[9px] text-[#484f58] uppercase font-bold">{v.resourceId}</span>
                            </div>
                            <p className="text-sm text-[#c9d1d9] font-medium leading-snug">{v.message}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="bg-[#161b22] p-10 rounded-[50px] border border-white/5 space-y-6 mt-12">
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter underline decoration-[#3fb950] decoration-4 underline-offset-8">Narrowing Rationale</h3>
                   <div className="font-mono text-[11px] text-[#8b949e] bg-[#0d1117] p-6 rounded-3xl border border-white/5 whitespace-pre">
{`# Proposed Narrowing for ${report.resources[0]?.name}
resource "aws_iam_policy" "narrowed" {
  name        = "NarrowedAccess"
  description = "ArchLens: Narrowed based on code usage"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["s3:PutObject", "s3:GetObject"]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}`}
                   </div>
                   <button className="w-full bg-[#3fb950] text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#3fb95022]">DEPLOY NARROWED POLICY</button>
                </div>
             </div>
          </div>
        </div>
      ) : isAuditing ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-8">
           <div className="w-16 h-16 border-4 border-[#3fb950]/30 border-t-[#3fb950] rounded-full animate-spin" />
           <div className="text-center space-y-2">
              <div className="text-[12px] font-black text-[#3fb950] uppercase tracking-[0.4em] animate-pulse">Scanning IaC Perimeter...</div>
              <p className="text-[10px] text-[#484f58] uppercase font-bold">Cross-referencing IAM Roles with Application Logic</p>
           </div>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8 opacity-40">
           <div className="scale-[4] text-[#30363d]"><CloudIcon /></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#484f58]">Initialize Cloud Sentinel to audit Infrastructure-as-Code.</p>
        </div>
      )}
    </div>
  );
};

export default CloudSentinel;
