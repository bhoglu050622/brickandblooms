import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextReveal, circularReveal } from '@/lib/motion';
import { TiltImage } from '@/components/TiltImage';

gsap.registerPlugin(ScrollTrigger);

import { team } from '@/data/team';

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const contexts: gsap.Context[] = [];

    if (prefersReduced) {
      section.querySelectorAll('.team-item').forEach((el) => gsap.set(el, { opacity: 1 }));
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1 });
      return;
    }

    // Heading: dual-axis split — first half from left, second half from right
    if (headingRef.current) {
      const headCtx = splitTextReveal(headingRef.current, section, {
        mode: 'words',
        duration: 0.6,
        stagger: 0.08,
        y: 35,
        rotateX: 15,
        start: 'top 80%',
      });
      contexts.push(headCtx);
    }

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll('.team-item');

      items.forEach((item, i) => {
        const delay = i * 0.12;

        // Card entrance: fade + scale up
        gsap.fromTo(item,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay,
            scrollTrigger: { trigger: section, start: 'top 75%' },
          }
        );

        // Photo: circular bloom reveal (seed → full circle)
        const photoWrap = item.querySelector('.photo-wrap') as HTMLElement;
        if (photoWrap) {
          const photoCtx = circularReveal(photoWrap, section, {
            duration: 0.8,
            start: 'top 75%',
            targetRadius: '75%',
            delay: delay + 0.15,
            ease: 'power3.out',
          });
          contexts.push(photoCtx);
        }

        // Name: character reveal after photo blooms
        const nameEl = item.querySelector('.member-name') as HTMLElement;
        if (nameEl) {
          const nameCtx = splitTextReveal(nameEl, section, {
            mode: 'chars',
            duration: 0.4,
            stagger: 0.02,
            y: 20,
            rotateX: 0,
            ease: 'power2.out',
            start: 'top 75%',
            delay: delay + 0.3,
          });
          contexts.push(nameCtx);
        }

        // Role: left-wipe reveal
        const roleEl = item.querySelector('.member-role') as HTMLElement;
        if (roleEl) {
          gsap.fromTo(roleEl,
            { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.5,
              ease: 'power2.out',
              delay: delay + 0.45,
              scrollTrigger: { trigger: section, start: 'top 75%' },
              onComplete: () => { gsap.set(roleEl, { clipPath: 'none' }); },
            }
          );
        }

        // Hover: grayscale → color with radial warmth bloom
        const img = item.querySelector('.team-photo') as HTMLElement;
        const warmGlow = item.querySelector('.warm-glow') as HTMLElement;
        if (img && warmGlow) {
          item.addEventListener('mouseenter', () => {
            gsap.to(img, { filter: 'grayscale(0%)', duration: 0.5, ease: 'power2.out' });
            gsap.to(warmGlow, { opacity: 1, scale: 1.5, duration: 0.5, ease: 'power2.out' });
          });
          item.addEventListener('mouseleave', () => {
            gsap.to(img, { filter: 'grayscale(100%)', duration: 0.5, ease: 'power2.out' });
            gsap.to(warmGlow, { opacity: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
          });
        }
      });

      // Bottom section: earth-rise
      gsap.fromTo(
        section.querySelector('.team-bottom'),
        { y: 40, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        {
          y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)',
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: section.querySelector('.team-bottom'), start: 'top 85%' },
          onComplete: () => {
            const el = section.querySelector('.team-bottom') as HTMLElement;
            if (el) gsap.set(el, { clipPath: 'none' });
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
      contexts.forEach((c) => c.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#1A1A17] py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">THE TEAM</span>
        </div>
        <div className="flex items-start justify-between mb-16">
          <div>
            <h2
              ref={headingRef}
              className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-white"
              style={{ perspective: '800px' }}
            >
              No serious faces. Real serious work.
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-white/50">
              —— We bring sharp strategy and bold ideas, without the stiff boardroom vibe. Professional where it counts, human where it matters.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white/40">B&B</span>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {team.map((member, index) => (
            <div
              key={index}
              className="team-item group"
              style={{ opacity: 0 }}
              data-cursor-type="leaf"
              data-cursor-hover
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
                const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
                // Photo moves more than text (diorama effect)
                const photoEl = e.currentTarget.querySelector('.photo-wrap') as HTMLElement;
                if (photoEl) {
                  gsap.to(photoEl, { rotateY: dx * 8, rotateX: -dy * 8, duration: 0.2, ease: 'power2.out', transformPerspective: 600 });
                }
                e.currentTarget.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
              }}
              onMouseLeave={(e) => {
                const photoEl = e.currentTarget.querySelector('.photo-wrap') as HTMLElement;
                if (photoEl) {
                  gsap.to(photoEl, { rotateY: 0, rotateX: 0, duration: 0.4, ease: 'power2.out' });
                }
                e.currentTarget.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
              }}
            >
              {/* KPI tag */}
              <div className="mb-3">
                <span className="text-[10px] font-medium text-sage tracking-[0.1em]">//KPI</span>
              </div>

              {/* KPI stat */}
              <div className="mb-2 text-[28px] md:text-[36px] lg:text-[42px] font-bold leading-none text-white">
                {member.kpi}
              </div>
              <p className="mb-4 text-[11px] leading-relaxed text-white/40">
                {member.kpiDescription}
              </p>

              {/* Name & Role */}
              <h3 className="member-name mb-1 text-[14px] font-semibold text-white">{member.name}</h3>
              <p className="member-role mb-4 text-[11px] text-white/50" style={{ clipPath: 'inset(0 100% 0 0)' }}>{member.role}</p>

              {/* Photo with circular bloom + warm glow */}
              <div className="photo-wrap relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#2A2A25]" style={{ clipPath: 'circle(0% at 50% 50%)', willChange: 'transform' }}>
                {/* Warm glow overlay */}
                <div
                  className="warm-glow absolute inset-0 rounded-xl pointer-events-none z-10"
                  style={{
                    background: 'radial-gradient(circle at 50% 40%, rgba(124,140,110,0.15) 0%, transparent 70%)',
                    opacity: 0,
                  }}
                />

                {member.image ? (
                  <TiltImage maxTilt={4} perspective={1000} scale={1.03}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-photo h-full w-full object-cover grayscale transition-none"
                      style={{ filter: 'grayscale(100%)' }}
                    />
                  </TiltImage>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                    <span className="text-[32px] font-bold text-white/20">{member.initials}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="team-bottom grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-12" style={{ opacity: 0 }}>
          <div>
            <p className="text-[14px] leading-relaxed text-white/60">
              Our leadership team involved from{' '}
              <span className="text-sage font-semibold">first kickoff to final delivery</span>.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/40">
              Every milestone checked, every detail reviewed, every client kept in the loop. That's how projects land sharp and on time.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-[14px] font-semibold text-white">Discover team Brick & Blooms</h3>
            <p className="mb-4 text-[12px] leading-relaxed text-white/40">
              Meet the people, culture, and energy that keep our work sharp and our days fun.
            </p>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-sage transition-colors hover:text-sage-hover"
              data-cursor-magnetic
              data-cursor-type="tool"
            >
              Follow us on LinkedIn
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
