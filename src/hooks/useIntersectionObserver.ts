import { useState, useEffect, useRef, type RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = <T extends Element>(
  options: IntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T>(null) as RefObject<T>;

  useEffect(() => {
    const { root = null, rootMargin = '0px', threshold = 0.1 } = options;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return { ref: elementRef, isIntersecting };
};