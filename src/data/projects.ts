export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  logo: string;
  tech: string[];
  year: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Greenview Terrace',
    subtitle: 'Terrace garden design & installation',
    description: 'A rooftop terrace transformed into a lush green retreat with native species, drip irrigation, and ambient LED lighting designed for year-round enjoyment.',
    image: '/project-aspen.jpg',
    logo: 'greenview',
    tech: ['Terrace Design', 'Native Planting', 'Drip Irrigation', 'Lightweight Soil', 'LED Lighting'],
    year: '2025',
  },
  {
    id: 2,
    title: 'Oasis Courtyard',
    subtitle: 'Commercial landscape transformation',
    description: 'A sun-drenched commercial courtyard reimagined with flowing water features, shade structures, and seasonal planting beds that welcome visitors through every season.',
    image: '/project-aurelis.jpg',
    logo: 'oasis',
    tech: ['Hardscape', 'Water Features', 'Shade Structure', 'Ambient Lighting', 'Seasonal Planting'],
    year: '2025',
  },
  {
    id: 3,
    title: 'Villa Serenity',
    subtitle: 'Estate landscape & outdoor living',
    description: 'A sprawling estate landscape integrating mature trees, stone pathways, pool surroundings, and smart irrigation into a seamless outdoor living experience.',
    image: '/project-blackwell.jpg',
    logo: 'villa',
    tech: ['Full Estate Design', 'Pool Integration', 'Pathway Systems', 'Mature Trees', 'Smart Irrigation'],
    year: '2026',
  },
];
