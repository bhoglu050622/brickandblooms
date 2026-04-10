import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { LenisContext } from './hooks/useLenis';
import IntroLoader from './components/IntroLoader';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import WeCreateSection from './sections/WeCreateSection';
import WorkSection from './sections/WorkSection';
import StatsSection from './sections/StatsSection';
import ServicesSection from './sections/ServicesSection';
import ProcessSection from './sections/ProcessSection';
import SatisfactionSection from './sections/SatisfactionSection';
import PricingSection from './sections/PricingSection';
import TeamSection from './sections/TeamSection';
import FAQSection from './sections/FAQSection';
import TestimonialsSection from './sections/TestimonialsSection';
import BlogSection from './sections/BlogSection';
import TransformationSection from './sections/TransformationSection';
import CTASection from './sections/CTASection';
import Footer from './sections/Footer';
import { CursorGradient } from './components/CursorGradient';
import { SoundController } from './components/SoundController';
import { PersonalizedGreeting } from './components/PersonalizedGreeting';

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const lenisTickerRef = useRef<((time: number) => void) | null>(null);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    // Only initialize Lenis smooth scroll when motion is allowed
    if (!prefersReduced) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.15,
      });
      lenisRef.current = lenis;
      setLenisInstance(lenis);

      lenis.on('scroll', ScrollTrigger.update);

      const onLenisTicker = (time: number) => {
        lenis.raf(time * 1000);
      };
      lenisTickerRef.current = onLenisTicker;
      gsap.ticker.add(onLenisTicker);
      gsap.ticker.lagSmoothing(500, 33);

      // Lenis does not always emit `scroll` on first paint — without this, scrubbed
      // ScrollTriggers (e.g. hero video) stay wrong until the user scrolls once.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      });
    }

    ScrollTrigger.refresh();

    return () => {
      if (lenisTickerRef.current) {
        gsap.ticker.remove(lenisTickerRef.current);
        lenisTickerRef.current = null;
      }
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!introComplete) return;
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    });
  }, [introComplete]);

  return (
    <LenisContext.Provider value={lenisInstance}>
      <main className="relative min-h-screen w-full overflow-x-clip">
        {/* Intro Loader */}
        {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}

        {/* Custom Cursor */}
        <CustomCursor />
        <CursorGradient colorRgb="124, 140, 110" intensity={0.12} size={720} />
        <SoundController />
        <PersonalizedGreeting />

        {/* Navigation */}
        <Navigation />

        {/* Sections */}
        <HeroSection />
        <WeCreateSection />
        <WorkSection />
        <TransformationSection />
        <StatsSection />
        <ServicesSection />
        <ProcessSection />
        <SatisfactionSection />
        <PricingSection />
        <TeamSection />
        <FAQSection />
        <TestimonialsSection />
        <BlogSection />
        <CTASection />
        <Footer />
      </main>
    </LenisContext.Provider>
  );
}

export default App;
