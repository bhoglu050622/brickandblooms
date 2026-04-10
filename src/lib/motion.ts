import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** Set elements to their visible final state without animation. */
function setVisible(elements: gsap.TweenTarget) {
  gsap.set(elements, { opacity: 1, y: 0, scale: 1, clipPath: 'none', skewY: 0 });
}

interface FadeInUpOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

export function fadeInUp(
  elements: gsap.TweenTarget,
  trigger: Element,
  options: FadeInUpOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    setVisible(elements);
    return gsap.context(() => {}, trigger);
  }

  const { y = 50, duration = 0.7, stagger = 0.1, ease = 'power2.out', start = 'top 70%' } = options;

  return gsap.context(() => {
    gsap.fromTo(
      elements,
      { y, opacity: 0 },
      { y: 0, opacity: 1, duration, stagger, ease, scrollTrigger: { trigger, start } }
    );
  }, trigger);
}

interface StaggerRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
}

export function staggerReveal(
  selector: string,
  trigger: Element,
  options: StaggerRevealOptions = {}
): gsap.Context {
  const els = trigger.querySelectorAll(selector);
  if (prefersReduced()) {
    setVisible(els);
    return gsap.context(() => {}, trigger);
  }

  const { y = 60, duration = 0.8, stagger = 0.15, ease = 'power2.out', start = 'top 80%' } = options;

  return gsap.context(() => {
    gsap.fromTo(
      els,
      { y, opacity: 0 },
      { y: 0, opacity: 1, duration, stagger, ease, scrollTrigger: { trigger, start } }
    );
  }, trigger);
}

export function parallax(
  element: gsap.TweenTarget,
  trigger: Element,
  amount: string = '-15%'
): gsap.Context {
  if (prefersReduced() || isTouchDevice()) return gsap.context(() => {}, trigger);

  return gsap.context(() => {
    gsap.to(element, {
      y: amount,
      ease: 'none',
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }, trigger);
}

export function clipReveal(
  element: gsap.TweenTarget,
  trigger: Element,
  options: { duration?: number; start?: string } = {}
): gsap.Context {
  if (prefersReduced()) {
    setVisible(element);
    return gsap.context(() => {}, trigger);
  }

  const { duration = 1.2, start = 'top 70%' } = options;

  return gsap.context(() => {
    gsap.fromTo(
      element,
      { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0, willChange: 'transform, clip-path, opacity' },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration, ease: 'power3.out', scrollTrigger: { trigger, start },
        onComplete: () => { gsap.set(element, { willChange: 'auto' }); } }
    );
  }, trigger);
}

// ── Shared Types ───────────────────────────────────────────────────────

type ClipDirection = 'left' | 'right' | 'top' | 'bottom' | 'center';

const clipStartStates: Record<ClipDirection, string> = {
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  top: 'inset(0% 0% 100% 0%)',
  bottom: 'inset(100% 0% 0% 0%)',
  center: 'inset(10% 10% 10% 10%)',
};

// ── Nature Motion Language ──────────────────────────────────────────────

export const NATURE = {
  ease: {
    slow: 'power2.inOut',
    drift: 'sine.inOut',
    grow: 'power3.out',
    breathe: 'sine.inOut',
    entrance: 'power4.out',
  },
  duration: {
    slow: 1.6,
    medium: 1.0,
    breathe: 4.0,
    drift: 8.0,
    stagger: 0.12,
  },
};

/** Continuous subtle breathing scale oscillation */
export function breatheScale(
  element: gsap.TweenTarget,
  options: { min?: number; max?: number; duration?: number } = {}
): () => void {
  if (prefersReduced()) return () => {};

  const { min = 1.0, max = 1.02, duration = NATURE.duration.breathe } = options;
  const tween = gsap.fromTo(element,
    { scale: min },
    { scale: max, duration, ease: NATURE.ease.breathe, yoyo: true, repeat: -1 }
  );

  return () => { tween.kill(); gsap.set(element, { scale: 1 }); };
}

/** Slow continuous drift for ambient overlay layers */
export function driftOverlay(
  element: gsap.TweenTarget,
  options: { x?: number; y?: number; duration?: number } = {}
): () => void {
  if (prefersReduced()) return () => {};

  const { x = 30, y = 15, duration = NATURE.duration.drift } = options;
  const tweenX = gsap.to(element, { x, duration, ease: NATURE.ease.drift, yoyo: true, repeat: -1 });
  const tweenY = gsap.to(element, { y, duration: duration * 1.3, ease: NATURE.ease.drift, yoyo: true, repeat: -1 });

  return () => {
    tweenX.kill();
    tweenY.kill();
    gsap.set(element, { x: 0, y: 0 });
  };
}

/** Cinematic reveal — clip-path + scale for viewport-filling sections */
interface CinematicRevealOptions {
  direction?: ClipDirection;
  duration?: number;
  start?: string;
  delay?: number;
}

export function cinematicReveal(
  element: gsap.TweenTarget,
  trigger: Element,
  options: CinematicRevealOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    setVisible(element);
    return gsap.context(() => {}, trigger);
  }

  const { direction = 'center', duration = NATURE.duration.slow, start = 'top 75%', delay = 0 } = options;

  return gsap.context(() => {
    gsap.fromTo(
      element,
      { clipPath: clipStartStates[direction], opacity: 0, scale: 1.05, willChange: 'transform, clip-path, opacity' },
      {
        clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1,
        duration, ease: NATURE.ease.grow, delay,
        scrollTrigger: { trigger, start },
        onComplete: () => { gsap.set(element, { willChange: 'auto' }); },
      }
    );
  }, trigger);
}

