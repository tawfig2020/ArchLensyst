import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, AlertTriangle, CheckCircle2, Clock, Play, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const DRIFT_EVENTS = [
  { id: 1, type: 'structural', severity: 'critical', repo: 'payment-service', description: 'New circular dependency detected between PaymentController and OrderService', time: '2 hours ago', status: 'open' },
  { id: 2, type: 'dependency', severity: 'warning', repo: 'auth-gateway', description: 'Outdated dependency lodash@4.17.20 has known CVE-2021-23337', time: '5 hours ago', status: 'open' },
  { id: 3, type: 'architectural', severity: 'critical', repo: 'data-pipeline', description: 'Layer violation: presentation layer directly accessing database layer', time: '1 day ago', status: 'resolved' },
  { id: 4, type: 'coupling', severity: 'warning', repo: 'archlens-core', description: 'Afferent coupling increased by 40% in UserService module', time: '2 days ago', status: 'open' },
  { id: 5, type: 'structural', severity: 'info', repo: 'billing-api', description: 'New module detected: invoice-generator, pending architectural review', time: '3 days ago', status: 'resolved' },
];

export default function DriftDetection() {
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const runScan = async () => {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setScanning(false);
  };

  const filtered = DRIFT_EVENTS.filter((e) => filter === 'all' || e.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Crosshair className="w-7 h-7 text-caution-amber" />
            Drift Detection
          </h1>
          <p className="text-gray-400 text-sm mt-1">Monitor architectural invariant violations in real-time</p>
        </div>
        <button onClick={runScan} disabled={scanning} className="flex items-center gap-2 px-5 py-2.5 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-glow-blue">
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {scanning ? 'Scanning...' : 'Run Drift Scan'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Open Events', value: DRIFT_EVENTS.filter((e) => e.status === 'open').length, icon: AlertTriangle, color: 'text-caution-amber' },
          { label: 'Resolved', value: DRIFT_EVENTS.filter((e) => e.status === 'resolved').length, icon: CheckCircle2, color: 'text-invariant-green' },
          { label: 'Last Scan', value: '2h ago', icon: Clock, color: 'text-sentinel-blue' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-citadel-surface border border-citadel-border rounded-2xl p-5">
            <card.icon className={cn('w-5 h-5 mb-3', card.color)} />
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-citadel-surface border border-citadel-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-citadel-border flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-white">Drift Events</h2>
          <div className="flex gap-2">
            {(['all', 'open', 'resolved'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize', filter === f ? 'bg-sentinel-blue/10 text-sentinel-blue border border-sentinel-blue/20' : 'text-gray-400 hover:text-white border border-transparent')}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-citadel-border/50">
          {filtered.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="px-6 py-4 hover:bg-citadel-elevated transition-all">
              <div className="flex items-start gap-4">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', event.severity === 'critical' ? 'bg-breach-red-glow text-breach-red' : event.severity === 'warning' ? 'bg-caution-amber-glow text-caution-amber' : 'bg-sentinel-blue-glow text-sentinel-blue')}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">{event.description}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs font-mono text-sentinel-blue">{event.repo}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', event.severity === 'critical' ? 'bg-breach-red-glow text-breach-red' : event.severity === 'warning' ? 'bg-caution-amber-glow text-caution-amber' : 'bg-sentinel-blue-glow text-sentinel-blue')}>{event.severity}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', event.status === 'open' ? 'bg-caution-amber-glow text-caution-amber' : 'bg-invariant-green-glow text-invariant-green')}>{event.status}</span>
                    <span className="text-xs text-gray-500">{event.time}</span>
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
