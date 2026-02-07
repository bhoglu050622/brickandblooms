import { useEffect, useRef } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorRole: string;
  authorInitials: string;
  date: string;
}

const posts: BlogPost[] = [
  {
    title: 'Rethinking Product Design with Intelligence',
    excerpt: 'A SaaS product team approached us with an AI add-on. The challenge was to rethink AI not as a widget but as a foundation for smarter systems.',
    image: '/blog-ai-design.jpg',
    author: 'Lucas Marino',
    authorRole: 'Technical Director',
    authorInitials: 'LM',
    date: 'Jul 30, 2025',
  },
  {
    title: 'Digital Identities Across Cultures',
    excerpt: 'Numeriq approached us to redefine their online presence. The challenge was balancing their street-level origins with their luxury aspirations.',
    image: '/blog-digital-identity.jpg',
    author: 'Edward Bright',
    authorRole: 'Marketing Lead',
    authorInitials: 'EB',
    date: 'Jul 25, 2025',
  },
  {
    title: 'Architecture in the Digital Age',
    excerpt: 'An architecture studio wanted its online presence to feel as ambitious as its buildings. The challenge was to move beyond static portfolios and reflect authority and vision.',
    image: '/blog-architecture.jpg',
    author: 'Mark Miller',
    authorRole: 'Creative Lead',
    authorInitials: 'MM',
    date: 'Jul 20, 2025',
  },
  {
    title: 'The Future of E-Mobility Marketing from Lindholm',
    excerpt: 'Lindholm launched Aspen® 877, a new e-bike. The challenge was positioning it as both a lifestyle product and a piece of cutting-edge mobility tech.',
    image: '/blog-emobility.jpg',
    author: 'Matthew Parker',
    authorRole: 'Head of Product',
    authorInitials: 'MP',
    date: 'Jul 15, 2025',
  },
  {
    title: 'How Automotive Brands Win Online',
    excerpt: 'An automotive brand asked us to build a digital showroom. The challenge was giving customers an online experience that could rival the thrill of being behind the wheel.',
    image: '/blog-automotive.jpg',
    author: 'Jordan Ellis',
    authorRole: 'UX Strategist',
    authorInitials: 'JE',
    date: 'Dec 7, 2025',
  },
];

const BlogSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.blog-item'),
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
    <section ref={sectionRef} id="whispers" className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">WHISPERS</span>
        </div>
        <div className="flex items-start justify-between mb-16">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-black">
              What bubbles up needs to be shared
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-black/50">
              —— From new launches to design explorations and team experiments, this is where ideas take shape and stories unfold.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-black/20 flex items-center justify-center">
              <span className="text-[14px] font-bold text-black/30">C</span>
            </div>
          </div>
        </div>

        {/* Top row: Info card + Featured post */}
        <div className="blog-item grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 opacity-0">
          {/* Whispers info card */}
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-8">
            <h3 className="mb-2 text-[18px] font-medium text-black">
              Whispers - Blog
            </h3>
            <p className="mb-4 text-[13px] text-black/40">From small sparks to big ideas.</p>
            <p className="mb-6 text-[12px] leading-relaxed text-black/50">
              Articles, notes on creativity, strategy and making things work.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Plus className="h-3 w-3 text-coral" />
                <span className="text-[11px] text-black/50">Studio projects and case studies</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-3 w-3 text-coral" />
                <span className="text-[11px] text-black/50">Notes on design and process</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-3 w-3 text-coral" />
                <span className="text-[11px] text-black/50">Ideas, insights, and inspiration</span>
              </div>
            </div>
          </div>

          {/* Featured post */}
          <div className="lg:col-span-2 group cursor-pointer">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1a1a1a]">
              <img
                src={posts[0].image}
                alt={posts[0].title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{posts[0].authorInitials}</span>
                  </div>
                  <span className="text-[11px] text-white/70">{posts[0].author}</span>
                  <span className="text-[11px] text-white/40">{posts[0].authorRole}</span>
                  <span className="text-[11px] text-white/30">{posts[0].date}</span>
                </div>
                <h3 className="mb-2 text-[22px] font-semibold text-white leading-tight">
                  {posts[0].title}
                </h3>
                <p className="text-[12px] text-white/50 line-clamp-2">
                  {posts[0].excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {posts.slice(1).map((post, i) => (
            <div key={i} className="blog-item group cursor-pointer opacity-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f0f0f0] mb-3">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-gray-600">{post.authorInitials}</span>
                </div>
                <span className="text-[10px] font-medium text-black/50">{post.author}</span>
                <span className="text-[10px] text-black/30">{post.authorRole}</span>
              </div>
              <span className="text-[10px] text-black/30 mb-1 block">{post.date}</span>
              <h4 className="mb-1 text-[14px] font-semibold text-black leading-tight group-hover:text-coral transition-colors">
                {post.title}
              </h4>
              <p className="text-[11px] text-black/40 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>

        {/* More Whispers button */}
        <div className="blog-item flex justify-center opacity-0">
          <a
            href="#"
            className="group flex items-center gap-2.5 rounded-xl border border-black/15 bg-transparent px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-black transition-all duration-250 hover:border-black/30 hover:bg-black/[0.03]"
          >
            More Whispers
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-black px-1.5 text-[10px] font-bold text-white">
              7
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
