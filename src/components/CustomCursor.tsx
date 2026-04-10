import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  
  // Check if we should disable custom cursor on mobile or reduced motion
  const isMobileOrReducedMotion = 
    ('ontouchstart' in window) || 
    (navigator.maxTouchPoints > 0) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (isMobileOrReducedMotion) {
    return null;
  }
  const isHovering = useRef(false);
  const [cursorLabel, setCursorLabel] = useState('');

  const updateHoverState = useCallback((hovering: boolean, text?: string, cursorType?: string) => {
    isHovering.current = hovering;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const hasText = hovering && !!text;
    setCursorLabel(hasText ? text : '');

    // Cursor type mapping
    const cursorConfig = {
      default: { 
        size: hovering ? 36 : 8, 
        bg: hovering ? 'rgba(124, 140, 110, 0.14)' : 'rgba(124, 140, 110, 0.6)',
        border: hasText ? 1 : 0,
        shape: 'circle'
      },
      leaf: { 
        size: hovering ? 40 : 12, 
        bg: hovering ? 'rgba(124, 140, 110, 0.2)' : 'rgba(124, 140, 110, 0.7)',
        border: hasText ? 1 : 0,
        shape: 'leaf'
      },
      tool: { 
        size: hovering ? 38 : 10, 
        bg: hovering ? 'rgba(198, 125, 91, 0.2)' : 'rgba(198, 125, 91, 0.7)',
        border: hasText ? 1 : 0,
        shape: 'diamond'
      },
      play: { 
        size: hovering ? 48 : 14, 
        bg: hovering ? 'rgba(212, 201, 184, 0.2)' : 'rgba(212, 201, 184, 0.8)',
        border: hasText ? 1 : 0,
        shape: 'play'
      }
    };

    const config = cursorConfig[cursorType as keyof typeof cursorConfig] || cursorConfig.default;

    gsap.to(cursor, {
      width: hasText ? 80 : config.size,
      height: hasText ? 80 : config.size,
      backgroundColor: config.bg,
      borderWidth: config.border,
      borderRadius: config.shape === 'circle' ? '50%' : 
                   config.shape === 'leaf' ? '30% 70% 70% 30%' :
                   config.shape === 'diamond' ? '0%' : '50%',
      transform: config.shape === 'play' ? 'rotate(45deg)' : 'rotate(0deg)',
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
        duration: 0.08,
        ease: 'power2.out',
      });

      if (magneticTarget && magneticRect) {
        const cx = magneticRect.left + magneticRect.width / 2;
        const cy = magneticRect.top + magneticRect.height / 2;
        const pull = 0.14;
        const pullX = cx + (e.clientX - cx) * pull;
        const pullY = cy + (e.clientY - cy) * pull;
        gsap.to(cursor, {
          x: pullX,
          y: pullY,
          duration: 0.26,
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
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.18;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.18;
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
      const cursorType = el.dataset.cursorType || 
        (el.classList.contains('btn-enhanced-primary') ? 'tool' : 
         el.classList.contains('hero-item') ? 'leaf' : 
         el.tagName === 'VIDEO' ? 'play' : 'default');
      updateHoverState(true, text, cursorType);

      if (el.hasAttribute('data-cursor-magnetic')) {
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
    let moRaf = 0;
    const observer = new MutationObserver(() => {
      if (moRaf) cancelAnimationFrame(moRaf);
      moRaf = requestAnimationFrame(() => {
        moRaf = 0;
        attachHoverListeners();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rafId.current);
      if (moRaf) cancelAnimationFrame(moRaf);
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
