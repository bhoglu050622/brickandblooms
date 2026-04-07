import { useEffect, useRef, useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { faqs } from '@/data/faqs';

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.faq-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
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
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">FAQ</span>
          <div className="h-px w-8 bg-sage" />
        </div>

        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-black">
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
              {/* Avatar placeholder */}
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
                <div key={index} className="faq-item opacity-0">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:bg-black/[0.01]"
                  >
                    <span className="text-[15px] font-medium text-black pr-4">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <Minus className="h-4 w-4 shrink-0 text-sage mt-1" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-black/40 mt-1" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-[300px] pb-5' : 'max-h-0'
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed text-black/50 pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* "Do you still have questions?" */}
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
