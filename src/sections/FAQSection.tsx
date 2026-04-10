import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextReveal, circularReveal } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

import { faqs } from '@/data/faqs';

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFAQ = (index: number) => {
    const newOpen = openIndex === index ? null : index;

    // Animate icon rotation
    iconRefs.current.forEach((icon, i) => {
      if (!icon) return;
      if (i === index) {
        gsap.to(icon, {
          rotation: newOpen === index ? 135 : 0,
          duration: 0.3,
          ease: 'back.out(2)',
        });
      }
    });

    // Close previously open item
    if (openIndex !== null && openIndex !== index && answerRefs.current[openIndex]) {
      const closingEl = answerRefs.current[openIndex]!.parentElement as HTMLElement;
      gsap.to(closingEl, { height: 0, duration: 0.3, ease: 'power3.in', overwrite: true });
    }

    // Open/close current item with GSAP height animation
    const wrapper = answerRefs.current[index]?.parentElement as HTMLElement | null;
    if (wrapper) {
      if (newOpen === index) {
        // Open: measure natural height then animate to it
        gsap.set(wrapper, { height: 'auto', overflow: 'hidden' });
        const fullHeight = wrapper.offsetHeight;
        gsap.fromTo(wrapper,
          { height: 0 },
          { height: fullHeight, duration: 0.45, ease: 'power3.out', overwrite: true,
            onComplete: () => { gsap.set(wrapper, { height: 'auto' }); ScrollTrigger.refresh(); }
          }
        );
        // Blur unfurl on answer text
        const el = answerRefs.current[index]!;
        gsap.fromTo(el,
          { opacity: 0, y: -8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out', delay: 0.1 }
        );
      } else {
        gsap.to(wrapper, { height: 0, duration: 0.35, ease: 'power3.in', overwrite: true,
          onComplete: () => ScrollTrigger.refresh()
        });
      }
    }

    setOpenIndex(newOpen);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      section.querySelectorAll('.faq-item').forEach((el) => gsap.set(el, { opacity: 1 }));
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1 });
      return;
    }

    const contexts: gsap.Context[] = [];

    // Heading: splitTextReveal with rotateX
    if (headingRef.current) {
      const headCtx = splitTextReveal(headingRef.current, section, {
        mode: 'words',
        duration: 0.6,
        stagger: 0.08,
        y: 40,
        rotateX: 15,
        ease: 'power3.out',
        start: 'top 80%',
      });
      contexts.push(headCtx);
    }

    const ctx = gsap.context(() => {
      // FAQ items: bottom-wipe emergence
      const faqItems = section.querySelectorAll('.faq-item');
      faqItems.forEach((item, i) => {
        gsap.fromTo(item,
          { clipPath: 'inset(100% 0 0 0)', y: 20, opacity: 0 },
          {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: section, start: 'top 70%' },
            onComplete: () => { gsap.set(item, { clipPath: 'none' }); },
          }
        );
      });

      // Number badge: circular reveal
      const badges = section.querySelectorAll('.faq-badge');
      badges.forEach((badge, i) => {
        const badgeCtx = circularReveal(badge, section, {
          duration: 0.3,
          start: 'top 70%',
          targetRadius: '50%',
          delay: i * 0.1 + 0.1,
          ease: 'power2.out',
        });
        contexts.push(badgeCtx);
      });

      // Hover: vine-line on left edge
      const faqRows = section.querySelectorAll('.faq-row');
      faqRows.forEach((row, i) => {
        const vine = vineRefs.current[i];
        if (!vine) return;

        row.addEventListener('mouseenter', () => {
          gsap.to(vine, { scaleY: 1, opacity: 1, duration: 0.2, ease: 'power2.out', transformOrigin: 'top center' });
        });
        row.addEventListener('mouseleave', () => {
          gsap.to(vine, { scaleY: 0, opacity: 0, duration: 0.2, ease: 'power2.in', transformOrigin: 'bottom center' });
        });
      });
    }, section);

    return () => {
      ctx.revert();
      contexts.forEach((c) => c.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">FAQ</span>
          <div className="h-px w-8 bg-sage" />
        </div>

        <div className="flex items-start justify-between mb-12">
          <div>
            <h2
              ref={headingRef}
              className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-black"
              style={{ perspective: '800px' }}
            >
              Clearing doubts and concerns
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-black/50">
              —— Explore the most common questions about working with Brick & Blooms, all in one place.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-black/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-black/30">B&B</span>
            </div>
          </div>
        </div>

        {/* Large background text */}
        <div className="mb-8">
          <span className="text-[32px] sm:text-[48px] md:text-[80px] lg:text-[120px] font-bold leading-none text-black/[0.04] select-none">
            Clearing doubts
          </span>
        </div>

        {/* FAQ + Expert side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Expert card */}
          <div className="faq-item order-2 lg:order-1 opacity-0">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <p className="mb-2 text-[12px] text-black/40">
                Book a quick chat and we'll walk you through how we do things.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center">
                  <span className="text-white font-bold text-[12px]">LB</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-black">Lynn Bergmann</p>
                  <p className="text-[11px] text-black/50">Project Manager</p>
                </div>
              </div>
              <a
                href="#contact"
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A1A17] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#2A2A25]"
              >
                BOOK A CALL
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* FAQ list */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="divide-y divide-black/10">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item relative opacity-0">
                  {/* Vine indicator on left */}
                  <div
                    ref={(el) => { vineRefs.current[index] = el; }}
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-sage rounded-full pointer-events-none"
                    style={{ transform: 'scaleY(0)', opacity: 0, transformOrigin: 'top center' }}
                  />

                  <div className="faq-row">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex w-full items-start justify-between gap-4 py-5 text-left pl-4"
                    >
                      {/* Number badge with circular reveal */}
                      <span
                        className="faq-badge shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage/10 text-[10px] font-semibold text-sage"
                        style={{ clipPath: 'circle(0% at 50% 50%)' }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-[15px] font-medium text-black pr-4">
                        {faq.question}
                      </span>
                      {/* Animated icon */}
                      <div
                        ref={(el) => { iconRefs.current[index] = el; }}
                        className="shrink-0 mt-1 h-4 w-4 flex items-center justify-center"
                        style={{ willChange: 'transform' }}
                      >
                        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                          <line x1="8" y1="2" x2="8" y2="14" stroke={openIndex === index ? '#7C8C6E' : 'rgba(0,0,0,0.4)'} strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="2" y1="8" x2="14" y2="8" stroke={openIndex === index ? '#7C8C6E' : 'rgba(0,0,0,0.4)'} strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </button>

                    {/* Answer: GSAP height animation */}
                    <div style={{ height: 0, overflow: 'hidden' }}>
                      <div
                        ref={(el) => { answerRefs.current[index] = el; }}
                        className="pl-14 pr-8 pb-5"
                      >
                        <p className="text-[13px] leading-relaxed text-black/50">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-item mt-8 rounded-2xl border border-black/10 p-6 flex items-center justify-between opacity-0">
              <div>
                <h3 className="text-[14px] font-semibold text-black">Do you still have questions?</h3>
                <p className="text-[12px] text-black/40">Book a quick chat and we'll walk you through how we do things.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center">
                  <span className="text-white font-bold text-[9px]">LB</span>
                </div>
                <a
                  href="#contact"
                  className="group flex items-center gap-2 rounded-lg bg-[#1A1A17] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#2A2A25]"
                >
                  BOOK A CALL
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
