export interface Puja {
  id: number;
  title: string;
  price: string;
  duration: string;
  priests: number;
  benefits: string[];
}

export const pujasList: Puja[] = [
  {
    id: 201,
    title: 'Maha Mrityunjaya Puja',
    price: '₹8,500',
    duration: '4 Hours',
    priests: 3,
    benefits: [
      'Promotes longevity & sound health',
      'Eliminates terminal fears',
      'Purges severe negative planetary configurations',
    ],
  },
  {
    id: 202,
    title: 'Lakshmi Kuber Maha Yajna',
    price: '₹11,000',
    duration: '5 Hours',
    priests: 5,
    benefits: [
      'Invokes infinite wealth & business expansion',
      'Clears persistent financial debts',
      'Brings prosperity & harmony home',
    ],
  },
  {
    id: 203,
    title: 'Navgrah Shanti Puja',
    price: '₹6,200',
    duration: '3 Hours',
    priests: 2,
    benefits: [
      'Balances all nine astronomical bodies',
      'Resolves career roadblocks',
      'Mitigates Sade Sati & Kaal Sarp Dosha effects',
    ],
  },
];
