export interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorRole: string;
  authorInitials: string;
  date: string;
}

export const posts: BlogPost[] = [
  {
    title: 'How We Approach Terrace Garden Design in Small Spaces',
    excerpt: 'Compact spaces need smarter planning. We break down how we turn balconies and terraces into functional green retreats without compromising on aesthetics.',
    image: '/blog-ai-design.jpg',
    author: 'Amelia Cross',
    authorRole: 'Head of Landscape Design',
    authorInitials: 'AC',
    date: 'Mar 15, 2026',
  },
  {
    title: 'Choosing the Right Plants for Your Climate Zone',
    excerpt: 'Plant selection makes or breaks a landscape. Here is our approach to picking species that thrive in your specific sunlight, soil, and weather conditions.',
    image: '/blog-digital-identity.jpg',
    author: 'Lucas Marino',
    authorRole: 'Horticulture Specialist',
    authorInitials: 'LM',
    date: 'Feb 28, 2026',
  },
  {
    title: 'Before & After: A Backyard Transformation in 6 Weeks',
    excerpt: 'Follow a real project from first site visit to final planting. See how strategic design and hands-on execution turned an empty lot into a living space.',
    image: '/blog-architecture.jpg',
    author: 'Sofia Reyes',
    authorRole: 'Project Manager',
    authorInitials: 'SR',
    date: 'Feb 10, 2026',
  },
  {
    title: 'Sustainable Landscaping: More Than Just a Trend',
    excerpt: 'Native plants, water-efficient irrigation, and organic soil management are not optional extras — they are how modern landscapes should be built.',
    image: '/blog-emobility.jpg',
    author: 'Tobias Neumann',
    authorRole: 'Founder & Lead Designer',
    authorInitials: 'TN',
    date: 'Jan 20, 2026',
  },
  {
    title: 'Why Lighting Design Matters in Outdoor Spaces',
    excerpt: 'A well-lit garden extends your living space into the evening. We explore how integrated lighting design elevates both safety and ambiance.',
    image: '/blog-automotive.jpg',
    author: 'Amelia Cross',
    authorRole: 'Head of Landscape Design',
    authorInitials: 'AC',
    date: 'Jan 5, 2026',
  },
];
