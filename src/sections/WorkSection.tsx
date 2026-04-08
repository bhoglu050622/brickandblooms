import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

const BrandLogo = ({ name }: { name: string }) => {
  const initial = name.charAt(0).toUpperCase();
  const displayName: Record<string, string> = {
    greenview: 'Greenview Terrace',
    oasis: 'Oasis Courtyard',
    villa: 'Villa Serenity',
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">{initial}</span>
      </div>
      <span className="text-[13px] font-semibold text-white/90 tracking-wide">
        {displayName[name] || name}
      </span>
    </div>
  );
};

const WorkSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      section.querySelectorAll('.project-card').forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0, filter: 'none', transform: 'none' });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.project-card');

      // Progressive tilt — each card tilts more than the last, like falling dominoes
      cards.forEach((card, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        const tiltAmount = 3 + i * 2; // 3°, 5°, 7° — increases per card

        // Reveal: card tilts in from a heavy lean, straightens as it enters focus
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            rotateZ: direction * tiltAmount,
            rotateX: 2,
            filter: 'blur(8px)',
            scale: 0.93,
          },
          {
            opacity: 1,
            y: 0,
            rotateZ: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              end: 'top 45%',
              scrub: 0.5,
            },
          }
        );

        // Scroll-out: card falls away as next one comes in
        gsap.to(card, {
          opacity: 0.15,
          y: -30,
          rotateZ: direction * -1.5,
          scale: 0.98,
          scrollTrigger: {
            trigger: card,
            start: 'bottom 40%',
            end: 'bottom 10%',
            scrub: 0.5,
          },
        });
      });

      // Active card tracking for progress indicator
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveCard(i),
          onEnterBack: () => setActiveCard(i),
        });
      });

      // Parallax on project images (deep layer)
      section.querySelectorAll('.project-image').forEach((img) => {
        gsap.to(img, {
          y: '-14%',
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // Content overlay parallax (shallow layer — moves slower than image)
      section.querySelectorAll('.project-content').forEach((content) => {
        gsap.to(content, {
          y: '-4%',
          ease: 'none',
          scrollTrigger: {
            trigger: content.closest('.project-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // Tech badges parallax (fastest layer — creates depth)
      section.querySelectorAll('.project-tech').forEach((tech) => {
        gsap.to(tech, {
          y: '-8%',
          ease: 'none',
          scrollTrigger: {
            trigger: tech.closest('.project-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="w-full bg-[#1A1A17] py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12 bg-white/20" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
            SELECTED WORK
          </span>
        </div>

        {/* Featured Projects */}
        <div className="space-y-12" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
          {projects.map((project) => (
            <div
              key={project.id}
              data-cursor-text="View"
              className="project-card group relative cursor-pointer rounded-2xl opacity-0"
              style={{ willChange: 'transform, filter', transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width / 2);
                const dy = e.clientY - (rect.top + rect.height / 2);
                gsap.to(e.currentTarget, { x: dx * 0.03, y: dy * 0.03, rotateY: dx * 0.01, rotateX: -dy * 0.01, duration: 0.3, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
              }}
            >
              {/* Full width image with parallax */}
              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-2xl">
                <div className="project-image absolute inset-0 h-[130%] w-full">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="project-content absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                {/* Top - Brand Logo + Year */}
                <div className="flex items-start justify-between">
                  <BrandLogo name={project.logo} />
                  <span className="text-[10px] font-medium text-white/40 tracking-wider">
                    {project.year}
                  </span>
                </div>

                {/* Bottom - Title, Subtitle, Tech */}
                <div>
                  {/* Tech stack */}
                  <div className="project-tech hidden md:flex flex-wrap gap-x-3 gap-y-1 mb-3">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium text-white/40 tracking-wider"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="mb-1 text-[32px] sm:text-[40px] md:text-[56px] font-bold text-white transition-colors duration-300 group-hover:text-sage leading-[1.05]">
                    {project.title}
                  </h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                    {project.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {projects.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === activeCard ? '32px' : '8px',
                backgroundColor: i === activeCard ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* More Projects Button */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[11px] font-medium text-white/40">2021 — 2026</span>
          </div>

          <a
            href="#"
            className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-transparent px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-250 hover:border-white/40 hover:bg-white/[0.03]"
          >
            More Projects
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-white px-1.5 text-[10px] font-bold text-black">
              5
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
