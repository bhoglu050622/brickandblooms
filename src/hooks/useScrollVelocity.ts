import { useRef, useEffect } from 'react';
import type Lenis from 'lenis';
import gsap from 'gsap';

/**
 * Exposes Lenis scroll velocity as a ref.
 * Reads velocity on each GSAP ticker frame (already synced with Lenis in App.tsx).
 */
export function useScrollVelocity(lenis: Lenis | null) {
  const velocity = useRef(0);

  useEffect(() => {
    if (!lenis) return;

    const update = () => {
      velocity.current = lenis.velocity;
    };

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return velocity;
}
