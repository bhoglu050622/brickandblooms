import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '@/data/testimonials';
import { companyStats } from '@/data/stats';
import { circularReveal, breatheScale } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const contexts: gsap.Context[] = [];
    const cleanups: (() => void)[] = [];

    if (prefersReduced) {
      section.querySelectorAll('.test-item').forEach((el) => gsap.set(el, { opacity: 1 }));
      return;
    }

    const ctx = gsap.context(() => {
      const testItems = section.querySelectorAll('.test-item');

      // Items: flip-in from back (rotateY 90° → 0°)
      testItems.forEach((item, i) => {
        gsap.fromTo(item,
          { rotateY: 90, opacity: 0.3, transformPerspective: 1000 },
          {
            rotateY: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: { trigger: section, start: 'top 70%' },
          }
        );
      });

      // Stars: burst sequence with brightness flash
      section.querySelectorAll('.star-group').forEach((group) => {
        const stars = group.querySelectorAll('.star-icon');
        stars.forEach((star, si) => {
          gsap.fromTo(star,
            { scale: 0, opacity: 0 },
            {
              scale: 1, opacity: 1,
              duration: 0.3,
              ease: 'back.out(3)',
              delay: si * 0.08,
              scrollTrigger: { trigger: group, start: 'top 80%' },
            }
          );
          // Brightness flash
          gsap.fromTo(star,
            { filter: 'brightness(2.5)' },
            {
              filter: 'brightness(1)',
              duration: 0.4,
              delay: si * 0.08,
              scrollTrigger: { trigger: group, start: 'top 80%' },
            }
          );
        });
      });

      // Quote text: ink-flow clip reveal
      const quotes = section.querySelectorAll('.quote-text');
      quotes.forEach((quote, i) => {
        gsap.fromTo(quote,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            ease: 'power2.inOut',
            delay: i * 0.15 + 0.3,
            scrollTrigger: { trigger: section, start: 'top 70%' },
            onComplete: () => { gsap.set(quote, { clipPath: 'none' }); },
          }
        );
      });

      // Author avatars: circular bloom
      const avatars = section.querySelectorAll('.author-avatar');
      avatars.forEach((avatar, i) => {
        const avCtx = circularReveal(avatar, section, {
          duration: 0.4,
          start: 'top 70%',
          targetRadius: '50%',
          delay: i * 0.15 + 0.1,
          ease: 'power3.out',
        });
        contexts.push(avCtx);
      });

      // Ambient: subtle breathing on cards while in viewport
      const cards = section.querySelectorAll('.testimonial-card');
      cards.forEach((card) => {
        const cleanup = breatheScale(card, { min: 1.0, max: 1.003, duration: 5 });
        cleanups.push(cleanup);
      });

      // Card hover: dimensional lift with lean-back
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            rotateX: 3,
            scale: 1.01,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 800,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          });
        });
      });
    }, section);

    return () => {
      ctx.revert();
      contexts.forEach((c) => c.revert());
      cleanups.forEach((c) => c());
    };
  }, []);

  const selected = selectedIndex !== null ? testimonials[selectedIndex] : null;

  return (
    <section ref={sectionRef} className="w-full bg-[#1A1A17] py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="test-item mb-4 opacity-0" style={{ willChange: 'transform' }}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
            What our clients say
          </span>
        </div>

        <div className="test-item flex items-start justify-between mb-12 opacity-0" style={{ willChange: 'transform' }}>
          <div>
            <h3 className="text-[28px] md:text-[36px] font-medium leading-[1.1] tracking-tight text-white mb-3">
              Partnerships that last, results that stick.
            </h3>
            <p className="max-w-[460px] text-[13px] text-white/50">
              From kickoff to launch, brands trust us to stay close, adapt fast, and deliver without any drama.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="star-group flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="star-icon inline-block" style={{ filter: 'brightness(1)' }}>
                  <Star className="h-4 w-4 fill-sage text-sage" />
                </span>
              ))}
            </div>
            <span className="text-[14px] font-semibold text-white">{companyStats.rating}</span>
            <span className="text-[12px] text-white/40">({companyStats.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="test-item mb-6 opacity-0" style={{ willChange: 'transform' }}>
          <span className="text-[80px] md:text-[120px] font-serif leading-none text-sage/10 select-none">&ldquo;</span>
        </div>

        {/* Testimonial cards */}
        <div className="test-item grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 opacity-0" style={{ willChange: 'transform' }}>
          {testimonials.slice(0, 3).map((t, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="testimonial-card text-left rounded-2xl border border-white/10 bg-[#22221E] p-6 transition-colors hover:border-white/20 hover:bg-[#2A2A25]"
              style={{ willChange: 'transform' }}
              data-cursor-type="leaf"
              data-cursor-hover
            >
              {/* Stars */}
              <div className="star-group flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="star-icon inline-block" style={{ filter: 'brightness(1)' }}>
                    <Star className="h-3 w-3 fill-sage text-sage" />
                  </span>
                ))}
              </div>

              {/* Quote: ink-flow reveal */}
              <p className="quote-text mb-5 text-[13px] leading-relaxed text-white/70 italic line-clamp-4" style={{ clipPath: 'inset(0 100% 0 0)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="author-avatar h-10 w-10 rounded-full bg-gradient-to-br from-sage/60 to-sage flex items-center justify-center shrink-0"
                  style={{ clipPath: 'circle(0% at 50% 50%)' }}
                >
                  <span className="text-white font-bold text-[11px]">{t.initials}</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{t.name}</p>
                  <p className="text-[11px] text-white/40">{t.role}, {t.company}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="text-[10px] text-white/25">{t.date}</span>
              </div>
            </button>
          ))}
        </div>

        {/* View all CTA */}
        <div className="test-item flex items-center justify-between opacity-0" style={{ willChange: 'transform' }}>
          <p className="text-[11px] text-white/30">
            Backed by feedback from <strong className="text-white/50">{companyStats.projectsCompleted}</strong> projects delivered.
          </p>
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:border-white/40 hover:bg-white/[0.03]"
          >
            View all reviews
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-[560px] animate-scale-in rounded-2xl border border-white/10 bg-[#1A1A17] p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-0.5 mb-5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-sage text-sage" />
              ))}
            </div>

            <p className="mb-6 text-[16px] md:text-[18px] leading-relaxed text-white/80 italic">
              &ldquo;{selected.quote}&rdquo;
            </p>

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sage/60 to-sage flex items-center justify-center">
                <span className="text-white font-bold text-[16px]">{selected.initials}</span>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white">{selected.name}</p>
                <p className="text-[12px] text-white/50">{selected.role}</p>
                <p className="text-[12px] text-white/30">{selected.company}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[11px] text-white/30">{selected.date}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
