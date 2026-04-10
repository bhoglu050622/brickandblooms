import { type ReactNode } from 'react';
import { useTilt } from '@/hooks/useTilt';

interface TiltImageProps {
  children: ReactNode;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  className?: string;
}

export const TiltImage = ({ 
  children, 
  maxTilt = 8, 
  perspective = 1000, 
  scale = 1.03,
  className = ''
}: TiltImageProps) => {
  const { ref, style } = useTilt({ maxTilt, perspective, scale });

  return (
    <div 
      ref={ref} 
      style={style}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};