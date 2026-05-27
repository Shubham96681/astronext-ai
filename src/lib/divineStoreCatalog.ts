import catalogFile from '@/data/divine-store-catalog.json';
import type {
  DivineStoreCatalogFile,
  JgProduct,
  PdpBenefitIcon,
  PdpCareRitual,
  PdpFaq,
  PdpWhyWear,
  PdpWearingMantra,
} from '@/content/jgStoreProducts';
import { buildProductReviews } from '@/lib/divineStoreReviews';

const catalog = catalogFile as DivineStoreCatalogFile;

const DEFAULT_BENEFIT_ICONS: PdpBenefitIcon[] = ['leaf', 'sun', 'shield', 'eye'];

const DEFAULT_WHY_BENEFITS: PdpWhyWear['benefits'] = [
  {
    icon: 'leaf',
    title: 'Peace of mind',
    description: 'Calms the nervous system; supports meditation and steadier sleep.',
  },
  {
    icon: 'sun',
    title: 'Clarity & focus',
    description: 'Sharpens concentration during study, work, and decision-making.',
  },
  {
    icon: 'shield',
    title: 'Spiritual protection',
    description: 'Long held to ward against negative energy and the evil eye.',
  },
  {
    icon: 'eye',
    title: 'Energy alignment',
    description: 'Balances the chakras; harmonises body and breath.',
  },
];

function padWhyBenefitsToFour(benefits: PdpWhyWear['benefits']): PdpWhyWear['benefits'] {
  const result = benefits.slice(0, 4);
  while (result.length < 4) {
    result.push(DEFAULT_WHY_BENEFITS[result.length]);
  }
  return result;
}

function buildWhyWear(raw: JgProduct, aboutParagraphs: string[]): PdpWhyWear {
  if (raw.whyWear) {
    return { ...raw.whyWear, benefits: padWhyBenefitsToFour(raw.whyWear.benefits) };
  }

  const intro =
    aboutParagraphs.find((p) => p.length > 80 && !/^(what is|why to|how to|workmanship|care)/i.test(p)) ??
    raw.desc ??
    `Discover the sacred significance of ${raw.displayName ?? raw.name}.`;

  const benefitSources = aboutParagraphs
    .filter((p) => p.length > 30 && !/^(what is|why to|how to|workmanship|care|benefits)/i.test(p))
    .slice(0, 4);

  const benefits =
    benefitSources.length >= 2
      ? benefitSources.map((description, i) => {
          const firstSentence = description.split(/[.!]/)[0]?.trim() || description.slice(0, 40);
          return {
            icon: DEFAULT_BENEFIT_ICONS[i % DEFAULT_BENEFIT_ICONS.length],
            title: firstSentence.length > 48 ? firstSentence.slice(0, 45) + '…' : firstSentence,
            description: description.length > 120 ? description.slice(0, 117) + '…' : description,
          };
        })
      : [
          {
            icon: 'leaf' as const,
            title: 'Sacred offering',
            description: intro.slice(0, 120),
          },
          {
            icon: 'sun' as const,
            title: 'Daily devotion',
            description: `A trusted piece from Astronext Divine Store — ${raw.displayName ?? raw.name}.`,
          },
        ];

  return {
    eyebrow: 'Why wear it',
    headline: 'Cherished by devotees,',
    headlineAccent: 'for generations.',
    intro,
    benefits: padWhyBenefitsToFour(benefits),
  };
}

function defaultMantraForProduct(raw: JgProduct): PdpWearingMantra {
  const n = `${raw.handle} ${raw.displayName ?? ''} ${raw.name}`.toLowerCase();

  if (/bracelet|rudraksha|mala|kavach/i.test(n)) {
    return {
      eyebrow: 'The wearing mantra',
      mantra: 'ॐ नमः शिवाय',
      transliteration: 'Om Namah Śivāya',
      practice:
        'Salutations to the auspicious one. Recite eleven times each morning while holding the bracelet over the heart — this is the traditional energising practice for a freshly worn rudraksha.',
    };
  }

  if (/panjika|panji/i.test(n)) {
    return {
      eyebrow: 'The wearing mantra',
      mantra: 'ॐ',
      transliteration: 'Om — opening the sacred almanac',
      practice:
        'Before opening your panjika each morning, sit quietly and recall your intention for the day. This simple pause honours the tradition of beginning with the divine.',
    };
  }

  if (/yantra/i.test(n)) {
    return {
      eyebrow: 'The wearing mantra',
      mantra: 'ॐ',
      transliteration: 'Om',
      practice:
        'Place the yantra facing east. Recite Om eleven times to energise it before daily worship.',
    };
  }

  return {
    eyebrow: 'The wearing mantra',
    mantra: 'ॐ',
    transliteration: 'Om',
    practice:
      'Hold your sacred offering with both hands. Offer a moment of gratitude and recite Om before first use.',
  };
}

