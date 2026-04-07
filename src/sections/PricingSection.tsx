import { useEffect, useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { plans } from '@/data/pricing';
import { contacts } from '@/data/company';

gsap.registerPlugin(ScrollTrigger);

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.pricing-card'),
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );

      // Count up price numbers
      section.querySelectorAll('.price-value').forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.price || '0', 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
          onUpdate: () => { (el as HTMLElement).textContent = '$' + Math.round(obj.val).toLocaleString(); },
        });
      });

      // Stagger feature reveals
      section.querySelectorAll('.pricing-card').forEach((card) => {
        const features = card.querySelectorAll('.price-feature');
        gsap.fromTo(features, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 65%' } });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Ladder config: Premium (index 1) gets the most visual weight
  const cardStyles = [
    'md:mt-8', // Budget-Friendly: offset down
    'md:-mt-4 ring-2 ring-sage/30', // Premium: taller, highlighted
    'md:mt-12', // Ultra Luxury: offset further down
  ];

  return (
    <section ref={sectionRef} id="pricing" className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">PRICING</span>
        </div>
        <div className="flex items-start justify-between mb-16">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-black">
              Plans built to fit your next project
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-black/50">
              Three tiers designed around different scales of outdoor transformation — from a single balcony to a full estate.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-black/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-black/30">B&B</span>
            </div>
          </div>
        </div>

        {/* Pricing Ladder */}
        <div className="group/pricing grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card rounded-2xl border bg-white overflow-hidden opacity-0 transition-all duration-300 group-hover/pricing:opacity-50 hover:!opacity-100 ${
                index === 1
                  ? 'border-sage/30 shadow-lg shadow-sage/5 hover:shadow-xl hover:shadow-sage/10'
                  : 'border-black/10 hover:border-black/20'
              } ${cardStyles[index]}`}
            >
              {/* Recommended badge for Premium */}
              {index === 1 && (
                <div className="bg-sage px-4 py-2 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className={`p-6 ${index === 1 ? 'pb-8' : ''} border-b border-black/10`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-black/60">{plan.name}</span>
                  <span className="text-[10px] font-medium text-black/30">{plan.tier}</span>
                </div>
                <p className="text-[12px] text-black/50 mb-4">{plan.subtitle}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`font-bold text-black leading-none ${
                    index === 1 ? 'text-[32px] md:text-[42px] lg:text-[52px]' : 'text-[28px] md:text-[36px] lg:text-[42px]'
                  }`}>
                    <span className="price-value" data-price={plan.price.replace(/[$,]/g, '')}>{plan.price}</span>
                  </span>
                  <span className="text-[13px] text-black/40">/project</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[12px] text-black/30 line-through">{plan.originalPrice}</span>
                  <span className="rounded bg-sage/10 px-2 py-0.5 text-[10px] font-semibold text-sage">
                    SAVE 20%
                  </span>
                </div>

                {/* Gradient strip */}
                <div className={`h-2 w-full rounded-full bg-gradient-to-r ${plan.color} mb-4`} />

                <p className="text-[12px] italic text-black/50">{plan.description}</p>
              </div>

              {/* Features */}
              <div className={`p-6 ${index === 1 ? 'py-8' : ''}`}>
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="price-feature flex items-start gap-2.5">
                      <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                        index === 1 ? 'text-sage' : 'text-black/30'
                      }`} />
                      <span className="text-[12px] text-black/60">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Extras */}
                <div className="space-y-2 mb-6 border-t border-black/10 pt-4">
                  {plan.extras.map((extra, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[12px] font-medium text-sage">+</span>
                      <span className="text-[12px] italic text-black/50">{extra}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`group flex w-full items-center justify-center gap-2 rounded-lg px-5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    index === 1
                      ? 'bg-sage py-4 text-white hover:bg-sage-hover'
                      : 'bg-[#1A1A17] py-3 text-white hover:bg-[#2A2A25]'
                  }`}
                >
                  GET STARTED
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>

                {/* Timeline */}
                <div className="mt-4 text-center">
                  <span className="text-[10px] text-black/40">Timeline</span>
                  <p className="text-[13px] font-semibold text-black">{plan.timeline}</p>
                </div>
              </div>

              {/* Plan number */}
              <div className="px-6 pb-6 text-right">
                <span className="text-[48px] font-bold text-black/5 leading-none">#{plan.number}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ask our expert */}
        <div className="pricing-card rounded-2xl border border-black/10 p-8 flex flex-col md:flex-row items-center gap-8 opacity-0">
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-black/40">Ask our expert</span>
            <p className="mt-2 text-[14px] text-black/60">
              Schedule a quick call, and we'll walk you through our flexible plans.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sage/60 to-sage flex items-center justify-center">
              <span className="text-white font-bold text-[14px]">{contacts.operationsManager.initials}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-black">{contacts.operationsManager.name}</p>
              <p className="text-[11px] text-black/50">{contacts.operationsManager.role}</p>
            </div>
            <a
              href="#contact"
              className="group flex items-center gap-2 rounded-lg bg-[#1A1A17] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#2A2A25]"
            >
              BOOK A CALL
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
