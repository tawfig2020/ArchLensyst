import { motion } from 'framer-motion';
import { ScrollText, User, Clock, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';

const AUDIT_ENTRIES = [
  { id: 1, user: 'Alex Rivera', action: 'Triggered analysis', target: 'archlens-core', time: '2 min ago', type: 'analysis' },
  { id: 2, user: 'Dr. Sarah Chen', action: 'Created rule', target: 'no-circular-deps', time: '15 min ago', type: 'rule' },
  { id: 3, user: 'System', action: 'Drift detected', target: 'payment-service', time: '1 hour ago', type: 'drift' },
  { id: 4, user: 'Alex Rivera', action: 'Resolved vulnerability', target: 'CVE-2024-1234', time: '2 hours ago', type: 'security' },
  { id: 5, user: 'CI/CD Pipeline', action: 'Deployed version', target: 'v3.2.1', time: '3 hours ago', type: 'deploy' },
  { id: 6, user: 'Dr. Sarah Chen', action: 'Updated organization settings', target: 'TechCorp Global', time: '5 hours ago', type: 'settings' },
  { id: 7, user: 'System', action: 'Phantom execution completed', target: 'billing-api', time: '6 hours ago', type: 'analysis' },
  { id: 8, user: 'Alex Rivera', action: 'Added repository', target: 'data-pipeline', time: '1 day ago', type: 'repo' },
];

const typeColors: Record<string, string> = {
  analysis: 'bg-sentinel-blue-glow text-sentinel-blue',
  rule: 'bg-purple-400/10 text-purple-400',
  drift: 'bg-caution-amber-glow text-caution-amber',
  security: 'bg-breach-red-glow text-breach-red',
  deploy: 'bg-invariant-green-glow text-invariant-green',
  settings: 'bg-gray-400/10 text-gray-400',
  repo: 'bg-sentinel-blue-glow text-sentinel-blue',
};

export default function AuditLog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ScrollText className="w-7 h-7 text-sentinel-blue" /> Audit Log
        </h1>
        <p className="text-gray-400 text-sm mt-1">Immutable audit trail of all system actions</p>
      </div>
      <div className="bg-citadel-surface border border-citadel-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-citadel-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{AUDIT_ENTRIES.length} Events</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 border border-citadel-border rounded-lg hover:text-white hover:border-citadel-border-hover transition-all">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>
        <div className="divide-y divide-citadel-border/50">
          {AUDIT_ENTRIES.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="px-6 py-4 hover:bg-citadel-elevated transition-all">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-citadel-elevated flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{entry.user}</span>{' '}
                    <span className="text-gray-400">{entry.action}</span>{' '}
                    <span className="font-mono text-sentinel-blue">{entry.target}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{entry.time}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', typeColors[entry.type])}>{entry.type}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
