import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import { NATURE } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function scrambleText(element: HTMLElement, finalText: string, duration = 400) {
  const total = Math.ceil(duration / 30);
  let iteration = 0;
  const interval = setInterval(() => {
    element.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < Math.floor((iteration / total) * finalText.length)) return finalText[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    iteration++;
    if (iteration > total) {
      element.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
  return () => clearInterval(interval);
}

const WorkSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterTopRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);

  // Counter strip for slot-machine roll
  const buildCounterStrip = (container: HTMLDivElement) => {
    container.innerHTML = '';
    container.style.overflow = 'hidden';
    container.style.height = '1em';
    container.style.lineHeight = '1';

    const strip = document.createElement('div');
    strip.style.display = 'flex';
    strip.style.flexDirection = 'column';
    strip.style.willChange = 'transform';

    projects.forEach((_, i) => {
      const digit = document.createElement('span');
      digit.textContent = String(i + 1).padStart(2, '0');
      digit.style.height = '1em';
      digit.style.lineHeight = '1';
      digit.style.display = 'block';
      strip.appendChild(digit);
    });

    container.appendChild(strip);
    return strip;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReduced) {
      slidesRef.current.forEach((slide) => {
        if (slide) gsap.set(slide, { opacity: 1, clipPath: 'none' });
      });
      return;
    }

    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];

    // Build counter strips
    let counterStrip: HTMLDivElement | null = null;
    if (counterTopRef.current && !isMobile) {
      counterStrip = buildCounterStrip(counterTopRef.current) as HTMLDivElement;
    }

    if (isMobile) {
      const ctx = gsap.context(() => {
        slides.forEach((slide) => {
          gsap.fromTo(slide,
            { opacity: 0, rotateY: 8, transformPerspective: 1200 },
            {
              opacity: 1, rotateY: 0,
              duration: NATURE.duration.slow,
              ease: NATURE.ease.grow,
              scrollTrigger: { trigger: slide, start: 'top 85%' },
            }
          );
        });
      }, section);
      return () => ctx.revert();
    }

    // Desktop: full-viewport pinned scroll storytelling
    const ctx = gsap.context(() => {
      slides.forEach((slide, i) => {
        // Alternate wipe directions: even = left, odd = right
        const isEven = i % 2 === 0;
        if (i === 0) {
          gsap.set(slide, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        } else {
          gsap.set(slide, {
            opacity: 1,
            clipPath: isEven ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
          });
        }
      });

      const firstContent = slides[0]?.querySelectorAll('.slide-content > *');
      if (firstContent) gsap.set(firstContent, { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${projects.length * 100}vh`,
          pin: pin,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(projects.length - 1, Math.floor(self.progress * projects.length));
            setActiveProject(idx);

            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }

            // Roll counter strip
            if (counterStrip) {
              gsap.to(counterStrip, {
                y: `-${idx}em`,
                duration: 0.3,
                ease: 'back.out(1.5)',
                overwrite: true,
              });
            }
          },
        },
      });

      slides.forEach((slide, i) => {
        if (i === 0) return;

        const prevSlide = slides[i - 1];
        const prevBg = prevSlide.querySelector('.slide-bg') as HTMLElement;
        const prevContent = prevSlide.querySelectorAll('.slide-content > *');
        const nextContent = slide.querySelectorAll('.slide-content > *');
        gsap.set(nextContent, { opacity: 0, y: 40 });

        const pos = (i - 1) * 1;

        if (prevBg) {
          tl.to(prevBg, { scale: 1.08, duration: 0.6, ease: 'none' }, pos);
        }

        tl.to(prevContent, {
          opacity: 0, y: -30, duration: 0.3, stagger: 0.03, ease: NATURE.ease.slow,
        }, pos);

        // Alternating wipe direction
        tl.to(slide, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.5,
          ease: NATURE.ease.grow,
        }, pos + 0.25);

        // Title scramble after slide appears
        const titleEl = slide.querySelector('.slide-title') as HTMLElement;
        if (titleEl) {
          const originalText = titleEl.textContent || '';
          tl.call(() => { scrambleText(titleEl, originalText, 400); }, undefined, pos + 0.45);
        }

        tl.to(nextContent, {
          opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: NATURE.ease.entrance,
        }, pos + 0.5);

        if (i === slides.length - 1) {
          tl.to({}, { duration: 0.4 });
        }
      });

      // Parallax on slide backgrounds
      slides.forEach((slide) => {
        const bg = slide.querySelector('.slide-bg');
        if (bg) {
          gsap.fromTo(bg,
            { y: '5%' },
            {
              y: '-5%',
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: `+=${projects.length * 100}vh`,
                scrub: 1,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="w-full bg-[#1A1A17]">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Section label */}
        <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
          <div className="h-px w-12 bg-white/20" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">SELECTED WORK</span>
        </div>

        {/* Project counter: slot-machine odometer */}
        <div className="absolute top-8 right-8 z-30 flex items-center gap-2">
          <div
            ref={counterTopRef}
            className="text-[28px] font-bold text-white tabular-nums leading-none"
            style={{ willChange: 'transform' }}
          >
            {String(activeProject + 1).padStart(2, '0')}
          </div>
          <span className="text-[14px] text-white/30 font-medium">/</span>
          <span className="text-[14px] text-white/30 font-medium tabular-nums">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* Stacked project slides */}
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { slidesRef.current[i] = el; }}
            className="absolute inset-0"
            style={{ zIndex: i + 1 }}
            data-cursor-text="View"
            data-cursor-type="play"
          >
            {/* Full-bleed background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="slide-bg absolute inset-0 h-[120%] w-full -top-[10%]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A17] via-[#1A1A17]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A17]/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="slide-content absolute bottom-0 left-0 z-10 p-8 md:p-12 lg:p-16 max-w-[650px]">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-sage mb-3 opacity-0">
                {project.subtitle}
              </span>
              <h3
                className="slide-title text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-bold text-white leading-[1.0] tracking-tight mb-4 opacity-0"
              >
                {project.title}
              </h3>
              <p className="text-[13px] md:text-[14px] leading-relaxed text-white/60 mb-6 max-w-[480px] opacity-0">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 opacity-0">
                {project.tech.map((tech, j) => (
                  <span key={j} className="text-[10px] font-medium text-white/40 tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Year */}
            <div className="absolute top-20 right-8 md:right-12 z-10">
              <span className="text-[11px] font-medium text-white/30 tracking-wider">{project.year}</span>
            </div>
          </div>
        ))}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressRef}
            className="h-full bg-sage/60 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {projects.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-700 ease-nature"
              style={{
                width: i === activeProject ? '32px' : '8px',
                backgroundColor: i === activeProject ? 'rgba(124,140,110,0.8)' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Below pinned area */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[11px] font-medium text-white/40">2021 — 2026</span>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-transparent px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-1200 ease-nature hover:border-white/40 hover:bg-white/[0.03]"
          >
            More Projects
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-white px-1.5 text-[10px] font-bold text-black">
              5
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-nature group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
