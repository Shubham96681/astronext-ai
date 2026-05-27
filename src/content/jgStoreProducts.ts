export type ProductSpec = {
  title: string;
  description: string;
};

export type PdpPerk = {
  title: string;
  subtitle: string;
};

export type PdpAuthenticity = {
  title: string;
  description: string;
};

export type PdpBenefitIcon = 'leaf' | 'sun' | 'shield' | 'eye' | 'sparkles' | 'heart';

export type PdpWhyWear = {
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  intro: string;
  benefits: { icon: PdpBenefitIcon; title: string; description: string }[];
};

export type PdpWearingMantra = {
  eyebrow?: string;
  /** Large decorative Om shown above the mantra line. */
  omSymbol?: string;
  mantra?: string;
  transliteration?: string;
  practice: string;
};

export type PdpCareRitual = {
  eyebrow?: string;
  headline: string;
  intro: string;
  steps: { title: string; description: string }[];
};

export type PdpReview = {
  rating: number;
  title: string;
  text: string;
  author?: string;
  date?: string;
};

export type PdpReviewDistribution = {
  stars: number;
  count: number;
};

export type PdpFaq = {
  question: string;
  answer: string;
};

export type JgProduct = {
  id: number;
  handle: string;
  name: string;
  category: string;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  desc: string;
  descLong: string;
  aboutParagraphs: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  images: string[];
  image: string;
  priceNote?: string;
  trustBullets?: string[];
  specs?: ProductSpec[];
  eyebrow?: string;
  displayName?: string;
  tagline?: string;
  authenticity?: PdpAuthenticity;
  perks?: PdpPerk[];
  galleryBadge?: string;
  whyWear?: PdpWhyWear;
  wearingMantra?: PdpWearingMantra;
  careRitual?: PdpCareRitual;
  reviewsList?: PdpReview[];
  reviewDistribution?: PdpReviewDistribution[];
  faqs?: PdpFaq[];
};

export type DivineStoreCatalogFile = {
  version: number;
  collectionTitle: string;
  collectionHandle: string;
  updatedAt: string;
  products: JgProduct[];
};
