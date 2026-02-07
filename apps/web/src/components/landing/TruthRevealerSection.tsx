import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Zap, ChevronDown } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface DialogueItem {
  thought: string;
  response: string;
  traditional: string;
  archlens: string;
}

const dialogues: DialogueItem[] = [
  {
    thought: '"We have CI/CD, linters, and code reviews..."',
    response: '"But do you have architectural consciousness?"',
    traditional: 'Rules check code syntax and formatting',
    archlens: 'Intelligence understands intent, predicts drift, preserves architectural DNA',
  },
  {
    thought: '"Our monitoring catches issues in production..."',
    response: '"But what if you never had those issues in the first place?"',
    traditional: 'Monitoring tells you when it fails',
    archlens: 'ArchLens prevents failure by understanding architectural stress before it manifests',
  },
  {
    thought: '"We document our architecture decisions..."',
    response: '"But does your documentation evolve with your code?"',
    traditional: 'Documentation describes what was',
    archlens: 'ArchLens maintains a living model of what is, what should be, and what will break',
  },
];

function DialogueCard({ item, index }: { item: DialogueItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="glass-card overflow-hidden"
    >
      {/* User Thought */}
      <div className="p-6 border-b border-citadel-border">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">You think</span>
            <p className="text-gray-300 mt-1 text-lg italic">{item.thought}</p>
          </div>
        </div>
      </div>

      {/* ArchLens Response */}
      <div className="p-6 bg-sentinel-blue/[0.03]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-sentinel-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-sentinel-blue" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-sentinel-blue font-medium uppercase tracking-wider">ArchLens responds</span>
            <p className="text-white mt-1 text-lg font-medium">{item.response}</p>

            {/* Expandable comparison */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm text-sentinel-blue hover:text-sentinel-blue-hover mt-4 transition-colors"
            >
              See the difference
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-breach-red/5 border border-breach-red/20">
                      <span className="text-xs font-semibold text-breach-red uppercase">Traditional</span>
                      <p className="text-sm text-gray-400 mt-2">{item.traditional}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-invariant-green/5 border border-invariant-green/20">
                      <span className="text-xs font-semibold text-invariant-green uppercase">ArchLens</span>
                      <p className="text-sm text-gray-300 mt-2">{item.archlens}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TruthRevealerSection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
            The Unspoken Truth
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            Tools Don't Think. <span className="gradient-text">ArchLens Does.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            The gap between what you have and what you need isn't more tools — it's intelligence.
          </p>
        </motion.div>

        <div className="space-y-6">
          {dialogues.map((item, i) => (
            <DialogueCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
