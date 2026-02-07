import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);

  const updateHoverState = useCallback((hovering: boolean) => {
    isHovering.current = hovering;
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.to(cursor, {
      width: hovering ? 48 : 8,
      height: hovering ? 48 : 8,
      backgroundColor: hovering ? 'rgba(255, 107, 74, 0.2)' : 'rgba(255, 107, 74, 0.6)',
      duration: 0.2,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, cursorDot], { opacity: 0, duration: 0.3 });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.75,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.7)',
      });
    };

    const animateCursor = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
      gsap.set(cursor, {
        x: cursorPos.current.x,
        y: cursorPos.current.y,
      });
      rafId.current = requestAnimationFrame(animateCursor);
    };

    // MutationObserver to detect new interactive elements
    const attachHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select');
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onElementEnter);
        el.removeEventListener('mouseleave', onElementLeave);
        el.addEventListener('mouseenter', onElementEnter);
        el.addEventListener('mouseleave', onElementLeave);
      });
    };

    const onElementEnter = () => updateHoverState(true);
    const onElementLeave = () => updateHoverState(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    attachHoverListeners();
    rafId.current = requestAnimationFrame(animateCursor);

    // Re-attach listeners periodically for dynamically added elements
    const interval = setInterval(attachHoverListeners, 2000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rafId.current);
      clearInterval(interval);
    };
  }, [updateHoverState]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference"
        style={{
          width: 8,
          height: 8,
          backgroundColor: 'rgba(255, 107, 74, 0.6)',
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/80"
      />
    </>
  );
};

export default CustomCursor;
