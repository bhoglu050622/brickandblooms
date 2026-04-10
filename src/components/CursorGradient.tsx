import { useEffect, useRef } from 'react';

interface CursorGradientProps {
  colorRgb?: string;
  intensity?: number;
  size?: number;
  className?: string;
}

/** Ambient cursor-follow gradient — updates DOM only (no React re-renders per mousemove). */
export const CursorGradient = ({
  colorRgb = '124, 140, 110',
  intensity = 0.2,
  size = 600,
  className = '',
}: CursorGradientProps) => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const el = gradientRef.current;
    if (!el) return;

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || reduced) return;

    const alpha = Math.max(0, Math.min(1, intensity));

    const apply = () => {
      rafId.current = 0;
      const p = pending.current;
      if (!p || !gradientRef.current) return;
      gradientRef.current.style.background = `radial-gradient(${size}px circle at ${p.x}px ${p.y}px, rgba(${colorRgb},${alpha}), transparent 78%)`;
    };

    const onMove = (e: MouseEvent) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(apply);
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [colorRgb, intensity, size]);

  return (
    <div
      ref={gradientRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: `radial-gradient(${size}px circle at -200px -200px, rgba(${colorRgb},0), transparent 78%)`,
        mixBlendMode: 'overlay',
      }}
    />
  );
};
