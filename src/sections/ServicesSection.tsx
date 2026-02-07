import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  number: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  imageColor: string;
}

const services: Service[] = [
  {
    number: '/01',
    category: 'FOUNDATION',
    title: 'Brand Identity',
    description: 'The foundation of every project — how your brand looks, feels, and communicates.',
    features: [
      'Positioning and messaging frameworks',
      'Visual identity systems',
      'Brand guidelines for consistent use',
      'Digital-first brand systems',
      'Branded assets across campaigns and touchpoints',
    ],
    imageColor: 'from-orange-600 to-red-800',
  },
  {
    number: '/02',
    category: 'GROWTH',
    title: 'Strategy',
    description: 'Clear direction backed by insight and planning to move from idea to execution.',
    features: [
      'Market and audience research',
      'Product and campaign strategy',
      'User journey mapping',
      'Roadmaps and rollout planning',
      'Workshops and alignment sessions',
    ],
    imageColor: 'from-teal-600 to-blue-800',
  },
  {
    number: '/03',
    category: 'CREATIVE',
    title: 'Design & Innovation',
    description: 'From first concepts to polished products that people want to use and share.',
    features: [
      'UX and UI design',
      'Prototyping and user testing',
      'Digital product and service design',
      'Iteration and validation',
      'Launch planning and support',
    ],
    imageColor: 'from-gray-600 to-gray-900',
  },
  {
    number: '/04',
    category: 'SMART AI',
    title: 'AI Systems',
    description: 'Practical applications of AI to unlock smarter products and workflows.',
    features: [
      'Define AI vision and roadmap',
      'Intelligent experience design',
      'Prototyping and proof-of-concepts',
      'Integration into platforms and workflows',
      'Team enablement and training',
    ],
    imageColor: 'from-purple-600 to-indigo-800',
  },
  {
    number: '/05',
    category: 'DISCOVERABLE',
    title: 'SEO',
    description: 'Making your brand findable, visible, and competitive in search.',
    features: [
      'Technical site audit',
      'Keyword research and content strategy',
      'On-page and metadata optimisation',
      'Link-building and authority growth',
      'Performance tracking and reporting',
    ],
    imageColor: 'from-blue-600 to-cyan-800',
  },
  {
    number: '/06',
    category: 'BUILD',
    title: 'Development',
    description: 'Turning ideas and designs into scalable, functional, and reliable digital products.',
    features: [
      'Web and app development',
      'CMS integration and setup',
      'E-commerce builds and optimisation',
      'Custom feature development',
      'Ongoing technical support',
    ],
    imageColor: 'from-gray-700 to-black',
  },
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.service-item'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="studio" className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40">
          What we do best, and what your next project needs most.
        </div>
        <h2 className="mb-16 text-[48px] md:text-[72px] font-medium leading-none tracking-tight text-black/10">
          services
        </h2>

        {/* Services List */}
        <div className="divide-y divide-black/10">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-item group grid grid-cols-1 gap-6 py-10 opacity-0 transition-colors duration-300 hover:bg-black/[0.02] lg:grid-cols-12 lg:gap-8"
            >
              {/* Image placeholder */}
              <div className="lg:col-span-3">
                <div className={`aspect-[4/3] w-full rounded-xl bg-gradient-to-br ${service.imageColor} overflow-hidden`}>
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-white/20 text-[40px] font-bold">{service.number}</span>
                  </div>
                </div>
              </div>

              {/* Category + Title + Description */}
              <div className="lg:col-span-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
                    {service.category}
                  </span>
                  <span className="text-[10px] font-medium text-black/30">
                    {service.number.replace('/', '/0')}
                  </span>
                </div>
                <h3 className="mb-3 text-[28px] md:text-[36px] font-medium leading-tight tracking-tight text-black">
                  {service.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-black/50">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              <div className="lg:col-span-4">
                <div className="space-y-2.5">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-[12px] font-medium text-coral">+</span>
                      <span className="text-[13px] leading-relaxed text-black/60">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
