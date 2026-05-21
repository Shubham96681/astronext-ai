import heroJagannathTriad from '../assets/generated/hero-jagannath-triad.png';
import pujaItems from '../assets/generated/puja-items.png';
import productChakra from '../assets/generated/product-chakra-bracelet.png';
import productVedic from '../assets/generated/product-vedic-remedy.png';
import productGoldWomen from '../assets/generated/product-gold-bracelet-women.png';
import productGoldMen from '../assets/generated/product-gold-bracelet-men.png';

export type JgProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  descLong: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
};

export const JG_STORE_PRODUCTS: JgProduct[] = [
  {
    id: 101,
    name: 'Divine Jagannath Mahaprasad Plate',
    category: 'Sacred Prasad',
    price: 550,
    desc: 'Dry Mahaprasad (Kanika & Kora Khua) prepared directly in the grand temple hearths of Jagannath Temple, Puri. Blessed spiritual nectar.',
    descLong:
      'Mahaprasad from Shri Jagannath Temple, Puri is among the most sacred offerings in the Vaishnava tradition. This plate includes dry Kanika (sweet rice) and Kora Khua prepared in the temple kitchen (Rosha) under strict ritual supervision. Each batch is blessed before dispatch and packed hygienically for devotees who cannot visit Puri in person. Ideal for family prasad distribution, Ekadashi offerings, and festival annadan.',
    rating: 5.0,
    reviews: 284,
    inStock: true,
    image: pujaItems,
  },
  {
    id: 102,
    name: 'Original Neem Wood Jagannath Murti Set',
    category: 'Sacred Idols',
    price: 3200,
    desc: 'A hand-crafted set of Jagannath, Balabhadra, and Subhadra idols sculpted using sacred Neem wood by hereditary Puri artisans.',
    descLong:
      'Hand-carved by hereditary artisans near Puri using seasoned Neem wood prescribed for deity icons. The set includes Jagannath, Balabhadra, and Subhadra with traditional proportions and natural mineral colours. Suitable for home altar worship; includes care instructions for oiling and storage.',
    rating: 4.9,
    reviews: 156,
    inStock: true,
    image: heroJagannathTriad,
  },
  {
    id: 103,
    name: 'Sacred Puri Dham Chandan Paste',
    category: 'Temple Remedies',
    price: 350,
    desc: 'Original sandalwood paste used in the daily Shringar ritual of Lord Jagannath. Incredibly fragrant, purifying, and calming.',
    descLong:
      'Temple-grade chandan prepared for the daily Shringar of Lord Jagannath. Pure, creamy texture with a long-lasting natural fragrance. Use for deity worship, tilak, and festival abhishek. Store in a cool place away from direct sunlight.',
    rating: 4.8,
    reviews: 92,
    inStock: false,
    image: productVedic,
  },
  {
    id: 104,
    name: 'Blessed Jagannath Patachitra Scroll',
    category: 'Sacred Art',
    price: 1850,
    desc: 'Traditional folk painting on cotton canvas depicting the Nabakalebara of the Lord. Painted using purely natural mineral pigments.',
    descLong:
      'Authentic Pattachitra on treated cotton canvas by trained painters from Raghurajpur heritage village. Natural stone and vegetable pigments; motifs depict Nabakalebara and temple lore. Framed ready for wall mounting in puja room or living space.',
    rating: 4.9,
    reviews: 67,
    inStock: true,
    image: productGoldWomen,
  },
  {
    id: 105,
    name: 'Jagannath Temple Tulsi Mala',
    category: 'Spiritual Mala',
    price: 899,
    desc: '108-bead Tulsi mala consecrated at Puri Dham. Ideal for daily japa and devotional chanting.',
    descLong:
      '108 Tulsi beads strung on traditional thread, sanctified at Puri before shipping. Used for Hare Krishna japa, Vishnu sahasranama, and daily sadhana. Each mala is inspected for bead uniformity and knot strength.',
    rating: 4.7,
    reviews: 118,
    inStock: true,
    image: productChakra,
  },
  {
    id: 106,
    name: 'Blessed Jagannath Photo Frame',
    category: 'Sacred Art',
    price: 450,
    desc: 'High-quality framed photograph of Lord Jagannath from the sanctum, blessed for home altar worship.',
    descLong:
      'High-resolution print of Lord Jagannath from the sanctum, set in a durable frame with glass front. Blessed before dispatch for home altar installation. Includes wall-mount hardware and dust cover for transport.',
    rating: 4.8,
    reviews: 203,
    inStock: true,
    image: productGoldMen,
  },
];
