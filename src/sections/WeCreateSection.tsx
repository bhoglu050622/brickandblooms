import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextInline } from '@/lib/motion';
import { useLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function scrambleText(element: HTMLElement, finalText: string, duration = 800) {
  let iteration = 0;
  const totalIterations = Math.ceil(duration / 30);

  const interval = setInterval(() => {
    element.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < Math.floor((iteration / totalIterations) * finalText.length)) return finalText[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    iteration++;
    if (iteration > totalIterations) {
      element.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);

  return () => clearInterval(interval);
}

// Each phrase enters from a different direction for wow variety
const textLines = [
  { text: 'we observe', color: 'text-black', enterFrom: 'left' },
  { text: 'we design', color: 'text-black', enterFrom: 'top' },
  { text: 'we transform', color: 'text-sage', enterFrom: 'bottom' },
  { text: 'outdoor spaces', color: 'text-black/70', enterFrom: 'center' },
];

const directionInitial: Record<string, { x?: number; y?: number; scale?: number }> = {
  left: { x: -120, y: 0 },
  right: { x: 120, y: 0 },
  top: { x: 0, y: -80 },
  bottom: { x: 0, y: 80 },
  center: { x: 0, y: 0, scale: 0.6 },
};

const WeCreateSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const hasScrambled = useRef<Set<number>>(new Set());
  const lenis = useLenis();

  useEffect(() => {
    const section = sectionRef.current;
    const linesContainer = linesRef.current;
    if (!section || !linesContainer) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = linesContainer.querySelectorAll('.line');
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    if (prefersReduced) {
      lines.forEach((line) => gsap.set(line, { opacity: 1 }));
      return;
    }

    // Split text into chars for cinematic entrance
    const lineChars: HTMLSpanElement[][] = [];
    lines.forEach((line, li) => {
      const textEl = line.querySelector('.scramble-target') as HTMLElement;
      if (textEl) {
        const finalText = textEl.dataset.text || '';
        const chars = splitTextInline(textEl, 'chars');
        const dir = textLines[li]?.enterFrom || 'bottom';
        const init = directionInitial[dir] || { y: 60 };
        gsap.set(chars, { ...init, opacity: 0 });
        (textEl as HTMLElement & { _finalText: string })._finalText = finalText;
        lineChars.push(chars);
      }
    });

    // Velocity skew on text lines (desktop only) — per-line different max-skew
    const maxSkews = [2.5, 1.8, 3.0, 2.0];
    let velocityCleanup: (() => void) | undefined;
    if (lenis && !isMobile) {
      lines.forEach((line, li) => {
        const skewTo = gsap.quickTo(line, 'skewY', { duration: 0.3, ease: 'power2.out' });
        const update = () => {
          const v = lenis.velocity;
          const clamped = Math.max(-maxSkews[li], Math.min(maxSkews[li], v * 0.03));
          skewTo(clamped);
        };
        gsap.ticker.add(update);
        const cleanup = () => {
          gsap.ticker.remove(update);
          gsap.set(line, { skewY: 0 });
        };
        // Store cleanup
        if (li === 0) velocityCleanup = cleanup;
        else {
          const prev = velocityCleanup;
          velocityCleanup = () => { prev?.(); cleanup(); };
        }
      });
    }

    // Background kinetic shift — desktop only (mobile keeps white bg so dark text is readable)
    if (!isMobile) {
      gsap.fromTo(section,
        { backgroundColor: '#0A0A08' },
        {
          backgroundColor: '#ffffff',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    } else {
      gsap.set(section, { backgroundColor: '#ffffff' });
    }

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        const chars = lineChars[i];
        if (!chars) return;

        const dir = textLines[i]?.enterFrom || 'bottom';

        ScrollTrigger.create({
          trigger: line,
          start: 'top 85%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            // Chars slide in from their direction
            gsap.to(chars, {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.7,
              stagger: 0.025,
              ease: 'power4.out',
              overwrite: true,
            });
            gsap.to(line, { opacity: 1, duration: 0.3 });

            // Scramble on first entry
            if (!hasScrambled.current.has(i)) {
              hasScrambled.current.add(i);
              const textEl = line.querySelector('.scramble-target') as HTMLElement;
              if (textEl) {
                const finalText = (textEl as HTMLElement & { _finalText: string })._finalText;
                setTimeout(() => { scrambleText(textEl, finalText, 500 + i * 80); }, 250);
              }
            }
          },
          onLeaveBack: () => {
            // Exit: blow away in different direction (like petals in wind)
            const exitX = dir === 'left' ? 80 : dir === 'right' ? -80 : (i % 2 === 0 ? 60 : -60);
            gsap.to(chars, {
              x: exitX,
              y: -20,
              opacity: 0,
              duration: 0.4,
              stagger: { each: 0.01, from: 'random' },
              ease: 'power2.in',
              overwrite: true,
            });
            gsap.to(line, { opacity: 0, duration: 0.25 });
          },
        });
      });

      // 3-layer parallax droplets
      gsap.to('.droplet-bg-close', {
        y: '-30%', ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.droplet-bg-mid', {
        y: '-15%', ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.droplet-bg-far', {
        y: '-5%', ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }, section);

    return () => {
      ctx.revert();
      velocityCleanup?.();
    };
  }, [lenis]);

  // Split droplets into 3 depth layers
  const makeDroplets = (count: number, sizeRange: [number, number], opacityRange: [number, number]) =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      left: `${Math.random() * 100}%`,
      size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      duration: Math.random() * 4 + 4,
      opacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
      blur: Math.random() * 2,
    }));

  const closeDroplets = makeDroplets(8, [20, 36], [0.4, 0.7]);
  const midDroplets = makeDroplets(10, [10, 22], [0.3, 0.5]);
  const farDroplets = makeDroplets(7, [4, 12], [0.15, 0.3]);

  const renderDroplets = (droplets: ReturnType<typeof makeDroplets>, className: string) =>
    droplets.map((d) => (
      <div
        key={d.id}
        className={`absolute rounded-full ${className}`}
        style={{
          left: d.left,
          width: d.size,
          height: d.size * 1.2,
          background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(180,190,200,${d.opacity}) 40%, rgba(120,130,140,${d.opacity * 0.5}) 70%, transparent 100%)`,
          borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
          boxShadow: 'inset -2px -3px 6px rgba(0,0,0,0.15), inset 3px 3px 6px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.1)',
          filter: `blur(${d.blur}px)`,
          animation: `dropFall ${d.duration}s ease-in ${d.delay}s infinite`,
        }}
      />
    ));

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white py-20 md:py-32"
    >
      {/* 3-layer parallax droplet field */}
      <div className="droplet-bg-close absolute inset-0 overflow-hidden pointer-events-none">
        {renderDroplets(closeDroplets, '')}
      </div>
      <div className="droplet-bg-mid absolute inset-0 overflow-hidden pointer-events-none">
        {renderDroplets(midDroplets, '')}
      </div>
      <div className="droplet-bg-far absolute inset-0 overflow-hidden pointer-events-none">
        {renderDroplets(farDroplets, '')}
      </div>

      <style>{`
        @keyframes dropFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          88% { opacity: 0.8; }
          100% { transform: translateY(calc(100vh + 100px)) rotate(5deg); opacity: 0; }
        }
      `}</style>

      {/* Text content with directional split text + scramble */}
      <div ref={linesRef} className="relative z-10 flex flex-col items-center text-center px-6">
        {textLines.map((line, index) => (
          <div
            key={index}
            className={`line text-[40px] sm:text-[56px] md:text-[80px] lg:text-[110px] xl:text-[130px] font-extrabold leading-[0.95] tracking-tight ${line.color} opacity-0`}
            style={{ perspective: '600px' }}
          >
            <span className="scramble-target" data-text={line.text}>
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeCreateSection;
