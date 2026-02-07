import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Sparkles, Monitor, Users, ArrowRight } from 'lucide-react';

const actions = [
  {
    type: 'primary',
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Begin Architecting Your Legacy',
    subtitle: "Schedule a discovery session where we'll map your architectural genome.",
    href: '/signup',
    className: 'bg-blue-purple text-white hover:shadow-sentinel shadow-lg hover:scale-[1.02]',
    iconBg: 'bg-white/20',
    tag: 'Aspiration',
    tagColor: 'text-purple-300',
  },
  {
    type: 'secondary',
    icon: <Monitor className="w-6 h-6" />,
    title: 'Experience Architectural Consciousness',
    subtitle: 'Interactive demo with your own codebase (completely confidential).',
    href: '/signin',
    className: 'glass-card hover:border-sentinel-blue/30 hover:scale-[1.02]',
    iconBg: 'bg-sentinel-blue/10',
    tag: 'Proof',
    tagColor: 'text-sentinel-blue',
  },
  {
    type: 'tertiary',
    icon: <Users className="w-6 h-6" />,
    title: 'Join Engineering Leaders Who See Differently',
    subtitle: 'Limited-seat executive briefing on AI-driven architecture.',
    href: '#',
    className: 'glass-card hover:border-purple-500/30 hover:scale-[1.02]',
    iconBg: 'bg-purple-500/10',
    tag: 'Community',
    tagColor: 'text-caution-amber',
  },
];

export default function ElevatedCTASection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Multi-layer background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-sentinel-blue/5 rounded-full blur-[250px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[200px]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Your Architecture Deserves{' '}
            <span className="gradient-text">Consciousness.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every day without architectural intelligence is another day of accumulated risk,
            missed opportunities, and unrealized potential.
          </p>
        </motion.div>

        {/* Triple CTA */}
        <div className="space-y-4">
          {actions.map((action, i) => (
            <motion.a
              key={i}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className={`block p-6 md:p-8 rounded-2xl transition-all duration-300 ${action.className}`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-xl ${action.iconBg} flex items-center justify-center flex-shrink-0 ${
                  action.type === 'primary' ? 'text-white' : 'text-sentinel-blue'
                }`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-bold uppercase tracking-wider ${action.tagColor} mb-1 block`}>
                    {action.tag}
                  </span>
                  <h3 className={`text-lg md:text-xl font-bold mb-1 ${
                    action.type === 'primary' ? 'text-white' : 'text-gray-200'
                  }`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${
                    action.type === 'primary' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {action.subtitle}
                  </p>
                </div>
                <ArrowRight className={`w-6 h-6 flex-shrink-0 ${
                  action.type === 'primary' ? 'text-white/70' : 'text-gray-600'
                }`} />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-600 mt-8"
        >
          Trusted by 200+ engineering teams. SOC 2 Type II compliant. Your code never leaves your infrastructure.
        </motion.p>
      </div>
    </section>
  );
}
