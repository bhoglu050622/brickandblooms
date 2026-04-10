import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Play, X, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clientLogos } from '@/data/clientLogos';
import { company } from '@/data/company';
import { NATURE } from '@/lib/motion';
import { LazyLoad } from '@/components/LazyLoad';
import { MobileOptimized } from '@/components/MobileOptimized';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

// Enhanced ambient particles with drift and bokeh
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = 0;

    interface Particle {
      x: number;
      y: number;
      baseX: number;
      size: number;
      speed: number;
      opacity: number;
      isLeaf: boolean; // elongated ellipse vs circle
      id: number;
    }

    interface Bokeh {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      driftX: number;
      driftY: number;
      id: number;
    }

    const particles: Particle[] = [];
    const bokehDots: Bokeh[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 25 particles (reduced from 40) with mixed shapes
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.08,
        opacity: Math.random() * 0.35 + 0.1,
        isLeaf: Math.random() > 0.6, // 40% are leaf-shaped
        id: i,
      });
    }

    // 8 large bokeh circles — depth-of-field feel
    for (let i = 0; i < 8; i++) {
      bokehDots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 40,
        opacity: Math.random() * 0.03 + 0.02,
        driftX: (Math.random() - 0.5) * 60,
        driftY: (Math.random() - 0.5) * 30,
        id: i,
      });
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const time = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bokeh (background layer — large, low opacity)
      bokehDots.forEach((b) => {
        const dx = Math.sin(time * 0.0003 + b.id * 1.7) * b.driftX;
        const dy = Math.cos(time * 0.0002 + b.id * 2.3) * b.driftY;
        ctx.beginPath();
        ctx.arc(b.x + dx, b.y + dy, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 140, 110, ${b.opacity})`;
        ctx.fill();
      });

      // Draw particles with horizontal sinusoidal drift
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.baseX = Math.random() * canvas.width;
        }

        // Sinusoidal horizontal drift
        const drift = Math.sin(time * 0.001 + p.id * 0.8) * 20;
        p.x = p.baseX + drift;

        // Green tint gradient: particles near bottom are more opaque sage
        const heightFactor = p.y / canvas.height;
        const alpha = p.opacity * (0.5 + heightFactor * 0.5);

        ctx.beginPath();
        if (p.isLeaf) {
          // Elongated ellipse (leaf-like)
          ctx.ellipse(p.x, p.y, p.size * 0.6, p.size * 1.5, Math.sin(time * 0.0005 + p.id) * 0.3, 0, Math.PI * 2);
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(124, 140, 110, ${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[2]" />;
};

const HeroSection = () => {
  const [time, setTime] = useState('--:--');
  const [showReel, setShowReel] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  /** Hero is above the fold — load immediately; lazy delay caused playback to hitch with Lenis/ST. */
  const [shouldLoadVideo] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  // Mouse-reactive parallax — layered headline words at different depths + spotlight
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;

    // Background only — translating the whole hero content caused horizontal clipping (120+, showreel) with overflow-x-clip
    if (bgRef.current) {
      gsap.to(bgRef.current, { x: dx * 3, y: dy * 2, duration: 1.2, ease: 'power2.out' });
    }

    // Cursor spotlight
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(600px circle at ${clientX}px ${clientY}px, rgba(124,140,110,0.06), transparent 60%)`;
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const t = new Date().toLocaleTimeString('en-US', {
        timeZone: company.timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(t);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(bgRef.current, { opacity: 1 });
      gsap.set(contentRef.current, { opacity: 1 });
      return () => clearInterval(interval);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: NATURE.ease.entrance } });

      // Video fades in slowly (cinematic)
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 3, ease: NATURE.ease.slow }, 0);

      // Content reveals
      tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 3.0);

      // Staggered Masked Split-Text Reveal for Headline
      tl.fromTo(
        '.word-anim',
        { y: '120%', opacity: 0, rotationZ: 8 },
        { y: '0%', opacity: 1, rotationZ: 0, duration: 1.2, stagger: 0.12, ease: 'power4.out' },
        3.1
      );

      tl.fromTo(
        '.hero-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: NATURE.duration.stagger, ease: NATURE.ease.grow },
        3.6
      );

      // Counter with elastic overshoot
      const counterObj = { val: 0 };
      tl.to(counterObj, {
        val: 120,
        duration: 2.5,
        ease: 'elastic.out(1, 0.5)',
        onUpdate: () => {
          if (counterRef.current) counterRef.current.textContent = Math.round(counterObj.val) + '+';
        },
      }, 3.5);

      // Scroll: video desaturates (needs ScrollTrigger.update on load — see App.tsx + Lenis)
      gsap.to(bgRef.current, {
        filter: 'grayscale(100%) brightness(0.6)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  // Keep hero video playing: autoplay can stall until the next paint/scroll when using Lenis + scrubbed ST.
  useEffect(() => {
    if (prefersReduced || !shouldLoadVideo) return;
    const el = videoRef.current;
    if (!el) return;

    const nudgePlay = () => {
      void el.play().catch(() => {});
    };

    el.addEventListener('loadeddata', nudgePlay);
    el.addEventListener('canplay', nudgePlay);
    nudgePlay();

    return () => {
      el.removeEventListener('loadeddata', nudgePlay);
      el.removeEventListener('canplay', nudgePlay);
    };
  }, [shouldLoadVideo, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col overflow-x-clip bg-[#1A1A17]"
      onMouseMove={prefersReduced ? undefined : handleMouseMove}
    >
      {/* Video Background with optimized formats and loading states */}
      <div ref={bgRef} className="absolute inset-0 z-0 opacity-0 overflow-hidden">
        {prefersReduced ? (
          <picture className="h-full w-full block">
            <source media="(max-width: 768px)" srcSet="/hero-poster-sm.jpg" />
            <source media="(max-width: 1280px)" srcSet="/hero-poster-md.jpg" />
            <img 
              src="/hero-poster-lg.jpg" 
              alt="Brick & Blooms landscape design studio" 
              className="h-full w-full object-cover"
              loading="eager"
            />
          </picture>
        ) : (
          <>
            {!videoLoaded && shouldLoadVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A17]">
                <div className="w-16 h-16 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {shouldLoadVideo && (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                preload="auto"
                onCanPlay={() => setVideoLoaded(true)}
              >
                <source src="/hero-video.webm" type="video/webm" />
                <source src={company.heroMedia} type="video/mp4" />
              </video>
            )}
          </>
        )}
        {/* Cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,26,23,0.6) 100%)' }}
        />
        <div className="absolute inset-0 bg-[#1A1A17]/15 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#1A1A17] via-[#1A1A17]/40 to-transparent pointer-events-none" />
      </div>

      {/* Enhanced ambient particles with drift + bokeh */}
      {!prefersReduced && <Particles />}

      {/* Cursor-reactive spotlight overlay */}
      <div ref={spotlightRef} className="absolute inset-0 z-[3] pointer-events-none" />

      {/* Audio Toggle */}
      {!prefersReduced && (
        <button
          onClick={toggleAudio}
          className="absolute bottom-6 left-6 z-20 flex items-center gap-2 rounded-full bg-[#1A1A17]/60 backdrop-blur-xl border border-white/10 px-4 py-2 text-white/50 transition-all duration-1200 ease-nature hover:bg-[#1A1A17]/80 hover:text-white/80"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className="text-[10px] font-medium uppercase tracking-[0.1em]">
            {muted ? 'Sound Off' : 'Sound On'}
          </span>
        </button>
      )}

      {/* Main Hero Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col px-4 sm:px-6 lg:px-12 opacity-0"
      >
        <div className="flex min-w-0 flex-1 flex-col pt-20 lg:pt-24">
          {/* Hero Headline - Enhanced Typography */}
          <div className="mb-8 min-w-0 lg:mb-12">
            <h1 className="text-display font-black tracking-tighter leading-none text-shadow-hero flex flex-col sm:flex-row sm:flex-wrap sm:gap-[0.2em]">
              {company.heroHeadline.map((word, index) => (
                <span key={index} className="overflow-hidden block sm:inline-block pb-1 sm:pb-2 lg:pb-4">
                  <span className="word-anim inline-block opacity-0 will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* Stats */}
          <div className="hero-item flex w-full min-w-0 items-start justify-between gap-4 opacity-0">
            <div className="min-w-0 flex-1" />
            <div className="hidden text-right lg:block lg:max-w-[min(200px,42vw)] lg:shrink-0">
              <div className="text-[36px] md:text-[56px] lg:text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-none tracking-tight text-sage gradient-text-hero">
                <span ref={counterRef}>0+</span>
              </div>
              <p className="mt-2 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-white/50">
                Projects delivered across India
              </p>
            </div>
          </div>

          {/* Client logos marquee */}
          <LazyLoad rootMargin="100px">
            <div className="hero-item mt-auto mb-8 overflow-hidden opacity-0">
              <div className="flex animate-marquee gap-12 whitespace-nowrap hover:[animation-play-state:paused]">
                {[...clientLogos, ...clientLogos].map((logo, i) => (
                  <div key={i} className="flex items-center gap-2 shrink-0 opacity-40">
                    <div className="h-5 w-5 rounded-full border border-white/30 flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold">{logo[0]}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-white tracking-wide">{logo}</span>
                  </div>
                ))}
              </div>
            </div>
          </LazyLoad>
        </div>

        {/* Bottom — Description + CTAs + Showreel */}
        <div className="flex w-full min-w-0 flex-col gap-8 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-full lg:max-w-[550px]">
            <div className="hero-item opacity-0">
              <p className="mb-1 text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.06em] text-white/70">
                {company.heroDescription}
              </p>
              <p className="mb-4 text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.06em] text-white/70">
                {company.heroServices}
              </p>
            </div>

            <div className="hero-item mb-5 opacity-0">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">OUR TIME</p>
                  <p className="text-[13px] font-medium tracking-tight text-white/80 tabular-nums">{time}</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  {company.timezoneLabel}
                </p>
              </div>
            </div>

            <div className="hero-item flex flex-wrap gap-3 opacity-0">
              <MobileOptimized onTap={() => {}}>
                <MagneticButton
                  href="#work"
                  className="group btn-enhanced-primary"
                  data-cursor-type="tool"
                >
                  SEE WORK
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-nature group-hover:translate-x-1" />
                </MagneticButton>
              </MobileOptimized>
              <MobileOptimized onTap={() => {}}>
                <MagneticButton
                  href="#contact"
                  className="group btn-enhanced-secondary"
                  data-cursor-type="leaf"
                >
                  GET A QUOTE
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-nature group-hover:translate-x-1" />
                </MagneticButton>
              </MobileOptimized>
            </div>
          </div>

          {/* Showreel — width capped to viewport so it never clips at the right edge */}
          <div className="hero-item mb-10 w-full shrink-0 opacity-0 lg:mb-0 lg:w-auto lg:max-w-[min(300px,calc(100vw-3rem))] lg:self-end">
            <button
              type="button"
              onClick={() => setShowReel(true)}
              data-cursor-text="Play"
              className="group relative mx-auto block w-full max-w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-xl sm:max-w-[18rem] md:max-w-[19rem] lg:mx-0 lg:ml-auto lg:max-w-[300px]"
            >
              <video
                muted
                loop
                playsInline
                autoPlay
                className="aspect-[16/9] w-full object-cover transition-transform duration-1200 ease-nature group-hover:scale-105"
                poster="/showreel-poster-md.jpg"
                onCanPlay={(e) => {
                  void e.currentTarget.play().catch(() => {});
                }}
              >
                <source src="/showreel.webm" type="video/webm" />
                <source src="/showreel.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-500 group-hover:bg-black/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-500 ease-nature group-hover:scale-110">
                  <Play className="h-5 w-5 text-black ml-0.5" fill="black" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70">Showreel</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Lightbox */}
      {showReel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowReel(false)}
        >
          <button
            onClick={() => setShowReel(false)}
            className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="w-full max-w-[900px] mx-4" onClick={(e) => e.stopPropagation()}>
            <video autoPlay controls playsInline className="w-full rounded-xl shadow-2xl" poster="/showreel-poster-lg.jpg">
              <source src="/showreel.webm" type="video/webm" />
              <source src="/showreel.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
