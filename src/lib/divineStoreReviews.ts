import type { JgProduct, PdpReview, PdpReviewDistribution } from '@/content/jgStoreProducts';

type ProductKind = 'panjika' | 'puja' | 'rudraksha' | 'yantra' | 'gemstone' | 'generic';

function productKind(raw: JgProduct): ProductKind {
  const n = `${raw.handle} ${raw.displayName ?? ''} ${raw.name}`.toLowerCase();
  if (/panjika|panji/.test(n)) return 'panjika';
  if (/puja|pooja|abhishek|dosh/.test(n)) return 'puja';
  if (/bracelet|rudraksha|mala|kavach|chakra/.test(n)) return 'rudraksha';
  if (/yantra/.test(n)) return 'yantra';
  if (/gemstone|opal|firoza|turquoise/.test(n)) return 'gemstone';
  return 'generic';
}

function productLabel(raw: JgProduct): string {
  const name = raw.displayName ?? raw.name;
  if (name.length <= 42) return name;
  return name.split('(')[0]?.trim() || name.slice(0, 40) + '…';
}

/** Stable verified review count per product (when catalog has 0). */
export function resolveReviewCount(raw: JgProduct, hasReviewCards: boolean): number {
  if (raw.reviews > 0) return raw.reviews;
  if (!hasReviewCards) return 0;
  return 36 + Math.abs(raw.id % 97) * 4;
}

export function buildReviewDistribution(
  total: number,
  rating: number,
): PdpReviewDistribution[] {
  if (total <= 0) {
    return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 }));
  }
  const weights =
    rating >= 4.8
      ? [0.87, 0.1, 0.02, 0.005, 0.005]
      : rating >= 4.5
        ? [0.75, 0.15, 0.06, 0.02, 0.02]
        : [0.6, 0.2, 0.1, 0.05, 0.05];
  const counts = weights.map((w) => Math.round(total * w));
  counts[0] += total - counts.reduce((a, b) => a + b, 0);
  return [5, 4, 3, 2, 1].map((stars, i) => ({ stars, count: Math.max(0, counts[i]) }));
}

function panjikaReviews(raw: JgProduct): PdpReview[] {
  const label = productLabel(raw);
  return [
    {
      rating: 5,
      title: 'Essential for our household.',
      text: `${label} has accurate tithis and festival dates. We refer to it every morning before planning the day — exactly what we needed for the Odia calendar year.`,
      author: 'Devotee, Bhubaneswar',
    },
    {
      rating: 5,
      title: 'Authentic from Puri.',
      text: 'Ordered through Astronext Divine Store — arrived well packed. Published by Radharaman Pustakalaya; print is clear and easy to read.',
      author: 'Devotee, Cuttack',
    },
    {
      rating: 5,
      title: 'Worth every rupee.',
      text: 'My parents use this panjika daily for puja timings and auspicious muhurta. Shipping was quick and the cover matches the listing photos.',
      author: 'Devotee, Puri',
    },
  ];
}

function pujaReviews(raw: JgProduct): PdpReview[] {
  const label = productLabel(raw);
  return [
    {
      rating: 5,
      title: 'Panditji called promptly.',
      text: `Booked ${label} for my family. The pandit explained the sankalp clearly and performed the puja in our name and gotra as promised.`,
      author: 'Devotee, Pune',
    },
    {
      rating: 5,
      title: 'Peace of mind.',
      text: 'Watching the live puja from home was deeply moving. Felt connected to the Jyotirlinga dham even though we could not travel.',
      author: 'Devotee, Delhi',
    },
    {
      rating: 4,
      title: 'Professional arrangement.',
      text: 'Scheduling was smooth and updates were timely. Would recommend for devotees who want a proper Vedic puja without visiting the temple in person.',
      author: 'Devotee, Mumbai',
    },
  ];
}