function buildMantra(raw: JgProduct, aboutParagraphs: string[]): PdpWearingMantra {
  if (raw.wearingMantra?.practice) {
    return {
      omSymbol: 'ॐ',
      ...raw.wearingMantra,
    };
  }

  const omLine = aboutParagraphs.find((p) => /नमः|namah|mantra|ॐ/i.test(p));
  if (omLine) {
    const lines = omLine.split('\n').map((l) => l.trim()).filter(Boolean);
    const fallback = defaultMantraForProduct(raw);
    return {
      eyebrow: 'The wearing mantra',
      omSymbol: 'ॐ',
      mantra: lines[0] || fallback.mantra,
      transliteration: lines[1] || fallback.transliteration,
      practice: fallback.practice,
    };
  }

  return { omSymbol: 'ॐ', ...defaultMantraForProduct(raw) };
}

const RUDRAKSHA_CARE_STEPS: PdpCareRitual['steps'] = [
  {
    title: 'Cleanse',
    description:
      'Soak overnight in raw cow milk, then rinse with Ganga jal or clean water. Pat dry with a soft cloth.',
  },
  {
    title: 'Energise',
    description:
      'Hold in your right palm; recite your mantra eleven times. Best done on a Monday morning after bath.',
  },
  {
    title: 'Wear',
    description:
      'Tie on the right wrist with the knot facing inward. Remove during baths if wearing daily.',
  },
  {
    title: 'Care',
    description:
      'Apply sandalwood oil weekly. Avoid soap, perfume, and chlorinated water to preserve the bead.',
  },
];

const PANJIKA_CARE_STEPS: PdpCareRitual['steps'] = [
  {
    title: 'Receive',
    description: 'Unbox with gratitude. Handle your panjika with clean, dry hands.',
  },
  {
    title: 'Place',
    description: 'Keep on your home altar or sacred shelf, wrapped in a clean cloth.',
  },
  {
    title: 'Use',
    description: 'Open each morning or before important dates as per Odia tradition.',
  },
  {
    title: 'Store',
    description: 'Avoid moisture and direct sunlight. Store flat when not in use.',
  },
];

const GENERIC_CARE_STEPS: PdpCareRitual['steps'] = [
  {
    title: 'Receive',
    description: 'Unbox with gratitude. Handle your sacred item with clean hands.',
  },
  {
    title: 'Prepare',
    description: 'Place in a clean, quiet space. Offer a moment of prayer before first use.',
  },
  {
    title: 'Use',
    description: 'Follow traditional practice for this offering with devotion and respect.',
  },
  {
    title: 'Care',
    description: 'Keep away from moisture and harsh chemicals. Store safely when not in use.',
  },
];

