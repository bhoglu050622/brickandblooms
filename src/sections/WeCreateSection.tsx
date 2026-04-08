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
    lines.forEach((line) => {
      const textEl = line.querySelector('.scramble-target') as HTMLElement;
      if (textEl) {
        const finalText = textEl.dataset.text || '';
        const chars = splitTextInline(textEl, 'chars');
        gsap.set(chars, { y: 60, rotateX: 20, opacity: 0 });
        // Store final text for scramble on re-entry
        (textEl as HTMLElement & { _finalText: string })._finalText = finalText;
        lineChars.push(chars);
      }
    });

    // Velocity skew on text lines (desktop only)
    let velocityCleanup: (() => void) | undefined;
    if (lenis && !isMobile) {
      const skewTargets = Array.from(lines);
      const skewTo = gsap.quickTo(skewTargets, 'skewY', { duration: 0.3, ease: 'power2.out' });
      const update = () => {
        const v = lenis.velocity;
        const clamped = Math.max(-2, Math.min(2, v * 0.03));
        skewTo(clamped);
      };
      gsap.ticker.add(update);
      velocityCleanup = () => {
        gsap.ticker.remove(update);
        gsap.set(skewTargets, { skewY: 0 });
      };
    }

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        const chars = lineChars[i];
        if (!chars) return;

        ScrollTrigger.create({
          trigger: line,
          start: 'top 85%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            // Chars slide up with stagger
            gsap.to(chars, {
              y: 0,
              rotateX: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.025,
              ease: 'power3.out',
              overwrite: true,
            });
            gsap.to(line, { opacity: 1, duration: 0.3 });

            // Scramble effect on first entry
            if (!hasScrambled.current.has(i)) {
              hasScrambled.current.add(i);
              const textEl = line.querySelector('.scramble-target') as HTMLElement;
              if (textEl) {
                const finalText = (textEl as HTMLElement & { _finalText: string })._finalText;
                // Scramble runs on the spans' textContent
                setTimeout(() => {
                  scrambleText(textEl, finalText, 600 + i * 100);
                }, 300);
              }
            }
          },
          onLeaveBack: () => {
            gsap.to(chars, {
              y: 60,
              rotateX: 20,
              opacity: 0,
              duration: 0.4,
              stagger: 0.015,
              ease: 'power2.in',
              overwrite: true,
            });
            gsap.to(line, { opacity: 0, duration: 0.3 });
          },
        });
      });

      // Parallax droplets
      gsap.to('.droplet-bg', {
        y: '-15%',
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }, section);

    return () => {
      ctx.revert();
      velocityCleanup?.();
    };
  }, [lenis]);

  // Reduced droplets (25 instead of 50) — GSAP-ready
  const droplets = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    delay: Math.random() * 8,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 30 + 6,
    duration: Math.random() * 4 + 4,
    opacity: Math.random() * 0.5 + 0.2,
    blur: Math.random() * 3,
  }));

  const textLines = [
    { text: 'we observe', color: 'text-black' },
    { text: 'we design', color: 'text-black' },
    { text: 'we transform', color: 'text-sage' },
    { text: 'outdoor spaces', color: 'text-black/70' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white py-32"
    >
      {/* Water droplet background */}
      <div className="droplet-bg absolute inset-0 overflow-hidden pointer-events-none">
        {droplets.map((d) => (
          <div
            key={d.id}
            className="absolute rounded-full"
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
        ))}
      </div>

      <style>{`
        @keyframes dropFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          88% { opacity: 0.8; }
          100% { transform: translateY(calc(100vh + 100px)) rotate(5deg); opacity: 0; }
        }
      `}</style>

      {/* Text content with split text + scramble effect */}
      <div ref={linesRef} className="relative z-10 flex flex-col items-center text-center px-6">
        {textLines.map((line, index) => (
          <div
            key={index}
            className={`line text-[28px] sm:text-[48px] md:text-[80px] lg:text-[110px] xl:text-[130px] font-extrabold leading-[0.95] tracking-tight ${line.color} opacity-0`}
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
