import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Code2, Search, Brain, AlertTriangle, Shield, Zap, ChevronRight } from 'lucide-react';

const sampleCode = `// PaymentService.ts
import { UserService } from '../user/UserService';

export class PaymentService {
  private userService = new UserService();

  async processPayment(userId: string, amount: number) {
    const user = this.userService.getInternalState(userId);
    const balance = user._accountBalance; // Direct internal access
    
    if (balance >= amount) {
      await this.userService._deductBalance(userId, amount);
      return { success: true, remaining: balance - amount };
    }
    throw new Error('Insufficient funds');
  }
}`;

const surfaceFindings = [
  { type: 'warning', text: 'Unused variable: balance may be stale after deduction' },
  { type: 'info', text: 'Missing null check on user object' },
  { type: 'style', text: 'Consider using optional chaining for user._accountBalance' },
];

const archlensFindings = [
  {
    severity: 'critical',
    icon: <AlertTriangle className="w-4 h-4" />,
    title: 'Circular Dependency Detected',
    detail: 'PaymentService → UserService creates a bi-directional coupling that will break during the Q3 user service migration.',
    color: 'breach-red',
  },
  {
    severity: 'architectural',
    icon: <Shield className="w-4 h-4" />,
    title: 'Internal API Boundary Violation',
    detail: 'Direct access to _accountBalance and _deductBalance bypasses the UserService public contract. 14 downstream services depend on this contract.',
    color: 'caution-amber',
  },
  {
    severity: 'prediction',
    icon: <Brain className="w-4 h-4" />,
    title: 'Future Impact Prediction',
    detail: 'This coupling pattern will cascade to Billing, Notifications, and Analytics services within 6 months. Estimated remediation cost: 340 engineering hours.',
    color: 'sentinel-blue',
  },
  {
    severity: 'fix',
    icon: <Zap className="w-4 h-4" />,
    title: 'Recommended Refactor',
    detail: 'Extract a shared PaymentContract interface. Replace direct access with event-driven balance queries. Reduces future maintenance by 40%.',
    color: 'invariant-green',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  'breach-red': { bg: 'bg-breach-red/10', border: 'border-breach-red/20', text: 'text-breach-red' },
  'caution-amber': { bg: 'bg-caution-amber/10', border: 'border-caution-amber/20', text: 'text-caution-amber' },
  'sentinel-blue': { bg: 'bg-sentinel-blue/10', border: 'border-sentinel-blue/20', text: 'text-sentinel-blue' },
  'invariant-green': { bg: 'bg-invariant-green/10', border: 'border-invariant-green/20', text: 'text-invariant-green' },
};

export default function InteractiveProofSection() {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'surface' | 'deep'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const { ref, isVisible } = useIntersectionObserver();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnalysis = () => {
    setPhase('scanning');
    setScanProgress(0);

    intervalRef.current = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };

  useEffect(() => {
    if (scanProgress >= 50 && phase === 'scanning') {
      setPhase('surface');
    }
    if (scanProgress >= 100 && phase === 'surface') {
      setPhase('deep');
    }
  }, [scanProgress, phase]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sentinel-blue/30 to-transparent" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-sentinel-blue uppercase tracking-wider">
            ArchLens In Action
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            See What ArchLens Sees{' '}
            <span className="gradient-text">That You Can't</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Watch how ArchLens analyzes a real code snippet and reveals hidden architectural risks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-citadel-elevated border-b border-citadel-border">
                <Code2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 font-mono">PaymentService.ts</span>
                <div className="ml-auto flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-breach-red/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-caution-amber/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-invariant-green/60" />
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                  {sampleCode.split('\n').map((line, i) => (
                    <div key={i} className="flex hover:bg-white/[0.02] -mx-4 px-4">
                      <span className="text-gray-600 w-8 text-right mr-4 select-none flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className={
                        phase === 'deep' && (line.includes('getInternalState') || line.includes('_accountBalance') || line.includes('_deductBalance'))
                          ? 'text-breach-red bg-breach-red/10 px-1 rounded'
                          : ''
                      }>
                        {line}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Scan Button */}
              {phase === 'idle' && (
                <div className="p-4 border-t border-citadel-border">
                  <button
                    onClick={startAnalysis}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Analyze with ArchLens
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Progress bar */}
              {phase !== 'idle' && (
                <div className="px-4 py-3 border-t border-citadel-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">
                      {phase === 'deep' ? 'Analysis Complete' : 'Analyzing...'}
                    </span>
                    <span className="text-xs text-sentinel-blue font-mono">{Math.min(scanProgress, 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-sentinel-blue to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(scanProgress, 100)}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Surface Level */}
            <AnimatePresence>
              {(phase === 'surface' || phase === 'deep') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-5 transition-all duration-500 ${
                    phase === 'deep' ? 'opacity-40 scale-[0.98]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-400">Traditional Analysis</h4>
                  </div>
                  <div className="space-y-2">
                    {surfaceFindings.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-xs text-gray-500"
                      >
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          f.type === 'warning' ? 'bg-caution-amber' : 'bg-gray-600'
                        }`} />
                        {f.text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ArchLens Deep Analysis */}
            <AnimatePresence>
              {phase === 'deep' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-sentinel-blue" />
                    <h4 className="text-sm font-bold text-sentinel-blue">ArchLens Architectural Insight</h4>
                  </div>
                  <div className="space-y-3">
                    {archlensFindings.map((finding, i) => {
                      const c = colorMap[finding.color];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.15 }}
                          className={`glass-card p-4 ${c.border} border`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-6 h-6 rounded ${c.bg} ${c.border} border flex items-center justify-center ${c.text}`}>
                              {finding.icon}
                            </div>
                            <span className={`text-sm font-bold ${c.text}`}>{finding.title}</span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed ml-8">
                            {finding.detail}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* AHA Moment */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-4 p-4 rounded-xl bg-gradient-to-r from-sentinel-blue/5 via-purple-500/5 to-invariant-green/5 border border-purple-500/20 text-center"
                  >
                    <p className="text-sm text-purple-300 font-semibold italic">
                      "This is the insight that prevents next quarter's crisis"
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Idle state */}
            {phase === 'idle' && (
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <Brain className="w-12 h-12 text-gray-700 mb-4" />
                <p className="text-gray-500 text-sm">
                  Click "Analyze with ArchLens" to see the difference between surface-level and architectural analysis.
                </p>
              </div>
            )}

            {/* Scanning state */}
            {phase === 'scanning' && (
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full border-2 border-sentinel-blue/30 border-t-sentinel-blue animate-spin mb-4" />
                <p className="text-gray-400 text-sm">
                  Building architectural model...
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