// ── Primitives ─────────────────────────────────────────────────────────

interface ClipRevealDirectionalOptions {
  duration?: number;
  start?: string;
  ease?: string;
  delay?: number;
}

export function clipRevealDirectional(
  element: gsap.TweenTarget,
  trigger: Element,
  direction: ClipDirection = 'center',
  options: ClipRevealDirectionalOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    setVisible(element);
    return gsap.context(() => {}, trigger);
  }

  const { duration = 1.2, start = 'top 70%', ease = 'power3.out', delay = 0 } = options;

  return gsap.context(() => {
    gsap.fromTo(
      element,
      { clipPath: clipStartStates[direction], opacity: 0, willChange: 'transform, clip-path, opacity' },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration, ease, delay, scrollTrigger: { trigger, start },
        onComplete: () => { gsap.set(element, { willChange: 'auto' }); } }
    );
  }, trigger);
}

/** Split text into chars/words and animate them in with stagger */
type SplitMode = 'chars' | 'words' | 'lines';

interface SplitTextRevealOptions {
  mode?: SplitMode;
  duration?: number;
  stagger?: number;
  y?: number;
  rotateX?: number;
  ease?: string;
  start?: string;
  delay?: number;
  onComplete?: () => void;
}

/** Splits an element's text into wrapped spans and returns them */
function splitTextIntoSpans(element: HTMLElement, mode: SplitMode): HTMLSpanElement[] {
  const text = element.textContent || '';
  element.innerHTML = '';
  element.style.overflow = 'hidden';

  let parts: string[];
  if (mode === 'chars') {
    parts = text.split('');
  } else if (mode === 'words') {
    parts = text.split(/(\s+)/);
  } else {
    parts = [text];
  }

  const spans: HTMLSpanElement[] = [];
  parts.forEach((part) => {
    if (mode === 'words' && /^\s+$/.test(part)) {
      element.appendChild(document.createTextNode(part));
      return;
    }
    const span = document.createElement('span');
    span.textContent = part;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity';
    element.appendChild(span);
    spans.push(span);
  });

  return spans;
}

export function splitTextReveal(
  element: HTMLElement,
  trigger: Element,
  options: SplitTextRevealOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    gsap.set(element, { opacity: 1 });
    return gsap.context(() => {}, trigger);
  }

  const {
    mode = 'chars',
    duration = 0.6,
    stagger = 0.03,
    y = 40,
    rotateX = 15,
    ease = 'power3.out',
    start = 'top 75%',
    delay = 0,
    onComplete,
  } = options;

  const spans = splitTextIntoSpans(element, mode);

  return gsap.context(() => {
    gsap.fromTo(
      spans,
      { y, rotateX, opacity: 0 },
      {
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        delay,
        scrollTrigger: { trigger, start },
        onComplete: () => {
          spans.forEach((s) => { s.style.willChange = 'auto'; });
          onComplete?.();
        },
      }
    );
  }, trigger);
}

