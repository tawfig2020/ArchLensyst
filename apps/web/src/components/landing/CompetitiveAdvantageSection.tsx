import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Search, Monitor, FileText, Eye, Shield, Cpu, Lock, Zap } from 'lucide-react';

const competitors = [
  { name: 'Static Analysis', icon: <Search className="w-5 h-5" />, limitation: 'Knows what\'s broken, not why it matters' },
  { name: 'Monitoring', icon: <Monitor className="w-5 h-5" />, limitation: 'Tells you when it fails, not how to prevent it' },
  { name: 'Documentation', icon: <FileText className="w-5 h-5" />, limitation: 'Describes what was, not what should be' },
  { name: 'Code Review', icon: <Eye className="w-5 h-5" />, limitation: 'Catches syntax issues, misses architectural erosion' },
];

const archlensCapabilities = [
  { icon: <Cpu className="w-5 h-5" />, label: 'Understands intent, not just syntax' },
  { icon: <Shield className="w-5 h-5" />, label: 'Preserves design decisions through generations of developers' },
  { icon: <Zap className="w-5 h-5" />, label: 'Predicts architectural drift before it becomes technical debt' },
  { icon: <Lock className="w-5 h-5" />, label: 'Cryptographic proof of architectural compliance' },
];

export default function CompetitiveAdvantageSection() {
  const [hoveredCompetitor, setHoveredCompetitor] = useState<number | null>(null);
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="advantages" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sentinel-blue/3 rounded-full blur-[200px]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-sentinel-blue uppercase tracking-wider">
            The Uniqueness Diamond
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            Beyond Tools. <span className="gradient-text">Architectural Consciousness.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Other solutions solve pieces. ArchLens understands the whole picture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Other Solutions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center lg:text-left">
              Traditional Approaches
            </h3>
            {competitors.map((comp, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => setHoveredCompetitor(i)}
                onMouseLeave={() => setHoveredCompetitor(null)}
                className={`glass-card p-5 transition-all duration-300 cursor-default ${
                  hoveredCompetitor === i ? 'border-breach-red/30 bg-breach-red/[0.02]' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
                    {comp.icon}
                  </div>
                  <span className="font-semibold text-gray-300">{comp.name}</span>
                </div>
                <p className="text-sm text-gray-500 ml-12 italic">"{comp.limitation}"</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ArchLens */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-sentinel-blue uppercase tracking-wider mb-6 text-center lg:text-left">
              The ArchLens Difference
            </h3>
            <div className="glass-card p-8 border-sentinel-blue/20 bg-sentinel-blue/[0.02] h-full relative overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-sentinel-blue/10 rounded-full blur-[80px]" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-purple flex items-center justify-center shadow-sentinel">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Architectural Consciousness</h4>
                    <p className="text-sm text-sentinel-blue">The core innovation</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {archlensCapabilities.map((cap, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sentinel-blue/10 border border-sentinel-blue/20 flex items-center justify-center text-sentinel-blue flex-shrink-0 mt-0.5">
                        {cap.icon}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed pt-1">{cap.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-invariant-green/5 border border-invariant-green/20">
                  <p className="text-sm text-invariant-green font-medium">
                    "Not a tool. A thinking partner for your architecture."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
