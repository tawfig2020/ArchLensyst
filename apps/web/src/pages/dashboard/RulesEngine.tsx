import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const RULES = [
  { id: 1, name: 'No Circular Dependencies', severity: 'critical', enabled: true, violations: 2, description: 'Prevent circular import chains between modules' },
  { id: 2, name: 'Max File Complexity', severity: 'warning', enabled: true, violations: 5, description: 'Cyclomatic complexity must not exceed 15 per function' },
  { id: 3, name: 'Layer Isolation', severity: 'critical', enabled: true, violations: 0, description: 'Presentation layer cannot directly access data layer' },
  { id: 4, name: 'Test Coverage Minimum', severity: 'warning', enabled: true, violations: 3, description: 'All modules must maintain at least 80% test coverage' },
  { id: 5, name: 'No Direct DB Access', severity: 'critical', enabled: false, violations: 0, description: 'Services must use repository pattern for database operations' },
  { id: 6, name: 'API Versioning', severity: 'info', enabled: true, violations: 1, description: 'All public API endpoints must include version prefix' },
];

export default function RulesEngine() {
  const [rules, setRules] = useState(RULES);
  const toggle = (id: number) => setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-purple-400" /> Rules Engine
          </h1>
          <p className="text-gray-400 text-sm mt-1">Define and enforce architectural invariants</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all shadow-glow-blue">
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>
      <div className="grid gap-4">
        {rules.map((rule, i) => (
          <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={cn('bg-citadel-surface border rounded-2xl p-5 transition-all', rule.enabled ? 'border-citadel-border' : 'border-citadel-border/50 opacity-60')}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-sm font-semibold text-white">{rule.name}</h3>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', rule.severity === 'critical' ? 'bg-breach-red-glow text-breach-red' : rule.severity === 'warning' ? 'bg-caution-amber-glow text-caution-amber' : 'bg-sentinel-blue-glow text-sentinel-blue')}>{rule.severity}</span>
                  {rule.violations > 0 && rule.enabled && (
                    <span className="flex items-center gap-1 text-xs text-caution-amber"><AlertTriangle className="w-3 h-3" />{rule.violations} violations</span>
                  )}
                  {rule.violations === 0 && rule.enabled && (
                    <span className="flex items-center gap-1 text-xs text-invariant-green"><CheckCircle2 className="w-3 h-3" />Passing</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{rule.description}</p>
              </div>
              <button onClick={() => toggle(rule.id)} className={cn('w-11 h-6 rounded-full transition-all flex items-center px-0.5', rule.enabled ? 'bg-invariant-green' : 'bg-citadel-border')}>
                <div className={cn('w-5 h-5 rounded-full bg-white transition-transform', rule.enabled ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
