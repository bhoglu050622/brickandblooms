import { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [position, setPosition] = useState(50);
  const positionProxy = useRef({ value: 50 });
  const hasHinted = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Smooth position interpolation
    const posTo = gsap.quickTo(positionProxy.current, 'value', {
      duration: 0.15,
      ease: 'power2.out',
    });

    // RAF loop to read proxy and update DOM
    let rafId: number;
    const update = () => {
      const v = positionProxy.current.value;
      setPosition(v);
      if (clipRef.current) clipRef.current.style.width = `${v}%`;
      if (dividerRef.current) dividerRef.current.style.left = `${v}%`;
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    // Pointer events for drag
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      container.setPointerCapture(e.pointerId);
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
      posTo(pct);
    };

    const onPointerUp = () => {
      isDragging.current = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    // Scroll-triggered hint animation
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && !hasHinted.current) {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          hasHinted.current = true;
          const hintTl = gsap.timeline();
          hintTl.to(positionProxy.current, { value: 25, duration: 0.8, ease: 'power2.inOut' });
          hintTl.to(positionProxy.current, { value: 75, duration: 0.8, ease: 'power2.inOut' });
          hintTl.to(positionProxy.current, { value: 50, duration: 0.6, ease: 'power2.inOut' });
        },
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl cursor-grab select-none touch-none"
    >
      {/* After image (full, sits behind) */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        ref={clipRef}
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        ref={dividerRef}
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="h-full w-[2px] bg-white/70" />
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm">
          <ArrowLeftRight className="h-4 w-4 text-black" />
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 z-20 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 z-20 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {afterLabel}
      </span>
    </div>
  );
};

export default BeforeAfterSlider;
