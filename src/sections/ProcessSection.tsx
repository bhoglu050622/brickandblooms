import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '@/data/processSteps';

gsap.registerPlugin(ScrollTrigger);

const stepGradients = [
  'linear-gradient(135deg, #1A1A17 0%, #1E2418 30%, #222A1C 50%, #1E2418 70%, #1A1A17 100%)',
  'linear-gradient(135deg, #1A1A17 0%, #1E2820 30%, #203024 50%, #1E2820 70%, #1A1A17 100%)',
  'linear-gradient(135deg, #1A1A17 0%, #23201A 30%, #2A251C 50%, #23201A 70%, #1A1A17 100%)',
  'linear-gradient(135deg, #1A1A17 0%, #1E2220 30%, #222A28 50%, #1E2220 70%, #1A1A17 100%)',
];

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const container = stepsContainerRef.current;
    if (!section || !container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      container.querySelectorAll('.step-card').forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const steps = container.querySelectorAll('.step-card');
    const stepNumbers = container.querySelectorAll('.step-number');
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (isMobile) {
        steps.forEach((step) => {
          gsap.fromTo(step,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 85%' } }
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
          onUpdate: (self) => {
            const stepIndex = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            setActiveStep(stepIndex);
          },
        },
      });

      // Progress line
      if (progressRef.current) {
        tl.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: steps.length * 0.5 }, 0);
      }

      steps.forEach((step, i) => {
        const stepNumber = stepNumbers[i] as HTMLElement;

        // Background gradient shift
        if (bgRef.current && stepGradients[i]) {
          tl.to(bgRef.current, { background: stepGradients[i], duration: 0.3, ease: 'power1.inOut' }, i * 0.5);
        }

        // Step card fade in
        tl.fromTo(step,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          i * 0.5
        );

        // Step number: 3D flip reveal (rotateY 90° → 0°)
        if (stepNumber) {
          tl.fromTo(stepNumber,
            { rotateY: 90, opacity: 0, transformPerspective: 600 },
            { rotateY: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
            i * 0.5 + 0.05
          );
        }

        // Icon: scale + rotation bounce
        const icon = step.querySelector('.step-icon');
        if (icon) {
          tl.fromTo(icon,
            { scale: 0, rotation: -90 },
            { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' },
            i * 0.5 + 0.1
          );
        }

        // Dim previous step
        if (i > 0) {
          tl.to(steps[i - 1], { opacity: 0.3, duration: 0.3 }, i * 0.5);
          // Completed step: warm glow pulse
          const prevCard = steps[i - 1] as HTMLElement;
          tl.to(prevCard, {
            boxShadow: '0 0 20px rgba(124,140,110,0.15)',
            duration: 0.4,
          }, i * 0.5);
        }
      });

      // Hold last step
      tl.to({}, { duration: 0.3 });

      // Exit: all cards scatter outward
      gsap.to(Array.from(steps),
        {
          scale: 0.85,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: section,
            start: `+=${steps.length * 100}% top`,
            end: `+=${steps.length * 100 + 30}% top`,
            scrub: 0.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      <div ref={bgRef} className="absolute inset-0" style={{ background: stepGradients[0] }} />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(124,140,110,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(198,125,91,0.1) 0%, transparent 40%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 py-24 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">HOW WE WORK</span>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[32px] font-bold text-sage tabular-nums leading-none">
              {String(activeStep + 1).padStart(2, '0')}
            </span>
            <span className="text-[14px] text-white/30 font-medium">/</span>
            <span className="text-[14px] text-white/30 font-medium tabular-nums">
              {String(processSteps.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Progress line */}
        <div className="hidden md:block mb-8 h-px w-full bg-white/10 overflow-hidden">
          <div ref={progressRef} className="h-full bg-sage/50 origin-left" style={{ transform: 'scaleX(0)' }} />
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

        {/* Steps */}
        <div ref={stepsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="step-card rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 md:p-8 opacity-0"
                style={{ willChange: 'transform, box-shadow' }}
                data-cursor-type="tool"
                data-cursor-hover
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  const icon = card.querySelector('.step-icon') as HTMLElement;
                  gsap.to(card, { y: -6, boxShadow: '0 20px 60px rgba(124,140,110,0.2)', borderColor: 'rgba(124,140,110,0.3)', duration: 0.3, ease: 'power2.out' });
                  if (icon) gsap.to(icon, { rotate: 15, scale: 1.15, duration: 0.3, ease: 'back.out(2)' });
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  const icon = card.querySelector('.step-icon') as HTMLElement;
                  gsap.to(card, { y: 0, boxShadow: 'none', borderColor: 'rgba(255,255,255,0.1)', duration: 0.4, ease: 'power3.out' });
                  if (icon) gsap.to(icon, { rotate: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
                }}
              >
                <div className="flex items-start gap-5">
                  <div className="step-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-white/70" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="step-number text-[10px] font-medium text-sage"
                        style={{ display: 'inline-block', willChange: 'transform' }}
                      >
                        {step.number}
                      </span>
                      <span className="text-[14px] font-semibold uppercase tracking-[0.08em] text-white">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/50">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
