import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  logo: string;
  tech: string[];
  year: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Aurelis Beach Resort',
    subtitle: 'Hospitality branding and website',
    image: '/project-aurelis.jpg',
    logo: 'aurelis',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Cloudflare CDN'],
    year: '2025',
  },
  {
    id: 2,
    title: 'Blackwell Motors',
    subtitle: 'Automotive digital transformation',
    image: '/project-blackwell.jpg',
    logo: 'blackwell',
    tech: ['React', 'WebGL', 'Node.js', 'AWS Lambda', 'OpenAI Embeddings'],
    year: '2025',
  },
  {
    id: 3,
    title: 'Aspen® 877',
    subtitle: 'E-Mobility brand launch',
    image: '/project-aspen.jpg',
    logo: 'aspen',
    tech: ['Framer', 'Next.js', 'GSAP', 'WebGL', 'Meta Ads integration'],
    year: '2025',
  },
];

const BrandLogo = ({ name }: { name: string }) => {
  const logos: Record<string, React.ReactNode> = {
    aurelis: (
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">A</span>
        </div>
        <span className="text-[13px] font-semibold text-white/90 tracking-wide">aurelis</span>
        <span className="text-[7px] text-white/50 -mt-1">beach<br/>resort</span>
      </div>
    ),
    blackwell: (
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">B</span>
        </div>
        <span className="text-[13px] font-semibold text-white/90 tracking-wide">Blackwell</span>
      </div>
    ),
    aspen: (
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">A</span>
        </div>
        <span className="text-[13px] font-semibold text-white/90 tracking-wide">Aspen® 877</span>
      </div>
    ),
  };
  return <>{logos[name]}</>;
};

const WorkSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.project-card'),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );

      section.querySelectorAll('.project-image').forEach((img) => {
        gsap.to(img, {
          y: '-15%',
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="w-full bg-[#0a0a0a] py-8">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Projects - no header, projects flow directly */}
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card group relative cursor-pointer overflow-hidden rounded-2xl opacity-0"
            >
              {/* Full width image with parallax */}
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <div className="project-image absolute inset-0 h-[130%] w-full">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                {/* Top - Brand Logo */}
                <div>
                  <BrandLogo name={project.logo} />
                </div>

                {/* Center - Title & Subtitle */}
                <div className="flex flex-1 items-end justify-between">
                  <div className="flex-1">
                    {/* Tech stack on left */}
                    <div className="hidden md:flex flex-col gap-1 mb-4">
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium text-white/50 tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center flex-1">
                    <h3 className="mb-2 text-[28px] sm:text-[36px] md:text-[48px] font-bold text-white transition-colors duration-300 group-hover:text-coral leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="flex-1 text-right">
                    <span className="text-[11px] font-medium text-white/40">
                      YR/<br/>{project.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Projects Button */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[11px] font-medium text-white/40">2017-2025</span>
          </div>

          <a
            href="#"
            className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-transparent px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-250 hover:border-white/40 hover:bg-white/[0.03]"
          >
            More Projects
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-white px-1.5 text-[10px] font-bold text-black">
              5
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
