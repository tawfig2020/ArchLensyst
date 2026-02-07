import { motion } from 'framer-motion';
import { Clock, ShieldAlert, DollarSign, TrendingDown, AlertTriangle, Users } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useCountUp } from '../../hooks/useCountUp';

interface PainCard {
  icon: React.ReactNode;
  before: number;
  after: number;
  unit: string;
  suffix?: string;
  label: string;
  emotional: string;
  color: string;
  decimals?: number;
}

const painCards: PainCard[] = [
  {
    icon: <Clock className="w-6 h-6" />,
    before: 8.2,
    after: 0.3,
    unit: 'weeks',
    label: 'Time spent discovering "why" that change broke production',
    emotional: 'The midnight pager duty no playbook can prevent',
    color: 'breach',
    decimals: 1,
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    before: 63,
    after: 97,
    unit: '% confidence',
    label: 'Architectural decision certainty when scaling teams',
    emotional: 'That moment you realize "everyone understood differently"',
    color: 'caution',
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    before: 2.4,
    after: 0,
    unit: 'M dollars',
    suffix: 'M',
    label: 'Annual cost of undetected dependency vulnerabilities',
    emotional: 'The security breach that almost ended careers',
    color: 'breach',
    decimals: 1,
  },
  {
    icon: <TrendingDown className="w-6 h-6" />,
    before: 34,
    after: 3,
    unit: '% drift',
    label: 'Architectural drift per quarter in growing codebases',
    emotional: 'The slow erosion nobody noticed until it was too late',
    color: 'caution',
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    before: 12,
    after: 0,
    unit: 'incidents',
    label: 'Production incidents from undocumented dependencies',
    emotional: 'The dependency you forgot existed — until it broke everything',
    color: 'breach',
  },
  {
    icon: <Users className="w-6 h-6" />,
    before: 6,
    after: 1,
    unit: 'months',
    label: 'New engineer ramp-up time on legacy architecture',
    emotional: 'The tribal knowledge that walks out the door with every departure',
    color: 'caution',
  },
];

function MetricCard({ card, index }: { card: PainCard; index: number }) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });
  const beforeCount = useCountUp(card.before, isVisible, 1500, card.decimals ?? 0);
  const afterCount = useCountUp(card.after, isVisible, 2000, card.decimals ?? 0);

  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    breach: {
      bg: 'bg-breach-red/5',
      border: 'border-breach-red/20',
      text: 'text-breach-red',
      glow: 'shadow-[0_0_30px_rgba(248,81,73,0.1)]',
    },
    caution: {
      bg: 'bg-caution-amber/5',
      border: 'border-caution-amber/20',
      text: 'text-caution-amber',
      glow: 'shadow-[0_0_30px_rgba(210,153,34,0.1)]',
    },
  };

  const c = colorMap[card.color] ?? colorMap.breach;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`glass-card p-6 hover:${c.border} ${c.glow} transition-all duration-500 group`}
    >
      <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center mb-4 ${c.text}`}>
        {card.icon}
      </div>

      <div className="flex items-baseline gap-3 mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-breach-red line-through opacity-60">
            {beforeCount}{card.suffix ?? ''}
          </span>
          <span className="text-xs text-gray-500">{card.unit}</span>
        </div>
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-invariant-green">
            {afterCount}{card.suffix ?? ''}
          </span>
          <span className="text-xs text-gray-500">{card.unit}</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-3 leading-relaxed">{card.label}</p>

      <p className="text-xs text-gray-500 italic border-t border-citadel-border pt-3 mt-auto">
        "{card.emotional}"
      </p>
    </motion.div>
  );
}

export default function PainPointsSection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="pain-points" className="section-padding relative">
      <div className="absolute inset-0 mesh-bg opacity-30" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-breach-red uppercase tracking-wider">
            The Hidden Costs
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            The Price You're Already Paying
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Every engineering organization faces these challenges.
            Most don't realize the true cost until it's too late.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painCards.map((card, i) => (
            <MetricCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
