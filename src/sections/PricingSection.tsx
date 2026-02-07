import { useEffect, useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PricingPlan {
  number: string;
  name: string;
  tier: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  extras: string[];
  timeline: string;
  color: string;
}

const plans: PricingPlan[] = [
  {
    number: '01',
    name: 'Core',
    tier: 'Starter Plan',
    subtitle: 'For startups and first launches',
    price: '$2,800',
    originalPrice: '$3,500',
    description: 'Simple, fast, and effective, so you can focus on growing your business.',
    features: [
      'Brand & Identity starter kit',
      'Website design (core pages)',
      'Standard revisions',
      'SEO setup essentials',
      'Unlimited stock images',
      'Native source files included',
      'Final handoff files',
    ],
    extras: [
      'Clear milestones from start to finish',
      'We keep you in the loop',
      'Feedback built into the process',
    ],
    timeline: '2-3 weeks',
    color: 'from-red-700 to-red-900',
  },
  {
    number: '02',
    name: 'Studio',
    tier: 'Advanced Plan',
    subtitle: 'For growing teams and serious builds',
    price: '$6,500',
    originalPrice: '$8,000',
    description: 'A complete package with flexibility, advanced design, and the support you need to grow faster.',
    features: [
      'Extended Branding',
      'Full website design',
      'UX flows & product design',
      'Unlimited revisions',
      'Advanced SEO & content',
      'Priority support response',
      'Final handoff',
    ],
    extras: [
      'Deeper design coverage for complex needs',
      'Unlimited adjustments before launch',
      'Faster responses when you need us most',
    ],
    timeline: '4-6 weeks',
    color: 'from-blue-700 to-blue-900',
  },
  {
    number: '03',
    name: 'Scale',
    tier: 'Growth Plan',
    subtitle: 'For established teams and long-term growth',
    price: '$12,000',
    originalPrice: '$15,000',
    description: 'Strategy, design, and dedicated support for complex projects that demand scalability and polish.',
    features: [
      'End-to-end brand strategy',
      'Large-scale website & CMS',
      'Advanced UX & product design',
      'Dedicated senior managers',
      'Advanced micro-interactions',
      'Optimization & support',
      'Enterprise-level handoff',
    ],
    extras: [
      'Scalable solutions designed for growth',
      'Dedicated manager guiding every stage with integrations',
      'Long-term support beyond launch',
    ],
    timeline: '6–8 weeks',
    color: 'from-gray-700 to-gray-900',
  },
];

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.pricing-card'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

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
              —— Designed around your specs, each plan gives you clarity on scope, features, and cost so you can move forward with confidence.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-black/20 flex items-center justify-center">
              <span className="text-[14px] font-bold text-black/30">C</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="pricing-card rounded-2xl border border-black/10 bg-white overflow-hidden opacity-0 hover:border-black/20 transition-all duration-300"
            >
              {/* Card header */}
              <div className="p-6 border-b border-black/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-black/40">{plan.name}</span>
                  <span className="text-[10px] font-medium text-black/30">{plan.tier}</span>
                </div>
                <p className="text-[12px] text-black/50 mb-4">{plan.subtitle}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[36px] md:text-[42px] font-bold text-black leading-none">
                    {plan.price}
                  </span>
                  <span className="text-[13px] text-black/40">/project</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[12px] text-black/30 line-through">{plan.originalPrice}</span>
                  <span className="rounded bg-coral/10 px-2 py-0.5 text-[10px] font-semibold text-coral">
                    SAVE 20%
                  </span>
                </div>

                {/* Image placeholder */}
                <div className={`aspect-[3/2] w-full rounded-xl bg-gradient-to-br ${plan.color} mb-4 flex items-center justify-center`}>
                  <span className="text-white/20 text-[24px] font-bold">{plan.name}</span>
                </div>

                <p className="text-[12px] italic text-black/50">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="h-3.5 w-3.5 mt-0.5 text-coral shrink-0" />
                      <span className="text-[12px] text-black/60">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Extras */}
                <div className="space-y-2 mb-6 border-t border-black/10 pt-4">
                  {plan.extras.map((extra, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[12px] font-medium text-coral">+</span>
                      <span className="text-[12px] italic text-black/50">{extra}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-coral px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-coral-hover"
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
            {/* Avatar placeholder */}
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
              <span className="text-white font-bold text-[14px]">MW</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-black">Maggie Winslow</p>
              <p className="text-[11px] text-black/50">Project Operations Manager</p>
            </div>
            <a
              href="#contact"
              className="group flex items-center gap-2 rounded-lg bg-[#0a0a0a] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#222]"
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
