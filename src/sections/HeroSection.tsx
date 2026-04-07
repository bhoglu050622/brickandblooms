import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Play, X, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clientLogos } from '@/data/clientLogos';
import { company } from '@/data/company';

gsap.registerPlugin(ScrollTrigger);

// Floating particle component
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 140, 110, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

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
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const logoTextRef1 = useRef<HTMLSpanElement>(null);
  const logoTextRef2 = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  // Mouse-reactive parallax on logo + cursor spotlight
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;

    // Parallax on logo layers — different depths
    if (logoTextRef1.current) {
      gsap.to(logoTextRef1.current, { x: dx * 15, y: dy * 10, duration: 0.6, ease: 'power2.out' });
    }
    if (logoTextRef2.current) {
      gsap.to(logoTextRef2.current, { x: dx * 25, y: dy * 15, duration: 0.6, ease: 'power2.out' });
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
      gsap.set(logoOverlayRef.current, { opacity: 0, display: 'none' });
      gsap.set(contentRef.current, { opacity: 1 });
      return () => clearInterval(interval);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Video fades in
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 2 }, 0);

      // Logo appears with scale + slight rotation
      tl.fromTo(
        logoOverlayRef.current,
        { opacity: 0, scale: 0.85, rotateX: 5 },
        { opacity: 1, scale: 1, rotateX: 0, duration: 1.6 },
        0.5
      );

      // Logo fades out
      tl.to(logoOverlayRef.current, {
        opacity: 0,
        scale: 1.08,
        filter: 'blur(8px)',
        duration: 1.2,
        ease: 'power2.in',
      }, 2.8);

      // Content reveals
      tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 3.8);

      tl.fromTo(
        '.hero-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out' },
        3.9
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
      }, 4.0);

      // Scroll: video desaturates as user scrolls past hero
      gsap.to(bgRef.current, {
        filter: 'grayscale(100%) brightness(0.6)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#1A1A17]"
      onMouseMove={prefersReduced ? undefined : handleMouseMove}
    >
      {/* Video Background */}
      <div ref={bgRef} className="absolute inset-0 z-0 opacity-0 overflow-hidden">
        {prefersReduced ? (
          <img src={company.heroPoster} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={company.heroPoster}
            className="h-full w-full object-cover"
          >
            <source src={company.heroMedia} type="video/mp4" />
          </video>
        )}
        {/* Cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,26,23,0.6) 100%)' }}
        />
        <div className="absolute inset-0 bg-[#1A1A17]/15 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#1A1A17] via-[#1A1A17]/40 to-transparent pointer-events-none" />
      </div>

      {/* Floating particles */}
      {!prefersReduced && <Particles />}

      {/* Cursor-reactive spotlight overlay */}
      <div ref={spotlightRef} className="absolute inset-0 z-[3] pointer-events-none" />

      {/* Audio Toggle */}
      {!prefersReduced && (
        <button
          onClick={toggleAudio}
          className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-[#1A1A17]/60 backdrop-blur-xl border border-white/10 px-4 py-2 text-white/50 transition-all duration-200 hover:bg-[#1A1A17]/80 hover:text-white/80"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className="text-[10px] font-medium uppercase tracking-[0.1em]">
            {muted ? 'Sound Off' : 'Sound On'}
          </span>
        </button>
      )}

      {/* Logo Overlay — mouse-reactive parallax layers */}
      <div
        ref={logoOverlayRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none opacity-0"
        style={{ perspective: '1000px' }}
      >
        <div className="flex items-baseline gap-1">
          <span
            ref={logoTextRef1}
            className="text-[36px] sm:text-[56px] md:text-[80px] lg:text-[110px] xl:text-[130px] font-extrabold leading-none tracking-tighter text-sage"
          >
            Brick
          </span>
          <span
            ref={logoTextRef2}
            className="text-[36px] sm:text-[56px] md:text-[80px] lg:text-[110px] xl:text-[130px] font-extrabold leading-none tracking-tighter text-white"
          >
            &amp; Blooms
          </span>
        </div>
        <p className="mt-4 text-[12px] sm:text-[14px] font-medium uppercase tracking-[0.25em] text-white/50">
          {company.tagline}
        </p>
      </div>

      {/* Main Hero Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col px-6 lg:px-12 opacity-0"
      >
        <div className="flex flex-1 flex-col pt-20">
          {/* Stats */}
          <div className="hero-item flex items-start justify-between opacity-0">
            <div className="flex-1" />
            <div className="hidden lg:block text-right shrink-0">
              <div className="text-[36px] md:text-[56px] lg:text-[72px] font-bold leading-none tracking-tight text-sage">
                <span ref={counterRef}>0+</span>
              </div>
              <p className="mt-2 max-w-[160px] text-right text-[10px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-white/50">
                Projects delivered across India
              </p>
            </div>
          </div>

          {/* Client logos marquee */}
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
        </div>

        {/* Bottom — Description + CTAs + Showreel */}
        <div className="pb-8 flex flex-col lg:flex-row items-end justify-between gap-8">
          <div className="max-w-[550px]">
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
              <a
                href="#work"
                className="group flex items-center gap-2 rounded-lg bg-sage px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-sage-hover hover:shadow-lg hover:shadow-sage/30 hover:scale-[1.02]"
              >
                SEE WORK
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-250 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="group flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02]"
              >
                GET A QUOTE
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-250 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Showreel thumbnail */}
          <div className="hero-item opacity-0 shrink-0 mb-10 lg:mb-0">
            <button
              onClick={() => setShowReel(true)}
              className="group relative w-[240px] md:w-[300px] overflow-hidden rounded-xl"
            >
              <video muted loop playsInline autoPlay className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105">
                <source src="/showreel.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-300 group-hover:bg-black/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
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
            <video autoPlay controls playsInline className="w-full rounded-xl shadow-2xl">
              <source src="/showreel.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
