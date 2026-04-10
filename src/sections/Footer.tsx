import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { breatheScale } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const navColsRef = useRef<HTMLDivElement>(null);
  const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const newsletterFormRef = useRef<HTMLDivElement>(null);
  const newsletterSuccessRef = useRef<HTMLDivElement>(null);
  const newsletterInputRef = useRef<HTMLInputElement>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setEmailError('Please enter a valid email address.');
      if (newsletterInputRef.current) {
        const el = newsletterInputRef.current;
        const shakeTl = gsap.timeline();
        shakeTl.to(el, { x: -12, duration: 0.06, ease: 'power2.out' })
          .to(el, { x: 12, duration: 0.06 })
          .to(el, { x: -8, duration: 0.06 })
          .to(el, { x: 8, duration: 0.06 })
          .to(el, { x: -4, duration: 0.06 })
          .to(el, { x: 0, duration: 0.08, ease: 'power2.in' });
      }
      return;
    }
    setEmailError('');
    // Animate form out, success in
    if (newsletterFormRef.current && newsletterSuccessRef.current) {
      gsap.to(newsletterFormRef.current, {
        y: -20, opacity: 0, duration: 0.35, ease: 'power2.in',
        onComplete: () => setSubmitted(true),
      });
    } else {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];

    if (prefersReduced) {
      gsap.set(footer, { opacity: 1, clipPath: 'none' });
      if (logoRef.current) gsap.set(logoRef.current, { opacity: 1 });
      return;
    }

    // Footer: earth-rise wipe from bottom
    gsap.fromTo(footer,
      { clipPath: 'inset(30% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.0,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: footer, start: 'top 90%' },
        onComplete: () => { gsap.set(footer, { clipPath: 'none' }); },
      }
    );

    // Logo: crystallize from blur + small scale
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { scale: 0.4, opacity: 0, filter: 'blur(12px)' },
        {
          scale: 1, opacity: 1, filter: 'blur(0px)',
          duration: 1.0,
          ease: 'power4.out',
          scrollTrigger: { trigger: logoRef.current, start: 'top 90%' },
        }
      );
    }

    // Nav links: vine-growth stagger (column by column, link by link)
    if (navColsRef.current) {
      const columns = navColsRef.current.querySelectorAll('.footer-col');
      columns.forEach((col, ci) => {
        const links = col.querySelectorAll('a, p');
        gsap.fromTo(links,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.05,
            delay: ci * 0.15,
            scrollTrigger: { trigger: navColsRef.current, start: 'top 85%' },
          }
        );
      });
    }

    // Social icons: spring pop blossoms
    socialRefs.current.forEach((icon, i) => {
      if (!icon) return;
      gsap.fromTo(icon,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.4,
          ease: 'back.out(3)',
          delay: i * 0.08,
          scrollTrigger: { trigger: icon, start: 'top 90%' },
        }
      );
    });

    // Rotating circle + breathe scale layered
    if (circleRef.current) {
      gsap.to(circleRef.current, { rotation: 360, duration: 60, repeat: -1, ease: 'none' });
      const cleanup = breatheScale(circleRef.current, { min: 1.0, max: 1.04, duration: 5 });
      cleanups.push(cleanup);
    }

    // Copyright: late quiet fade
    if (copyrightRef.current) {
      gsap.fromTo(copyrightRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6,
          delay: 0.8,
          scrollTrigger: { trigger: copyrightRef.current, start: 'top 95%' },
        }
      );
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { label: 'HOME', href: '#' },
    { label: 'PROJECTS', href: '#work' },
    { label: 'SERVICES', href: '#studio' },
    { label: 'INSIGHTS', href: '#whispers' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const legalLinks = [
    { label: 'TERMS OF SERVICE', href: '#' },
    { label: 'PRIVACY POLICY', href: '#' },
  ];

  const socialLinks = [
    { label: 'X', href: 'https://x.com' },
    { label: 'Li', href: 'https://linkedin.com' },
    { label: 'IG', href: 'https://instagram.com' },
    { label: 'FB', href: 'https://facebook.com' },
    { label: 'WA', href: 'https://whatsapp.com' },
  ];

  return (
    <footer ref={footerRef} className="relative w-full bg-white" style={{ clipPath: 'inset(30% 0 0 0)' }}>
      {/* Newsletter Section */}
      <div className="border-t border-black/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-[24px] md:text-[32px] font-medium tracking-tight text-black mb-2">
                Keep you in the loop.
              </h3>
              <p className="text-[13px] text-black/50">
                Get the latest news, insights directly to your inbox. *
              </p>
            </div>
            <div>
              {!submitted ? (
                <div ref={newsletterFormRef}>
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                    <input
                      ref={newsletterInputRef}
                      type="email"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                      className={`newsletter-input flex-1 rounded-lg border bg-transparent px-4 py-3 text-[13px] text-black placeholder:text-black/30 outline-none focus:border-sage focus:shadow-[0_0_20px_rgba(124,140,110,0.15)] transition-all duration-300 ${emailError ? 'border-red-400' : 'border-black/15'}`}
                    />
                    <button
                      type="submit"
                      className="group flex items-center gap-2 rounded-lg bg-sage px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-sage-hover shrink-0"
                    >
                      JOIN OUR NEWSLETTER
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                  {emailError && <p className="mt-2 text-[11px] text-red-500">{emailError}</p>}
                  <p className="mt-3 text-[10px] text-black/30">By submitting, you agree to our Terms & Service.</p>
                  <p className="text-[10px] text-black/30">* No spam, just awesome updates.</p>
                </div>
              ) : (
                <div
                  ref={newsletterSuccessRef}
                  className="py-4"
                  style={{ animation: 'fadeInUp 0.5s ease forwards' }}
                >
                  <p className="text-[18px] font-medium text-sage">You're on our list.</p>
                  <p className="mt-1 text-[13px] text-black/50">Expect the good stuff — no noise.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation + Links — vine-growth stagger */}
      <div className="border-t border-black/10 py-12">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div ref={navColsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="footer-col">
              <h4 className="mb-4 text-[11px] font-semibold text-black/40">Navigate</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-black/70 transition-colors hover:text-sage"
                    style={{ opacity: 0 }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4 className="mb-4 text-[11px] font-semibold text-black/40">Links</h4>
              <div className="space-y-2.5">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-black/70 transition-colors hover:text-sage"
                    style={{ opacity: 0 }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4 className="mb-4 text-[11px] font-semibold text-black/40">Follow us on socials</h4>
              <div className="flex gap-4 flex-wrap">
                {socialLinks.map((link, i) => (
                  <a
                    key={link.label}
                    ref={(el) => { socialRefs.current[i] = el; }}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-sage transition-colors hover:text-sage-hover"
                    style={{ opacity: 0, willChange: 'transform' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <p className="text-[12px] leading-relaxed text-black/40" style={{ opacity: 0 }}>
                Landscape design, terrace gardens, and outdoor transformations that bring nature closer to you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-black/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            {/* Dotted circle — breathes + rotates */}
            <div className="relative flex h-[140px] w-[140px] items-center justify-center md:h-[180px] md:w-[180px]">
              <div
                ref={circleRef}
                className="absolute inset-0"
                style={{
                  background: `repeating-conic-gradient(from 0deg, #7C8C6E 0deg 2deg, transparent 2deg 8deg)`,
                  borderRadius: '50%',
                  maskImage: 'radial-gradient(circle, transparent 55%, black 56%)',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 56%)',
                  willChange: 'transform',
                }}
              />
              <button
                onClick={scrollToTop}
                className="group relative flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#1A1A17] transition-transform duration-300 hover:scale-105 md:h-[120px] md:w-[120px]"
                aria-label="Back to top"
              >
                <ArrowUp className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-1" />
              </button>
            </div>

            {/* Center: Large Logo — crystallizes into existence */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span
                  ref={logoRef}
                  className="footer-logo text-[32px] md:text-[44px] lg:text-[56px] font-bold tracking-tight text-sage"
                  style={{ opacity: 0, willChange: 'transform, filter' }}
                >
                  Brick &amp; Blooms
                </span>
              </div>
              <p className="mt-2 text-[12px] text-black/40">
                A landscape design studio for terraces, balconies, and outdoor spaces that grow with you.
              </p>
            </div>

            {/* Right: Phone & Socials */}
            <div className="flex flex-col items-center gap-4 md:items-end">
              <a
                href="tel:+911234567890"
                className="text-[18px] font-semibold text-black/70 transition-colors hover:text-sage"
              >
                +91 98765 43210
              </a>
              <div className="flex gap-4">
                {socialLinks.map((link, i) => (
                  <a
                    key={link.label}
                    ref={(el) => { socialRefs.current[socialLinks.length + i] = el; }}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-sage transition-colors hover:text-sage-hover"
                    style={{ opacity: 0, willChange: 'transform' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar — late quiet fade */}
      <div className="border-t border-black/10 py-6">
        <div ref={copyrightRef} className="mx-auto max-w-[1400px] px-6 lg:px-12" style={{ opacity: 0 }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-black/30">© 2026 Brick &amp; Blooms — All gardens, all rights.</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-[11px] text-black/30">Brick &amp; Blooms — Landscape Design Studio</span>
            </div>
            <div className="text-[10px] text-black/25">
              <p><strong>Brick &amp; Blooms</strong></p>
              <p>Terrace &amp; Landscape Studio</p>
              <p>Based in India</p>
            </div>
            <div className="text-[10px] text-black/25">
              <p>hello@brickandblooms.in</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
