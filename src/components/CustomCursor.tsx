import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);
  const [cursorLabel, setCursorLabel] = useState('');

  const updateHoverState = useCallback((hovering: boolean, text?: string) => {
    isHovering.current = hovering;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const hasText = hovering && !!text;
    setCursorLabel(hasText ? text : '');

    gsap.to(cursor, {
      width: hasText ? 80 : hovering ? 48 : 8,
      height: hasText ? 80 : hovering ? 48 : 8,
      backgroundColor: hovering ? 'rgba(124, 140, 110, 0.15)' : 'rgba(124, 140, 110, 0.6)',
      borderWidth: hasText ? 1 : 0,
      duration: 0.25,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Magnetic target tracking
    let magneticTarget: HTMLElement | null = null;
    let magneticRect: DOMRect | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'power2.out',
      });

      // If hovering a magnetic element, pull cursor ring toward its center
      if (magneticTarget && magneticRect) {
        const cx = magneticRect.left + magneticRect.width / 2;
        const cy = magneticRect.top + magneticRect.height / 2;
        const pullX = cx + (e.clientX - cx) * 0.3;
        const pullY = cy + (e.clientY - cy) * 0.3;
        gsap.to(cursor, {
          x: pullX,
          y: pullY,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, cursorDot], { opacity: 0, duration: 0.3 });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.75, duration: 0.1, ease: 'power2.out' });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
    };

    // Smooth cursor ring animation
    const animateCursor = () => {
      if (!magneticTarget) {
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
        gsap.set(cursor, {
          x: cursorPos.current.x,
          y: cursorPos.current.y,
        });
      }
      rafId.current = requestAnimationFrame(animateCursor);
    };

    // Hover listener handlers
    const onElementEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const text = el.dataset.cursorText || '';
      updateHoverState(true, text);

      // Enable magnetic pull for buttons and elements with data-cursor-magnetic
      if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.hasAttribute('data-cursor-magnetic')) {
        magneticTarget = el;
        magneticRect = el.getBoundingClientRect();
      }
    };

    const onElementLeave = () => {
      updateHoverState(false);
      magneticTarget = null;
      magneticRect = null;
    };

    const attachHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor-hover], [data-cursor-text], input, textarea, select'
      );
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onElementEnter);
        el.removeEventListener('mouseleave', onElementLeave);
        el.addEventListener('mouseenter', onElementEnter);
        el.addEventListener('mouseleave', onElementLeave);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    attachHoverListeners();
    rafId.current = requestAnimationFrame(animateCursor);

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, [updateHoverState]);

  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  ) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference flex items-center justify-center border-white/20"
        style={{
          width: 8,
          height: 8,
          backgroundColor: 'rgba(124, 140, 110, 0.6)',
          borderWidth: 0,
          borderStyle: 'solid',
        }}
      >
        {cursorLabel && (
          <span
            ref={cursorTextRef}
            className="text-[10px] font-medium uppercase tracking-wider text-white whitespace-nowrap select-none"
          >
            {cursorLabel}
          </span>
        )}
      </div>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/80"
      />
    </>
  );
};

export default CustomCursor;
