import { useState, useEffect, useRef } from 'react';

interface TouchGesture {
  type: 'tap' | 'doubleTap' | 'swipeLeft' | 'swipeRight' | 'swipeUp' | 'swipeDown' | 'longPress';
  position: { x: number; y: number };
}

interface GestureHandlers {
  onTap?: (e: TouchEvent) => void;
  onDoubleTap?: (e: TouchEvent) => void;
  onSwipeLeft?: (e: TouchEvent) => void;
  onSwipeRight?: (e: TouchEvent) => void;
  onSwipeUp?: (e: TouchEvent) => void;
  onSwipeDown?: (e: TouchEvent) => void;
  onLongPress?: (e: TouchEvent) => void;
}

const SWIPE_THRESHOLD = 50;
const LONG_PRESS_DURATION = 500;

// Declare NodeJS namespace for setTimeout return type
declare const setTimeout: {
  (handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
  <T extends any[]>(handler: (...args: T) => void, timeout?: number, ...args: T): number;
};

export const useTouchGestures = (handlers: GestureHandlers = {}) => {
  const [gesture, setGesture] = useState<TouchGesture | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { 
        x: touch.clientX, 
        y: touch.clientY, 
        time: Date.now() 
      };

      // Set up long press timer
      if (handlers.onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          if (touchStartRef.current) {
            handlers.onLongPress?.(e);
            setGesture({ 
              type: 'longPress', 
              position: { x: touch.clientX, y: touch.clientY } 
            });
          }
        }, LONG_PRESS_DURATION);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStartRef.current.x;
      const deltaY = touchEnd.clientY - touchStartRef.current.y;
      const duration = Date.now() - touchStartRef.current.time;

      // Check for swipe gestures
      if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0) {
            handlers.onSwipeRight?.(e);
            setGesture({ type: 'swipeRight', position: { x: touchEnd.clientX, y: touchEnd.clientY } });
          } else {
            handlers.onSwipeLeft?.(e);
            setGesture({ type: 'swipeLeft', position: { x: touchEnd.clientX, y: touchEnd.clientY } });
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            handlers.onSwipeDown?.(e);
            setGesture({ type: 'swipeDown', position: { x: touchEnd.clientX, y: touchEnd.clientY } });
          } else {
            handlers.onSwipeUp?.(e);
            setGesture({ type: 'swipeUp', position: { x: touchEnd.clientX, y: touchEnd.clientY } });
          }
        }
      } else if (duration < 300) {
        // Quick tap - could be double tap
        handlers.onTap?.(e);
        setGesture({ type: 'tap', position: { x: touchEnd.clientX, y: touchEnd.clientY } });
      }

      touchStartRef.current = null;
    };

    const handleTouchCancel = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      touchStartRef.current = null;
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handlers]);

  return { gesture };
};