import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton = ({ children, strength = 40, className = '', ...props }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Skip for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;

      gsap.to(button, {
        x: (x / rect.width) * strength,
        y: (y / rect.height) * strength,
        duration: 1,
        ease: 'power3.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <a ref={buttonRef} className={`will-change-transform ${className}`} {...props}>
      {children}
    </a>
  );
};
