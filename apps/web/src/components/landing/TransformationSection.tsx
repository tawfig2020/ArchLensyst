import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AlertTriangle, Sparkles, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    phase: 'before',
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'The "Quick Fix"',
    subtitle: 'What typically happens',
    color: 'breach-red',
    bgColor: 'bg-breach-red/5',
    borderColor: 'border-breach-red/20',
    content: {
      scenario: 'The "quick fix" that created 6 months of technical debt',
      details: [
        'Developer patches a critical bug in the payment service',
        'Creates a direct dependency on the user service internals',
        'Bypasses the established API contract for speed',
        'Code review passes — "it works, ship it"',
      ],
      consequence: 'Six months later: The user service migration breaks payments, billing, and notifications simultaneously.',
    },
  },
  {
    phase: 'archlens',
    icon: <Sparkles className="w-6 h-6" />,
    title: 'ArchLens Intervenes',
    subtitle: 'AI-powered architectural insight',
    color: 'sentinel-blue',
    bgColor: 'bg-sentinel-blue/5',
    borderColor: 'border-sentinel-blue/20',
    content: {
      scenario: 'ArchLens sees 3 steps ahead',
      details: [
        '⚠ "This fix creates a circular dependency that will surface in Q3 during the migration you\'re planning."',
        '📊 Impact analysis: 14 downstream services affected, 3 critical paths broken',
        '🔮 "The user service refactor scheduled for Q3 will cascade failure through this new coupling"',
        '✅ "Instead, refactor these two services to share an abstraction layer, reducing future maintenance by 40%"',
      ],
      consequence: 'The fix takes 2 extra hours now, but saves 6 months of technical debt and a potential production outage.',
    },
  },
  {
    phase: 'after',
    icon: <Trophy className="w-6 h-6" />,
    title: 'The Outcome',
    subtitle: 'Architectural mastery achieved',
    color: 'invariant-green',
    bgColor: 'bg-invariant-green/5',
    borderColor: 'border-invariant-green/20',
    content: {
      scenario: 'You didn\'t just fix a bug. You strengthened the architectural foundation.',
      details: [
        '10x fewer surprises in production',
        'Q3 migration completes on schedule — zero breaking changes',
        'New abstraction layer reduces code duplication by 35%',
        'Team confidence in architectural decisions increases to 97%',
      ],
      consequence: 'The engineering team ships faster, sleeps better, and builds with confidence.',
    },
  },
];

export default function TransformationSection() {
  const [activeStep, setActiveStep] = useState(0);
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-invariant-green/5 rounded-full blur-[200px]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-invariant-green uppercase tracking-wider">
            The Impossible Made Inevitable
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            From Firefighting to <span className="gradient-text-green">Foresight</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            See how ArchLens transforms a common "quick fix" scenario into architectural mastery.
          </p>
        </motion.div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeStep === i
                  ? `${step.bgColor} ${step.borderColor} border text-${step.color}`
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`glass-card p-8 md:p-10 ${steps[activeStep].borderColor} border`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg ${steps[activeStep].bgColor} ${steps[activeStep].borderColor} border flex items-center justify-center text-${steps[activeStep].color}`}>
                {steps[activeStep].icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{steps[activeStep].content.scenario}</h3>
                <p className="text-sm text-gray-500">{steps[activeStep].subtitle}</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {steps[activeStep].content.details.map((detail, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className={`w-1.5 h-1.5 rounded-full bg-${steps[activeStep].color} mt-2 flex-shrink-0`} />
                  <span className="text-sm leading-relaxed">{detail}</span>
                </motion.li>
              ))}
            </ul>

            <div className={`p-4 rounded-lg ${steps[activeStep].bgColor} ${steps[activeStep].borderColor} border`}>
              <p className="text-sm font-medium text-gray-200">
                {steps[activeStep].content.consequence}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setActiveStep(0)}
                className={`text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors ${activeStep === 0 ? 'invisible' : ''}`}
              >
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="btn-primary !px-5 !py-2 text-sm flex items-center gap-1.5"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {activeStep === steps.length - 1 && (
                <Link to="/signup" className="btn-primary !px-5 !py-2 text-sm flex items-center gap-1.5">
                  Experience This <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
