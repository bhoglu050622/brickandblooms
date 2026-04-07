export interface Stat {
  value: number;
  suffix: string;
  label: string;
  code: string;
  barWidth: string;
}

export const stats: Stat[] = [
  { value: 10000, suffix: '+', label: 'PLANTS INSTALLED', code: '//001', barWidth: '95%' },
  { value: 50, suffix: '+', label: 'TERRACE & BALCONY GARDENS', code: '//002', barWidth: '80%' },
  { value: 4, suffix: '+', label: 'YEARS OF DESIGN & EXECUTION EXPERTISE', code: '//003', barWidth: '70%' },
  { value: 95, suffix: '%', label: 'PROJECT COMPLETION WITHIN TIMELINE', code: '//004', barWidth: '95%' },
];

export const companyStats = {
  projectsCompleted: '120+',
  yearsExpertise: '4+',
  onTimeDelivery: '95%',
  repeatClients: '90%',
  satisfactionRate: '98%',
  reviewCount: '98',
  rating: '5 / 5',
  plantsInstalled: '10,000+',
};
