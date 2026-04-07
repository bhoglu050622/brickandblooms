import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Set elements to their visible final state without animation. */
function setVisible(elements: gsap.TweenTarget) {
  gsap.set(elements, { opacity: 1, y: 0, scale: 1, clipPath: 'none' });
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
