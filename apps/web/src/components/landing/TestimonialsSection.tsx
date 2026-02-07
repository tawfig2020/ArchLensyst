import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "ArchLens transformed how we think about our architecture. We went from reactive firefighting to proactive design. Our production incidents dropped by 80% in the first quarter.",
    author: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'ScaleForce',
    avatar: 'SC',
    rating: 5,
  },
  {
    quote: "The architectural consciousness concept is real. For the first time, our entire team — from juniors to principals — shares the same understanding of system intent. Onboarding time dropped from 4 months to 3 weeks.",
    author: 'Marcus Rivera',
    role: 'Chief Architect',
    company: 'DataStream Labs',
    avatar: 'MR',
    rating: 5,
  },
  {
    quote: "We were skeptical about another dev tool. Then ArchLens predicted a cascading failure we had no idea was coming. It saved us from a $2M incident. It paid for itself in the first week.",
    author: 'Dr. Emily Watson',
    role: 'CTO',
    company: 'MediCore Systems',
    avatar: 'EW',
    rating: 5,
  },
  {
    quote: "The phantom execution feature is like having a crystal ball for architecture. We simulate every major refactor before writing a single line of code. Our confidence in architectural decisions is at an all-time high.",
    author: 'James Okafor',
    role: 'Engineering Director',
    company: 'FinBridge',
    avatar: 'JO',
    rating: 5,
  },
  {
    quote: "Cryptographic audit trails solved our compliance nightmare. We went from weeks of manual documentation to automated, verifiable proof of architectural compliance. Our auditors were impressed.",
    author: 'Lisa Park',
    role: 'Head of Platform',
    company: 'RegTech Global',
    avatar: 'LP',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { ref, isVisible } = useIntersectionObserver();

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-10" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-caution-amber uppercase tracking-wider">
            Trusted by Leaders
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            What Engineering Leaders Say
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 md:p-12"
            >
              <Quote className="w-10 h-10 text-sentinel-blue/30 mb-6" />

              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-caution-amber text-caution-amber" />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 italic">
                "{testimonials[current].quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-purple flex items-center justify-center text-white font-bold text-sm">
                  {testimonials[current].avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonials[current].author}</p>
                  <p className="text-sm text-gray-400">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-sentinel-blue/30 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-sentinel-blue w-8' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-sentinel-blue/30 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
