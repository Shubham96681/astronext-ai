export type AstroSpeciality = {
  title: string;
  description: string;
};

export type Astrologer = {
  id: number;
  name: string;
  specialty: string;
  title: string;
  tagline: string;
  bio: string;
  bioLong: string;
  rating: number;
  reviews: number;
  consultations: number;
  exp: number;
  pricePerMinute: number;
  online: boolean;
  languages: string;
  specialities: AstroSpeciality[];
  avatar: string;
  portrait: string;
};

/** Local portraits — not Figma SVG extracts (those were footer social icons / wrong screenshots). */
const v = '?v=2';

const IMG = {
  vidyabhushan: {
    avatar: `/astrologers/vidyabhushan-avatar.jpg${v}`,
    portrait: `/astrologers/vidyabhushan-portrait.jpg${v}`,
  },
  priya: {
    avatar: `/astrologers/priya-avatar.jpg${v}`,
    portrait: `/astrologers/priya-portrait.jpg${v}`,
  },
  govind: {
    avatar: `/astrologers/govind-avatar.jpg${v}`,
    portrait: `/astrologers/govind-portrait.jpg${v}`,
  },
  kabir: {
    avatar: `/astrologers/kabir-avatar.jpg${v}`,
    portrait: `/astrologers/kabir-portrait.jpg${v}`,
  },
  meera: {
    avatar: `/astrologers/meera-avatar.jpg${v}`,
    portrait: `/astrologers/meera-portrait.jpg${v}`,
  },
  ramesh: {
    avatar: `/astrologers/ramesh-avatar.jpg${v}`,
    portrait: `/astrologers/ramesh-portrait.jpg${v}`,
  },
} as const;

