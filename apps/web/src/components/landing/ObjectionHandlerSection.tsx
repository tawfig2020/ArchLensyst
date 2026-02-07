import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { GitBranch, Users, ShieldCheck, Lightbulb, ChevronRight } from 'lucide-react';

const options = [
  {
    icon: <GitBranch className="w-5 h-5" />,
    label: 'A mature CI/CD pipeline',
    response:
      'Perfect. ArchLens becomes the architectural brain that tells your pipeline not just what to build, but how to build it better every time.',
    color: 'sentinel-blue',
    bgClass: 'bg-sentinel-blue/10',
    borderClass: 'border-sentinel-blue/20',
    textClass: 'text-sentinel-blue',
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Senior architects who know the codebase',
    response:
      "Brilliant. Now capture their architectural wisdom so it survives team changes, scaling, and time.",
    color: 'purple-400',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/20',
    textClass: 'text-purple-400',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    label: 'Security scanning tools',
    response:
      'Essential. ArchLens connects security findings to architectural impact, so you fix root causes, not just symptoms.',
    color: 'invariant-green',
    bgClass: 'bg-invariant-green/10',
    borderClass: 'border-invariant-green/20',
    textClass: 'text-invariant-green',
  },
];

export default function ObjectionHandlerSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[200px]" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-caution-amber uppercase tracking-wider">
            The Inevitable Question
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-4">
            "But we already have..."
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Choose the one that sounds most like your team.
          </p>
        </motion.div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`w-full text-left p-5 rounded-xl transition-all duration-300 border ${
                selected === i
                  ? `${opt.bgClass} ${opt.borderClass} shadow-lg`
                  : 'glass-card hover:border-citadel-border-hover'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${opt.bgClass} ${opt.borderClass} border flex items-center justify-center ${opt.textClass} flex-shrink-0`}>
                  {opt.icon}
                </div>
                <span className={`font-semibold flex-1 ${selected === i ? 'text-white' : 'text-gray-300'}`}>
                  {opt.label}
                </span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                  selected === i ? `rotate-90 ${opt.textClass}` : 'text-gray-600'
                }`} />
              </div>

              {/* Response */}
              <AnimatePresence>
                {selected === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 ml-14 p-4 rounded-lg bg-citadel-surface/50 border ${opt.borderClass}`}>
                      <p className="text-gray-200 leading-relaxed italic">
                        "{opt.response}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Universal Truth */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="glass-card p-8 border-purple-500/20 bg-purple-500/[0.02]">
                <Lightbulb className="w-8 h-8 text-caution-amber mx-auto mb-4" />
                <p className="text-lg md:text-xl text-white font-semibold leading-relaxed">
                  "ArchLens doesn't replace what works.
                </p>
                <p className="text-lg md:text-xl gradient-text font-bold mt-1">
                  It makes everything work together with architectural intelligence."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
