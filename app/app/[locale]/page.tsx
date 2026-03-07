import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import {
  getRequestSiteId,
  loadContent,
  loadSiteInfo,
} from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import type { SiteInfoChinese } from '@/lib/chinese-restaurant-types';
import { getActiveFestival } from '@/lib/festivalsDb';
import {
  getCurationChefSignatures,
  getFeaturedMenuItems,
  getTodayDailySpecial,
} from '@/lib/menuDb';

// Chinese-specific components
import BilinguaHeroHeadline from '@/components/ui/BilinguaHeroHeadline';
import InkWashOverlay from '@/components/ui/InkWashOverlay';
import DimSumStatusBadge from '@/components/ui/DimSumStatusBadge';
import HeroGalleryBackground from '@/components/ui/HeroGalleryBackground';
import FestivalHighlightSection from '@/components/sections/FestivalHighlightSection';

// Reused Meridian sections (restyled)
import HeroSection from '@/components/sections/HeroSection';
import TodaySpecialSection from '@/components/menu/TodaySpecialSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import GalleryPreviewSection from '@/components/sections/GalleryPreviewSection';
import ChefHeroFull from '@/components/sections/ChefHeroFull';
import CTASection from '@/components/sections/CTASection';
import ReservationsCTA from '@/components/sections/ReservationsCTA';

// Client-side can use 'use client' — but this is server component
// We import server-safe components only

interface PageProps {
  params: { locale: Locale };
}

