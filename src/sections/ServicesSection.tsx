import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isDesktop = window.innerWidth >= 1024;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.service-text-item') as HTMLElement[];
      const images = gsap.utils.toArray('.service-image') as HTMLElement[];
      const vines = gsap.utils.toArray('.vine-indicator') as HTMLElement[];

      // Section entrance: split panels slide from center-out
      const leftCol = leftColRef.current;
      const rightCol = rightColRef.current;
      if (leftCol && isDesktop) {
        gsap.fromTo(leftCol,
          { x: -60, opacity: 0, clipPath: 'inset(0 20% 0 0)' },
          {
            x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)',
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%' },
            onComplete: () => { gsap.set(leftCol, { clipPath: 'none' }); },
          }
        );
      }
      if (rightCol && isDesktop) {
        gsap.fromTo(rightCol,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.9, ease: 'power3.out',
            delay: 0.15,
            scrollTrigger: { trigger: section, start: 'top 80%' },
          }
        );
      }

      if (isDesktop) {
        images.forEach((img, i) => {
          gsap.set(img, {
            clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
            scale: i === 0 ? 1 : 1.1,
            display: 'block',
          });
        });

        items.forEach((item, i) => {
          gsap.set(item, { opacity: i === 0 ? 1 : 0.2, x: i === 0 ? 20 : 0 });
        });

        // Set vine indicators
        vines.forEach((v) => gsap.set(v, { scaleY: 0, transformOrigin: 'top center' }));
        if (vines[0]) gsap.set(vines[0], { scaleY: 1 });

        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => {
              if (self.isActive) {
                setActiveIndex(i);

                // Highlight current text
                gsap.to(item, { opacity: 1, x: 30, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });

                // Blur-resolve title
                const titleEl = item.querySelector('.service-title') as HTMLElement;
                if (titleEl) {
                  gsap.fromTo(titleEl,
                    { filter: 'blur(4px)', opacity: 0.5 },
                    { filter: 'blur(0px)', opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
                  );
                }

                // Reveal vine indicator
                vines.forEach((v, vi) => {
                  gsap.to(v, {
                    scaleY: vi === i ? 1 : 0,
                    duration: 0.4,
                    ease: vi === i ? 'power3.out' : 'power2.in',
                    transformOrigin: vi === i ? 'top center' : 'bottom center',
                    overwrite: 'auto',
                  });
                });

                // Reveal current image with clip
                gsap.to(images[i], {
                  clipPath: 'inset(0% 0% 0% 0%)',
                  scale: 1,
                  duration: 1.2,
                  ease: 'power3.inOut',
                  overwrite: 'auto',
                  zIndex: 10,
                });

                if (i > 0 && self.direction === 1) {
                  gsap.set(images[i - 1], { zIndex: 1 });
                }
                if (i < images.length - 1 && self.direction === -1) {
                  gsap.set(images[i + 1], { zIndex: 1 });
                  gsap.to(images[i + 1], {
                    clipPath: 'inset(100% 0% 0% 0%)',
                    scale: 1.1,
                    duration: 1.2,
                    ease: 'power3.inOut',
                    overwrite: 'auto',
                  });
                }
              } else {
                gsap.to(item, { opacity: 0.15, x: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
              }
            },
          });
        });
      } else {
        // Mobile: blur-resolve fade in
        items.forEach((item) => {
          gsap.fromTo(item,
            { opacity: 0, y: 40, filter: 'blur(4px)' },
            {
              opacity: 1, y: 0, filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top 80%' },
            }
          );
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="studio" className="relative w-full bg-[#f4f2ef] lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 h-full">

        {/* Section Header */}
        <div className="mb-16 lg:mb-24 pt-16 lg:pt-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-sage" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
              Our Expertise
            </span>
          </div>
          <h2 className="text-[40px] md:text-[64px] lg:text-[80px] font-medium leading-[1] tracking-tight text-black max-w-[800px]">
            Every service is a chapter in your landscape story.
          </h2>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-12 lg:gap-24">

          {/* Left Column (Sticky Images) */}
          <div
            ref={leftColRef}
            className="w-full lg:w-1/2 lg:sticky lg:top-32 lg:h-[70vh] rounded-2xl overflow-hidden shadow-2xl relative"
          >
            {services.map((service, index) => (
              <div
                key={index}
                className={`service-image absolute inset-0 w-full h-full bg-gradient-to-br ${service.imageColor} origin-bottom lg:origin-center lg:block ${index === 0 ? 'block' : 'hidden'}`}
                style={{ zIndex: services.length - index }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover mix-blend-overlay opacity-50"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                <div className="absolute bottom-8 left-8 text-[80px] font-black text-white/20 leading-none">
                  {service.number}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div ref={rightColRef} className="w-full lg:w-1/2 flex flex-col gap-24 lg:pb-[30vh]">
            {services.map((service, index) => (
              <div
                key={index}
                className={`service-text-item relative flex flex-col gap-6 lg:opacity-20`}
                data-cursor-type="tool"
                data-cursor-hover
              >
                {/* Vine line indicator (desktop) */}
                <div
                  className="vine-indicator hidden lg:block absolute left-[-24px] top-0 bottom-0 w-[2px] bg-sage rounded-full"
                  style={{ transform: 'scaleY(0)', transformOrigin: 'top center' }}
                />

                {/* Mobile Image */}
                <div className={`lg:hidden w-full h-[300px] rounded-xl overflow-hidden bg-gradient-to-br ${service.imageColor} relative mb-4`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover mix-blend-overlay opacity-50"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute bottom-4 left-4 text-[40px] font-black text-white/20 leading-none">
                    {service.number}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-bold tracking-[0.1em] text-sage hidden lg:block">
                    {service.number}
                  </span>
                  <div className="h-[1px] flex-1 bg-black/10 hidden lg:block" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    {service.category}
                  </span>
                </div>

                <h3 className="service-title text-[32px] lg:text-[48px] font-medium leading-[1.1] tracking-tight text-black">
                  {service.title}
                </h3>

                <p className="text-[15px] leading-[1.7] text-black/60 max-w-[480px]">
                  {service.description}
                </p>

                <div className="flex flex-col gap-3 mt-2">
                  {service.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <div className="w-[18px] h-[18px] mt-0.5 rounded-full border border-sage/30 flex items-center justify-center shrink-0">
                        <div className="w-[4px] h-[4px] rounded-full bg-sage" />
                      </div>
                      <span className="text-[14px] leading-relaxed text-black/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <MagneticButton
                    href="#contact"
                    className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:text-sage"
                    strength={20}
                  >
                    <span className="border-b border-black/20 group-hover:border-sage pb-1 transition-colors duration-300">
                      Discuss this service
                    </span>
                    <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-sage transition-colors duration-300">
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </MagneticButton>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
