import { useState, useEffect, useRef } from 'react';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  transitionSpeed?: number;
}

export const useTilt = (options: TiltOptions = {}) => {
  const {
    maxTilt = 10,
    perspective = 1000,
    scale = 1.05,
    transitionSpeed = 300
  } = options;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const tiltX = (mouseY / rect.height) * maxTilt;
      const tiltY = -(mouseX / rect.width) * maxTilt;
      
      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [maxTilt]);

  const transform = `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${scale}, ${scale}, ${scale})`;
  const transition = `transform ${transitionSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  return {
    ref: elementRef,
    style: {
      transform,
      transition,
      transformStyle: 'preserve-3d' as const,
    }
  };
};