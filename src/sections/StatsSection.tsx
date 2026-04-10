import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stats } from '@/data/stats';
import { clientLogos } from '@/data/clientLogos';
import { counterRoll, clipRevealDirectional, NATURE } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const LogoCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const row = rowRef.current;
    if (!container || !row) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const setupTimer = setTimeout(() => {
      const totalWidth = row.scrollWidth;
      const visibleWidth = container.offsetWidth;
      if (visibleWidth <= 0 || totalWidth <= visibleWidth) return;

      const pages = Math.ceil(totalWidth / visibleWidth);
      const tl = gsap.timeline({ repeat: -1 });

      for (let i = 0; i < pages; i++) {
        const targetX = Math.min(visibleWidth * (i + 1), totalWidth - visibleWidth);
        tl.to(row, { x: -targetX, duration: 1.2, ease: NATURE.ease.slow });
        tl.to({}, { duration: 2.5 });
      }

      tl.to(row, { x: 0, duration: 1.2, ease: NATURE.ease.slow });
      tl.to({}, { duration: 2.5 });

      // Pause + hover tilt on individual logo items
      container.addEventListener('mouseenter', () => tl.pause());
      container.addEventListener('mouseleave', () => tl.resume());

      // Hover tilt on each logo
      const logos = row.querySelectorAll('.logo-item');
      logos.forEach((logo) => {
        logo.addEventListener('mouseenter', () => {
          gsap.to(logo, {
            scale: 1.1,
            rotateZ: -2,
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(logo, {
            rotateZ: 2,
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 0.3,
          });
        });
        logo.addEventListener('mouseleave', () => {
          gsap.killTweensOf(logo);
          gsap.to(logo, { scale: 1, rotateZ: 0, duration: 0.4, ease: 'power2.out' });
        });
      });

      return () => { tl.kill(); };
    }, 100);

    return () => clearTimeout(setupTimer);
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 border-t border-white/10 py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
          Brands who are part of our success story
        </p>
        <div className="overflow-hidden">
          <div ref={rowRef} className="flex gap-10 md:gap-20 whitespace-nowrap items-center">
            {clientLogos.map((logo, i) => (
              <div
                key={i}
                className="logo-item flex items-center gap-3 shrink-0 opacity-50 hover:opacity-80 transition-opacity duration-500 ease-nature cursor-pointer"
                style={{ willChange: 'transform' }}
              >
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                  <span className="text-[14px] text-white font-bold">{logo[0]}</span>
                </div>
                <span className="text-[13px] md:text-[18px] font-semibold text-white tracking-wide">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const suffixRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      section.querySelectorAll('.stat-item').forEach((el) => gsap.set(el, { opacity: 1 }));
      counterRefs.current.forEach((el, i) => {
        if (el) el.textContent = `${stats[i].value}${stats[i].suffix}`;
      });
      return;
    }

    const contexts: gsap.Context[] = [];

    const ctx = gsap.context(() => {
      const statItems = section.querySelectorAll('.stat-item');

      // Header entrance
      gsap.fromTo(
        section.querySelector('.stats-header'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 85%' } }
      );

      // Stat items: BURST entrance (scale 2.5 → 1) then counter rolls
      statItems.forEach((item, i) => {
        const numEl = item.querySelector('.stat-num-wrap');
        const suffixEl = suffixRefs.current[i];

        // Burst scale entrance
        if (numEl) {
          gsap.fromTo(numEl,
            { scale: 2.2, opacity: 0, y: 10 },
            {
              scale: 1, opacity: 1, y: 0,
              duration: 0.45,
              ease: 'back.out(2)',
              delay: i * 0.12,
              scrollTrigger: { trigger: section, start: 'top 75%', once: true },
            }
          );
        }

        // Radial bloom on card enter
        const bloom = item.querySelector('.stat-bloom') as HTMLElement;
        if (bloom) {
          gsap.fromTo(bloom,
            { scale: 0, opacity: 0.6 },
            {
              scale: 3, opacity: 0,
              duration: 0.9,
              ease: 'power2.out',
              delay: i * 0.12,
              scrollTrigger: { trigger: section, start: 'top 75%', once: true },
            }
          );
        }

        // Suffix float in from below
        if (suffixEl) {
          gsap.fromTo(suffixEl,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.5,
              ease: 'elastic.out(1, 0.5)',
              delay: i * 0.12 + 0.2,
              scrollTrigger: { trigger: section, start: 'top 75%', once: true },
            }
          );
        }
      });

      // Rolling counter animation
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const rollCtx = counterRoll(el, stat.value, section, {
          suffix: '',  // suffix handled separately
          duration: 1.8,
          stagger: 0.12,
          ease: 'power2.out',
          start: 'top 75%',
        });
        contexts.push(rollCtx);

        // Ambient glow pulse after counter finishes
        const countEl = el.closest('.stat-item')?.querySelector('.stat-number-glow');
        if (countEl) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            once: true,
            onEnter: () => {
              setTimeout(() => {
                gsap.to(countEl, {
                  textShadow: '0 0 30px rgba(124,140,110,0.35)',
                  duration: 1.5,
                  ease: 'sine.inOut',
                  yoyo: true,
                  repeat: -1,
                  delay: 1.8 + i * 0.12,
                });
              }, 0);
            },
          });
        }
      });

      // Directional clip reveal on progress bars — elastic overshoot settle
      const bars = section.querySelectorAll('.stat-bar-fill');
      bars.forEach((bar, i) => {
        const direction = i % 2 === 0 ? 'left' as const : 'right' as const;
        gsap.set(bar, { width: stats[i]?.barWidth || '0%' });
        const barCtx = clipRevealDirectional(bar, section, direction, {
          duration: 1.2,
          start: 'top 70%',
          ease: 'elastic.out(1.2, 0.4)',
          delay: i * 0.15,
        });
        contexts.push(barCtx);
      });

    }, section);

    return () => {
      ctx.revert();
      contexts.forEach((c) => c.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#1A1A17] overflow-hidden">
      {/* Header area */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pt-24">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sage">PERFORMANCE</span>
        </div>

        <div className="stats-header flex items-start justify-between mb-8">
          <div>
            <h2 className="mb-4 text-[32px] font-medium leading-[1.1] tracking-tight text-white md:text-[44px]">
              The proof behind our landscapes
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-white/50">
              From concept to completion, we design and deliver outdoor spaces that stand the test of time.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white/40">B&B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pb-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item relative overflow-hidden">
              {/* Radial bloom element */}
              <div
                className="stat-bloom absolute top-4 left-8 w-12 h-12 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(124,140,110,0.5) 0%, transparent 70%)',
                  transformOrigin: 'center',
                  scale: 0,
                  opacity: 0,
                }}
              />

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[14px] font-medium text-white/30">
                  {index === 0 ? '10+' : index === 1 ? '10%' : index === 2 ? '10' : '10%'}
                </span>
              </div>

              {/* Number row: counter + suffix */}
              <div className="stat-num-wrap flex items-baseline gap-1 mb-3" style={{ willChange: 'transform' }}>
                <div
                  ref={(el) => { counterRefs.current[index] = el; }}
                  className="stat-number-glow text-[32px] md:text-[48px] lg:text-[64px] font-bold leading-none tracking-tight text-sage"
                />
                <span
                  ref={(el) => { suffixRefs.current[index] = el; }}
                  className="text-[20px] md:text-[28px] font-bold text-sage/70"
                  style={{ opacity: 0 }}
                >
                  {stat.suffix}
                </span>
              </div>

              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                {stat.label}
              </p>

              <div className="mb-2 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="stat-bar-fill h-full bg-gradient-to-r from-sage to-sage/60 rounded-full shadow-[0_0_8px_rgba(124,140,110,0.4)]"
                  style={{ width: '0%', opacity: 0 }}
                />
              </div>

              <div className="text-[10px] font-medium tracking-[0.12em] text-white/30">
                {stat.code}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave background overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 80%, rgba(124,140,110,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(50,50,80,0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      <LogoCarousel />
    </section>
  );
};

export default StatsSection;
