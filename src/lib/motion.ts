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
  if (prefersReduced()) return gsap.context(() => {}, trigger);

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
      { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0 },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration, ease: 'power3.out', scrollTrigger: { trigger, start } }
    );
  }, trigger);
}

// ── New Primitives ──────────────────────────────────────────────────────

/** Direction-aware clip-path reveal */
type ClipDirection = 'left' | 'right' | 'top' | 'bottom' | 'center';

const clipStartStates: Record<ClipDirection, string> = {
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  top: 'inset(0% 0% 100% 0%)',
  bottom: 'inset(100% 0% 0% 0%)',
  center: 'inset(10% 10% 10% 10%)',
};

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
      { clipPath: clipStartStates[direction], opacity: 0 },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration, ease, delay, scrollTrigger: { trigger, start } }
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
