import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent } from '@/lib/content';
import { getFestivalWithMenu } from '@/lib/festivalsDb';
import type { Festival, PrixFixeTier } from '@/lib/chinese-restaurant-types';
import FestivalPage from '@/components/sections/FestivalPage';

interface PageProps {
  params: { locale: Locale; slug: string };
}

function canUseDb() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function fileToFestival(fileData: any): Festival | null {
  if (!fileData?.festival) return null;
  const f = fileData.festival;
  return {
    id: f.id || f.slug,
    siteId: 'grand-pavilion',
    name: f.name,
    nameZh: f.nameZh,
    slug: f.slug,
    activeDateStart: f.activeDateStart,
    activeDateEnd: f.activeDateEnd,
    year: f.year,
    heroImage: f.heroImage,
    tagline: f.tagline,
    taglineZh: f.taglineZh,
    description: f.description,
    descriptionZh: f.descriptionZh,
    urgencyMessage: f.urgencyMessage,
    urgencyCount: f.urgencyCount,
    isActive: true,
    isLocked: false,
    prixFixeTiers: (fileData.prixFixeTiers || []).map((tier: any, idx: number) => ({
      id: `${f.slug}-tier-${idx}`,
      festivalId: f.id || f.slug,
      tier: tier.tier,
      tierName: tier.tierName,
      tierNameZh: tier.tierNameZh,
      pricePerPerson: tier.pricePerPerson,
      minGuests: tier.minGuests || 2,
      courses: tier.courses || [],
      sortOrder: idx,
    })) as PrixFixeTier[],
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'chinese-new-year' },
    { slug: 'mid-autumn' },
    { slug: 'wedding-banquet' },
    { slug: 'dragon-boat' },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  const fileData = await loadContent<any>(siteId, locale, `pages/festivals/${slug}.json`);
  const f = fileData?.festival;
  if (!f) return {};
  const name = locale === 'zh' ? f.nameZh : f.name;
  return {
    title: `${name} ${f.year} — Grand Pavilion 大观楼`,
    description: locale === 'zh' ? f.descriptionZh || f.taglineZh : f.description || f.tagline,
  };
}

export default async function FestivalSlugPage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  let festival: Festival | null = null;

  // Try DB first
  if (canUseDb()) {
    festival = await getFestivalWithMenu(siteId, slug).catch(() => null);
  }

  // Fall back to file-based content
  if (!festival) {
    const fileData = await loadContent<any>(siteId, locale, `pages/festivals/${slug}.json`);
    festival = fileToFestival(fileData);
  }

  if (!festival) notFound();

  const fileData = await loadContent<any>(siteId, locale, `pages/festivals/${slug}.json`);
  const cta = fileData?.cta;
  const giftBoxes = fileData?.giftBoxes;

  return (
    <FestivalPage
      festival={festival}
      locale={locale}
      ctaPrimary={cta?.primary}
      ctaSecondary={cta?.secondary}
      giftBoxes={giftBoxes}
    />
  );
}
