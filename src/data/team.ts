export interface TeamMember {
  name: string;
  role: string;
  kpi: string;
  kpiDescription: string;
  image: string;
  initials: string;
}

export const team: TeamMember[] = [
  {
    name: 'Tobias Neumann',
    role: 'Founder & Lead Designer',
    kpi: '97%',
    kpiDescription: 'Projects delivered on time under his oversight.',
    image: '/team-tobias.jpg',
    initials: 'TN',
  },
  {
    name: 'Amelia Cross',
    role: 'Head of Landscape Design',
    kpi: '50+',
    kpiDescription: 'Terrace and balcony gardens designed and installed.',
    image: '/team-amelia.jpg',
    initials: 'AC',
  },
  {
    name: 'Sofia Reyes',
    role: 'Project Manager',
    kpi: '120+',
    kpiDescription: 'Landscape projects managed from concept to handover.',
    image: '',
    initials: 'SR',
  },
  {
    name: 'Lucas Marino',
    role: 'Horticulture Specialist',
    kpi: '10k+',
    kpiDescription: 'Plants selected, sourced, and installed across projects.',
    image: '',
    initials: 'LM',
  },
];
