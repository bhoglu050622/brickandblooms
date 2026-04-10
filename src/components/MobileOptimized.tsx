import { type ReactNode, useState } from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface MobileOptimizedProps {
  children: ReactNode;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const MobileOptimized = ({ 
  children, 
  onTap,
  onDoubleTap,
  onSwipeLeft,
  onSwipeRight,
  className = ''
}: MobileOptimizedProps) => {
  const [isActive, setIsActive] = useState(false);
  
  useTouchGestures({
    onTap: () => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 150);
      onTap?.();
    },
    onDoubleTap: () => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 200);
      onDoubleTap?.();
    },
    onSwipeLeft: () => {
      onSwipeLeft?.();
    },
    onSwipeRight: () => {
      onSwipeRight?.();
    }
  });

  return (
    <div 
      className={`touch-optimized ${isActive ? 'active' : ''} ${className}`}
      style={{
        transition: 'transform 0.15s ease-out',
        transform: isActive ? 'scale(0.98)' : 'scale(1)'
      }}
    >
      {children}
    </div>
  );
};