import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfoChinese } from '@/lib/chinese-restaurant-types';

interface PageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const pageContent = await loadContent<any>(siteId, locale, 'pages/catering.json');
  return buildPageMetadata({ siteId, locale, title: pageContent?.seo?.title, description: pageContent?.seo?.description });
}

export default async function CateringPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/catering.json'),
  ]);

  const isZh = locale === 'zh';
  const hero = pageContent?.hero || {};
  const services = pageContent?.services || [];

  return (
    <div className="catering-page">
      <section style={{ padding: '5rem var(--container-px) 3rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
          {isZh && hero.headingZh ? hero.headingZh : hero.heading || (isZh ? '外卖餐饮服务' : 'Catering Services')}
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '520px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {isZh && hero.subheadingZh ? hero.subheadingZh : hero.subheading || ''}
        </p>
      </section>

      <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto 3rem', textAlign: 'center' }}>
            <p style={{ lineHeight: 1.8, color: 'var(--body-on-light)', fontSize: '0.95rem' }}>
              {isZh && pageContent?.descriptionZh ? pageContent.descriptionZh : pageContent?.description || ''}
            </p>
          </div>

          {services.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              {services.map((service: any, i: number) => (
                <div key={i} style={{ background: 'var(--backdrop-secondary)', borderRadius: 'var(--radius-base)', padding: 'var(--card-pad)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display-zh)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--heading-on-light)', marginBottom: '0.5rem' }}>
                    {isZh && service.nameZh ? service.nameZh : service.name}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--body-on-light)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                    {service.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)' }}>
                    {isZh ? `最少${service.minGuests}位宾客` : `Min. ${service.minGuests} guests`}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href={`/${locale}/contact`} style={{ display: 'inline-block', padding: '0.875rem 2.5rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', borderRadius: 'var(--radius-base)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>
              {isZh ? '申请外卖报价' : 'Request a Catering Quote'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
