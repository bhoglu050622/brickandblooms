import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '@/data/processSteps';

gsap.registerPlugin(ScrollTrigger);

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = stepsContainerRef.current;
    if (!section || !container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Show all steps immediately
      container.querySelectorAll('.step-card').forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0 });
      });
      return;
    }

    const steps = container.querySelectorAll('.step-card');
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (isMobile) {
        // Mobile: simple stagger reveal, no pinning
        steps.forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: { trigger: step, start: 'top 85%' },
            }
          );
        });
        return;
      }

      // Desktop: pinned sequential reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${steps.length * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      steps.forEach((step, i) => {
        // Fade in current step
        tl.fromTo(
          step,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          i * 0.5
        );

        // Icon bounce in
        const icon = step.querySelector('.step-icon');
        if (icon) {
          tl.fromTo(icon, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' }, i * 0.5 + 0.1);
        }

        // Dim previous step (except last)
        if (i > 0) {
          tl.to(
            steps[i - 1],
            { opacity: 0.3, duration: 0.3 },
            i * 0.5
          );
        }
      });

      // Hold last step visible
      tl.to({}, { duration: 0.3 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A1A17 0%, #1E2418 30%, #222A1C 50%, #1E2418 70%, #1A1A17 100%)',
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(124,140,110,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(198,125,91,0.1) 0%, transparent 40%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 py-24 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
            HOW WE WORK
          </span>
        </div>

        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-white">
              The process behind every landscape
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-white/50">
              We work with clarity and care. Every step is designed to transform your space with confidence.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white/40">B&B</span>
            </div>
          </div>
        </div>

        {/* Steps — pinned reveal */}
        <div ref={stepsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="step-card rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 md:p-8 opacity-0"
              >
                <div className="flex items-start gap-5">
                  <div className="step-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-white/70" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-[10px] font-medium text-sage">{step.number}</span>
                      <span className="text-[14px] font-semibold uppercase tracking-[0.08em] text-white">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/50">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-sage transition-colors hover:text-sage-hover"
          >
            Start your journey
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
