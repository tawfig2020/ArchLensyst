import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, GitBranch, Shield, AlertTriangle, CheckCircle2, Code2,
  TrendingUp, Clock, Zap, ArrowUpRight, ArrowDownRight, BarChart3,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function Overview() {
  const { user } = useAuthStore();
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'API Gateway', status: 'healthy', latency: '12ms' },
    { name: 'Cognitive AI', status: 'healthy', latency: '45ms' },
    { name: 'Citadel', status: 'healthy', latency: '8ms' },
    { name: 'Vault', status: 'healthy', latency: '15ms' },
    { name: 'PostgreSQL', status: 'healthy', latency: '3ms' },
    { name: 'Redis', status: 'healthy', latency: '1ms' },
  ]);
  const [liveHealth, setLiveHealth] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('http://localhost:8000/health');
        if (res.ok) {
          setServices((prev) =>
            prev.map((s) => (s.name === 'API Gateway' ? { ...s, status: 'healthy' as const } : s))
          );
        }
      } catch {
        setServices((prev) =>
          prev.map((s) => (s.name === 'API Gateway' ? { ...s, status: 'down' as const } : s))
        );
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Repositories', value: '24', change: '+3', up: true, icon: Code2, color: 'text-sentinel-blue' },
    { label: 'Analyses Run', value: '1,847', change: '+127', up: true, icon: Activity, color: 'text-invariant-green' },
    { label: 'Drift Events', value: '12', change: '-5', up: false, icon: AlertTriangle, color: 'text-caution-amber' },
    { label: 'Security Score', value: '94%', change: '+2%', up: true, icon: Shield, color: 'text-purple-400' },
  ];

  const recentActivity = [
    { action: 'Analysis completed', repo: 'archlens-core', time: '2 min ago', type: 'success' },
    { action: 'Drift detected', repo: 'payment-service', time: '15 min ago', type: 'warning' },
    { action: 'Rule violation fixed', repo: 'auth-gateway', time: '1 hour ago', type: 'success' },
    { action: 'New dependency added', repo: 'data-pipeline', time: '2 hours ago', type: 'info' },
    { action: 'Security scan passed', repo: 'archlens-core', time: '3 hours ago', type: 'success' },
    { action: 'Phantom execution run', repo: 'billing-api', time: '5 hours ago', type: 'info' },
  ];

  const architectureHealth = [
    { label: 'Coupling Score', value: 87, max: 100, color: 'bg-invariant-green' },
    { label: 'Cohesion Score', value: 92, max: 100, color: 'bg-sentinel-blue' },
    { label: 'Complexity Index', value: 34, max: 100, color: 'bg-caution-amber' },
    { label: 'Test Coverage', value: 78, max: 100, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div {...fadeUp}>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here's your architecture intelligence overview for {user?.orgName}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-citadel-surface border border-citadel-border rounded-2xl p-5 hover:border-citadel-border-hover transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color, 'bg-current/10')}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <span className={cn(
                'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
                stat.up ? 'text-invariant-green bg-invariant-green-glow' : 'text-breach-red bg-breach-red-glow'
              )}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Architecture Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-citadel-surface border border-citadel-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sentinel-blue" />
              Architecture Health
            </h2>
            <span className="text-xs text-gray-500">Updated 2 min ago</span>
          </div>
          <div className="space-y-5">
            {architectureHealth.map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{metric.label}</span>
                  <span className="text-sm font-bold text-white">{metric.value}%</span>
                </div>
                <div className="h-2 bg-citadel-elevated rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={cn('h-full rounded-full', metric.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Service Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-citadel-surface border border-citadel-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-invariant-green" />
            Service Status
          </h2>
          <div className="space-y-3">
            {services.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between py-2 border-b border-citadel-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    svc.status === 'healthy' ? 'bg-invariant-green animate-pulse' :
                    svc.status === 'degraded' ? 'bg-caution-amber' : 'bg-breach-red'
                  )} />
                  <span className="text-sm text-gray-300">{svc.name}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{svc.latency}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-citadel-surface border border-citadel-border rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-sentinel-blue" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-citadel-border/50 last:border-0">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                item.type === 'success' ? 'bg-invariant-green-glow text-invariant-green' :
                item.type === 'warning' ? 'bg-caution-amber-glow text-caution-amber' :
                'bg-sentinel-blue-glow text-sentinel-blue'
              )}>
                {item.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                 item.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                 <GitBranch className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{item.action}</p>
                <p className="text-xs text-gray-500 font-mono">{item.repo}</p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
