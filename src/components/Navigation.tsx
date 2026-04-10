import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const navItems = [
  { label: 'Projects', href: '#work' },
  { label: 'Services', href: '#studio' },
  { label: 'Insights', href: '#whispers' },
  { label: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const bubbleRef = useRef<HTMLElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const links = mobileLinksRef.current?.querySelectorAll('.mobile-link');
      if (links) {
        gsap.fromTo(
          links,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15 }
        );
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Bubble Nav — iOS Dynamic Island style */}
      <nav
        ref={bubbleRef}
        className={`fixed top-4 left-4 sm:left-1/2 sm:-translate-x-1/2 z-50 transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}
      >
        <div className="flex items-center gap-0.5 sm:gap-1 rounded-full bg-[#1A1A17]/80 backdrop-blur-2xl border border-white/10 px-1.5 py-1 sm:px-2 sm:py-1.5 shadow-2xl shadow-black/30 max-w-[95vw]">
          {/* Logo pill */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center rounded-full bg-sage/15 px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-300 hover:bg-sage/25 hover:scale-105"
          >
            <span className="text-[12px] sm:text-[13px] font-bold tracking-tight text-sage">B&B</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="rounded-full px-4 py-2 text-[12px] font-medium text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-0 after:bg-sage after:transition-all after:duration-300 hover:after:w-4 after:rounded-full"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA pill */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="hidden md:flex items-center rounded-full bg-sage px-4 py-2 text-[12px] font-semibold text-white transition-colors duration-200 hover:bg-sage-hover"
          >
            Get a Quote
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center rounded-full w-8 h-8 text-white/70 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#1A1A17]/95 backdrop-blur-xl transition-all duration-400 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          ref={mobileLinksRef}
          className="flex flex-col items-center justify-center h-full gap-6"
        >
          {navItems.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="mobile-link text-[22px] md:text-[28px] font-bold uppercase tracking-tight text-white opacity-0 transition-colors hover:text-sage"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="mobile-link mt-4 rounded-full bg-sage px-8 py-3 text-[14px] font-semibold text-white opacity-0 transition-colors hover:bg-sage-hover"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </>
  );
};

export default Navigation;
