import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfoChinese } from '@/lib/chinese-restaurant-types';
import DimSumStatusBadge from '@/components/ui/DimSumStatusBadge';

interface PageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/menu.json'),
  ]);
  return buildPageMetadata({ siteId, locale, title: pageContent?.seo?.title, description: pageContent?.seo?.description });
}

export default async function MenuHubPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/menu.json'),
  ]);

  const isZh = locale === 'zh';
  const categories = pageContent?.categories || [];
  const hero = pageContent?.hero || {};

  const localizeUrl = (url: string) => {
    if (!url || url.startsWith('http')) return url;
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    if (url === '/') return `/${locale}`;
    return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="chinese-restaurant-menu-hub">
      {/* Hero */}
      <section
        style={{
          padding: '5rem var(--container-px) 3rem',
          background: 'var(--primary)',
          color: 'var(--text-on-dark-primary)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          {isZh ? '菜单' : 'Menu'}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
          }}
        >
          {isZh && hero.headingZh ? hero.headingZh : hero.heading || (isZh ? '我们的菜单' : 'Our Menus')}
        </h1>
        <p style={{ opacity: 0.75, fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          {isZh && hero.subheadingZh ? hero.subheadingZh : hero.subheading || ''}
        </p>
        {/* Live dim sum status */}
        <DimSumStatusBadge
          dimSumHours={siteInfo?.dimSumHours}
          weekendBrunchHours={siteInfo?.weekendBrunchHours}
          locale={locale}
          className="mt-4"
        />
      </section>

      {/* Category nav pills */}
      <div style={{ background: 'var(--backdrop-secondary)', borderBottom: 'var(--menu-divider)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'flex', gap: '0.25rem', padding: '0.75rem var(--container-px)', flexWrap: 'nowrap', minWidth: 'max-content' }}>
          {categories.map((cat: any) => (
            <a
              key={cat.id}
              href={localizeUrl(cat.href)}
              style={{
                display: 'inline-block',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--btn-radius, 2px)',
                border: '1px solid var(--border-default)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--heading-on-light)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {isZh && cat.nameZh ? cat.nameZh : cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* Category Cards Grid */}
      <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--grid-gap)' }}>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={localizeUrl(cat.href)}
              style={{
                display: 'block',
                textDecoration: 'none',
                background: 'var(--backdrop-primary)',
                borderRadius: 'var(--radius-base)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                transition: 'box-shadow var(--duration-base)',
              }}
            >
              {/* Card image */}
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--backdrop-secondary)' }}>
                {cat.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} aria-hidden="true" />
                )}
                {cat.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      background: 'var(--secondary)',
                      color: 'var(--primary)',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      borderRadius: 'var(--radius-base)',
                    }}
                  >
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Card content */}
              <div style={{ padding: 'var(--card-pad)' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'var(--heading-on-light)',
                    marginBottom: '0.2rem',
                    lineHeight: 1.2,
                  }}
                  lang="zh-Hans"
                >
                  {cat.nameZh}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--body-on-light)', marginBottom: '0.75rem' }}>
                  {cat.name}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-on-light)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {isZh && cat.descriptionZh ? cat.descriptionZh : cat.description}
                </p>
                {cat.hours && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {isZh && cat.hoursZh ? cat.hoursZh : cat.hours}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Allergen note */}
      {pageContent?.allergenNote && (
        <div style={{ padding: '1.5rem var(--container-px)', textAlign: 'center', background: 'var(--backdrop-secondary)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted-on-light)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            {isZh && pageContent.allergenNoteZh ? pageContent.allergenNoteZh : pageContent.allergenNote}
          </p>
        </div>
      )}
    </div>
  );
}
