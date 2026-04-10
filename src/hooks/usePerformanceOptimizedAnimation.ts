import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimationOptions {
  duration?: number;
  ease?: string;
  stagger?: number;
  delay?: number;
}

export const usePerformanceOptimizedAnimation = (
  triggerRef: React.RefObject<HTMLElement>,
  animationConfig: any,
  options: AnimationOptions = {}
) => {
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const isReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!triggerRef.current || isReducedMotion) return;

    const { duration = 0.7, ease = 'power2.out', stagger = 0.1, delay = 0 } = options;

    // Kill any existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Create optimized animation
    animationRef.current = gsap.fromTo(
      triggerRef.current,
      {
        ...animationConfig.from,
        willChange: 'transform, opacity'
      },
      {
        ...animationConfig.to,
        duration,
        ease,
        stagger,
        delay,
        onComplete: () => {
          // Remove will-change after animation completes for better performance
          if (triggerRef.current) {
            triggerRef.current.style.willChange = 'auto';
          }
        }
      }
    );

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [triggerRef, animationConfig, options, isReducedMotion]);
};