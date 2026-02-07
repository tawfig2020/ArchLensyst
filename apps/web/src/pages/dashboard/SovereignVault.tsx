import { motion } from 'framer-motion';
import { Lock, FileSignature, Link2, ShieldCheck, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

const LEDGER = [
  { id: 1, action: 'Decision recorded', title: 'Migrate to event-driven architecture', hash: 'a3f8b2...c91d', time: '1 day ago', verified: true },
  { id: 2, action: 'Rationale signed', title: 'Adopt gRPC for inter-service communication', hash: 'e7d1c4...5f2a', time: '3 days ago', verified: true },
  { id: 3, action: 'Policy enforced', title: 'Zero-trust mTLS requirement for all services', hash: 'b9e6f3...8d4c', time: '1 week ago', verified: true },
  { id: 4, action: 'Decision recorded', title: 'PostgreSQL as primary data store over DynamoDB', hash: 'c2a7d8...1e5b', time: '2 weeks ago', verified: true },
];

export default function SovereignVault() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Lock className="w-7 h-7 text-invariant-green" /> Sovereign Vault
            <span className="text-xs px-2 py-0.5 bg-purple-400/10 text-purple-400 border border-purple-400/30 rounded-full font-semibold">Institution</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Cryptographically signed, immutable architectural decision ledger</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all shadow-glow-blue">
          <Plus className="w-4 h-4" /> Record Decision
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ledger Entries', value: LEDGER.length, icon: Link2, color: 'text-sentinel-blue' },
          { label: 'Verified', value: LEDGER.filter(l => l.verified).length, icon: ShieldCheck, color: 'text-invariant-green' },
          { label: 'Signatures', value: LEDGER.length * 2, icon: FileSignature, color: 'text-purple-400' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-citadel-surface border border-citadel-border rounded-2xl p-5">
            <c.icon className={cn('w-5 h-5 mb-3', c.color)} />
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-citadel-surface border border-citadel-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-citadel-border"><h2 className="text-lg font-semibold text-white">Immutable Ledger</h2></div>
        <div className="divide-y divide-citadel-border/50">
          {LEDGER.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="px-6 py-4 hover:bg-citadel-elevated transition-all">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-invariant-green-glow flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-invariant-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{entry.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs text-gray-500">{entry.action}</span>
                    <span className="text-xs font-mono text-sentinel-blue bg-sentinel-blue-glow px-2 py-0.5 rounded">{entry.hash}</span>
                    <span className="text-xs text-gray-500">{entry.time}</span>
                    {entry.verified && <span className="text-xs text-invariant-green flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Verified</span>}
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