/** Standalone split for timeline-based use (no ScrollTrigger) */
export function splitTextInline(element: HTMLElement, mode: SplitMode = 'chars'): HTMLSpanElement[] {
  return splitTextIntoSpans(element, mode);
}

/** Magnetic element — follows cursor within a bounded radius. Desktop only. */
interface MagneticOptions {
  strength?: number;   // max displacement in px (default 15)
  ease?: number;       // quickTo duration (default 0.4)
}

export function magneticElement(
  element: HTMLElement,
  options: MagneticOptions = {}
): () => void {
  if (prefersReduced() || isTouchDevice()) return () => {};

  const { strength = 15, ease = 0.4 } = options;
  const xTo = gsap.quickTo(element, 'x', { duration: ease, ease: 'power3.out' });
  const yTo = gsap.quickTo(element, 'y', { duration: ease, ease: 'power3.out' });

  const onMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.max(rect.width, rect.height);

    if (dist < radius) {
      const factor = 1 - dist / radius;
      xTo(dx * factor * (strength / radius) * 2);
      yTo(dy * factor * (strength / radius) * 2);
    } else {
      xTo(0);
      yTo(0);
    }
  };

  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  element.addEventListener('mousemove', onMove);
  element.addEventListener('mouseleave', onLeave);

  return () => {
    element.removeEventListener('mousemove', onMove);
    element.removeEventListener('mouseleave', onLeave);
    gsap.set(element, { x: 0, y: 0 });
  };
}

/** Velocity-based skew — elements lean with scroll direction */
export function velocitySkew(
  element: gsap.TweenTarget,
  lenis: Lenis,
  maxSkew: number = 3
): () => void {
  if (prefersReduced() || isTouchDevice()) return () => {};

  const skewTo = gsap.quickTo(element, 'skewY', { duration: 0.3, ease: 'power2.out' });

  const update = () => {
    const velocity = lenis.velocity;
    const clamped = Math.max(-maxSkew, Math.min(maxSkew, velocity * 0.05));
    skewTo(clamped);
  };

  gsap.ticker.add(update);
  return () => {
    gsap.ticker.remove(update);
    gsap.set(element, { skewY: 0 });
  };
}

/** Circular clip-path reveal from center — like a seed blooming open */
interface CircularRevealOptions {
  duration?: number;
  start?: string;
  targetRadius?: string;
  delay?: number;
  ease?: string;
}

export function circularReveal(
  element: gsap.TweenTarget,
  trigger: Element,
  options: CircularRevealOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    setVisible(element);
    return gsap.context(() => {}, trigger);
  }

  const { duration = 0.8, start = 'top 75%', targetRadius = '75%', delay = 0, ease = 'power3.out' } = options;

  return gsap.context(() => {
    gsap.fromTo(
      element,
      { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
      {
        clipPath: `circle(${targetRadius} at 50% 50%)`,
        opacity: 1,
        duration,
        ease,
        delay,
        scrollTrigger: { trigger, start },
        onComplete: () => { gsap.set(element, { clipPath: 'none', willChange: 'auto' }); },
      }
    );
  }, trigger);
}

/** Darkroom photo-develop effect — grayscale + dim to full color */
interface PhotoRevealOptions {
  duration?: number;
  start?: string;
  delay?: number;
}

export function photoReveal(
  element: gsap.TweenTarget,
  trigger: Element,
  options: PhotoRevealOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    gsap.set(element, { filter: 'none', opacity: 1 });
    return gsap.context(() => {}, trigger);
  }

  const { duration = 0.9, start = 'top 75%', delay = 0 } = options;

  return gsap.context(() => {
    gsap.fromTo(
      element,
      { filter: 'grayscale(100%) brightness(0.5)', opacity: 0.3 },
      {
        filter: 'grayscale(0%) brightness(1)',
        opacity: 1,
        duration,
        ease: 'power2.out',
        delay,
        scrollTrigger: { trigger, start },
      }
    );
  }, trigger);
}

/** Earth-rise wipe — bottom-up clip reveal for section entrances */
interface EarthRiseOptions {
  duration?: number;
  start?: string;
  ease?: string;
  delay?: number;
}

