import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroLoaderProps {
  onComplete: () => void;
}

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Skip for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      setRemoved(true);
      return;
    }

    // Skip on repeat visits
    if (localStorage.getItem('bb_intro_seen')) {
      onComplete();
      setRemoved(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        localStorage.setItem('bb_intro_seen', '1');
        onComplete();
        // Keep it in DOM slightly longer so the wipe clears cleanly
        setTimeout(() => setRemoved(true), 200);
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

    // Progress bar fills during the hold window
    if (progressBarRef.current) {
      tl.fromTo(progressBarRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.5, ease: 'power1.inOut' },
        0.5
      );
    }

    // Hold for a cinematic beat
    tl.to({}, { duration: 0.3 });

    // Slide content up first
    tl.to([logoRef.current, taglineRef.current], {
      y: -50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.in'
    });

    // Premium Curved Arch wipe up
    tl.to(overlayRef.current, {
      yPercent: -100,
      borderBottomLeftRadius: '50vw 30vh',
      borderBottomRightRadius: '50vw 30vh',
      duration: 1.2,
      ease: 'power4.inOut',
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (removed) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A1A17] will-change-transform origin-top"
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
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div
          ref={progressBarRef}
          className="h-full bg-sage"
          style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
        />
      </div>
    </div>
  );
};

export default IntroLoader;
