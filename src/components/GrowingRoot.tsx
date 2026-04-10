import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const GrowingRoot = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // Skip for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const length = path.getTotalLength();
    
    // Set initial state - completely hidden (dashed out)
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Draw the root dynamically as the user scrolls down the entire document
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] flex justify-center" style={{ opacity: 0.4 }}>
      <svg
        className="w-full max-w-[1000px] h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Main stem */}
        <path
          ref={pathRef}
          d="M 50,0
             C 70,15 30,25 50,40
             C 65,52 40,65 50,75
             C 58,83 45,92 50,100"
          vectorEffect="non-scaling-stroke"
          stroke="#7C8C6E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Left branch */}
        <path
          d="M 50,40 C 35,45 22,52 15,65"
          vectorEffect="non-scaling-stroke"
          stroke="#7C8C6E"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Right branch */}
        <path
          d="M 50,75 C 65,78 76,85 85,98"
          vectorEffect="non-scaling-stroke"
          stroke="#7C8C6E"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};
