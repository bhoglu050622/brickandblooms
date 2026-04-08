import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { splitTextInline } from '../lib/motion';

interface IntroLoaderProps {
  onComplete: () => void;
}

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const brickRef = useRef<HTMLSpanElement>(null);
  const bloomsRef = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      setRemoved(true);
      return;
    }

    const brick = brickRef.current;
    const blooms = bloomsRef.current;
    const tagline = taglineRef.current;
    if (!brick || !blooms || !tagline) return;

    // Split text into individual characters
    const brickChars = splitTextInline(brick, 'chars');
    const bloomsChars = splitTextInline(blooms, 'chars');
    const taglineChars = splitTextInline(tagline, 'chars');

    // Set initial states
    gsap.set([...brickChars, ...bloomsChars], { y: 50, rotateX: 20, opacity: 0 });
    gsap.set(taglineChars, { y: 20, opacity: 0 });
    gsap.set(dividerRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
        setRemoved(true);
      },
    });

    // "Brick" chars stagger in from left
    tl.to(brickChars, {
      y: 0,
      rotateX: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power3.out',
    });

    // "& Blooms" chars stagger in (slightly overlapping)
    tl.to(
      bloomsChars,
      {
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.out',
      },
      '-=0.3'
    );

    // Divider line expands from center
    tl.to(
      dividerRef.current,
      {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      '-=0.2'
    );

    // Tagline chars reveal
    tl.to(
      taglineChars,
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.015,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    // Hold
    tl.to({}, { duration: 0.6 });

    // Curtain reveal exit — top and bottom panels split apart
    tl.to(topCurtainRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.inOut',
    });
    tl.to(
      bottomCurtainRef.current,
      {
        yPercent: 100,
        duration: 0.7,
        ease: 'power3.inOut',
      },
      '<'
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (removed) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100]">
      {/* Top curtain */}
      <div
        ref={topCurtainRef}
        className="absolute inset-0 bottom-1/2 bg-[#1A1A17]"
      />
      {/* Bottom curtain */}
      <div
        ref={bottomCurtainRef}
        className="absolute inset-0 top-1/2 bg-[#1A1A17]"
      />
      {/* Content centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="flex items-center" style={{ perspective: '600px' }}>
          <span
            ref={brickRef}
            className="text-[36px] sm:text-[48px] font-extrabold tracking-tighter text-sage"
          >
            Brick
          </span>
          <span
            ref={bloomsRef}
            className="text-[36px] sm:text-[48px] font-extrabold tracking-tighter text-white"
          >
            &amp; Blooms
          </span>
        </div>
        {/* Expanding divider */}
        <div
          ref={dividerRef}
          className="mt-3 h-px w-32 bg-sage/40 origin-center"
        />
        <p
          ref={taglineRef}
          className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40"
        >
          A New Way of Living
        </p>
      </div>
    </div>
  );
};

export default IntroLoader;
