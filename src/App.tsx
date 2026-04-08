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
import CTASection from './sections/CTASection';
import Footer from './sections/Footer';

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
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
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      setLenisInstance(lenis);

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.refresh();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        gsap.ticker.remove(lenisRef.current.raf);
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      <main className="relative min-h-screen w-full overflow-x-hidden">
        {/* Intro Loader */}
        {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}

        {/* Custom Cursor */}
        <CustomCursor />

        {/* Navigation */}
        <Navigation />

        {/* Sections */}
        <HeroSection />
        <WeCreateSection />
        <WorkSection />
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
