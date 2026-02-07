import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Play, Pause, ShieldCheck, Gauge, Layers, Sparkles } from 'lucide-react';

interface Note {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

const instruments = [
  {
    type: 'Security',
    icon: <ShieldCheck className="w-7 h-7" />,
    color: 'breach-red',
    isolatedLabel: 'Plays discordant notes — scanning without context',
    harmonyLabel: 'Security informs performance decisions',
    bgClass: 'bg-breach-red/10',
    borderClass: 'border-breach-red/20',
    textClass: 'text-breach-red',
    noteColor: '#f85149',
  },
  {
    type: 'Performance',
    icon: <Gauge className="w-7 h-7" />,
    color: 'caution-amber',
    isolatedLabel: 'Optimizes without architectural context',
    harmonyLabel: 'Performance respects architecture',
    bgClass: 'bg-caution-amber/10',
    borderClass: 'border-caution-amber/20',
    textClass: 'text-caution-amber',
    noteColor: '#d29922',
  },
  {
    type: 'Architecture',
    icon: <Layers className="w-7 h-7" />,
    color: 'sentinel-blue',
    isolatedLabel: 'Creates beautiful but impractical designs',
    harmonyLabel: 'Architecture enables security',
    bgClass: 'bg-sentinel-blue/10',
    borderClass: 'border-sentinel-blue/20',
    textClass: 'text-sentinel-blue',
    noteColor: '#2f81f7',
  },
];

export default function SymphonySection() {
  const [playing, setPlaying] = useState(false);
  const [harmonized, setHarmonized] = useState(false);
  const { ref, isVisible } = useIntersectionObserver();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const notesRef = useRef<Note[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;
    const colors = instruments.map((inst) => inst.noteColor);

    const animate = () => {
      ctx.clearRect(0, 0, w(), h());

      if (playing) {
        // Add new notes
        if (Math.random() < 0.3) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          if (harmonized) {
            // Harmonized: notes rise in organized wave
            const baseX = w() * 0.1 + Math.random() * w() * 0.8;
            notesRef.current.push({
              id: Date.now() + Math.random(),
              x: baseX,
              y: h(),
              size: 3 + Math.random() * 4,
              opacity: 0.8,
              color,
            });
          } else {
            // Chaotic: notes scatter randomly
            notesRef.current.push({
              id: Date.now() + Math.random(),
              x: Math.random() * w(),
              y: Math.random() * h(),
              size: 2 + Math.random() * 6,
              opacity: 0.5 + Math.random() * 0.5,
              color,
            });
          }
        }
      }

      // Draw and update notes
      notesRef.current = notesRef.current.filter((note) => {
        if (harmonized) {
          note.y -= 1.5;
          note.opacity -= 0.005;
          // Gentle wave
          note.x += Math.sin(note.y * 0.02 + note.id * 0.1) * 0.5;
        } else if (playing) {
          note.x += (Math.random() - 0.5) * 3;
          note.y += (Math.random() - 0.5) * 3;
          note.opacity -= 0.01;
        } else {
          note.opacity -= 0.02;
        }

        if (note.opacity <= 0) return false;

        ctx.beginPath();
        ctx.arc(note.x, note.y, note.size, 0, Math.PI * 2);
        ctx.fillStyle = note.color + Math.floor(note.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Glow
        if (harmonized) {
          ctx.beginPath();
          ctx.arc(note.x, note.y, note.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = note.color + '08';
          ctx.fill();
        }

        return true;
      });

      // Draw connection lines in harmony mode
      if (harmonized && playing) {
        const sorted = [...notesRef.current].sort((a, b) => a.y - b.y);
        for (let i = 0; i < sorted.length - 1; i++) {
          const a = sorted[i];
          const b = sorted[i + 1];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(47, 129, 247, ${0.1 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [playing, harmonized]);

  const handlePlay = () => {
    if (!playing) {
      setPlaying(true);
      setHarmonized(false);
      // After 2s, harmonize
      setTimeout(() => setHarmonized(true), 2000);
    } else {
      setPlaying(false);
      setHarmonized(false);
      notesRef.current = [];
    }
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sentinel-blue/3 rounded-full blur-[200px]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-sentinel-blue uppercase tracking-wider">
            The Synchronization Symphony
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            You're Not Managing Pieces.{' '}
            <span className="gradient-text">You're Conducting a Symphony.</span>
          </h2>
        </motion.div>

        {/* Canvas Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card p-1 mb-8 relative"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-48 md:h-64 rounded-xl"
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                playing
                  ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15'
                  : 'bg-blue-purple shadow-sentinel hover:scale-110'
              }`}
            >
              {playing ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
          </div>

          {/* Status label */}
          <AnimatePresence>
            {playing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
              >
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                  harmonized
                    ? 'bg-invariant-green/20 text-invariant-green border border-invariant-green/30'
                    : 'bg-breach-red/20 text-breach-red border border-breach-red/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${harmonized ? 'bg-invariant-green' : 'bg-breach-red'} animate-pulse`} />
                  {harmonized ? 'Synchronized — ArchLens Conducting' : 'Isolated — No Coordination'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instrument Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {instruments.map((inst, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className={`glass-card p-5 transition-all duration-500 ${
                harmonized && playing ? `${inst.borderClass} ${inst.bgClass.replace('/10', '/[0.03]')}` : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${inst.bgClass} ${inst.borderClass} border flex items-center justify-center ${inst.textClass} mb-3`}>
                {inst.icon}
              </div>
              <h4 className="text-white font-semibold mb-1">{inst.type}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                {harmonized && playing ? inst.harmonyLabel : inst.isolatedLabel}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Key Insight */}
        <AnimatePresence>
          {harmonized && playing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">Key Insight</span>
              </div>
              <p className="text-xl md:text-2xl text-white font-bold mb-2">
                "This isn't integration. This is <span className="gradient-text">emergence</span>."
              </p>
              <p className="text-gray-500">
                The whole becomes greater than the sum of parts.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
