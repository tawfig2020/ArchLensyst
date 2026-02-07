import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';

const METRICS = [
  { label: 'Avg Analysis Time', value: '4.2s', trend: '-12%', up: false, icon: Clock },
  { label: 'API Throughput', value: '1.2K/min', trend: '+8%', up: true, icon: TrendingUp },
  { label: 'CPU Usage', value: '34%', trend: '-5%', up: false, icon: Cpu },
  { label: 'Memory Usage', value: '2.1GB', trend: '+3%', up: true, icon: BarChart3 },
];

const TIMESERIES = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  analyses: Math.floor(Math.random() * 80 + 20),
  drift: Math.floor(Math.random() * 10),
}));

export default function Metrics() {
  const maxAnalyses = Math.max(...TIMESERIES.map(t => t.analyses));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-sentinel-blue" /> Metrics & Performance
        </h1>
        <p className="text-gray-400 text-sm mt-1">System performance and architecture metrics over time</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-citadel-surface border border-citadel-border rounded-2xl p-5">
            <m.icon className="w-5 h-5 mb-3 text-sentinel-blue" />
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">{m.label}</p>
              <span className={cn('text-xs font-semibold', m.up ? 'text-breach-red' : 'text-invariant-green')}>{m.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-citadel-surface border border-citadel-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Analyses (24h)</h2>
        <div className="flex items-end gap-1 h-40">
          {TIMESERIES.map((t, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(t.analyses / maxAnalyses) * 100}%` }}
                transition={{ delay: i * 0.02, duration: 0.5 }}
                className="w-full bg-sentinel-blue/60 rounded-t hover:bg-sentinel-blue transition-colors cursor-pointer min-h-[2px]"
                title={`${t.hour}: ${t.analyses} analyses`}
              />
              {i % 4 === 0 && <span className="text-[9px] text-gray-600 mt-1">{t.hour}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
