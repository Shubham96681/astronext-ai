export type JgProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
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
    rating: 5.0,
    reviews: 284,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568fa7098?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 102,
    name: 'Original Neem Wood Jagannath Murti Set',
    category: 'Sacred Idols',
    price: 3200,
    desc: 'A hand-crafted set of Jagannath, Balabhadra, and Subhadra idols sculpted using sacred Neem wood by hereditary Puri artisans.',
    rating: 4.9,
    reviews: 156,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544966503-df0fddf8431e?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 103,
    name: 'Sacred Puri Dham Chandan Paste',
    category: 'Temple Remedies',
    price: 350,
    desc: 'Original sandalwood paste used in the daily Shringar ritual of Lord Jagannath. Incredibly fragrant, purifying, and calming.',
    rating: 4.8,
    reviews: 92,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 104,
    name: 'Blessed Jagannath Patachitra Scroll',
    category: 'Sacred Art',
    price: 1850,
    desc: 'Traditional folk painting on cotton canvas depicting the Nabakalebara of the Lord. Painted using purely natural mineral pigments.',
    rating: 4.9,
    reviews: 67,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 105,
    name: 'Jagannath Temple Tulsi Mala',
    category: 'Spiritual Mala',
    price: 899,
    desc: '108-bead Tulsi mala consecrated at Puri Dham. Ideal for daily japa and devotional chanting.',
    rating: 4.7,
    reviews: 118,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 106,
    name: 'Blessed Jagannath Photo Frame',
    category: 'Sacred Art',
    price: 450,
    desc: 'High-quality framed photograph of Lord Jagannath from the sanctum, blessed for home altar worship.',
    rating: 4.8,
    reviews: 203,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e78c4b88?auto=format&fit=crop&q=80&w=400&h=400',
  },
];
