import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

gsap.registerPlugin(ScrollTrigger);

const transformations = [
  {
    before: '/project-aspen.jpg',
    after: '/project-aurelis.jpg',
    beforeLabel: 'Before',
    afterLabel: 'After',
    title: 'Greenview Terrace',
    description: 'From bare rooftop to lush green retreat',
  },
  {
    before: '/project-blackwell.jpg',
    after: '/project-aspen.jpg',
    beforeLabel: 'Before',
    afterLabel: 'After',
    title: 'Oasis Courtyard',
    description: 'A sun-drenched courtyard reimagined',
  },
];

const TransformationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      section.querySelectorAll('.transform-item').forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, clipPath: 'none' });
      if (subRef.current) gsap.set(subRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Headline: curtain-wipe reveal (right-to-left mask)
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: section, start: 'top 80%' },
            onComplete: () => {
              if (headingRef.current) gsap.set(headingRef.current, { clipPath: 'none' });
            },
          }
        );
      }

      // Sub-text: fade in slightly after heading
      if (subRef.current) {
        gsap.fromTo(subRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.6, scrollTrigger: { trigger: section, start: 'top 80%' } }
        );
      }

      // Slider cards: rotateX flower-bud entrance + cascading stagger
      const items = section.querySelectorAll('.transform-item');
      items.forEach((item, i) => {
        gsap.fromTo(item,
          { rotateX: 10, scale: 0.94, y: 60, opacity: 0, transformPerspective: 800 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            delay: i * 0.25,
            scrollTrigger: { trigger: section, start: 'top 70%' },
          }
        );
      });

      // Section exit: sliders compress as user scrolls past
      gsap.to(section.querySelector('.sliders-grid'),
        {
          scale: 0.96,
          opacity: 0.7,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'bottom 70%',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#1A1A17] py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-12 bg-white/20" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
            TRANSFORMATIONS
          </span>
        </div>

        {/* Curtain-wipe headline */}
        <h2
          ref={headingRef}
          className="mb-3 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-white"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          See the difference
        </h2>

        <p
          ref={subRef}
          className="mb-12 max-w-[500px] text-[14px] leading-relaxed text-white/50"
          style={{ opacity: 0 }}
        >
          Drag to reveal the transformation. Every project starts with a vision and ends with a living landscape.
        </p>

        {/* Before/After Sliders */}
        <div className="sliders-grid grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ willChange: 'transform' }}>
          {transformations.map((t, i) => (
            <div key={i} className="transform-item" style={{ opacity: 0 }}
              data-cursor-type="play"
              data-cursor-text="Drag"
            >
              <BeforeAfterSlider
                before={t.before}
                after={t.after}
                beforeLabel={t.beforeLabel}
                afterLabel={t.afterLabel}
              />
              <div className="mt-4">
                <h3 className="text-[16px] font-semibold text-white">{t.title}</h3>
                <p className="text-[12px] text-white/50">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;
