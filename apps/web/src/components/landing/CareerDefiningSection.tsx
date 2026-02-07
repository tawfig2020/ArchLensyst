import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { XCircle, CheckCircle, Sparkles } from 'lucide-react';

const withoutItems = [
  'Still explaining the same architectural principles',
  'Still surprised by production issues',
  "Still putting out yesterday's fires",
  "Still justifying your team's value",
];

const withItems = [
  'Architectural decisions become strategic advantages',
  'Proactive innovation replaces reactive fixes',
  'Your team is known for reliability and innovation',
  'You lead industry conversations about engineering excellence',
];

export default function CareerDefiningSection() {
  const [hoveredPath, setHoveredPath] = useState<'without' | 'with' | null>(null);
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-citadel-border to-transparent" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-sentinel-blue/5 rounded-full blur-[200px]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-caution-amber uppercase tracking-wider">
            The Career-Defining Moment
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-4">
            Two Years From Now, <span className="gradient-text">Looking Back...</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Without ArchLens */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onMouseEnter={() => setHoveredPath('without')}
            onMouseLeave={() => setHoveredPath(null)}
            className={`glass-card p-8 transition-all duration-500 cursor-default ${
              hoveredPath === 'without'
                ? 'border-breach-red/30 bg-breach-red/[0.02] scale-[1.01]'
                : hoveredPath === 'with'
                  ? 'opacity-50 scale-[0.99]'
                  : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-breach-red/10 border border-breach-red/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-breach-red" />
              </div>
              <h3 className="text-lg font-bold text-gray-300">Without ArchLens</h3>
            </div>

            <div className="space-y-4">
              {withoutItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-breach-red/60 mt-2 flex-shrink-0" />
                  <span className={`text-sm leading-relaxed transition-colors duration-300 ${
                    hoveredPath === 'without' ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Mood indicator */}
            <div className={`mt-6 p-3 rounded-lg transition-all duration-500 ${
              hoveredPath === 'without'
                ? 'bg-breach-red/10 border border-breach-red/20'
                : 'bg-gray-800/30 border border-transparent'
            }`}>
              <p className="text-xs text-center text-gray-500 italic">
                The cost of inaction compounds daily.
              </p>
            </div>
          </motion.div>

          {/* With ArchLens */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onMouseEnter={() => setHoveredPath('with')}
            onMouseLeave={() => setHoveredPath(null)}
            className={`glass-card p-8 transition-all duration-500 cursor-default relative overflow-hidden ${
              hoveredPath === 'with'
                ? 'border-invariant-green/30 bg-invariant-green/[0.02] scale-[1.01] shadow-lg'
                : hoveredPath === 'without'
                  ? 'opacity-50 scale-[0.99]'
                  : ''
            }`}
          >
            {/* Glow effect */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-700 ${
              hoveredPath === 'with' ? 'bg-invariant-green/10 opacity-100' : 'opacity-0'
            }`} />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-invariant-green/10 border border-invariant-green/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-invariant-green" />
                </div>
                <h3 className="text-lg font-bold text-white">With ArchLens</h3>
              </div>

              <div className="space-y-4">
                {withItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 transition-colors duration-300 ${
                      hoveredPath === 'with' ? 'bg-invariant-green' : 'bg-invariant-green/40'
                    }`} />
                    <span className={`text-sm leading-relaxed transition-colors duration-300 ${
                      hoveredPath === 'with' ? 'text-gray-100 font-medium' : 'text-gray-400'
                    }`}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Mood indicator */}
              <div className={`mt-6 p-3 rounded-lg transition-all duration-500 ${
                hoveredPath === 'with'
                  ? 'bg-invariant-green/10 border border-invariant-green/20'
                  : 'bg-gray-800/30 border border-transparent'
              }`}>
                <p className={`text-xs text-center italic transition-colors ${
                  hoveredPath === 'with' ? 'text-invariant-green' : 'text-gray-500'
                }`}>
                  The future belongs to architectural leaders.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Closing Argument */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-xl md:text-2xl text-white font-bold leading-relaxed mb-2">
            "This isn't about adding another tool.
          </p>
          <p className="text-xl md:text-2xl font-bold leading-relaxed">
            It's about evolving how engineering{' '}
            <span className="gradient-text">creates value.</span>"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
