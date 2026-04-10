import { useEffect, useRef } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicReveal, photoReveal, breatheScale } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

import { posts } from '@/data/blog';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function scrambleOnce(element: HTMLElement, duration = 400) {
  const original = element.textContent || '';
  let iteration = 0;
  const total = Math.ceil(duration / 30);
  const interval = setInterval(() => {
    element.textContent = original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < Math.floor((iteration / total) * original.length)) return original[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    iteration++;
    if (iteration > total) {
      element.textContent = original;
      clearInterval(interval);
    }
  }, 30);
  return () => clearInterval(interval);
}

const BlogSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredImgRef = useRef<HTMLImageElement>(null);
  const featuredContainerRef = useRef<HTMLDivElement>(null);
  const featuredTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const contexts: gsap.Context[] = [];
    const cleanups: (() => void)[] = [];

    if (prefersReduced) {
      section.querySelectorAll('.blog-item').forEach((el) => gsap.set(el, { opacity: 1 }));
      return;
    }

    const ctx = gsap.context(() => {
      // Featured post: cinematic reveal (top-down curtain + image scale)
      const featContainer = featuredContainerRef.current;
      if (featContainer) {
        const cinCtx = cinematicReveal(featContainer, section, {
          direction: 'top',
          duration: 1.4,
          start: 'top 90%',
        });
        contexts.push(cinCtx);
      }

      // Featured title: scramble on section enter
      const featTitle = featuredTitleRef.current;
      if (featTitle) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            setTimeout(() => { scrambleOnce(featTitle, 400); }, 300);
          },
        });
      }

      // Featured post image: Ken Burns breathing after reveal
      const featImg = featuredImgRef.current;
      if (featImg) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            setTimeout(() => {
              const cleanup = breatheScale(featImg, { min: 1.0, max: 1.04, duration: 8 });
              cleanups.push(cleanup);
            }, 1400);
          },
        });
      }

      // Grid posts: photo-develop (grayscale → color)
      const gridItems = section.querySelectorAll('.blog-grid-item');
      gridItems.forEach((item, i) => {
        const photoCtx = photoReveal(item, section, {
          duration: 0.9,
          start: 'top 75%',
          delay: i * 0.12,
        });
        contexts.push(photoCtx);

        // Title scramble on enter
        const title = item.querySelector('.post-title') as HTMLElement;
        if (title) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            once: true,
            onEnter: () => {
              setTimeout(() => { scrambleOnce(title, 350); }, i * 120 + 200);
            },
          });
        }
      });

      // Category tags: spring pop
      section.querySelectorAll('.category-tag').forEach((tag, i) => {
        gsap.fromTo(tag,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.3,
            ease: 'back.out(3)',
            delay: i * 0.12 + 0.3,
            scrollTrigger: { trigger: section, start: 'top 75%', once: true },
          }
        );
      });

      // More button
      const moreBtn = section.querySelector('.more-btn');
      if (moreBtn) {
        gsap.fromTo(moreBtn,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: moreBtn, start: 'top 85%' },
          }
        );
      }
    }, section);

    return () => {
      ctx.revert();
      contexts.forEach((c) => c.revert());
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section ref={sectionRef} id="whispers" className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">WHISPERS</span>
        </div>
        <div className="flex items-start justify-between mb-8 lg:mb-16">
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
              <span className="text-[10px] font-bold text-black/30">B&B</span>
            </div>
          </div>
        </div>

        {/* Top row: Info card + Featured post */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Whispers info card */}
          <div className="blog-item hidden lg:block rounded-2xl border border-black/10 bg-black/[0.02] p-8" style={{ opacity: 0 }}>
            <h3 className="mb-2 text-[18px] font-medium text-black">Whispers - Blog</h3>
            <p className="mb-4 text-[13px] text-black/40">From small sparks to big ideas.</p>
            <p className="mb-6 text-[12px] leading-relaxed text-black/50">
              Articles, notes on creativity, strategy and making things work.
            </p>
            <div className="space-y-2">
              {[
                'Studio projects and case studies',
                'Notes on design and process',
                'Ideas, insights, and inspiration',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Plus className="h-3 w-3 text-sage" />
                  <span className="text-[11px] text-black/50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured post: cinematic reveal */}
          <div
            ref={featuredContainerRef}
            className="col-span-1 lg:col-span-2 group cursor-pointer"
            style={{ opacity: 0 }}
            data-cursor-type="leaf"
            data-cursor-hover
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#2A2A25]">
              <img
                ref={featuredImgRef}
                src={posts[0].image}
                alt={posts[0].title}
                className="h-full w-full object-cover"
                style={{ willChange: 'transform' }}
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
                <h3 ref={featuredTitleRef} className="mb-2 text-[22px] font-semibold text-white leading-tight">
                  {posts[0].title}
                </h3>
                <p className="text-[12px] text-white/50 line-clamp-2">{posts[0].excerpt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Post grid: darkroom develop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {posts.slice(1).map((post, i) => (
            <div
              key={i}
              className="blog-grid-item group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              style={{ opacity: 0.3, filter: 'grayscale(100%) brightness(0.5)', willChange: 'filter' }}
              data-cursor-type="leaf"
              data-cursor-hover
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f0f0f0] mb-3">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Category tag */}
                <div className="absolute top-2 left-2">
                  <span className="category-tag inline-block bg-white/90 px-2 py-0.5 rounded text-[9px] font-semibold text-black/70" style={{ opacity: 0 }}>
                    Design
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-gray-600">{post.authorInitials}</span>
                </div>
                <span className="text-[10px] font-medium text-black/50">{post.author}</span>
                <span className="text-[10px] text-black/30">{post.authorRole}</span>
              </div>
              <span className="text-[10px] text-black/30 mb-1 block">{post.date}</span>
              <h4 className="post-title mb-1 text-[14px] font-semibold text-black leading-tight group-hover:text-sage transition-colors">
                {post.title}
              </h4>
              <p className="text-[11px] text-black/40 line-clamp-2">{post.excerpt}</p>
            </div>
          ))}
        </div>

        {/* More button */}
        <div className="more-btn flex justify-center opacity-0">
          <a
            href="#"
            className="group flex items-center gap-2.5 rounded-xl border border-black/15 bg-transparent px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-black transition-all duration-250 hover:border-black/30 hover:bg-black/[0.03]"
          >
            More Whispers
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-black px-1.5 text-[10px] font-bold text-white">7</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
