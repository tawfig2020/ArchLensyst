import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Brain, Activity, Heart } from 'lucide-react';

function NeuronVisualization({ active }: { active: boolean }) {
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    cx: 50 + Math.cos((i / 20) * Math.PI * 2) * (30 + Math.random() * 15),
    cy: 50 + Math.sin((i / 20) * Math.PI * 2) * (30 + Math.random() * 15),
    r: 2 + Math.random() * 2,
  }));

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Connections */}
      {nodes.map((n, i) =>
        nodes.slice(i + 1).map((m, j) => {
          const dist = Math.sqrt((n.cx - m.cx) ** 2 + (n.cy - m.cy) ** 2);
          if (dist > 35) return null;
          return (
            <motion.line
              key={`${i}-${j}`}
              x1={n.cx}
              y1={n.cy}
              x2={m.cx}
              y2={m.cy}
              stroke={active ? '#2f81f7' : '#f85149'}
              strokeWidth={0.3}
              initial={{ opacity: 0 }}
              animate={{
                opacity: active ? [0.2, 0.6, 0.2] : [0.1, 0.3, 0.1],
                stroke: active ? '#2f81f7' : '#f85149',
              }}
              transition={{
                duration: active ? 2 : 0.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: active ? 'easeInOut' : 'linear',
              }}
            />
          );
        }),
      )}
      {/* Nodes */}
      {nodes.map((n) => (
        <motion.circle
          key={n.id}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          fill={active ? '#2f81f7' : '#f85149'}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: active ? [0.4, 1, 0.4] : [0.2, 0.6, 0.2],
            r: active ? [n.r, n.r + 0.5, n.r] : [n.r, n.r + 1, n.r],
          }}
          transition={{
            duration: active ? 3 : 0.8 + Math.random() * 1,
            repeat: Infinity,
            delay: active ? n.id * 0.15 : Math.random() * 0.5,
          }}
        />
      ))}
      {/* Center node */}
      <motion.circle
        cx={50}
        cy={50}
        r={4}
        fill={active ? '#2f81f7' : '#484f58'}
        animate={{
          r: active ? [4, 6, 4] : [3, 4, 3],
          opacity: active ? [0.6, 1, 0.6] : [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

export default function NervousSystemSection() {
  const [active, setActive] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });

  return (
    <section className="section-padding relative overflow-hidden">
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
            The Architecture Nervous System
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            Give Your Codebase <span className="gradient-text">Consciousness</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            It knows when it's healthy, when it's stressed, and exactly what healing it needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto glass-card p-8">
              <div className="text-center mb-4">
                <span className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-500 ${
                  active ? 'text-sentinel-blue' : 'text-breach-red'
                }`}>
                  {active ? '● Synchronized — With ArchLens' : '● Irregular — Your Codebase'}
                </span>
              </div>
              <NeuronVisualization active={active} />
            </div>

            {/* Toggle */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setActive(!active)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-500 ${
                  active
                    ? 'bg-sentinel-blue/20 text-sentinel-blue border border-sentinel-blue/30 shadow-glow-blue'
                    : 'bg-breach-red/10 text-breach-red border border-breach-red/30'
                }`}
              >
                {active ? '✦ ArchLens Active — Synchronized Flow' : '⚠ Toggle to Activate ArchLens'}
              </button>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {[
              {
                icon: <Brain className="w-5 h-5" />,
                title: 'Understands Architectural Intent',
                desc: 'Not just what your code does, but what it was designed to do — and preserves that intent through every evolution.',
              },
              {
                icon: <Activity className="w-5 h-5" />,
                title: 'Predicts Drift Before It Happens',
                desc: 'Real-time detection of architectural erosion. Get alerted before technical debt compounds into system failure.',
              },
              {
                icon: <Heart className="w-5 h-5" />,
                title: 'Self-Healing Recommendations',
                desc: 'AI-driven prescriptive guidance that doesn\'t just identify problems — it provides the exact refactoring path.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card p-5 flex items-start gap-4 hover:border-sentinel-blue/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-sentinel-blue/10 border border-sentinel-blue/20 flex items-center justify-center text-sentinel-blue flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            <div className="glass-card p-5 border-sentinel-blue/20 bg-sentinel-blue/[0.03]">
              <p className="text-sm text-gray-300 italic leading-relaxed">
                "Unlike any static analyzer: We don't just find problems.
                We understand architectural intent and preserve it through evolution."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