function formatCareStepTitle(title: string): string {
  const t = title.trim();
  if (/^care instructions?$/i.test(t)) return 'Care';
  if (/^workmanship$/i.test(t)) return 'Craftsmanship';
  if (/^how to use$/i.test(t)) return 'Use';
  if (/^why to use$/i.test(t)) return 'Purpose';
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function defaultCareStepsForProduct(raw: JgProduct): PdpCareRitual['steps'] {
  const n = `${raw.handle} ${raw.displayName ?? ''} ${raw.name}`.toLowerCase();
  if (/bracelet|rudraksha|mala|kavach/i.test(n)) return RUDRAKSHA_CARE_STEPS;
  if (/panjika|panji|calendar/i.test(n)) return PANJIKA_CARE_STEPS;
  if (/yantra|puja|pooja/i.test(n)) return GENERIC_CARE_STEPS;
  return GENERIC_CARE_STEPS;
}

function careHeadline(raw: JgProduct): string {
  const n = `${raw.handle} ${raw.displayName ?? ''} ${raw.name}`.toLowerCase();
  if (/bracelet|rudraksha/i.test(n)) return 'How to wear your rudraksha.';
  if (/panjika|panji/i.test(n)) return 'How to use your sacred panjika.';
  if (/yantra/i.test(n)) return 'How to place and honour your yantra.';
  return 'How to honour your sacred offering.';
}

function careIntro(raw: JgProduct): string {
  const n = `${raw.handle} ${raw.displayName ?? ''} ${raw.name}`.toLowerCase();
  if (/bracelet|rudraksha/i.test(n)) {
    return 'A short four-step practice. Best done in the morning, after a bath, on a Monday — but begin whenever you can.';
  }
  if (/panjika|panji/i.test(n)) {
    return 'A simple practice to honour your panjika. Keep it in a clean, dry place and open with devotion each day.';
  }
  return 'A simple practice to honour your offering. Begin whenever you are ready.';
}

function padCareStepsToFour(
  steps: PdpCareRitual['steps'],
  fillFrom: PdpCareRitual['steps'],
): PdpCareRitual['steps'] {
  const result = steps.slice(0, 4);
  for (const step of fillFrom) {
    if (result.length >= 4) break;
    if (!result.some((s) => s.title.toLowerCase() === step.title.toLowerCase())) {
      result.push(step);
    }
  }
  while (result.length < 4) {
    result.push(fillFrom[result.length % fillFrom.length]);
  }
  return result.slice(0, 4);
}

function buildCare(raw: JgProduct): PdpCareRitual {
  const fillFrom = defaultCareStepsForProduct(raw);

  if (raw.careRitual && 'steps' in raw.careRitual) {
    return {
      ...raw.careRitual,
      steps: padCareStepsToFour(raw.careRitual.steps, fillFrom),
    };
  }

  const fromSpecs = (raw.specs ?? [])
    .filter((s) => /care|wear|workmanship|usage|how to|ritual|benefits/i.test(s.title))
    .map((s) => ({
      title: formatCareStepTitle(s.title),
      description: s.description,
    }));

  const steps = padCareStepsToFour(fromSpecs.length > 0 ? fromSpecs : fillFrom, fillFrom);

  return {
    eyebrow: 'Care & ritual',
    headline: careHeadline(raw),
    intro: careIntro(raw),
    steps,
  };
}

function buildFaqs(raw: JgProduct): PdpFaq[] {
  if (raw.faqs?.length) return raw.faqs;
  return [
    {
      question: 'Is this product authentic?',
      answer:
        raw.authenticity?.description ??
        'All Astronext Divine Store offerings are quality-checked and shipped with care from Puri.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Orders ship within 2–5 business days. Free shipping on orders above Rs. 499.',
    },
    {
      question: 'Can I return my order?',
      answer: 'Unworn items may be returned within 14 days. Contact support for help.',
    },
  ];
}

function normalizeProduct(raw: JgProduct): JgProduct {
  const images = raw.images?.length ? raw.images : raw.image ? [raw.image] : [];
  const image = raw.image || images[0] || '';
  const aboutParagraphs =
    raw.aboutParagraphs?.length > 0
      ? raw.aboutParagraphs
      : raw.descLong
        ? raw.descLong.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
        : [];

  const defaultPerks = [
    { title: 'Free shipping', subtitle: 'On orders above Rs. 499' },
    { title: 'COD available', subtitle: 'Pay on delivery' },
    { title: '14-day returns', subtitle: 'Unworn items only' },
  ];

  const whyWear = buildWhyWear(raw, aboutParagraphs);
  const wearingMantra = buildMantra(raw, aboutParagraphs);
  const careRitual = buildCare(raw);
  const { reviewsList, reviews, reviewDistribution } = buildProductReviews(raw);
  const faqs = buildFaqs(raw);

  return {
    ...raw,
    images,
    image,
    aboutParagraphs,
    descLong: raw.descLong || aboutParagraphs.join('\n\n'),
    desc: raw.desc || aboutParagraphs[0]?.slice(0, 200) || raw.name,
    displayName: raw.displayName ?? raw.name,
    eyebrow: raw.eyebrow ?? raw.category?.toUpperCase() ?? 'DIVINE STORE',
    tagline: raw.tagline,
    authenticity: raw.authenticity ?? {
      title: 'Authenticity guaranteed',
      description: 'Genuine sacred items sourced with care for devotees worldwide.',
    },
    perks: raw.perks?.length ? raw.perks : defaultPerks,
    trustBullets: raw.trustBullets ?? [
      'Genuine sacred items from trusted sources',
      'Secure packaging for safe delivery',
      'Devotee-rated quality on Astronext Divine Store',
    ],
    priceNote: raw.priceNote ?? 'Inclusive of blessings · Ships from Puri',
    specs: raw.specs ?? [],
    whyWear,
    wearingMantra,
    careRitual,
    reviews,
    reviewsList,
    reviewDistribution,
    faqs,
  };
}

const products = catalog.products.map(normalizeProduct);

export function getDivineStoreCatalogMeta() {
  return {
    collectionTitle: catalog.collectionTitle,
    collectionHandle: catalog.collectionHandle,
    updatedAt: catalog.updatedAt,
    version: catalog.version,
  };
}

export function getDivineStoreProductsFromJson(): JgProduct[] {
  return products;
}

export function getDivineStoreProductByIdFromJson(id: number): JgProduct | null {
  return products.find((p) => p.id === id) ?? null;
}

export function getDivineStoreProductByHandleFromJson(handle: string): JgProduct | null {
  return products.find((p) => p.handle === handle) ?? null;
}
