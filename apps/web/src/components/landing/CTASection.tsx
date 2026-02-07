import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { ArrowRight, Shield, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  'Full platform access for 14 days',
  'No credit card required',
  'AI-powered architecture analysis',
  'Unlimited team members during trial',
  'White-glove onboarding support',
  'Cancel anytime — no questions asked',
];

export default function CTASection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="demo" className="section-padding relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sentinel-blue/5 rounded-full blur-[200px]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sentinel-blue/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sentinel-blue/30 bg-sentinel-blue/5 mb-8">
            <Shield className="w-4 h-4 text-sentinel-blue" />
            <span className="text-sm text-sentinel-blue font-medium">Start Your Free Trial</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Give Your Architecture{' '}
            <span className="gradient-text">Consciousness?</span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the engineering leaders who've stopped fighting fires and started architecting legacies.
            Your codebase deserves intelligence.
          </p>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-10 text-left">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-invariant-green flex-shrink-0" />
                <span className="text-sm text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className="btn-primary text-base flex items-center gap-2 w-full sm:w-auto justify-center">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/signin" className="btn-secondary text-base w-full sm:w-auto text-center">
              Sign In
            </Link>
          </motion.div>

          <p className="text-xs text-gray-500 mt-6">
            Trusted by 200+ engineering teams worldwide. SOC 2 Type II compliant.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
