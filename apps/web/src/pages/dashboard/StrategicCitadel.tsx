import { motion } from 'framer-motion';
import { Building2, Network, Activity, ShieldCheck, Globe, Server } from 'lucide-react';
import { cn } from '../../lib/utils';

const MESH_NODES = [
  { name: 'API Gateway', status: 'healthy', connections: 5, uptime: '99.99%' },
  { name: 'Cognitive AI', status: 'healthy', connections: 3, uptime: '99.97%' },
  { name: 'Parser Service', status: 'degraded', connections: 2, uptime: '98.50%' },
  { name: 'Audit Service', status: 'healthy', connections: 4, uptime: '99.95%' },
  { name: 'Vault Service', status: 'healthy', connections: 2, uptime: '99.99%' },
];

export default function StrategicCitadel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Building2 className="w-7 h-7 text-purple-400" /> Strategic Citadel
          <span className="text-xs px-2 py-0.5 bg-purple-400/10 text-purple-400 border border-purple-400/30 rounded-full font-semibold">Institution</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Enterprise architecture command center and service mesh oversight</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Mesh Nodes', value: MESH_NODES.length, icon: Server, color: 'text-sentinel-blue' },
          { label: 'Avg Uptime', value: '99.68%', icon: Activity, color: 'text-invariant-green' },
          { label: 'ADR Decisions', value: '47', icon: ShieldCheck, color: 'text-purple-400' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-citadel-surface border border-citadel-border rounded-2xl p-5">
            <c.icon className={cn('w-5 h-5 mb-3', c.color)} />
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-citadel-surface border border-citadel-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4"><Network className="w-5 h-5 text-sentinel-blue" /> Service Mesh Topology</h2>
        <div className="h-48 flex items-center justify-center border border-dashed border-citadel-border rounded-xl bg-citadel-bg mb-6">
          <div className="text-center"><Globe className="w-10 h-10 text-gray-600 mx-auto mb-2" /><p className="text-gray-500 text-sm">Interactive mesh visualization</p></div>
        </div>
        <div className="space-y-3">
          {MESH_NODES.map((node, i) => (
            <motion.div key={node.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between py-3 px-4 bg-citadel-bg rounded-xl border border-citadel-border/50">
              <div className="flex items-center gap-3">
                <div className={cn('w-2.5 h-2.5 rounded-full', node.status === 'healthy' ? 'bg-invariant-green animate-pulse' : 'bg-caution-amber')} />
                <span className="text-sm text-white font-medium">{node.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{node.connections} connections</span>
                <span className="font-mono text-invariant-green">{node.uptime}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
