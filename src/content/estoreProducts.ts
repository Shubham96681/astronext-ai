import productImg1 from '@/assets/generated/product-chakra-bracelet.png';
import productImg2 from '@/assets/generated/product-vedic-remedy.png';
import productImg3 from '@/assets/generated/product-gold-bracelet-women.png';
import productImg4 from '@/assets/generated/product-gold-bracelet-men.png';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  desc: string;
  rating: number;
  iconBg: string;
  iconText: string;
  image?: string;
}

export const estoreProducts: Product[] = [
  {
    id: 1,
    name: '7 Chakra x Rudraksha Bands - Free Size Bracelet',
    category: 'gemstone',
    price: 399,
    originalPrice: 799,
    discount: '60% Off',
    desc: 'Authentic 7 Chakra gemstones combined with pure five-faced Rudraksha beads. Aids energy centering, mental clarity, and spiritual grounding.',
    rating: 4.9,
    iconBg: 'radial-gradient(circle, #3d5afe 0%, #1a237e 100%)',
    iconText: '📿',
    image: productImg1.src,
  },
  {
    id: 2,
    name: 'Dr. V Brahmachari',
    category: 'remedy',
    price: 24999,
    desc: 'Exclusive personalized Vedic remedy protocol designed by Dr. V Brahmachari. Includes planetary shanti homams and certified energized gemstones.',
    rating: 5.0,
    iconBg: 'radial-gradient(circle, #ffee58 0%, #fbc02d 100%)',
    iconText: '🕉️',
    image: productImg2.src,
  },
  {
    id: 3,
    name: 'Gold Plated Cubio Rudraksha Bracelet For Women',
    category: 'sacred',
    price: 699,
    originalPrice: 899,
    discount: '20% Off',
    desc: 'A gorgeous designer gold-plated bracelet accented with premium Nepalese Rudraksha beads. Elegant accessory carrying protective cosmic energy.',
    rating: 4.8,
    iconBg: 'radial-gradient(circle, #ff8a65 0%, #d84315 100%)',
    iconText: '✨',
    image: productImg3.src,
  },
  {
    id: 4,
    name: 'Gold Plated Essential Rudraksha Bracelet',
    category: 'gemstone',
    price: 899,
    originalPrice: 1499,
    discount: '40% Off',
    desc: 'Traditional high-polish gold plated bracelet inlaid with premium original Rudraksha. Stabilizes active blood pressure and calms thoughts.',
    rating: 4.9,
    iconBg: 'radial-gradient(circle, #a1887f 0%, #5d4037 100%)',
    iconText: '🔱',
    image: productImg4.src,
  },
];
