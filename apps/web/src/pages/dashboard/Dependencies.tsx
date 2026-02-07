import { motion } from 'framer-motion';
import { GitBranch, AlertTriangle, Package, ArrowRight, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

const DEPS = [
  { name: 'react', version: '18.3.1', latest: '18.3.1', type: 'production', health: 'ok' },
  { name: 'express', version: '4.18.2', latest: '4.21.0', type: 'production', health: 'outdated' },
  { name: 'lodash', version: '4.17.20', latest: '4.17.21', type: 'production', health: 'vulnerable' },
  { name: 'typescript', version: '5.7.3', latest: '5.7.3', type: 'dev', health: 'ok' },
  { name: 'axios', version: '1.6.0', latest: '1.7.9', type: 'production', health: 'outdated' },
  { name: 'prisma', version: '5.8.0', latest: '6.3.0', type: 'production', health: 'outdated' },
  { name: 'jest', version: '29.7.0', latest: '29.7.0', type: 'dev', health: 'ok' },
  { name: 'next', version: '14.1.0', latest: '15.1.0', type: 'production', health: 'outdated' },
];

export default function Dependencies() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <GitBranch className="w-7 h-7 text-sentinel-blue" /> Dependency Graph
        </h1>
        <p className="text-gray-400 text-sm mt-1">Track, audit, and visualize your dependency tree</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Deps', value: DEPS.length, icon: Package, color: 'text-sentinel-blue' },
          { label: 'Up to Date', value: DEPS.filter(d => d.health === 'ok').length, icon: GitBranch, color: 'text-invariant-green' },
          { label: 'Outdated', value: DEPS.filter(d => d.health === 'outdated').length, icon: Layers, color: 'text-caution-amber' },
          { label: 'Vulnerable', value: DEPS.filter(d => d.health === 'vulnerable').length, icon: AlertTriangle, color: 'text-breach-red' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-citadel-surface border border-citadel-border rounded-2xl p-5">
            <c.icon className={cn('w-5 h-5 mb-3', c.color)} />
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Dependency graph placeholder */}
      <div className="bg-citadel-surface border border-citadel-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Dependency Tree</h2>
        <div className="h-48 flex items-center justify-center border border-dashed border-citadel-border rounded-xl bg-citadel-bg">
          <div className="text-center">
            <GitBranch className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Interactive dependency graph visualization</p>
            <p className="text-gray-600 text-xs mt-1">Connect a repository to visualize</p>
          </div>
        </div>
      </div>

      <div className="bg-citadel-surface border border-citadel-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-citadel-border">
          <h2 className="text-lg font-semibold text-white">Package List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-citadel-border text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Package</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Current</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Latest</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-citadel-border/50">
              {DEPS.map((dep) => (
                <tr key={dep.name} className="hover:bg-citadel-elevated transition-all">
                  <td className="px-6 py-3 text-sm font-mono text-white">{dep.name}</td>
                  <td className="px-6 py-3 text-sm font-mono text-gray-400">{dep.version}</td>
                  <td className="px-6 py-3 text-sm font-mono text-gray-400">{dep.latest}</td>
                  <td className="px-6 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', dep.type === 'production' ? 'bg-sentinel-blue-glow text-sentinel-blue' : 'bg-gray-500/10 text-gray-400')}>{dep.type}</span></td>
                  <td className="px-6 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', dep.health === 'ok' ? 'bg-invariant-green-glow text-invariant-green' : dep.health === 'outdated' ? 'bg-caution-amber-glow text-caution-amber' : 'bg-breach-red-glow text-breach-red')}>{dep.health}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
