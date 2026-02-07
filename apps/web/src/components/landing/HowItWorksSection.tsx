import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Upload, Cpu, BarChart3, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Upload className="w-7 h-7" />,
    title: 'Connect Your Codebase',
    description: 'Point ArchLens at your repositories. No agents to install, no CI pipeline changes. Works with GitHub, GitLab, Bitbucket, and Azure DevOps.',
    detail: 'One-click integration. Read-only access. Zero overhead.',
  },
  {
    number: '02',
    icon: <Cpu className="w-7 h-7" />,
    title: 'AI Builds Your Architecture Model',
    description: 'Our AI engine analyzes every file, dependency, and design pattern to create a living architectural model of your entire system.',
    detail: 'First scan completes in under 5 minutes for most codebases.',
  },
  {
    number: '03',
    icon: <BarChart3 className="w-7 h-7" />,
    title: 'Get Actionable Insights',
    description: 'Receive your Architectural Health Score, drift analysis, vulnerability map, and prioritized improvement recommendations.',
    detail: 'Real-time updates as your codebase evolves.',
  },
  {
    number: '04',
    icon: <Sparkles className="w-7 h-7" />,
    title: 'Evolve With Confidence',
    description: 'Use AI-powered guidance for every architectural decision. Simulate changes, apply synthetic fixes, and track improvement over time.',
    detail: 'Your architecture gets stronger with every commit.',
  },
];

export default function HowItWorksSection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-citadel-border to-transparent" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-sentinel-blue uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            From Zero to <span className="gradient-text">Architectural Mastery</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Four steps. Five minutes. Complete architectural consciousness.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-sentinel-blue/50 via-purple-500/50 to-invariant-green/50 hidden md:block" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className={`relative md:flex items-center gap-8 md:mb-16 ${
                  i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sentinel-blue border-4 border-citadel-surface z-10 hidden md:block" />

                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'} md:pl-20 lg:pl-0`}>
                  <div className={`glass-card p-6 inline-block w-full ${i % 2 === 0 ? 'lg:ml-auto' : ''}`}>
                    <div className={`flex items-center gap-4 mb-4 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-sentinel-blue/10 border border-sentinel-blue/20 flex items-center justify-center text-sentinel-blue flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-xs text-sentinel-blue font-bold uppercase tracking-wider">
                          Step {step.number}
                        </span>
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">{step.description}</p>
                    <p className="text-xs text-sentinel-blue/80 font-medium">{step.detail}</p>
                  </div>
                </div>

                {/* Spacer for other side */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
