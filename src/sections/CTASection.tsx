import { useEffect, useRef } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextReveal, clipRevealDirectional, magneticElement } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const contexts: gsap.Context[] = [];
    const cleanups: (() => void)[] = [];

    if (prefersReduced) {
      section.querySelectorAll('.cta-item').forEach((el) => gsap.set(el, { opacity: 1 }));
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1 });
      if (quoteRef.current) gsap.set(quoteRef.current, { opacity: 1, clipPath: 'none' });
      return;
    }

    // Heading: cinematic splitTextReveal with rotateX
    if (headingRef.current) {
      const headCtx = splitTextReveal(headingRef.current, section, {
        mode: 'words',
        duration: 0.65,
        stagger: 0.06,
        y: 40,
        rotateX: 25,
        ease: 'power4.out',
        start: 'top 70%',
      });
      contexts.push(headCtx);
    }

    // Quote card: directional clip reveal
    if (quoteRef.current) {
      const quoteCtx = clipRevealDirectional(quoteRef.current, section, 'bottom', {
        duration: 1.2,
        start: 'top 75%',
      });
      contexts.push(quoteCtx);
    }

    // Magnetic effect on CTA button
    if (ctaBtnRef.current) {
      const cleanup = magneticElement(ctaBtnRef.current, { strength: 15, ease: 0.4 });
      cleanups.push(cleanup);
    }

    const ctx = gsap.context(() => {
      // Section background: radial warmth bloom on enter
      const bgGlow = bgGlowRef.current;
      if (bgGlow) {
        gsap.fromTo(bgGlow,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1, scale: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 70%' },
          }
        );
      }

      // CTA items stagger
      gsap.fromTo(
        section.querySelectorAll('.cta-item'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );

      // Secondary CTA button: draw border reveal
      const secondaryBtn = section.querySelector('.secondary-cta') as HTMLElement;
      if (secondaryBtn) {
        gsap.fromTo(secondaryBtn,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 0.5,
            scrollTrigger: { trigger: section, start: 'top 70%' },
            onComplete: () => { gsap.set(secondaryBtn, { clipPath: 'none' }); },
          }
        );
      }

      // Heading ambient breathing after it animates in
      if (headingRef.current) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            setTimeout(() => {
              gsap.to(headingRef.current!, {
                y: -3,
                duration: 4,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
              });
            }, 1200);
          },
        });
      }

      // Orbiting particles around CTA button — desktop only (mobile performance)
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const particleContainer = particleContainerRef.current;
      if (particleContainer && !isTouch) {
        const particleCount = 6;
        const radii = [40, 52, 46, 58, 42, 54];
        const speeds = [3, 4.5, 3.5, 5, 3.8, 4.2];

        Array.from({ length: particleCount }).forEach((_, i) => {
          const particle = document.createElement('div');
          const angle = (i / particleCount) * 360;
          const r = radii[i];

          particle.style.cssText = `
            position: absolute; width: 4px; height: 4px; border-radius: 50%;
            background: rgba(124,140,110,0.7);
            top: 50%; left: 50%; margin: -2px;
            transform: rotate(${angle}deg) translateX(${r}px);
            animation: orbit-particle-${i} ${speeds[i]}s linear infinite;
          `;
          particleContainer.appendChild(particle);

          gsap.to(particle, {
            rotation: `+=${360}`,
            duration: speeds[i],
            ease: 'none',
            repeat: -1,
            transformOrigin: `${-r}px 0px`,
          });
        });

        // Scatter on hover
        if (ctaBtnRef.current) {
          ctaBtnRef.current.addEventListener('mouseenter', () => {
            const particles = particleContainer.querySelectorAll('div');
            particles.forEach((p, i) => {
              const angle = (i / particleCount) * Math.PI * 2;
              gsap.to(p, {
                x: Math.cos(angle) * 80,
                y: Math.sin(angle) * 80,
                opacity: 0,
                scale: 1.5,
                duration: 0.5,
                ease: 'power2.out',
              });
            });
          });
          ctaBtnRef.current.addEventListener('mouseleave', () => {
            const particles = particleContainer.querySelectorAll('div');
            particles.forEach((p) => {
              gsap.to(p, {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
              });
            });
          });
        }
      }
    }, section);

    return () => {
      ctx.revert();
      contexts.forEach((c) => c.revert());
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative w-full bg-white py-24 overflow-hidden">
      {/* Radial warmth glow */}
      <div
        ref={bgGlowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(124,140,110,0.12) 0%, transparent 70%)',
          opacity: 0,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Stats row */}
        <div className="cta-item flex flex-wrap items-center gap-6 md:gap-12 mb-8 opacity-0">
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3 text-sage" />
            <span className="text-[13px] font-medium text-black/60">120+ projects delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3 text-sage" />
            <span className="text-[13px] font-medium text-black/60">4+ years landscape expertise</span>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3 text-sage" />
            <span className="text-[13px] font-medium text-black/60">95% on-time project delivery</span>
          </div>
        </div>

        {/* 4 years + heading */}
        <div className="cta-item grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 opacity-0">
          <div>
            <span className="text-[11px] font-medium text-black/30 tracking-[0.1em]">4+ years</span>
            <p className="mt-2 text-[14px] leading-relaxed text-black/50">
              Building lasting partnerships, scaling brands, and shipping work that stands out.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-[11px] text-black/40">120+ projects completed</p>
              <p className="text-[11px] text-black/40">95% on-time project delivery</p>
              <p className="text-[11px] text-black/40">90% repeat &amp; referral clients</p>
            </div>
            <div className="mt-6">
              <span className="text-[32px] md:text-[42px] font-bold text-black/10">2021 — 2026</span>
            </div>
          </div>

          <div>
            <h2
              ref={headingRef}
              className="text-[32px] md:text-[48px] font-medium leading-[1.1] tracking-tight text-black"
              style={{ perspective: '800px', willChange: 'transform' }}
            >
              Ready to transform your outdoor space?
            </h2>
          </div>
        </div>

        {/* CEO Quote Card: animated gradient border */}
        <div
          ref={quoteRef}
          className="cta-quote-card flex flex-col md:flex-row items-center gap-8 rounded-2xl p-8 md:p-12 mb-12 opacity-0"
          style={{
            background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(124,140,110,0.2), rgba(198,125,91,0.1), rgba(124,140,110,0.2)) border-box',
            border: '1px solid transparent',
            backgroundSize: '200% 200%',
            animation: 'gradient-border-spin 6s linear infinite',
          }}
        >
          <div className="shrink-0">
            <div className="relative">
              <img
                src="/team-tobias.jpg"
                alt="Tobias Neumann"
                className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                    '<div class="h-24 w-24 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center"><span class="text-white font-bold text-[18px]">TN</span></div>';
                }}
              />
            </div>
          </div>

          <div className="flex-1">
            <p className="text-[16px] md:text-[18px] leading-relaxed text-black/70 italic mb-4">
              "Every landscape begins with understanding your space — sunlight, soil, and how you live. From there, we design something that can grow with you."
            </p>
            <p className="text-[14px] font-semibold text-black">Brick &amp; Blooms</p>
            <p className="text-[12px] text-black/50">Landscape Design Studio</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="cta-item flex flex-col sm:flex-row items-center gap-4 opacity-0">
          {/* Primary: magnetic + orbiting particles */}
          <div className="relative" ref={particleContainerRef}>
            <a
              ref={ctaBtnRef}
              href="#contact"
              data-cursor-text="Let's Talk"
              data-cursor-type="tool"
              data-cursor-magnetic
              className="group relative flex items-center gap-2 rounded-lg bg-sage px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-sage-hover hover:shadow-xl hover:shadow-sage/30 overflow-hidden"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Secondary: draw-border reveal */}
          <a
            href="#work"
            className="secondary-cta group flex items-center gap-2 rounded-lg border border-black/20 bg-transparent px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:border-black/40 hover:bg-black/[0.03] hover:-translate-y-0.5"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            View recent projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes gradient-border-spin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default CTASection;