export function earthRise(
  element: gsap.TweenTarget,
  trigger: Element,
  options: EarthRiseOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    setVisible(element);
    return gsap.context(() => {}, trigger);
  }

  const { duration = 1.0, start = 'top 85%', ease = 'power3.inOut', delay = 0 } = options;

  return gsap.context(() => {
    gsap.set(element, { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 20 });
    gsap.fromTo(
      element,
      { clipPath: 'inset(100% 0% 0% 0%)', y: 20, opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        y: 0,
        opacity: 1,
        duration,
        ease,
        delay,
        scrollTrigger: { trigger, start },
        onComplete: () => { gsap.set(element, { clipPath: 'none', willChange: 'auto' }); },
      }
    );
  }, trigger);
}

/** Shimmer sweep — a gradient light sweeps across element left-to-right */
export function shimmerSweep(
  container: HTMLElement,
  options: { duration?: number; delay?: number; color?: string } = {}
): () => void {
  if (prefersReduced()) return () => {};

  const { duration = 0.8, delay = 0, color = 'rgba(255,255,255,0.25)' } = options;

  const shimmer = document.createElement('div');
  shimmer.style.cssText = `
    position: absolute; inset: 0; z-index: 20; pointer-events: none; overflow: hidden;
    border-radius: inherit;
  `;
  const line = document.createElement('div');
  line.style.cssText = `
    position: absolute; top: 0; bottom: 0; left: 0; width: 60%;
    background: linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%);
    transform: translateX(-100%);
  `;
  shimmer.appendChild(line);

  // Only add if container is position relative/absolute
  const cs = getComputedStyle(container);
  if (cs.position === 'static') container.style.position = 'relative';
  container.appendChild(shimmer);

  const tween = gsap.to(line, {
    x: '300%',
    duration,
    delay,
    ease: 'power2.inOut',
    onComplete: () => { shimmer.remove(); },
  });

  return () => { tween.kill(); shimmer.remove(); };
}

/** Odometer-style rolling digit counter */
interface CounterRollOptions {
  duration?: number;
  stagger?: number;
  ease?: string;
  prefix?: string;
  suffix?: string;
  start?: string;
}

export function counterRoll(
  container: HTMLElement,
  targetValue: number,
  trigger: Element,
  options: CounterRollOptions = {}
): gsap.Context {
  if (prefersReduced()) {
    container.textContent = `${options.prefix || ''}${targetValue}${options.suffix || ''}`;
    return gsap.context(() => {}, trigger);
  }

  const {
    duration = 1.5,
    stagger = 0.1,
    ease = 'power2.out',
    prefix = '',
    suffix = '',
    start = 'top 75%',
  } = options;

  const digits = String(targetValue).split('');

  // Build DOM structure
  container.innerHTML = '';
  container.style.display = 'inline-flex';
  container.style.overflow = 'hidden';

  if (prefix) {
    const pre = document.createElement('span');
    pre.textContent = prefix;
    container.appendChild(pre);
  }

  const columns: HTMLElement[] = [];

  digits.forEach((digit) => {
    if (digit === '.' || digit === ',') {
      const sep = document.createElement('span');
      sep.textContent = digit;
      container.appendChild(sep);
      return;
    }

    const col = document.createElement('span');
    col.style.display = 'inline-block';
    col.style.overflow = 'hidden';
    col.style.position = 'relative';
    col.style.height = '1em';
    col.style.lineHeight = '1';

    const strip = document.createElement('span');
    strip.style.display = 'flex';
    strip.style.flexDirection = 'column';
    strip.style.position = 'relative';
    strip.style.willChange = 'transform';

    // Create digits 0-9 + target on top
    for (let i = 0; i <= 9; i++) {
      const d = document.createElement('span');
      d.textContent = String(i);
      d.style.height = '1em';
      d.style.lineHeight = '1';
      strip.appendChild(d);
    }

    col.appendChild(strip);
    container.appendChild(col);
    columns.push(strip);

    // Store target digit for animation
    strip.dataset.target = digit;
  });

  if (suffix) {
    const suf = document.createElement('span');
    suf.textContent = suffix;
    container.appendChild(suf);
  }

  return gsap.context(() => {
    columns.forEach((strip, i) => {
      const target = parseInt(strip.dataset.target || '0', 10);
      gsap.fromTo(
        strip,
        { y: 0 },
        {
          y: `-${target}em`,
          duration,
          delay: i * stagger,
          ease,
          scrollTrigger: { trigger, start, once: true },
          onComplete: () => { strip.style.willChange = 'auto'; },
        }
      );
    });
  }, trigger);
}
