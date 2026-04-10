import { type ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyLoadProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export const LazyLoad = ({ 
  children, 
  rootMargin = '50px', 
  threshold = 0.1,
  className = ''
}: LazyLoadProps) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    threshold
  });

  return (
    <div ref={ref} className={className}>
      {isIntersecting && children}
    </div>
  );
};