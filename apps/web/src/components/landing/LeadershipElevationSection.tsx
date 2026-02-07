import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Flame, Rocket, Sparkles, ArrowRight, Zap, Shield, TrendingUp, Users, Award } from 'lucide-react';

const currentReality = [
  { icon: <Flame className="w-5 h-5" />, text: 'Putting out fires', emoji: '🔥' },
  { icon: <Zap className="w-5 h-5" />, text: 'Explaining why "simple changes" are complex', emoji: '⚡' },
  { icon: <Shield className="w-5 h-5" />, text: 'Justifying architectural decisions without data', emoji: '📊' },
  { icon: <TrendingUp className="w-5 h-5" />, text: "Worrying about what you don't know you don't know", emoji: '🌫️' },
];

const futureState = [
  { icon: <Rocket className="w-5 h-5" />, text: 'Strategic innovation', emoji: '🚀' },
  { icon: <TrendingUp className="w-5 h-5" />, text: 'Data-backed architectural decisions', emoji: '📈' },
  { icon: <Shield className="w-5 h-5" />, text: 'Proactive risk prevention', emoji: '🛡️' },
  { icon: <Users className="w-5 h-5" />, text: 'Confident scaling across teams', emoji: '🤝' },
  { icon: <Award className="w-5 h-5" />, text: 'Engineering reputation as a competitive advantage', emoji: '🏆' },
];

export default function LeadershipElevationSection() {
  const [transformed, setTransformed] = useState(false);
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sentinel-blue/5 rounded-full blur-[200px]" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
            The Leadership Elevation Story
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            From Firefighter to{' '}
            <span className="gradient-text">Visionary Architect</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Your role deserves more than reactive survival. See what your leadership looks like with architectural consciousness.
          </p>
        </motion.div>

        {/* Interactive Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card p-8 md:p-10 relative overflow-hidden"
        >
          {/* Background glow that shifts on transform */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ${
              transformed
                ? 'bg-gradient-to-br from-sentinel-blue/[0.03] via-transparent to-invariant-green/[0.03]'
                : 'bg-gradient-to-br from-breach-red/[0.03] via-transparent to-caution-amber/[0.03]'
            }`}
          />

          <div className="relative">
            <AnimatePresence mode="wait">
              {!transformed ? (
                <motion.div
                  key="current"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xl md:text-2xl text-gray-300 font-light italic mb-8">
                    "You spend your days..."
                  </p>
                  <div className="space-y-4 mb-10">
                    {currentReality.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-breach-red/[0.04] border border-breach-red/10 hover:border-breach-red/20 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-breach-red/10 border border-breach-red/20 flex items-center justify-center text-breach-red group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="text-gray-300 flex-1">{item.text}</span>
                        <span className="text-lg">{item.emoji}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="future"
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-xl md:text-2xl text-gray-300 font-light italic mb-8">
                    "You lead with..."
                  </p>
                  <div className="space-y-4 mb-10">
                    {futureState.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-invariant-green/[0.04] border border-invariant-green/10 hover:border-invariant-green/20 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-invariant-green/10 border border-invariant-green/20 flex items-center justify-center text-invariant-green group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="text-gray-200 flex-1 font-medium">{item.text}</span>
                        <span className="text-lg">{item.emoji}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Career Impact */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center p-6 rounded-xl bg-gradient-to-r from-sentinel-blue/5 via-purple-500/5 to-invariant-green/5 border border-purple-500/10"
                  >
                    <p className="text-lg text-purple-300 font-semibold italic">
                      "From firefighter to visionary architect"
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      The transformation your career has been waiting for.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Magic Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setTransformed(!transformed)}
                className={`inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base transition-all duration-500 ${
                  transformed
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-blue-purple text-white hover:shadow-sentinel shadow-lg hover:scale-105'
                }`}
              >
                {transformed ? (
                  <>
                    <Flame className="w-5 h-5" /> See Current Reality
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Experience ArchLens
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
