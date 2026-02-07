import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import {
  Brain, GitBranch, Shield, Zap, BarChart3, Users,
  Lock, Eye, Workflow, Gauge, Bell, Globe,
} from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI-Driven Analysis',
    description: 'Deep architectural understanding powered by advanced AI. Identifies patterns, anti-patterns, and optimization opportunities across your entire codebase.',
    color: 'sentinel-blue',
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: 'Dependency Intelligence',
    description: 'Interactive 3D dependency graphs with real-time impact analysis. See exactly how changes ripple through your architecture.',
    color: 'purple-400',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Cryptographic Audit Trails',
    description: 'Immutable, cryptographically signed records of every architectural decision. Compliance-ready proof that your architecture meets standards.',
    color: 'invariant-green',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-time Analysis',
    description: 'Sub-second analysis of architectural changes. Get instant feedback on impact, risk, and compliance before code reaches production.',
    color: 'caution-amber',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Architectural Health Score',
    description: 'A comprehensive, data-driven health score for your entire system. Track improvement over time with actionable metrics.',
    color: 'sentinel-blue',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Collaborative Reviews',
    description: 'WebRTC-powered real-time collaborative architecture reviews. Share insights, annotate decisions, and align teams instantly.',
    color: 'purple-400',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Security Perimeter',
    description: 'Automated detection of dependency vulnerabilities, exposed attack surfaces, and compliance violations. Security built into architecture.',
    color: 'breach-red',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Phantom Execution',
    description: 'Simulate changes before deploying. See the architectural impact of proposed refactors without touching production code.',
    color: 'invariant-green',
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Synthetic Fix Engine',
    description: 'AI-generated refactoring suggestions that maintain architectural intent. One-click application of architectural improvements.',
    color: 'caution-amber',
  },
  {
    icon: <Gauge className="w-6 h-6" />,
    title: 'Performance Intelligence',
    description: 'Bundle analysis, Web Vitals tracking, and performance budgets. Ensure architectural decisions align with performance goals.',
    color: 'sentinel-blue',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Drift Alerts',
    description: 'Proactive notifications when architecture drifts from intended design. Catch erosion before it compounds into system failure.',
    color: 'breach-red',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Newcomer Onboarding',
    description: 'AI-generated architecture guides for new team members. Reduce ramp-up time from months to days with contextual walkthroughs.',
    color: 'purple-400',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  'sentinel-blue': { bg: 'bg-sentinel-blue/10', border: 'border-sentinel-blue/20', text: 'text-sentinel-blue' },
  'purple-400': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  'invariant-green': { bg: 'bg-invariant-green/10', border: 'border-invariant-green/20', text: 'text-invariant-green' },
  'caution-amber': { bg: 'bg-caution-amber/10', border: 'border-caution-amber/20', text: 'text-caution-amber' },
  'breach-red': { bg: 'bg-breach-red/10', border: 'border-breach-red/20', text: 'text-breach-red' },
};

export default function FeaturesSection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="features" className="section-padding relative">
      <div className="absolute inset-0 mesh-bg opacity-20" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-sentinel-blue uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            Everything You Need. <span className="gradient-text">Nothing You Don't.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A seamlessly integrated platform where every capability works in concert — not in silos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const c = colorMap[feature.color] ?? colorMap['sentinel-blue'];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
                className="glass-card p-5 hover:border-citadel-border-hover transition-all duration-300 group"
              >
                <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center ${c.text} mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
