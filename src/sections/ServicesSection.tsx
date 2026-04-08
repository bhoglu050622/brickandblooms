import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { splitTextReveal } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      section.querySelectorAll('.service-item').forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0 });
      });
      section.querySelectorAll('.service-line path').forEach((el) => {
        gsap.set(el, { strokeDashoffset: 0 });
      });
      section.querySelectorAll('.service-dot').forEach((el) => {
        gsap.set(el, { scale: 1, opacity: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll('.service-item');

      items.forEach((item, i) => {
        const direction = i % 2 === 0 ? -1 : 1;

        // Card slides in from alternating sides with a soft tilt
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: direction * 60,
            y: 30,
            rotateZ: direction * 1.5,
            filter: 'blur(6px)',
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotateZ: 0,
            filter: 'blur(0px)',
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              end: 'top 45%',
              scrub: 0.5,
            },
          }
        );

        // Fade + shift out as it passes
        gsap.to(item, {
          opacity: 0.1,
          y: -20,
          scale: 0.98,
          scrollTrigger: {
            trigger: item,
            start: 'bottom 35%',
            end: 'bottom 5%',
            scrub: 0.5,
          },
        });
      });

      // Timeline dots pulse in with glow ring
      section.querySelectorAll('.service-dot').forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 80%',
              end: 'top 65%',
              scrub: 0.3,
              onEnter: () => {
                // Glow ring that expands and fades
                const ring = document.createElement('div');
                ring.style.cssText = 'position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(124,140,110,0.6);pointer-events:none;';
                (dot as HTMLElement).style.position = 'relative';
                dot.appendChild(ring);
                gsap.fromTo(ring,
                  { scale: 1, opacity: 1 },
                  { scale: 2.5, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ring.remove() }
                );
              },
            },
          }
        );
      });

      // Split text reveal on service card titles
      const titleContexts: gsap.Context[] = [];
      section.querySelectorAll('.service-title').forEach((title) => {
        const titleCtx = splitTextReveal(title as HTMLElement, title.closest('.service-item') || section, {
          mode: 'words',
          duration: 0.5,
          stagger: 0.06,
          y: 30,
          start: 'top 75%',
        });
        titleContexts.push(titleCtx);
      });

      // Staggered feature reveals within each card
      section.querySelectorAll('.service-item').forEach((item) => {
        const features = item.querySelectorAll('.feature-line');
        if (features.length) {
          gsap.fromTo(
            features,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 60%',
                end: 'top 35%',
                scrub: 0.3,
              },
            }
          );
        }
      });

      // SVG path draw animation on connecting lines
      section.querySelectorAll('.service-line path').forEach((path) => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: path.closest('svg'),
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: 0.3,
          },
        });
      });

      // Scroll progress bar on the timeline
      const progressBar = section.querySelector('.service-progress');
      if (progressBar) {
        gsap.to(progressBar, {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: section.querySelector('.service-timeline'),
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: true,
          },
        });
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="studio" className="w-full bg-white py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage">
            <span className="text-[10px] font-bold text-white">B&B</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40">
            Our Services
          </span>
        </div>
        <h2 className="mb-3 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-black">
          What we do best
        </h2>
        <p className="mb-16 max-w-[500px] text-[14px] leading-relaxed text-black/50">
          Every service is a chapter in your landscape story.
        </p>

        {/* Services storylane */}
        <div className="relative service-timeline">
          {/* Central timeline track */}
          <div className="absolute left-3 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-black/[0.06]" />
          {/* Scroll progress fill */}
          <div className="service-progress absolute left-3 md:left-1/2 md:-translate-x-px top-0 w-0.5 bg-sage/50 rounded-full origin-top" style={{ height: '0%' }} />

          {services.map((service, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={index} className="relative">
                {/* Connecting SVG path — draws itself */}
                {index > 0 && (
                  <div className="flex justify-start md:justify-center pl-[11px] md:pl-0">
                    <svg className="service-line h-20 w-2 overflow-visible" viewBox="0 0 2 80" preserveAspectRatio="none">
                      <path
                        d="M1 0 C1 20, 1 60, 1 80"
                        fill="none"
                        stroke="url(#sageLine)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="80"
                        strokeDashoffset="80"
                      />
                      <defs>
                        <linearGradient id="sageLine" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(124,140,110,0.2)" />
                          <stop offset="100%" stopColor="rgba(124,140,110,0.5)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* Timeline dot */}
                <div className="flex justify-start md:justify-center pl-[10px] md:pl-0 mb-4">
                  <div className="service-dot h-4 w-4 rounded-full bg-sage shadow-lg shadow-sage/30 ring-4 ring-white scale-0 opacity-0" />
                </div>

                {/* Service card — alternates sides on desktop */}
                <div
                  className={`service-item opacity-0 pl-10 md:pl-0 ${
                    isLeft
                      ? 'md:pr-[calc(50%+40px)] md:text-right'
                      : 'md:pl-[calc(50%+40px)]'
                  }`}
                >
                  <div
                    className="rounded-2xl border border-black/[0.06] bg-white p-7 md:p-9 transition-all duration-300 hover:shadow-xl hover:shadow-sage/5 hover:border-sage/20"
                    style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
                      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
                      e.currentTarget.style.transform = `rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'rotateY(0) rotateX(0)';
                    }}
                  >
                    {/* Number badge */}
                    <div className={`mb-5 flex items-center gap-3 ${isLeft ? 'md:justify-end' : ''}`}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10 text-[13px] font-bold text-sage">
                        {service.number}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
                        {service.category}
                      </span>
                    </div>

                    {/* Image */}
                    <div className={`mb-6 ${isLeft ? 'md:ml-auto' : ''} max-w-[400px]`}>
                      <div className="aspect-[2/1] w-full rounded-xl overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.className += ` bg-gradient-to-br ${service.imageColor}`;
                          }}
                        />
                      </div>
                    </div>

                    {/* Title + Description */}
                    <h3 className="service-title mb-2 text-[24px] md:text-[28px] font-medium leading-tight tracking-tight text-black">
                      {service.title}
                    </h3>
                    <p className="mb-5 text-[13px] leading-relaxed text-black/50">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className={`space-y-2 mb-5 ${isLeft ? 'md:ml-auto' : ''}`}>
                      {service.features.map((feature, i) => (
                        <div key={i} className={`feature-line flex items-start gap-2 ${isLeft ? 'md:justify-end md:flex-row-reverse' : ''}`}>
                          <span className="mt-0.5 text-[11px] font-medium text-sage">+</span>
                          <span className="text-[12px] leading-relaxed text-black/55">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <a
                      href="#contact"
                      className={`group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-sage transition-colors hover:text-sage-hover ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      Discuss your project
                      <ArrowRight className={`h-3 w-3 transition-transform group-hover:translate-x-1 ${isLeft ? 'md:rotate-180 md:group-hover:-translate-x-1 md:group-hover:translate-x-0' : ''}`} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final dot */}
          <div className="flex justify-start md:justify-center pl-[10px] md:pl-0 mt-4">
            <div className="service-dot h-4 w-4 rounded-full bg-sage shadow-lg shadow-sage/30 ring-4 ring-white scale-0 opacity-0" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
