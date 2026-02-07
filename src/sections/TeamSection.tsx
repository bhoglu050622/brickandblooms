import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  kpi: string;
  kpiDescription: string;
  image: string;
  initials: string;
}

const team: TeamMember[] = [
  {
    name: 'Tobias Neumann',
    role: 'Founder & CEO',
    kpi: '97%',
    kpiDescription: 'Projects delivered on time under his oversight.',
    image: '/team-tobias.jpg',
    initials: 'TN',
  },
  {
    name: 'Amelia Cross',
    role: 'Head of Strategy',
    kpi: '89%',
    kpiDescription: 'Campaigns hit or exceeded client KPIs.',
    image: '/team-amelia.jpg',
    initials: 'AC',
  },
  {
    name: 'Sofia Reyes',
    role: 'Chief Creative Officer',
    kpi: '120+',
    kpiDescription: 'Brand identities launched across industries.',
    image: '',
    initials: 'SR',
  },
  {
    name: 'Lucas Marino',
    role: 'Technical Director',
    kpi: '3.4x',
    kpiDescription: 'Faster site performance vs industry average.',
    image: '',
    initials: 'LM',
  },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.team-item'),
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
    <section ref={sectionRef} className="w-full bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">THE TEAM</span>
        </div>
        <div className="flex items-start justify-between mb-16">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-white">
              No serious faces. Real serious work.
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-white/50">
              —— We bring sharp strategy and bold ideas, without the stiff boardroom vibe. Professional where it counts, human where it matters.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[14px] font-bold text-white/40">C</span>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {team.map((member, index) => (
            <div key={index} className="team-item group opacity-0">
              {/* KPI tag */}
              <div className="mb-3">
                <span className="text-[10px] font-medium text-coral tracking-[0.1em]">//KPI</span>
              </div>

              {/* KPI stat */}
              <div className="mb-2 text-[36px] md:text-[42px] font-bold leading-none text-white">
                {member.kpi}
              </div>
              <p className="mb-4 text-[11px] leading-relaxed text-white/40">
                {member.kpiDescription}
              </p>

              {/* Name & Role */}
              <h3 className="mb-1 text-[14px] font-semibold text-white">{member.name}</h3>
              <p className="mb-4 text-[11px] text-white/50">{member.role}</p>

              {/* Photo */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#1a1a1a]">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                    <span className="text-[32px] font-bold text-white/20">{member.initials}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="team-item grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-12 opacity-0">
          <div>
            <p className="text-[14px] leading-relaxed text-white/60">
              Our leadership team involved from{' '}
              <span className="text-coral font-semibold">first kickoff to final delivery</span>.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/40">
              Every milestone checked, every detail reviewed, every client kept in the loop. That's how projects land sharp and on time.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-[14px] font-semibold text-white">Discover team Create®</h3>
            <p className="mb-4 text-[12px] leading-relaxed text-white/40">
              Meet the people, culture, and energy that keep our work sharp and our days fun.
            </p>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral transition-colors hover:text-coral-hover"
            >
              Follow us on LinkedIn
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
