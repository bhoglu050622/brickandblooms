import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "They didn't just hit the brief, they raised it. The project felt collaborative from start to finish, with clear updates, quick turns, and a final product that carried our brand further than we imagined.",
    name: 'Samuel Laronde',
    role: 'Marketing Lead',
    company: 'Lindholm',
    initials: 'SL',
    date: 'September 2025',
  },
  {
    quote: "From kickoff to launch, the process was fast-moving but never chaotic. Create kept everyone in the loop, solved issues before they became problems, and shipped exactly when they said they would.",
    name: 'Matthew Parker',
    role: 'Head of Product',
    company: 'Monolith',
    initials: 'MP',
    date: 'September 2025',
  },
  {
    quote: "They didn't just design a website, they built a framework we can grow with. Every decision was backed with clarity, and the final product looks polished while staying practical for our team.",
    name: 'Maya Chen',
    role: 'Brand Manager',
    company: 'Vornberg',
    initials: 'MC',
    date: 'September 2025',
  },
  {
    quote: "They don't just deliver a project and walk away. The team stayed close, fixed details on the fly, and made sure launch was smooth.",
    name: 'Mark Miller',
    role: 'Creative Lead',
    company: 'Wendrich',
    initials: 'MM',
    date: 'September 2025',
  },
  {
    quote: "Working with Create felt effortless. They understood our vision from day one and kept us aligned through clear milestones. The end result was a site that actually elevated our brand voice, not just dressed it up.",
    name: 'Jordan Ellis',
    role: 'Creative Director',
    company: 'Blackwell',
    initials: 'JE',
    date: 'September 2025',
  },
  {
    quote: "Every meeting felt productive, every deadline was hit, and the end result nailed our brand better than we could describe.",
    name: 'Rachel Morgan',
    role: 'Head of Design',
    company: 'Aurelis',
    initials: 'RM',
    date: 'September 2025',
  },
  {
    quote: "Create took our messy brief and turned it into a site we're proud to show. Fast, sharp, and no overthinking.",
    name: 'Edward Bright',
    role: 'Marketing Lead',
    company: 'Madison Square',
    initials: 'EB',
    date: 'September 2025',
  },
  {
    quote: "Create has a rare balance of speed and detail. They made complex flows simple, turned feedback into quick iterations, and delivered a product that's both user-friendly and brand-right.",
    name: 'Margaret Brooks',
    role: 'UX Lead',
    company: 'Morisson',
    initials: 'MB',
    date: 'September 2025',
  },
];

const clientLogos = ['Obliqon', 'Lindholm', 'Vornberg', 'Wendrich', 'Blackwell', 'Aurelis', 'Madison', 'Morisson'];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.test-item'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollAmount = 360;
    const newPos = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    carousel.scrollTo({ left: newPos, behavior: 'smooth' });
    setScrollPosition(newPos);
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#0a0a0a] py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header area */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">What our clients say</span>
        </div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-[20px] font-medium text-white">Partnerships that last, results that stick.</h3>
            <p className="mt-1 text-[13px] text-white/50">
              From kickoff to launch, brands trust us to stay close, adapt fast, and deliver without any drama.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-coral text-coral" />
              ))}
            </div>
            <span className="text-[12px] font-semibold text-white">5 / 5</span>
            <span className="text-[11px] text-white/40">(98 reviews)</span>
          </div>
        </div>
        <p className="mb-4 text-[11px] text-white/30">
          Backed by feedback from <strong className="text-white/50">120+</strong> brands we've worked with.
        </p>
        <a
          href="#"
          className="group inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:border-white/40 hover:bg-white/[0.03] mb-12"
        >
          WRITE A REVIEW
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </a>

        {/* Spotlight - Featured testimonial */}
        <div className="test-item mb-12 opacity-0">
          <div className="mb-4">
            <span className="text-[72px] md:text-[100px] lg:text-[140px] font-bold leading-none text-white/[0.04] select-none">
              Spotlight
            </span>
          </div>

          <div className="rounded-2xl bg-[#111] border border-white/10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <span className="text-white font-bold text-[18px]">SL</span>
              </div>
            </div>
            {/* Quote */}
            <div>
              <p className="text-[16px] md:text-[18px] leading-relaxed text-white/80 italic mb-6">
                "{testimonials[0].quote}"
              </p>
              <div>
                <p className="text-[14px] font-semibold text-white">{testimonials[0].name}</p>
                <p className="text-[12px] text-white/50">{testimonials[0].role}</p>
                <p className="text-[12px] text-white/30">{testimonials[0].company}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client logos marquee */}
        <div className="test-item mb-12 overflow-hidden opacity-0">
          <div className="flex animate-marquee gap-12 whitespace-nowrap items-center">
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0 opacity-40">
                <div className="h-5 w-5 rounded-full border border-white/30 flex items-center justify-center">
                  <span className="text-[7px] text-white font-bold">{logo[0]}</span>
                </div>
                <span className="text-[12px] font-semibold text-white tracking-wide">{logo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials carousel */}
        <div className="test-item opacity-0">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="shrink-0 w-[320px] md:w-[360px] rounded-xl border border-white/10 bg-[#111] p-6 snap-start"
              >
                <div className="mb-3 text-[10px] text-white/30">{t.date}</div>
                <p className="mb-4 text-[13px] leading-relaxed text-white/70 italic line-clamp-4">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                    <span className="text-white font-bold text-[9px]">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white">{t.name}</p>
                    <p className="text-[10px] text-white/40">{t.role}</p>
                    <p className="text-[10px] text-white/25">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => scroll('left')}
              className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white/50" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-white/50" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
