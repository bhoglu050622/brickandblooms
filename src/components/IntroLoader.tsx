import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroLoaderProps {
  onComplete: () => void;
}

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Skip for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      setRemoved(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
        setRemoved(true);
      },
    });

    // Fade in logo
    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

    // Fade in tagline
    tl.fromTo(
      taglineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      0.3
    );

    // Hold
    tl.to({}, { duration: 1 });

    // Fade out overlay
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (removed) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A1A17]"
    >
      <div ref={logoRef} className="flex items-center opacity-0">
        <span className="text-[36px] sm:text-[48px] font-extrabold tracking-tighter text-sage">
          Brick
        </span>
        <span className="text-[36px] sm:text-[48px] font-extrabold tracking-tighter text-white">
          &amp; Blooms
        </span>
      </div>
      <p
        ref={taglineRef}
        className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 opacity-0"
      >
        A New Way of Living
      </p>
    </div>
  );
};

export default IntroLoader;
