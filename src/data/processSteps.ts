import { Search, Lightbulb, Palette, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const processSteps: ProcessStep[] = [
  {
    number: '//01',
    title: 'DISCOVERY',
    description: 'We begin by understanding your space, lifestyle, and vision. Site visits, soil study, sunlight patterns, and functional needs are carefully mapped before design begins.',
    icon: Search,
  },
  {
    number: '//02',
    title: 'PLANNING & DESIGN',
    description: 'With insights in place, we create thoughtful landscape concepts. Layouts, plant selection, zoning, irrigation planning, and 3D visualizations ensure clarity before execution.',
    icon: Lightbulb,
  },
  {
    number: '//03',
    title: 'EXECUTION & BUILD',
    description: 'Design comes to life with precision. From sourcing materials to on-site supervision, we manage every detail to ensure quality and timeline control.',
    icon: Palette,
  },
  {
    number: '//04',
    title: 'GROW & MAINTAIN',
    description: 'Installation is just the beginning. We guide plant care, maintenance schedules, and seasonal upgrades to ensure your landscape thrives long-term.',
    icon: Rocket,
  },
];
