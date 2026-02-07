import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Lock, Eye, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

const VULNS = [
  { id: 1, severity: 'critical', title: 'SQL Injection in query builder', file: 'src/db/query.ts', cve: 'CVE-2024-1234', status: 'open' },
  { id: 2, severity: 'high', title: 'XSS vulnerability in template renderer', file: 'src/views/render.ts', cve: 'CVE-2024-5678', status: 'patched' },
  { id: 3, severity: 'medium', title: 'Insecure deserialization in API handler', file: 'src/api/handler.go', cve: null, status: 'open' },
  { id: 4, severity: 'low', title: 'Missing rate limiting on auth endpoint', file: 'src/auth/login.ts', cve: null, status: 'patched' },
  { id: 5, severity: 'high', title: 'Hardcoded credentials in config', file: 'src/config/db.py', cve: null, status: 'open' },
];

export default function SecurityHub() {
  const scoreColor = 'text-invariant-green';
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-7 h-7 text-purple-400" /> Security Hub
        </h1>
        <p className="text-gray-400 text-sm mt-1">Zero-trust security posture and vulnerability management</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Security Score', value: '94%', icon: Shield, color: 'text-invariant-green' },
          { label: 'Critical', value: VULNS.filter(v => v.severity === 'critical').length, icon: AlertTriangle, color: 'text-breach-red' },
          { label: 'Open Issues', value: VULNS.filter(v => v.status === 'open').length, icon: Eye, color: 'text-caution-amber' },
          { label: 'Patched', value: VULNS.filter(v => v.status === 'patched').length, icon: CheckCircle2, color: 'text-invariant-green' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-citadel-surface border border-citadel-border rounded-2xl p-5">
            <c.icon className={cn('w-5 h-5 mb-3', c.color)} />
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-citadel-surface border border-citadel-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-citadel-border">
          <h2 className="text-lg font-semibold text-white">Vulnerabilities</h2>
        </div>
        <div className="divide-y divide-citadel-border/50">
          {VULNS.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="px-6 py-4 hover:bg-citadel-elevated transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', v.severity === 'critical' ? 'bg-breach-red' : v.severity === 'high' ? 'bg-caution-amber' : v.severity === 'medium' ? 'bg-sentinel-blue' : 'bg-gray-500')} />
                  <div className="min-w-0">
                    <p className="text-sm text-white">{v.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">{v.file}</span>
                      {v.cve && <span className="text-xs text-breach-red font-mono">{v.cve}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', v.severity === 'critical' ? 'bg-breach-red-glow text-breach-red' : v.severity === 'high' ? 'bg-caution-amber-glow text-caution-amber' : v.severity === 'medium' ? 'bg-sentinel-blue-glow text-sentinel-blue' : 'bg-gray-500/10 text-gray-400')}>{v.severity}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', v.status === 'open' ? 'bg-caution-amber-glow text-caution-amber' : 'bg-invariant-green-glow text-invariant-green')}>{v.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
