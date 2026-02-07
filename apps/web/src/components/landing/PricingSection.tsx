import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Check, Sparkles, Building2, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Plan {
  name: string;
  icon: React.ReactNode;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    icon: <Rocket className="w-6 h-6" />,
    price: '$0',
    period: 'forever',
    description: 'For individual developers exploring architectural analysis.',
    features: [
      'Up to 3 repositories',
      'Basic dependency graph',
      'Architecture health score',
      'Community support',
      '7-day analysis history',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Professional',
    icon: <Sparkles className="w-6 h-6" />,
    price: '$49',
    period: 'per seat / month',
    description: 'For growing teams that need architectural intelligence.',
    features: [
      'Unlimited repositories',
      'AI-powered drift detection',
      'Real-time collaboration',
      'Cryptographic audit trails',
      'Phantom execution engine',
      'Synthetic fix suggestions',
      'Priority support',
      '90-day analysis history',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    icon: <Building2 className="w-6 h-6" />,
    price: 'Custom',
    period: 'annual contract',
    description: 'For organizations that demand architectural excellence at scale.',
    features: [
      'Everything in Professional',
      'SSO & SAML integration',
      'Custom compliance rules',
      'Dedicated success manager',
      'On-premise deployment option',
      'SOC 2 Type II audit support',
      'SLA guarantee (99.99%)',
      'Unlimited analysis history',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-citadel-border to-transparent" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[200px]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            Invest in Your Architecture's <span className="gradient-text">Future</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg mb-8">
            Start free, scale as your architecture evolves. No surprises, no lock-in.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-xl bg-citadel-elevated border border-citadel-border">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !annual ? 'bg-sentinel-blue/20 text-sentinel-blue' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                annual ? 'bg-sentinel-blue/20 text-sentinel-blue' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Annual <span className="text-invariant-green text-xs font-bold ml-1">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className={`relative glass-card p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-sentinel-blue/30 shadow-sentinel ring-1 ring-sentinel-blue/10'
                  : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-purple text-white text-xs font-bold">
                  {plan.badge}
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                plan.highlighted
                  ? 'bg-sentinel-blue/20 text-sentinel-blue'
                  : 'bg-citadel-elevated text-gray-400 border border-citadel-border'
              }`}>
                {plan.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">
                  {plan.price === 'Custom'
                    ? 'Custom'
                    : annual && plan.price !== '$0'
                      ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                      : plan.price}
                </span>
                {plan.price !== 'Custom' && plan.price !== '$0' && (
                  <span className="text-sm text-gray-500 ml-2">/ {plan.period}</span>
                )}
                {plan.price === '$0' && (
                  <span className="text-sm text-gray-500 ml-2">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-invariant-green flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          All plans include 256-bit encryption, GDPR compliance, and 24/7 uptime monitoring.
        </p>
      </div>
    </section>
  );
}
