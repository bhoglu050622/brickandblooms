export interface Service {
  number: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  imageColor: string;
  image: string;
}

export const services: Service[] = [
  {
    number: '/01',
    category: 'LANDSCAPE',
    title: 'Landscape Design',
    description: 'The foundation of every great outdoor space — where vision meets thoughtful planning.',
    features: [
      'Site analysis & space assessment',
      'Conceptual landscape planning',
      '2D & 3D design visualization',
      'Plant selection & zoning',
      'Sustainable design solutions',
    ],
    imageColor: 'from-sage to-terracotta',
    image: '/service-landscape.svg',
  },
  {
    number: '/02',
    category: 'TERRACE & BALCONY',
    title: 'Terrace & Balcony Gardens',
    description: 'Turning compact spaces into lush, livable environments.',
    features: [
      'Terrace garden design',
      'Balcony garden styling',
      'Lightweight soil systems',
      'Irrigation planning',
      'Space-optimized plant layouts',
    ],
    imageColor: 'from-teal-600 to-blue-800',
    image: '/service-terrace.svg',
  },
  {
    number: '/03',
    category: 'EXECUTION',
    title: 'Execution & Project Management',
    description: 'From blueprint to bloom — we handle everything.',
    features: [
      'End-to-end execution',
      'Material sourcing & coordination',
      'On-site supervision',
      'Timeline & quality control',
      'Vendor management',
    ],
    imageColor: 'from-gray-600 to-gray-900',
    image: '/service-execution.svg',
  },
  {
    number: '/04',
    category: 'TRANSFORMATIONS',
    title: 'Outdoor Transformations',
    description: 'Enhancing residential and commercial outdoor environments.',
    features: [
      'Backyard landscaping',
      'Lawn development',
      'Hardscape & pathway design',
      'Water features & focal elements',
      'Lighting integration',
    ],
    imageColor: 'from-purple-600 to-indigo-800',
    image: '/service-outdoor.svg',
  },
  {
    number: '/05',
    category: 'CARE',
    title: 'Maintenance & Plant Care',
    description: 'Keeping your landscape thriving long after installation.',
    features: [
      'Routine garden maintenance',
      'Plant health monitoring',
      'Seasonal replanting',
      'Soil & irrigation management',
      'Landscape upgrades',
    ],
    imageColor: 'from-blue-600 to-cyan-800',
    image: '/service-maintenance.svg',
  },
  {
    number: '/06',
    category: 'CONSULTATION',
    title: 'Consultation & Custom Solutions',
    description: 'Tailored solutions for unique spaces and visions.',
    features: [
      'Landscape consultation',
      'Space optimization planning',
      'Commercial landscaping strategy',
      'Sustainable planting guidance',
      'Custom garden concepts',
    ],
    imageColor: 'from-gray-700 to-black',
    image: '/service-consultation.svg',
  },
];