function canUseDb(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function clampPercent(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(90, Math.max(10, parsed));
}

const EXTRA_TESTIMONIALS_EN = [
  {
    name: 'Daniel Wu',
    text: 'Weekend brunch is packed but service is still smooth. The siu mai and cheung fun are excellent.',
    source: 'Google',
  },
  {
    name: 'Olivia Huang',
    text: 'Private dining for our family celebration was seamless from planning to dessert.',
    source: 'Yelp',
  },
  {
    name: 'Kevin Zhang',
    text: 'Roast duck skin is crisp and fragrant. Easily one of our favorite dinner spots in Queens.',
    source: 'Google',
  },
  {
    name: 'Lily Chen',
    text: 'Great tea selection and very attentive staff. We keep coming back for dim sum weekends.',
    source: 'OpenTable',
  },
];

const EXTRA_TESTIMONIALS_ZH = [
  {
    name: '李女士',
    nameZh: '李女士',
    text: '周末早茶排队也值得，虾饺和肠粉都很稳定。',
    textZh: '周末早茶排队也值得，虾饺和肠粉都很稳定。',
    source: 'Google',
  },
  {
    name: '周先生',
    nameZh: '周先生',
    text: '家庭聚会选择这里很安心，出菜节奏和服务都很专业。',
    textZh: '家庭聚会选择这里很安心，出菜节奏和服务都很专业。',
    source: 'Yelp',
  },
  {
    name: '吴太太',
    nameZh: '吴太太',
    text: '烧鸭皮脆肉嫩，整体味道很正宗，值得推荐。',
    textZh: '烧鸭皮脆肉嫩，整体味道很正宗，值得推荐。',
    source: 'Google',
  },
  {
    name: '郑先生',
    nameZh: '郑先生',
    text: '茶品选择多，环境干净舒适，接待朋友很有面子。',
    textZh: '茶品选择多，环境干净舒适，接待朋友很有面子。',
    source: 'OpenTable',
  },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/home.json'),
  ]);
  return buildPageMetadata({
    siteId,
    locale,
    title: pageContent?.seo?.title,
    description: pageContent?.seo?.description,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [siteInfo, homeContent, headerContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/home.json'),
    loadContent<any>(siteId, locale, 'header.json'),
  ]);

  if (!siteInfo) notFound();

  // Load DB data in parallel
  const [activeFestival, featuredItems, dailySpecial, curatedChefSignatures] = await Promise.all([
    canUseDb() ? getActiveFestival(siteId).catch(() => null) : Promise.resolve(null),
    canUseDb() ? getFeaturedMenuItems(siteId, 3).catch(() => []) : Promise.resolve([]),
    canUseDb() ? getTodayDailySpecial(siteId).catch(() => null) : Promise.resolve(null),
    canUseDb() ? getCurationChefSignatures(siteId).catch(() => []) : Promise.resolve([]),
  ]);

  const isZh = locale === 'zh';

  const hero = homeContent?.hero || {};
  const heroDesktopContentX = clampPercent(hero.contentPositionDesktopX ?? hero.contentPositionX, 50);
  const heroDesktopContentY = clampPercent(hero.contentPositionDesktopY ?? hero.contentPositionY, 56);
  const heroMobileContentX = clampPercent(
    hero.contentPositionMobileX ?? hero.contentPositionDesktopX ?? hero.contentPositionX,
    50
  );
  const heroMobileContentY = clampPercent(
    hero.contentPositionMobileY ?? hero.contentPositionDesktopY ?? hero.contentPositionY,
    60
  );
  const chefHero = homeContent?.chef_hero || {};
  const testimonials = homeContent?.testimonials || {};
  const festivalHighlight = homeContent?.festival_highlight || {};
  const privateDiningCta = homeContent?.private_dining_cta || {};
  const reservationsCta = homeContent?.reservations_cta || {};
  const dimSumStatus = homeContent?.dim_sum_status || {};
  const todaySpecials = homeContent?.today_specials || {};
  const todaySpecialItems = Array.isArray(todaySpecials.items) ? todaySpecials.items : [];
  const specialsImagePool = [
    ...todaySpecialItems.map((item: any) => String(item?.image || '')).filter(Boolean),
    ...(Array.isArray(homeContent?.menu_preview?.categories)
      ? homeContent.menu_preview.categories.map((cat: any) => String(cat?.image || '')).filter(Boolean)
      : []),
    ...(Array.isArray(homeContent?.gallery_preview?.images)
      ? homeContent.gallery_preview.images.map((img: any) => String(img || '')).filter(Boolean)
      : []),
  ];
  const fallbackSpecialImage = (index: number) =>
    specialsImagePool.length > 0 ? specialsImagePool[index % specialsImagePool.length] : '';
  const dailySpecialItem = dailySpecial?.item
    ? [{
        name: dailySpecial.item.name,
        nameZh: dailySpecial.item.nameZh,
        description: isZh
          ? (dailySpecial.item.descriptionZh || dailySpecial.item.description)
          : dailySpecial.item.description,
        price: dailySpecial.item.price,
        image: dailySpecial.item.image || fallbackSpecialImage(0),
        badge: isZh ? '今日推荐' : "Today's Special",
      }]
    : [];
  // Priority: weekday daily special > DB featured items > content JSON fallback.
  const specialsItems = dailySpecialItem.length > 0
    ? dailySpecialItem
    : featuredItems.length > 0
    ? featuredItems.map((item, index) => ({
        name: item.name,
        nameZh: item.nameZh,
        description: isZh ? (item.descriptionZh || item.description) : item.description,
        price: item.price,
        image: item.image || fallbackSpecialImage(index),
        badge: item.isChefSignature ? 'Signature' : item.isPopular ? "Chef's Pick" : null,
      }))
    : todaySpecialItems.map((item: any, index: number) => ({
        ...item,
        image: item?.image || fallbackSpecialImage(index),
      }));
  const signatureItems = curatedChefSignatures.slice(0, 9).map((item, index) => ({
    name: item.name,
    nameZh: item.nameZh,
    description: isZh ? (item.descriptionZh || item.description) : item.description,
    price: item.price,
    image: item.image || fallbackSpecialImage(index),
  }));
  const menuPreview = homeContent?.menu_preview || {};
  const blogPreview = homeContent?.blog_preview || {};
  const trustBar = homeContent?.trust_bar || {};
  const baseTestimonialItems = Array.isArray(testimonials?.items) ? testimonials.items : [];
  const extraTestimonials = isZh ? EXTRA_TESTIMONIALS_ZH : EXTRA_TESTIMONIALS_EN;
  const testimonialItems = [...baseTestimonialItems, ...extraTestimonials];
  const testimonialLoopItems =
    testimonialItems.length > 1 ? [...testimonialItems, ...testimonialItems] : testimonialItems;
  const testimonialScrollDurationSec = Math.max(28, testimonialItems.length * 6);
  const reviewSubtitle =
    (isZh
      ? testimonials?.subheadingZh || testimonials?.subheading
      : testimonials?.subheading || testimonials?.subheadingZh) ||
    (isZh ? '地道风味，难忘体验' : 'Authentic flavors, memorable experiences');
  const getInitials = (value: string) =>
    String(value || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'G';

  const siteName = isZh ? (siteInfo?.nameZh || siteInfo?.businessName) : siteInfo?.businessName;

  const localizeUrl = (url: string) => {
    if (!url || url.startsWith('http') || url.startsWith('tel:')) return url;
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    if (url === '/') return `/${locale}`;
    return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="chinese-restaurant-home">

      {/* ── 1. HERO SECTION ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'var(--hero-min-h, 100svh)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: hero.image ? 'var(--primary, #1A1A1A)' : 'var(--backdrop-primary)',
        }}
      >
        {/* Gallery background — cycles through images; falls back to single image */}
        <HeroGalleryBackground
          images={hero.gallery || (hero.image ? [hero.image] : [])}
          interval={hero.galleryInterval || 5000}
          fallback={hero.image}
        />

        {/* Hero overlay — darkness controlled by theme → hao-zhan.json effects.heroOverlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--hero-overlay)',
            zIndex: 1,
          }}
        />

        {/* Ink wash overlay — Chinese art aesthetic */}
        {hero.showInkWashOverlay !== false && <InkWashOverlay />}

        {/* Hero content */}
        <div
          className="home-hero-content"
          style={{
            position: 'absolute',
            top: 'var(--hero-content-y-desktop)',
            left: 'var(--hero-content-x-desktop)',
            transform: 'translate(calc(-1 * var(--hero-content-x-desktop)), calc(-1 * var(--hero-content-y-desktop)))',
            '--hero-content-x-desktop': `${heroDesktopContentX}%`,
            '--hero-content-y-desktop': `${heroDesktopContentY}%`,
            '--hero-content-x-mobile': `${heroMobileContentX}%`,
            '--hero-content-y-mobile': `${heroMobileContentY}%`,
            zIndex: 2,
            textAlign: 'center',
            padding: '0 var(--container-px, 2rem)',
            maxWidth: '860px',          /* narrower max-width prevents line clipping */
            width: 'min(860px, calc(100% - 1.5rem))',
          } as any}
        >
          {/* Dim Sum Status Badge */}
          {dimSumStatus?.enabled && (
            <div style={{ marginBottom: '1.5rem' }}>
              <DimSumStatusBadge
                dimSumHours={siteInfo?.dimSumHours}
                weekendBrunchHours={siteInfo?.weekendBrunchHours}
                locale={locale}
                tone="on-dark"
                availableText={dimSumStatus.availableText}
                availableTextZh={dimSumStatus.availableTextZh}
                closedText={dimSumStatus.closedText}
                closedTextZh={dimSumStatus.closedTextZh}
                weekendText={dimSumStatus.weekendText}
                weekendTextZh={dimSumStatus.weekendTextZh}
              />
            </div>
          )}

          {/* Bilingual headline — color explicitly set for dark hero */}
          {hero.headline && hero.headlineZh ? (
            <div style={{ color: 'var(--text-on-dark-primary, #F5F0E8)', marginBottom: '1.5rem' }}>
              <BilinguaHeroHeadline
                en={hero.headline}
                zh={hero.headlineZh}
                layout={hero.layout || 'zh-below'}
                locale={locale}
              />
            </div>
          ) : (
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 'var(--weight-display, 300)',
                color: 'var(--text-on-dark-primary, #F5F0E8)',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                overflowWrap: 'break-word',
              }}
            >
              {hero.headline || siteName}
            </h1>
          )}

          {/* Subheadline */}
          {(hero.subheadline || hero.subheadlineZh) && (
            <p
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1.1rem)',
                color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.8))',
                letterSpacing: '0.06em',
                marginBottom: '2.5rem',
                lineHeight: 1.6,
                maxWidth: '600px',
                margin: '0 auto 2.5rem',
              }}
            >
              {isZh && hero.subheadlineZh ? hero.subheadlineZh : hero.subheadline}
            </p>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {hero.cta && (
              <a
                href={localizeUrl(hero.cta.href || '/reservations')}
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2.5rem',
                  background: 'var(--secondary, #C9A84C)',
                  color: 'var(--primary, #1A1A1A)',
                  borderRadius: 'var(--btn-radius, 2px)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                }}
              >
                {isZh && hero.cta.textZh ? hero.cta.textZh : hero.cta.text}
              </a>
            )}
            {hero.ctaSecondary && (
              <a
                href={localizeUrl(hero.ctaSecondary.href || '/menu')}
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2.5rem',
                  background: 'transparent',
                  color: 'var(--text-on-dark-primary, #F5F0E8)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 'var(--btn-radius, 2px)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                }}
              >
                {isZh && hero.ctaSecondary.textZh ? hero.ctaSecondary.textZh : hero.ctaSecondary.text}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. TODAY'S SPECIALS ── */}
      {specialsItems?.length > 0 && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading)',
                color: 'var(--heading-on-light)',
                textAlign: 'center',
                marginBottom: '0.5rem',
              }}
            >
              {isZh && todaySpecials.headingZh ? todaySpecials.headingZh : todaySpecials.heading}
            </h2>
            {(todaySpecials.subheading || todaySpecials.subheadingZh) && (
              <p style={{ textAlign: 'center', color: 'var(--muted-on-light)', marginBottom: '3rem', fontSize: '0.9rem' }}>
                {isZh && todaySpecials.subheadingZh ? todaySpecials.subheadingZh : todaySpecials.subheading}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--grid-gap)' }}>
              {specialsItems.map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--backdrop-primary)',
                    borderRadius: 'var(--radius-base)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {item.image && (
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: 'var(--card-pad)' }}>
                    {/* ZH name large */}
                    <div
                      style={{
                        fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: 'var(--heading-on-light)',
                        marginBottom: '0.2rem',
                      }}
                      lang="zh-Hans"
                    >
                      {item.nameZh}
                    </div>
                    {/* EN name */}
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--body-on-light)', marginBottom: '0.5rem' }}>
                      {item.name}
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', marginBottom: '0.5rem', display: 'inline-block' }}>
                        {item.badge}
                      </span>
                    )}
                    {item.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted-on-light)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                        {item.description}
                      </p>
                    )}
                    {item.price && (
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: 'var(--heading-on-light)' }}>
                        ${(item.price / 100).toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. MENU PREVIEW ── */}
      {menuPreview?.categories?.length > 0 && (
        <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading)',
                color: 'var(--heading-on-light)',
                textAlign: 'center',
                marginBottom: '3rem',
              }}
            >
              {isZh && menuPreview.headingZh ? menuPreview.headingZh : menuPreview.heading}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--grid-gap)' }}>
              {menuPreview.categories.map((cat: any, i: number) => (
                <a
                  key={i}
                  href={localizeUrl(cat.href)}
                  style={{
                    display: 'block',
                    position: 'relative',
                    aspectRatio: '4/3',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-base)',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {cat.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} aria-hidden="true" />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
                    {cat.badge && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', display: 'block', marginBottom: '0.25rem' }}>
                        {cat.badge}
                      </span>
                    )}
                    <div
                      style={{
                        fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: 'var(--text-on-dark-primary, #FFFFFF)',
                        marginBottom: '0.15rem',
                      }}
                      lang="zh-Hans"
                    >
                      {cat.nameZh}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.8))' }}>
                      {isZh && cat.nameZh ? cat.nameZh : cat.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.65))', marginTop: '0.25rem' }}>
                      {isZh && cat.descriptionZh ? cat.descriptionZh : cat.description}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. CHEF SIGNATURES ── */}
      {signatureItems.length > 0 && (
        <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading)',
                color: 'var(--heading-on-light)',
                textAlign: 'center',
                marginBottom: '0.5rem',
              }}
            >
              {isZh ? '主厨招牌菜' : "Chef's Signature"}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--muted-on-light)', marginBottom: '3rem', fontSize: '0.9rem' }}>
              {isZh ? '精选经典与当季招牌菜，来自主厨推荐。' : 'Selected signature dishes from our chef highlights.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--grid-gap)' }}>
              {signatureItems.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  style={{
                    background: 'var(--backdrop-primary)',
                    borderRadius: 'var(--radius-base)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {item.image && (
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: 'var(--card-pad)' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        color: 'var(--heading-on-light)',
                        marginBottom: '0.2rem',
                      }}
                      lang="zh-Hans"
                    >
                      {item.nameZh}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--body-on-light)', marginBottom: '0.5rem' }}>
                      {item.name}
                    </div>
                    {item.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted-on-light)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                        {item.description}
                      </p>
                    )}
                    {item.price && (
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: 'var(--heading-on-light)' }}>
                        ${(item.price / 100).toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. CHEF HERO ── */}
      {chefHero?.name && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {chefHero.image && (
              <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 'var(--radius-base)', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={chefHero.image} alt={chefHero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '1rem' }}>
                {isZh ? '行政主厨' : 'Executive Chef'}
              </p>
              <div style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--heading-on-light)', marginBottom: '0.25rem', lineHeight: 1.1 }} lang="zh-Hans">
                {isZh && chefHero.headingZh ? chefHero.headingZh : chefHero.heading}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--body-on-light)', marginBottom: '0.5rem' }}>
                {isZh && chefHero.subheadingZh ? chefHero.subheadingZh : chefHero.subheading}
              </div>
              {/* Credentials */}
              {((isZh ? chefHero.credentialsZh : chefHero.credentials) || chefHero.credentials)?.map((cred: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', marginTop: i === 0 ? '1.5rem' : 0 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--seal-color, #8B0000)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--body-on-light)' }}>{cred}</span>
                </div>
              ))}
              <p style={{ lineHeight: 1.75, color: 'var(--body-on-light)', margin: '1.5rem 0', fontSize: '0.9rem' }}>
                {chefHero.bio}
              </p>
              {chefHero.cta && (
                <a
                  href={localizeUrl(chefHero.cta.href || '/about')}
                  style={{
                    display: 'inline-block',
                    padding: '0.7rem 1.75rem',
                    border: '1px solid var(--primary)',
                    color: 'var(--heading-on-light)',
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                  }}
                >
                  {isZh && chefHero.cta.textZh ? chefHero.cta.textZh : chefHero.cta.text}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. TESTIMONIALS ── */}
      {testimonialItems.length > 0 && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-primary)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(201,168,76,0.28)',
                  background: 'rgba(201,168,76,0.08)',
                  color: 'var(--secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                {isZh ? '宾客评价' : 'Testimonials'}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', marginBottom: '0.5rem' }}>
                {isZh && testimonials.headingZh ? testimonials.headingZh : testimonials.heading}
              </h2>
              <p style={{ color: 'var(--muted-on-light)', fontSize: '0.95rem' }}>{reviewSubtitle}</p>
            </div>
            <div className="testimonial-carousel-viewport" style={{ '--testimonial-card-gap': '1rem' } as any}>
              <div
                className="testimonial-carousel-track"
                style={{ '--testimonial-scroll-duration': `${testimonialScrollDurationSec}s` } as any}
              >
              {testimonialLoopItems.map((item: any, i: number) => {
                const displayName = isZh && item.nameZh ? item.nameZh : item.name;
                const displayText = isZh && item.textZh ? item.textZh : item.text;
                const initials = getInitials(displayName || item.name || '');
                return (
                  <article
                    key={`${displayName}-${i}`}
                    style={{
                      flex: '0 0 min(360px, calc(100vw - 6rem))',
                      background: 'var(--backdrop-primary)',
                      borderRadius: '16px',
                      border: '1px solid rgba(201,168,76,0.22)',
                      boxShadow: '0 12px 26px rgba(17,24,39,0.06)',
                      padding: '1.15rem',
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <div style={{ color: '#E6A11A', fontSize: '0.95rem', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                      ★★★★★
                    </div>
                    <p
                      style={{
                        fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
                        lineHeight: 1.65,
                        color: 'var(--body-on-light)',
                        marginBottom: '1rem',
                        fontStyle: 'italic',
                        fontWeight: 600,
                      }}
                    >
                      &ldquo;{displayText}&rdquo;
                    </p>
                    <div style={{ height: 1, background: 'rgba(17,24,39,0.08)', marginBottom: '0.9rem' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <div
                        aria-hidden="true"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '999px',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'linear-gradient(180deg, #F6B34A 0%, #EB8F1B 100%)',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--heading-on-light)' }}>
                          {displayName}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#E57E2C', fontWeight: 600 }}>
                          {isZh ? '认证顾客' : 'Verified Customer'}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. FESTIVAL HIGHLIGHT ── */}
      <FestivalHighlightSection
        festival={activeFestival}
        fallbackHeading={festivalHighlight.fallbackHeading}
        fallbackHeadingZh={festivalHighlight.fallbackHeadingZh}
        fallbackText={festivalHighlight.fallbackText}
        fallbackTextZh={festivalHighlight.fallbackTextZh}
        fallbackCta={festivalHighlight.fallbackCta}
        locale={locale}
        variant="section"
      />

      {/* ── 8. PRIVATE DINING CTA ── */}
      {privateDiningCta?.heading && (
        <section
          style={{
            padding: 'var(--section-py) var(--container-px)',
            background: privateDiningCta.image ? 'var(--primary)' : 'var(--backdrop-primary)',
            color: privateDiningCta.image ? 'var(--text-on-dark-primary)' : 'var(--heading-on-light)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {privateDiningCta.image && (
            <>
              <div
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${privateDiningCta.image})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
            </>
          )}
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', marginBottom: '1rem' }}>
              {isZh && privateDiningCta.headingZh ? privateDiningCta.headingZh : privateDiningCta.heading}
            </h2>
            <p style={{ maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.7, opacity: 0.85, fontSize: '0.95rem' }}>
              {isZh && privateDiningCta.subheadingZh ? privateDiningCta.subheadingZh : privateDiningCta.subheading}
            </p>
            {privateDiningCta.cta && (
              <a
                href={localizeUrl(privateDiningCta.cta.href || '/private-dining')}
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2.5rem',
                  background: 'var(--secondary)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                }}
              >
                {isZh && privateDiningCta.cta.textZh ? privateDiningCta.cta.textZh : privateDiningCta.cta.text}
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── 9. RESERVATIONS CTA ── */}
      {reservationsCta?.heading && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)', textAlign: 'center' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', marginBottom: '0.75rem' }}>
              {isZh && reservationsCta.headingZh ? reservationsCta.headingZh : reservationsCta.heading}
            </h2>
            <p style={{ color: 'var(--body-on-light)', marginBottom: '2rem', lineHeight: 1.7 }}>
              {isZh && reservationsCta.subheadingZh ? reservationsCta.subheadingZh : reservationsCta.subheading}
            </p>
            {reservationsCta.cta && (
              <a
                href={localizeUrl(reservationsCta.cta.href || '/reservations')}
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2.5rem',
                  background: 'var(--primary)',
                  color: 'var(--text-on-dark-primary)',
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                }}
              >
                {isZh && reservationsCta.cta.textZh ? reservationsCta.cta.textZh : reservationsCta.cta.text}
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── 10. STATS / TRUST BAR ── */}
      {trustBar?.stats?.length > 0 && (
        <section style={{ padding: '3rem var(--container-px)', background: 'var(--primary)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {trustBar.stats.map((stat: any, i: number) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--secondary)', lineHeight: 1.1, marginBottom: '0.4rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-on-dark-secondary)' }}>
                  {isZh && stat.labelZh ? stat.labelZh : stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
