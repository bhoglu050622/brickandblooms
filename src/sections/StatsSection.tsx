import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stats } from '@/data/stats';
import { clientLogos } from '@/data/clientLogos';
import { counterRoll, clipRevealDirectional } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [, setAnimated] = useState(false);

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
      // Stat items entrance with stagger
      gsap.fromTo(
        section.querySelectorAll('.stat-item'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        }
      );

      // Rolling counter animation for each stat
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const rollCtx = counterRoll(el, stat.value, section, {
          suffix: stat.suffix,
          duration: 1.8,
          stagger: 0.12,
          ease: 'power2.out',
          start: 'top 70%',
        });
        contexts.push(rollCtx);
      });

      // Directional clip reveal on progress bars (alternate left/right)
      const bars = section.querySelectorAll('.stat-bar-fill');
      bars.forEach((bar, i) => {
        const direction = i % 2 === 0 ? 'left' as const : 'right' as const;
        // Set the bar width to target first, then animate clip-path reveal
        gsap.set(bar, { width: stats[i]?.barWidth || '0%' });
        const barCtx = clipRevealDirectional(bar, section, direction, {
          duration: 1.2,
          start: 'top 70%',
          delay: i * 0.15,
        });
        contexts.push(barCtx);
      });

      // Header entrance
      gsap.fromTo(
        section.querySelector('.stats-header'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 85%' } }
      );

      // Trigger state for any dependent logic
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => setAnimated(true),
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
        {/* PERFORMANCE label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sage">
            PERFORMANCE
          </span>
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
          {/* Logo placeholder */}
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
            <div key={index} className="stat-item opacity-0">
              {/* Small starting number */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[14px] font-medium text-white/30">
                  {index === 0 ? '10+' : index === 1 ? '10%' : index === 2 ? '10' : '10%'}
                </span>
              </div>
              {/* Rolling counter */}
              <div
                ref={(el) => { counterRefs.current[index] = el; }}
                className="mb-3 text-[32px] md:text-[48px] lg:text-[64px] font-bold leading-none tracking-tight text-sage"
              />

              {/* Label */}
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                {stat.label}
              </p>

              {/* Progress bar with clip reveal */}
              <div className="mb-2 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="stat-bar-fill h-full bg-gradient-to-r from-sage to-sage/60 rounded-full shadow-[0_0_8px_rgba(124,140,110,0.4)]"
                  style={{ width: '0%', opacity: 0 }}
                />
              </div>

              {/* Code */}
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

      {/* Client Logos Section */}
      <div className="relative z-10 border-t border-white/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
            Brands who are part of our success story
          </p>

          {/* Logo marquee */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee gap-10 md:gap-20 whitespace-nowrap items-center justify-center">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <div key={i} className="flex items-center gap-3 shrink-0 opacity-50 hover:opacity-80 transition-opacity">
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
    </section>
  );
};

export default StatsSection;
