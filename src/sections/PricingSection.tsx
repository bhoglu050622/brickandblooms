import { useEffect, useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { plans } from '@/data/pricing';
import { contacts } from '@/data/company';
import { shimmerSweep } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      section.querySelectorAll('.pricing-card').forEach((el) => gsap.set(el, { opacity: 1 }));
      return;
    }

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.pricing-card');

      // Cards: staggered elevation rise — premium card arrives last with extra rotateX tilt
      cards.forEach((card, i) => {
        const isPremium = i === 1;
        gsap.fromTo(card,
          {
            y: 100,
            opacity: 0,
            scale: 0.9,
            rotateX: isPremium ? -8 : 0,
            transformPerspective: 800,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: isPremium ? 1.0 : 0.9,
            ease: 'power3.out',
            delay: i * 0.15 + (isPremium ? 0.3 : 0),
            scrollTrigger: { trigger: section, start: 'top 70%', once: true },
            onComplete: () => {
              // Shimmer sweep on premium card
              if (isPremium && cardRefs.current[i]) {
                shimmerSweep(cardRefs.current[i]!, { duration: 0.9, delay: 0.1 });
              }
              gsap.set(card, { willChange: 'auto' });
            },
          }
        );
      });

      // Price counter: slot-machine style roll through fake values
      section.querySelectorAll('.price-value').forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.price || '0', 10);
        const obj = { val: 0 };

        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            // Phase 1: 0.5s rapid random scramble
            tl.to(obj, {
              val: 1,
              duration: 0.5,
              ease: 'none',
              onUpdate: () => {
                const fake = Math.floor(Math.random() * target * 2);
                (el as HTMLElement).textContent = '$' + fake.toLocaleString();
              },
            });
            // Phase 2: 0.9s smooth settle to real value
            tl.to(obj, {
              val: target,
              duration: 0.9,
              ease: 'power3.out',
              onUpdate: () => {
                (el as HTMLElement).textContent = '$' + Math.round(obj.val).toLocaleString();
              },
              onComplete: () => {
                (el as HTMLElement).textContent = '$' + target.toLocaleString();
              },
            });
          },
        });
      });

      // Feature list: character typewriter reveal
      section.querySelectorAll('.pricing-card').forEach((card) => {
        const features = card.querySelectorAll('.price-feature span:last-child') as NodeListOf<HTMLElement>;
        features.forEach((span, fi) => {
          if (!span) return;
          gsap.fromTo(span,
            { opacity: 0, x: -10 },
            {
              opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out',
              delay: fi * 0.04,
              scrollTrigger: { trigger: card, start: 'top 65%', once: true },
            }
          );
        });
      });

      // Hover: sibling dim + 3D tilt toward viewer
      const cardEls = Array.from(cards) as HTMLElement[];
      cardEls.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          cardEls.forEach((c) => {
            if (c !== card) gsap.to(c, { opacity: 0.5, duration: 0.3, ease: 'power2.out' });
          });
          gsap.to(card, {
            rotateY: 2,
            rotateX: -2,
            scale: 1.01,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 800,
          });
        });
        card.addEventListener('mouseleave', () => {
          cardEls.forEach((c) => gsap.to(c, { opacity: 1, duration: 0.3, ease: 'power2.out' }));
          gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      });

      // Premium CTA button: pulse ring
      const premiumBtn = section.querySelector('.premium-cta') as HTMLElement;
      if (premiumBtn) {
        const ring = document.createElement('div');
        ring.style.cssText = `
          position: absolute; inset: -4px; border-radius: 10px; border: 2px solid rgba(124,140,110,0.4);
          pointer-events: none; animation: pulse-ring 2s ease-out infinite;
        `;
        premiumBtn.style.position = 'relative';
        premiumBtn.appendChild(ring);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const cardStyles = [
    'md:mt-8',
    'md:-mt-4 ring-2 ring-sage/30',
    'md:mt-12',
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              className={`pricing-card relative rounded-2xl border bg-white overflow-hidden opacity-0 ${
                index === 1
                  ? 'border-sage/30 shadow-lg shadow-sage/5'
                  : 'border-black/10'
              } ${cardStyles[index]}`}
              style={{ willChange: 'transform, opacity' }}
            >
              {index === 1 && (
                <div className="bg-sage px-4 py-2 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white">Most Popular</span>
                </div>
              )}

              <div className={`p-6 ${index === 1 ? 'pb-8' : ''} border-b border-black/10`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-black/60">{plan.name}</span>
                  <span className="text-[10px] font-medium text-black/30">{plan.tier}</span>
                </div>
                <p className="text-[12px] text-black/50 mb-4">{plan.subtitle}</p>

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
                  <span className="rounded bg-sage/10 px-2 py-0.5 text-[10px] font-semibold text-sage">SAVE 20%</span>
                </div>

                <div className={`h-2 w-full rounded-full bg-gradient-to-r ${plan.color} mb-4`} />
                <p className="text-[12px] italic text-black/50">{plan.description}</p>
              </div>

              <div className={`p-6 ${index === 1 ? 'py-8' : ''}`}>
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="price-feature flex items-start gap-2.5">
                      <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${index === 1 ? 'text-sage' : 'text-black/30'}`} />
                      <span className="text-[12px] text-black/60">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 border-t border-black/10 pt-4">
                  {plan.extras.map((extra, ei) => (
                    <div key={ei} className="flex items-start gap-2.5">
                      <span className="text-[12px] font-medium text-sage">+</span>
                      <span className="text-[12px] italic text-black/50">{extra}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#contact"
                  className={`premium-cta group flex w-full items-center justify-center gap-2 rounded-lg px-5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    index === 1
                      ? 'bg-sage py-4 text-white hover:bg-sage-hover'
                      : 'bg-[#1A1A17] py-3 text-white hover:bg-[#2A2A25]'
                  }`}
                >
                  GET STARTED
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>

                <div className="mt-4 text-center">
                  <span className="text-[10px] text-black/40">Timeline</span>
                  <p className="text-[13px] font-semibold text-black">{plan.timeline}</p>
                </div>
              </div>

              <div className="px-6 pb-6 text-right">
                <span className="text-[48px] font-bold text-black/5 leading-none">#{plan.number}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expert card */}
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

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default PricingSection;
