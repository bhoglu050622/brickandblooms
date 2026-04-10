import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';

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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      cardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Header line reveal
      const header = section.querySelector('.work-header');
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: header, start: 'top 85%' } }
        );
      }

      // Cards: staggered clip-path reveal from bottom
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(card,
          { opacity: 0, y: 60, clipPath: 'inset(100% 0% 0% 0%)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            delay: i * 0.12,
            ease: 'power4.out',
            scrollTrigger: { trigger: section, start: 'top 70%' },
            onComplete: () => { gsap.set(card, { clipPath: 'none' }); },
          }
        );

        // Title scramble on enter
        const title = card.querySelector('.card-title') as HTMLElement;
        if (title) {
          const original = title.textContent || '';
          ScrollTrigger.create({
            trigger: section,
            start: 'top 70%',
            once: true,
            onEnter: () => {
              setTimeout(() => scrambleText(title, original, 400), i * 120 + 300);
            },
          });
        }

        // Image scale on hover
        const img = card.querySelector('.card-img') as HTMLElement;
        if (img) {
          card.addEventListener('mouseenter', () => {
            gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power2.out' });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(img, { scale: 1, duration: 0.7, ease: 'power3.out' });
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="w-full bg-[#1A1A17] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        {/* Header */}
        <div className="work-header mb-16 flex items-end justify-between opacity-0">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">SELECTED WORK</span>
            <h2 className="mt-3 text-[32px] md:text-[44px] font-medium leading-[1.05] tracking-tight text-white">
              Projects that speak for themselves
            </h2>
          </div>
          <span className="hidden md:block text-[11px] font-medium text-white/30 tabular-nums">
            {String(projects.length).padStart(2, '0')} projects
          </span>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group cursor-pointer"
              data-cursor-type="play"
              data-cursor-text="View"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#2A2A25] mb-5">
                <img
                  src={project.image}
                  alt={project.title}
                  className="card-img h-full w-full object-cover transition-transform duration-700 will-change-transform"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A17]/70 via-transparent to-transparent" />
                {/* Year badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-semibold text-white/50 tracking-wider bg-[#1A1A17]/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {project.year}
                  </span>
                </div>
                {/* Arrow icon */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="px-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sage mb-2 block">
                  {project.subtitle}
                </span>
                <h3 className="card-title text-[22px] md:text-[26px] font-bold text-white leading-tight tracking-tight mb-3 group-hover:text-sage transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-white/50 mb-4 line-clamp-2">
                  {project.description}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech, j) => (
                    <span
                      key={j}
                      className="text-[9px] font-semibold uppercase tracking-wider text-white/30 border border-white/10 rounded-full px-2.5 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div className="mt-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[11px] font-medium text-white/40">2021 — 2026</span>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-transparent px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/[0.03]"
          >
            More Projects
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-white px-1.5 text-[10px] font-bold text-black">
              5
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
