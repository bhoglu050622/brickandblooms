import { useEffect, type RefObject } from 'react';
import { magneticElement } from '../lib/motion';

interface UseMagneticOptions {
  strength?: number;
  ease?: number;
  enabled?: boolean;
}

/**
 * Attaches magnetic mouse-follow behavior to an element ref.
 * Desktop only — no-op on touch devices and when reduced motion is preferred.
 */
export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  options: UseMagneticOptions = {}
) {
  const { strength = 15, ease = 0.4, enabled = true } = options;

  useEffect(() => {
    if (!enabled || !ref.current) return;
    return magneticElement(ref.current, { strength, ease });
  }, [ref, strength, ease, enabled]);
}
