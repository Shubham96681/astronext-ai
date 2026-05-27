import type { Metadata } from 'next';
import AstrologersPage from '@/components/AstrologersPage';
import { ASTROLOGERS, resolveAstrologerParam } from '@/content/astrologersData';

type PageProps = {
  params: Promise<{ astrologerId: string }>;
};

export async function generateStaticParams() {
  return ASTROLOGERS.map((a) => ({ astrologerId: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { astrologerId } = await params;
  const astro = resolveAstrologerParam(astrologerId);
  if (!astro) {
    return { title: 'Astrologer — AstroNext.ai' };
  }
  return {
    title: `${astro.name} — AstroNext.ai`,
    description: astro.tagline,
    openGraph: {
      title: `${astro.name} — AstroNext.ai`,
      description: astro.tagline,
      type: 'profile',
    },
  };
}

export default function Page() {
  return <AstrologersPage />;
}