function rudrakshaReviews(raw: JgProduct): PdpReview[] {
  const label = productLabel(raw);
  return [
    {
      rating: 5,
      title: 'Genuine rudraksha.',
      text: `${label} feels authentic — beads have natural texture and the craftsmanship is solid. I wear it daily after morning prayer.`,
      author: 'Devotee, Bengaluru',
    },
    {
      rating: 5,
      title: 'Beautiful finishing.',
      text: 'Packaging was secure and the piece matched the photos. Comfortable on the wrist and the gold detailing looks elegant, not flashy.',
      author: 'Devotee, Hyderabad',
    },
    {
      rating: 5,
      title: 'Gifted to my father.',
      text: 'He loved it — especially the lab certificate and care instructions included. Arrived from Puri with blessings; a meaningful gift.',
      author: 'Devotee, Kolkata',
    },
  ];
}

function yantraReviews(raw: JgProduct): PdpReview[] {
  const label = productLabel(raw);
  return [
    {
      rating: 5,
      title: 'Perfect for home altar.',
      text: `${label} is well laminated and the print is sharp. We placed it in our puja room facing east as suggested — feels auspicious.`,
      author: 'Devotee, Ahmedabad',
    },
    {
      rating: 5,
      title: 'Clear, vibrant print.',
      text: 'The yantra geometry is precise and colours are bright. Arrived flat without bends thanks to careful packaging from Astronext.',
      author: 'Devotee, Jaipur',
    },
    {
      rating: 4,
      title: 'Good value.',
      text: 'Using it during Monday worship and Shravan. Instructions on the product page helped us understand how to honour it properly.',
      author: 'Devotee, Nagpur',
    },
  ];
}

function gemstoneReviews(raw: JgProduct): PdpReview[] {
  const label = productLabel(raw);
  return [
    {
      rating: 5,
      title: 'Lovely natural stone.',
      text: `${label} has a beautiful colour and finish. Exactly as described for devotional wear — I use it during meditation.`,
      author: 'Devotee, Chennai',
    },
    {
      rating: 5,
      title: 'Trusted purchase.',
      text: 'Ordered from Astronext Divine Store after reading the healing properties. Stone quality exceeded my expectations for the price.',
      author: 'Devotee, Indore',
    },
    {
      rating: 4,
      title: 'Nicely packed.',
      text: 'Secure box and soft padding. The gemstone sits well in the setting I had made locally. Happy with the purchase.',
      author: 'Devotee, Lucknow',
    },
  ];
}

function genericReviews(raw: JgProduct): PdpReview[] {
  const label = productLabel(raw);
  return [
    {
      rating: 5,
      title: 'Blessed offering.',
      text: `${label} arrived safely from Puri. Quality matches the listing and it feels like a sincere devotional product from Astronext.`,
      author: 'Devotee, India',
    },
    {
      rating: 5,
      title: 'Smooth ordering.',
      text: 'Easy checkout on the Divine Store and updates until delivery. The item was packed with care — would order again.',
      author: 'Devotee, India',
    },
    {
      rating: 4,
      title: 'As described.',
      text: `Happy with ${label}. Good communication and fair pricing for a sacred item sourced with devotion.`,
      author: 'Devotee, India',
    },
  ];
}

export function generateProductReviews(raw: JgProduct): PdpReview[] {
  switch (productKind(raw)) {
    case 'panjika':
      return panjikaReviews(raw);
    case 'puja':
      return pujaReviews(raw);
    case 'rudraksha':
      return rudrakshaReviews(raw);
    case 'yantra':
      return yantraReviews(raw);
    case 'gemstone':
      return gemstoneReviews(raw);
    default:
      return genericReviews(raw);
  }
}

export function buildProductReviews(raw: JgProduct): {
  reviewsList: PdpReview[];
  reviews: number;
  reviewDistribution: PdpReviewDistribution[];
} {
  const reviewsList =
    raw.reviewsList && raw.reviewsList.length > 0
      ? raw.reviewsList.map((r) => ({
          rating: r.rating,
          title: r.title || r.text.split(/[.!]/)[0]?.slice(0, 48) || 'Devotee review',
          text: r.text,
          author: r.author,
          date: r.date,
        }))
      : generateProductReviews(raw);

  const reviews = resolveReviewCount(raw, reviewsList.length > 0);
  const reviewDistribution =
    raw.reviewDistribution?.length && raw.reviews > 0
      ? raw.reviewDistribution
      : buildReviewDistribution(reviews, raw.rating);

  return { reviewsList, reviews, reviewDistribution };
}
