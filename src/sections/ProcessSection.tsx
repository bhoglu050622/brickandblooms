import { useEffect, useRef } from 'react';
import { ArrowRight, Search, Lightbulb, Palette, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    number: '//01',
    title: 'DISCOVERY',
    description: 'We start by listening. Goals, challenges, and vision are mapped out clearly, setting the foundation for everything that follows.',
    icon: Search,
  },
  {
    number: '//02',
    title: 'STRATEGY',
    description: 'With insights in place, we define the roadmap. Positioning, priorities, and the best way to align design and execution.',
    icon: Lightbulb,
  },
  {
    number: '//03',
    title: 'DESIGN & BUILD',
    description: 'Ideas take shape. From visuals to digital experiences, we design and develop with sharp attention to detail.',
    icon: Palette,
  },
  {
    number: '//04',
    title: 'LAUNCH & GROW',
    description: 'Delivery is just the beginning. We measure, refine, and scale to ensure your project continues to perform.',
    icon: Rocket,
  },
];

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.process-item'),
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24"
      style={{
        background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 30%, #2a1050 50%, #3a1060 70%, #1a0a2e 100%)',
      }}
    >
      {/* Abstract gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(60,40,120,0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(180,50,80,0.2) 0%, transparent 40%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
            HOW WE WORK
          </span>
        </div>

        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-white">
              The process behind our success
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-white/50">
              —— We work with clarity, precision. Every step designed to move your project forward with confidence.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[14px] font-bold text-white/40">C</span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left - Process info + Steps */}
          <div>
            {/* Services card */}
            <div className="process-item mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 opacity-0">
              <h3 className="mb-3 text-[20px] font-medium text-white">
                Services built on process, precision, and people.
              </h3>
              <p className="mb-6 text-[13px] leading-relaxed text-white/50">
                We combine strategy, design, content, and technology, giving you a single partner for every stage of your brand's growth.
              </p>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral transition-colors hover:text-coral-hover"
              >
                Chat with our Operations Manager
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Process steps */}
            <div className="space-y-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="process-item rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 opacity-0 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <Icon className="h-4 w-4 text-white/70" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[10px] font-medium text-coral">{step.number}</span>
                          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-[12px] leading-relaxed text-white/50">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Featured Project Card */}
          <div className="process-item opacity-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden h-full">
              {/* Project image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/project-blackwell.jpg"
                  alt="Blackwell Motors"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border border-white/30 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white">B</span>
                  </div>
                  <span className="text-[12px] font-semibold text-white">Blackwell Motors</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <p className="mb-4 text-[12px] leading-relaxed text-white/60">
                  Step inside one of our featured projects. From first brief to launch, follow the process that shows what makes Create® different.
                </p>

                <div className="mb-4">
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">
                    Our process in motion
                  </h4>
                  <p className="text-[12px] leading-relaxed text-white/50">
                    Explore a real case where strategy, design, and delivery lined up exactly as we work today.
                  </p>
                </div>

                <a
                  href="#"
                  className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral transition-colors hover:text-coral-hover"
                >
                  Explore Case Studies
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
