export interface Project {
  id: number;
  title: string;
  subtitle: string;
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
    image: '/project-1.svg',
    logo: 'greenview',
    tech: ['Terrace Design', 'Native Planting', 'Drip Irrigation', 'Lightweight Soil', 'LED Lighting'],
    year: '2025',
  },
  {
    id: 2,
    title: 'Oasis Courtyard',
    subtitle: 'Commercial landscape transformation',
    image: '/project-2.svg',
    logo: 'oasis',
    tech: ['Hardscape', 'Water Features', 'Shade Structure', 'Ambient Lighting', 'Seasonal Planting'],
    year: '2025',
  },
  {
    id: 3,
    title: 'Villa Serenity',
    subtitle: 'Estate landscape & outdoor living',
    image: '/project-3.svg',
    logo: 'villa',
    tech: ['Full Estate Design', 'Pool Integration', 'Pathway Systems', 'Mature Trees', 'Smart Irrigation'],
    year: '2026',
  },
];