export const ASTROLOGERS: Astrologer[] = [
  {
    id: 301,
    name: 'Acharya Vidyabhushan',
    specialty: 'Vedic Astrology & Kundali Expert',
    title: 'Vedic Astrologer & Spiritual Guide',
    tagline:
      'Generations of Jyotish wisdom, distilled into honest and deeply actionable guidance for the modern seeker.',
    bio: 'Guiding seekers with precise chart readings, dasha analysis, and practical remedies rooted in classical Vedic tradition.',
    bioLong:
      'With over 18 years of practice, Acharya Vidyabhushan specialises in birth-chart analysis, planetary periods (dashas), and remedial measures aligned with classical Jyotish. He has guided more than 12,000 seekers across India and abroad.\n\nTrained in traditional gurukul methods and refined through years of live consultations, he focuses on career transitions, marriage timing, health concerns, and spiritual growth—with clear, actionable guidance rather than vague predictions.\n\nSessions are structured, confidential, and designed to leave you with practical next steps you can apply immediately.',
    rating: 4.95,
    reviews: 1420,
    consultations: 12450,
    exp: 18,
    pricePerMinute: 100,
    online: true,
    languages: 'Hindi, English, Sanskrit',
    specialities: [
      { title: 'Janma Kundali', description: 'Detailed birth-chart analysis with dasha predictions.' },
      { title: 'Dasha & Transit', description: 'Timing of events through Vimshottari and Gochar readings.' },
      { title: 'Match-making', description: 'Gun Milan and compatibility for marriage decisions.' },
      { title: 'Career & Finance', description: 'Planetary guidance for growth, promotions, and stability.' },
      { title: 'Remedies', description: 'Mantra, gemstone, and puja recommendations from classical texts.' },
    ],
    avatar: IMG.vidyabhushan.avatar,
    portrait: IMG.vidyabhushan.portrait,
  },
  {
    id: 302,
    name: 'Priya Chawla',
    specialty: 'Tarot Reading & Relationship Guide',
    title: 'Tarot Reader & Relationship Counselor',
    tagline:
      'Intuitive clarity for love, family, and life decisions—compassionate guidance you can trust.',
    bio: 'Specializing in relationship clarity, emotional healing, and intuitive Tarot spreads for life-changing decisions.',
    bioLong:
      'Priya blends intuitive Tarot with counselling-style conversation to help you navigate love, family, and major life choices. Over 8 years she has supported thousands of clients through breakups, reconciliations, and new beginnings.\n\nHer readings are warm, confidential, and oriented toward practical next steps—never fear-based. She is especially sought after for relationship dilemmas, career crossroads, and emotional healing after difficult phases.\n\nEach session combines spread interpretation with grounded advice you can act on the same day.',
    rating: 4.88,
    reviews: 890,
    consultations: 6200,
    exp: 8,
    pricePerMinute: 55,
    online: true,
    languages: 'Hindi, English',
    specialities: [
      { title: 'Tarot Reading', description: 'Celtic cross and relationship spreads for clear answers.' },
      { title: 'Love & Marriage', description: 'Clarity on partners, timing, and emotional patterns.' },
      { title: 'Career Guidance', description: 'Choices aligned with your energy and life path.' },
      { title: 'Emotional Healing', description: 'Support through anxiety, loss, and major transitions.' },
    ],
    avatar: IMG.priya.avatar,
    portrait: IMG.priya.portrait,
  },
  {
    id: 303,
    name: 'Shastri Govind Dev',
    specialty: 'KP System & Gemology Guru',
    title: 'KP Astrologer & Gemology Expert',
    tagline:
      'Precision timing and verified gemstones—Krishnamurti Paddhati for decisive life events.',
    bio: 'Expert in KP astrology, gemstone recommendations, and sub-lord techniques for accurate timing of events.',
    bioLong:
      'Shastri Govind Dev applies the Krishnamurti Paddhati system for sharp event timing and recommends gemstones only after rigorous chart verification. Ideal for clients seeking precision on promotions, litigation, property, and investments.\n\nWith 15 years of practice and training under senior KP masters, he has become a trusted name for corporate leaders and families needing exact Muhurat windows.\n\nConsultations are analytical, documented, and focused on verifiable outcomes.',
    rating: 4.91,
    reviews: 1105,
    consultations: 9800,
    exp: 15,
    pricePerMinute: 75,
    online: true,
    languages: 'Hindi, English',
    specialities: [
      { title: 'KP Horoscope', description: 'Sub-lord analysis for precise event timing.' },
      { title: 'Gemology', description: 'Certified gemstone recommendations after chart study.' },
      { title: 'Property & Legal', description: 'Favourable periods for purchase, sale, and disputes.' },
      { title: 'Business Timing', description: 'Launch dates and partnership compatibility.' },
    ],
    avatar: IMG.govind.avatar,
    portrait: IMG.govind.portrait,
  },
  {
    id: 304,
    name: 'Kabir Vats',
    specialty: 'Vedic Numerology & Astro-Vastu',
    title: 'Numerologist & Astro-Vastu Consultant',
    tagline:
      'Harmonize your name, home, and numbers with planetary vibrations for lasting success.',
    bio: 'Blending numerology with Vastu principles to harmonize your home, career path, and personal name vibrations.',
    bioLong:
      'Kabir integrates name numerology, mobile and business number analysis, and residential Vastu corrections. Consultations help families and entrepreneurs align their environment with favourable planetary vibrations.\n\nOver a decade he has advised startups, homeowners, and students on name changes, office layout, and lucky dates for launches.\n\nSessions include a written summary of corrections and simple remedies you can implement without major renovation.',
    rating: 4.85,
    reviews: 640,
    consultations: 4100,
    exp: 10,
    pricePerMinute: 60,
    online: true,
    languages: 'Hindi, English',
    specialities: [
      { title: 'Name Numerology', description: 'Personal and business name vibration analysis.' },
      { title: 'Astro-Vastu', description: 'Room-wise corrections for home and office energy.' },
      { title: 'Mobile & Vehicle', description: 'Lucky numbers for phones, plates, and accounts.' },
      { title: 'Life Path Numbers', description: 'Core strengths and challenges from birth date.' },
    ],
    avatar: IMG.kabir.avatar,
    portrait: IMG.kabir.portrait,
  },
  {
    id: 305,
    name: 'Dr. Meera Iyer',
    specialty: 'Palmistry & Prashna Shastra',
    title: 'Palmist & Prashna Shastra Expert',
    tagline:
      'Immediate answers when birth details are missing—palmistry and horary astrology combined.',
    bio: 'Offering palmistry insights and Prashna readings for immediate answers to pressing life questions.',
    bioLong:
      'Dr. Meera Iyer provides Prashna (horary) readings when birth details are incomplete, alongside traditional palmistry. She is sought after for urgent decisions on travel, surgery timing, and relationship dilemmas.\n\nWith 12 years of clinical and spiritual practice, she bridges classical Shastra with empathetic counselling for modern families.\n\nIdeal for clients who need same-day clarity on yes-or-no questions.',
    rating: 4.92,
    reviews: 756,
    consultations: 5300,
    exp: 12,
    pricePerMinute: 65,
    online: true,
    languages: 'Hindi, English, Tamil',
    specialities: [
      { title: 'Prashna Shastra', description: 'Horary charts for urgent yes/no questions.' },
      { title: 'Palmistry', description: 'Life line, fate line, and marriage line interpretation.' },
      { title: 'Health Timing', description: 'Favourable windows for procedures and recovery.' },
      { title: 'Travel & Relocation', description: 'Safety and success for moves abroad.' },
    ],
    avatar: IMG.meera.avatar,
    portrait: IMG.meera.portrait,
  },
  {
    id: 306,
    name: 'Pandit Ramesh Joshi',
    specialty: 'Muhurat & Ritual Astrology',
    title: 'Muhurat Specialist & Ritual Astrologer',
    tagline:
      'Sacred timing for weddings, ventures, and pujas—Panchang precision with clear ritual guidance.',
    bio: 'Calculating auspicious Muhurats and prescribing sacred rituals for weddings, ventures, and spiritual milestones.',
    bioLong:
      'Pandit Ramesh Joshi has officiated and timed hundreds of pujas and vivahas. He selects Muhurats using Panchang, local latitude corrections, and family gotra considerations, and explains each ritual step in plain language.\n\nWith 22 years of experience he is trusted by families across Gujarat and Maharashtra for griha pravesh, mundan, and corporate inaugurations.\n\nEvery consultation includes written Muhurat slots and a simple checklist for priests or family members.',
    rating: 4.89,
    reviews: 980,
    consultations: 11200,
    exp: 22,
    pricePerMinute: 110,
    online: true,
    languages: 'Hindi, Sanskrit',
    specialities: [
      { title: 'Vivah Muhurat', description: 'Wedding dates aligned with couple charts and Panchang.' },
      { title: 'Griha Pravesh', description: 'Auspicious entry timings for new homes.' },
      { title: 'Business Launch', description: 'Opening ceremonies and partnership beginnings.' },
      { title: 'Puja Vidhi', description: 'Step-by-step ritual guidance for family ceremonies.' },
    ],
    avatar: IMG.ramesh.avatar,
    portrait: IMG.ramesh.portrait,
  },
];

export function formatPerMinutePrice(perMin: number): string {
  return `Rs. ${perMin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** @deprecated Use formatPerMinutePrice for detail; kept for listing cards */
export function formatSessionPrice(perMin: number): string {
  return `Rs. ${(perMin * 11).toFixed(2)}`;
}

export function formatConsultCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k >= 10 ? `${Math.round(k)}K+` : `${k.toFixed(1).replace(/\.0$/, '')}K+`;
  }
  return `${n.toLocaleString('en-IN')}+`;
}

export function languagesList(languages: string): string {
  return languages.split(/,\s*/).join(' · ');
}

export function languageCount(languages: string): number {
  return languages.split(/,\s*/).length;
}
