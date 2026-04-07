import { useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



const SatisfactionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);


  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.sat-item'),
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
    <section ref={sectionRef} className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* WHY CHOOSE US header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
            WHY CHOOSE US
          </span>
        </div>
        <div className="flex items-start justify-between mb-16">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-black">
              Designed to Bring Nature Closer to You
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-black/50">
              Clear process. Thoughtful planning. Seamless execution. We keep things simple so your outdoor transformation feels effortless.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-black/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-black/30">B&B</span>
            </div>
          </div>
        </div>

        {/* "we listen. we imagine. we create." tagline + Ideas */}
        <div className="sat-item mb-16 opacity-0">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-black/40">we listen.</span>
              <span className="text-[11px] font-semibold tracking-[0.08em] text-black/40">we imagine.</span>
              <span className="text-[11px] font-semibold tracking-[0.08em] text-black/40">we create.</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[32px] sm:text-[48px] md:text-[80px] font-extrabold leading-none tracking-tight text-sage">
                Landscapes
              </span>
              <span className="text-[20px] md:text-[28px] font-medium text-black/60">
                that begin with your vision
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="sat-item mb-16 opacity-0">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-8">
            <div className="mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-black/40">Client Satisfaction Rate</span>
            </div>
            <div className="text-[48px] md:text-[64px] font-bold leading-none tracking-tight text-black mb-6">
              98%
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-[18px] md:text-[24px] font-bold text-black">120+</div>
                <div className="text-[11px] text-black/50">Projects Completed</div>
              </div>
              <div>
                <div className="text-[18px] md:text-[24px] font-bold text-black">4+ Years</div>
                <div className="text-[11px] text-black/50">Landscape Expertise</div>
              </div>
              <div>
                <div className="text-[18px] md:text-[24px] font-bold text-black">95%</div>
                <div className="text-[11px] text-black/50">On-Time Project Delivery</div>
              </div>
              <div>
                <div className="text-[18px] md:text-[24px] font-bold text-black">90%</div>
                <div className="text-[11px] text-black/50">Repeat & Referral Clients</div>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-6 flex items-center gap-3 border-t border-black/10 pt-6">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-sage text-sage" />
                ))}
              </div>
              <span className="text-[13px] font-semibold text-black">5 / 5</span>
              <span className="text-[12px] text-black/50">(Based on client feedback)</span>
            </div>
            <p className="mt-2 text-[12px] text-black/40">
              ★★★★★ 5/5 (Based on client feedback) — trusted by homeowners, commercial spaces & hospitality brands.
            </p>
          </div>
        </div>

        {/* "Every project starts fresh" cards */}
        <div className="sat-item grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 opacity-0">
          <div className="rounded-2xl border border-black/[0.08] p-10 bg-white transition-all duration-300 hover:border-sage/20 hover:shadow-xl hover:shadow-sage/5 hover:-translate-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-black/40 mb-3">
              No pre-designed templates
            </p>
            <h3 className="text-[24px] md:text-[28px] font-semibold leading-tight text-black mb-4">
              Every landscape starts with your space.
            </h3>
            <p className="text-[13px] leading-relaxed text-black/55">
              We design around your sunlight, soil, lifestyle, and vision — never one-size-fits-all.
            </p>
          </div>
          <div className="rounded-2xl border border-black/[0.08] p-10 bg-white transition-all duration-300 hover:border-sage/20 hover:shadow-xl hover:shadow-sage/5 hover:-translate-y-1 flex items-center">
            <div>
              <span className="text-[22px] md:text-[28px] lg:text-[36px] font-bold text-sage leading-tight tracking-tight">
                Custom solutions
              </span>
              <p className="text-[18px] md:text-[22px] font-medium text-black/60 mt-1">
                Built to grow with you.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-black/55">
                From concept to maintenance, every detail is tailored to your needs and long-term sustainability.
              </p>
            </div>
          </div>
        </div>

        {/* Spacer — pricing preview removed */}
        <div className="sat-item opacity-0">
        </div>

        {/* "With You Beyond Launch" */}
        <div className="sat-item mt-16 opacity-0">
          <div className="rounded-2xl border border-black/[0.08] bg-white p-8 md:px-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black/40 mb-2">Built for the long run</p>
            <h3 className="text-[22px] font-semibold text-black mb-6">With You Beyond Launch</h3>
            <div className="flex flex-wrap gap-6 md:gap-12">
              <span className="text-[14px] font-medium text-black/60">Ongoing support</span>
              <span className="text-[14px] font-medium text-black/60">Long-term partnership</span>
              <span className="text-[14px] font-medium text-black/60">Future-ready builds</span>
            </div>
          </div>
        </div>

        {/* Let's chat section */}
        <div className="sat-item mt-8 opacity-0">
          <div className="rounded-2xl border border-black/[0.08] bg-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-10">
            <div className="flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-black/40 mb-2">
                Quick intro call, no strings attached.
              </p>
              <h3 className="text-[24px] md:text-[28px] font-semibold leading-tight text-black mb-4">
                Let's chat or just say hello.
              </h3>
              <div className="mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50 block mb-1">
                  Next Availability
                </span>
                <p className="text-[14px] text-black/70">from 21 April 2026</p>
              </div>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-sage px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-sage-hover"
              >
                Book now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            {/* 3D Character placeholder - abstract avatar */}
            <div className="shrink-0 w-[160px] h-[200px] md:w-[200px] md:h-[240px] rounded-2xl bg-gradient-to-br from-sage/40 via-sage/30 to-terracotta/30 flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/30 mb-3" />
                <div className="w-20 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SatisfactionSection;
