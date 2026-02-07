import { useEffect, useRef } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.cta-item'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Stats row */}
        <div className="cta-item flex flex-wrap items-center gap-6 md:gap-12 mb-8 opacity-0">
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3 text-coral" />
            <span className="text-[13px] font-medium text-black/60">120+ projects delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3 text-coral" />
            <span className="text-[13px] font-medium text-black/60">99% on-time launches</span>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3 text-coral" />
            <span className="text-[13px] font-medium text-black/60">84% average boost in engagement</span>
          </div>
        </div>

        {/* 9 years + Let us inspire */}
        <div className="cta-item grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 opacity-0">
          {/* Left - 9 years */}
          <div>
            <span className="text-[11px] font-medium text-black/30 tracking-[0.1em]">9 years</span>
            <p className="mt-2 text-[14px] leading-relaxed text-black/50">
              Building lasting partnerships, scaling brands, and shipping work that stands out.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-[11px] text-black/40">120+ projects delivered</p>
              <p className="text-[11px] text-black/40">99% on-time launches</p>
              <p className="text-[11px] text-black/40">84% average boost in engagement</p>
            </div>
            <div className="mt-6">
              <span className="text-[32px] md:text-[42px] font-bold text-black/10">2016 — 2025</span>
            </div>
          </div>

          {/* Right - Let us inspire */}
          <div>
            <h2 className="text-[32px] md:text-[48px] font-medium leading-[1.1] tracking-tight text-black">
              Let us{' '}
              <span className="text-coral italic">inspire</span>
              {' '}your next project
            </h2>
          </div>
        </div>

        {/* CEO Quote Card */}
        <div className="cta-item flex flex-col md:flex-row items-center gap-8 rounded-2xl border border-black/10 bg-black/[0.02] p-8 md:p-12 mb-12 opacity-0">
          {/* CEO Photo */}
          <div className="shrink-0">
            <div className="relative">
              <img
                src="/team-tobias.jpg"
                alt="Tobias Neumann"
                className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="h-24 w-24 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center"><span class="text-white font-bold text-[18px]">TN</span></div>';
                }}
              />
            </div>
          </div>

          {/* Quote */}
          <div className="flex-1">
            <p className="text-[16px] md:text-[18px] leading-relaxed text-black/70 italic mb-4">
              "We listen first, stay transparent, and deliver what we promise. Every project matters to us."
            </p>
            <p className="text-[14px] font-semibold text-black">Tobias Neumann</p>
            <p className="text-[12px] text-black/50">CEO of Create®</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="cta-item flex flex-col sm:flex-row items-center gap-4 opacity-0">
          <a
            href="#contact"
            className="group flex items-center gap-2 rounded-lg bg-coral px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-coral-hover"
          >
            BOOK AN INTRO CALL
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#"
            className="group flex items-center gap-2 rounded-lg border border-black/20 bg-transparent px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:border-black/40 hover:bg-black/[0.03]"
          >
            Get Template
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#"
            className="text-[12px] font-medium text-black/50 underline underline-offset-4 transition-colors hover:text-coral"
          >
            See whats inside
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
