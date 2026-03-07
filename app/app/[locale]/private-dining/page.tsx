import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { getBanquetPackagesBySiteId } from '@/lib/banquetDb';
import type { SiteInfoChinese, BanquetPackage } from '@/lib/chinese-restaurant-types';
import BanquetPackageCards from '@/components/sections/BanquetPackageCards';

interface PageProps {
  params: { locale: Locale };
}

function canUseDb() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Demo packages (used when DB is not configured)
const DEMO_PACKAGES: BanquetPackage[] = [
  {
    id: 'demo-business-lunch',
    siteId: 'grand-pavilion',
    name: 'Business Lunch',
    nameZh: '商务午宴',
    slug: 'business-lunch',
    tier: 'business-lunch',
    description: 'A refined set lunch for corporate gatherings, client meetings, and team celebrations.',
    descriptionZh: '精致商务午宴，适合企业聚餐、客户会面及团队庆典。',
    pricePerHead: 4500,
    minGuests: 10,
    maxGuests: 50,
    includes: ['4-course set menu', 'Welcome tea service', 'Private dining room', 'Dedicated service team'],
    includesZh: ['4道精选菜式', '迎宾茶服务', '私人用餐室', '专属服务团队'],
    highlight: 'Best for 10–50 guests · Business-appropriate menu',
    roomImage: null,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'demo-celebration',
    siteId: 'grand-pavilion',
    name: 'Celebration Dinner',
    nameZh: '庆典晚宴',
    slug: 'celebration-dinner',
    tier: 'celebration',
    description: 'Celebrate milestones in style — birthdays, anniversaries, retirements, and family reunions.',
    descriptionZh: '以精致格调庆祝人生里程碑——生日、周年纪念、退休及家庭团聚。',
    pricePerHead: 6800,
    minGuests: 10,
    maxGuests: 80,
    includes: ['6-course celebration menu', 'Welcome cocktails', 'Customized cake service', 'Private dining room', 'Dedicated event manager'],
    includesZh: ['6道庆典菜式', '迎宾饮品', '定制蛋糕服务', '私人宴厅', '专属活动经理'],
    highlight: 'Best for 10–80 guests · Birthdays, anniversaries, milestones',
    roomImage: null,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'demo-wedding',
    siteId: 'grand-pavilion',
    name: 'Wedding Banquet',
    nameZh: '婚宴',
    slug: 'wedding-banquet',
    tier: 'wedding-banquet',
    description: "Flushing's finest wedding banquet venue — traditional Cantonese style with modern elegance.",
    descriptionZh: '法拉盛最优质的婚宴场地——传统粤式风格与现代优雅的完美结合。',
    pricePerHead: 12800,
    minGuests: 50,
    maxGuests: 500,
    includes: ['12-course wedding banquet menu', 'Crispy Suckling Pig ceremony', 'Bridal suite access', 'Full A/V setup', 'Dedicated wedding coordinator', 'Bilingual service team'],
    includesZh: ['12道传统婚宴菜式', '标志性脆皮乳猪仪式', '新娘休息室使用', '全套影音设备', '专属婚礼统筹师', '中英双语服务团队'],
    highlight: "Flushing's premier Cantonese wedding banquet · 50–500 guests",
    roomImage: null,
    isActive: true,
    sortOrder: 3,
  },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const pageContent = await loadContent<any>(siteId, locale, 'pages/private-dining.json');
  return buildPageMetadata({ siteId, locale, title: pageContent?.seo?.title, description: pageContent?.seo?.description });
}

export default async function PrivateDiningPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/private-dining.json'),
  ]);

  // Load banquet packages from DB or demo
  let packages: BanquetPackage[] = DEMO_PACKAGES;
  if (canUseDb()) {
    const dbPkgs = await getBanquetPackagesBySiteId(siteId).catch(() => null);
    if (dbPkgs && dbPkgs.length > 0) packages = dbPkgs;
  }

  const isZh = locale === 'zh';
  const hero = pageContent?.hero || {};
  const rooms = pageContent?.rooms || [];
  const testimonials = pageContent?.testimonials || [];

  return (
    <div className="private-dining-page">
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          background: hero.image ? 'var(--primary)' : 'var(--primary)',
          color: 'var(--text-on-dark-primary)',
          overflow: 'hidden',
        }}
      >
        {hero.image && (
          <>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          </>
        )}
        <div style={{ position: 'relative', zIndex: 1, padding: '6rem var(--container-px)', maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
            {isZh ? '私人宴厅' : 'Private Dining'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
            {isZh && hero.headingZh ? hero.headingZh : hero.heading || (isZh ? '私人宴厅' : 'Private Dining & Banquets')}
          </h1>
          <p style={{ opacity: 0.8, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {isZh && hero.subheadingZh ? hero.subheadingZh : hero.subheading || (isZh ? '我们可为多达500位宾客提供宴席服务。' : 'Hosting an event? We do banquets for up to 500 guests.')}
          </p>
        </div>
      </section>

      {/* Room Options */}
      {rooms.length > 0 && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', textAlign: 'center', marginBottom: '3rem' }}>
              {isZh ? '宴席空间' : 'Our Spaces'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {rooms.map((room: any, i: number) => (
                <div key={i} style={{ background: 'var(--backdrop-primary)', borderRadius: 'var(--radius-base)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                  {room.image && (
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: 'var(--card-pad)' }}>
                    <div style={{ fontFamily: 'var(--font-display-zh)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--heading-on-light)', marginBottom: '0.25rem' }}>
                      {isZh && room.nameZh ? room.nameZh : room.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                      {isZh && room.capacityZh ? room.capacityZh : room.capacity}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--body-on-light)', lineHeight: 1.65 }}>
                      {isZh && room.descriptionZh ? room.descriptionZh : room.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banquet Packages */}
      <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', textAlign: 'center', marginBottom: '0.75rem' }}>
            {isZh ? '宴席套餐' : 'Banquet Packages'}
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--muted-on-light)', marginBottom: '3rem', fontSize: '0.9rem' }}>
            {isZh ? '每位价格，含专属服务团队及场地布置' : 'Per person pricing includes dedicated service and venue setup'}
          </p>
          <BanquetPackageCards packages={packages} locale={locale} />
        </div>
      </section>

      {/* Inquiry Form CTA */}
      <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', marginBottom: '0.75rem' }}>
          {isZh ? '申请报价' : 'Request a Quote'}
        </h2>
        <p style={{ color: 'var(--body-on-light)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          {isZh ? '告知我们您的活动详情，我们将在24小时内回复。' : 'Tell us about your event and we will respond within 24 hours.'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href={`/${locale}/contact`}
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
            {isZh ? '发送查询' : 'Submit Inquiry'}
          </a>
          {siteInfo?.phone && (
            <a
              href={`tel:${siteInfo.phone.replace(/\D/g, '')}`}
              style={{
                display: 'inline-block',
                padding: '0.875rem 2.5rem',
                background: 'transparent',
                color: 'var(--heading-on-light)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
              }}
            >
              {isZh ? `致电 ${siteInfo.phone}` : `Call ${siteInfo.phone}`}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
