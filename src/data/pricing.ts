export interface PricingPlan {
  number: string;
  name: string;
  tier: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  extras: string[];
  timeline: string;
  color: string;
}

export const plans: PricingPlan[] = [
  {
    number: '01',
    name: 'Budget-Friendly',
    tier: 'Essential',
    subtitle: 'For balconies and compact spaces',
    price: '$2,800',
    originalPrice: '$3,500',
    description: 'Simple, fast, and effective, so you can focus on growing your business.',
    features: [
      'Brand & Identity starter kit',
      'Website design (core pages)',
      'Standard revisions',
      'SEO setup essentials',
      'Unlimited stock images',
    ],
    extras: [
      'Clear milestones from start to finish',
      'We keep you in the loop',
      'Feedback built into the process',
    ],
    timeline: '2-3 weeks',
    color: 'from-sage to-sage/80',
  },
  {
    number: '02',
    name: 'Premium',
    tier: 'Recommended',
    subtitle: 'Full landscape design and execution',
    price: '$6,500',
    originalPrice: '$8,000',
    description: 'A complete package with flexibility, advanced design, and the support you need to grow faster.',
    features: [
      'Extended Branding',
      'Full website design',
      'UX flows & product design',
      'Unlimited revisions',
      'Advanced SEO & content',
      'Priority support response',
      'Final handoff',
    ],
    extras: [
      'Deeper design coverage for complex needs',
      'Unlimited adjustments before launch',
      'Faster responses when you need us most',
    ],
    timeline: '4-6 weeks',
    color: 'from-blue-700 to-blue-900',
  },
  {
    number: '03',
    name: 'Ultra Luxury',
    tier: 'Bespoke',
    subtitle: 'Estate-level design and premium materials',
    price: '$12,000',
    originalPrice: '$15,000',
    description: 'Strategy, design, and dedicated support for complex projects that demand scalability and polish.',
    features: [
      'End-to-end brand strategy',
      'Large-scale website & CMS',
      'Advanced UX & product design',
      'Dedicated senior managers',
      'Advanced micro-interactions',
      'Optimization & support',
      'Enterprise-level handoff',
      'White-glove onboarding experience',
      'Quarterly strategy reviews',
    ],
    extras: [
      'Scalable solutions designed for growth',
      'Dedicated manager guiding every stage with integrations',
      'Long-term support beyond launch',
    ],
    timeline: '6–8 weeks',
    color: 'from-gray-700 to-gray-900',
  },
];

export const pricingPreview = [
  { name: 'Budget-Friendly', subtitle: 'For balconies and compact spaces', color: 'from-sage to-sage/80' },
  { name: 'Premium', subtitle: 'Full landscape design and execution', color: 'from-blue-600 to-blue-900' },
  { name: 'Ultra Luxury', subtitle: 'Estate-level design and premium materials', color: 'from-gray-600 to-gray-900' },
];
