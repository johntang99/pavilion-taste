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
  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/about.json'),
  ]);
  return buildPageMetadata({ siteId, locale, title: pageContent?.seo?.title, description: pageContent?.seo?.description });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/about.json'),
  ]);

  const isZh = locale === 'zh';
  const chef = pageContent?.chef || {};
  const story = pageContent?.story || {};
  const stats = pageContent?.stats || [];

  return (
    <div className="about-page">

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--primary)',
          color: 'var(--text-on-dark-primary)',
          overflow: 'hidden',
        }}
      >
        {pageContent?.hero?.image && (
          <>
            <div
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${pageContent.hero.image})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          </>
        )}
        <div style={{ position: 'relative', zIndex: 1, padding: '6rem var(--container-px)', maxWidth: 'var(--container-max)', width: '100%', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
            {isZh ? '关于我们' : 'Our Story'}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            {isZh && pageContent?.hero?.headingZh ? pageContent.hero.headingZh : (pageContent?.hero?.heading || (isZh ? '我们的故事' : 'Our Story'))}
          </h1>
        </div>
      </section>

      {/* Chef Portrait Section */}
      {chef.name && (
        <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'start' }}>
            {chef.image && (
              <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 'var(--radius-base)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={chef.image} alt={chef.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '1rem' }}>
                {isZh ? '行政主厨' : 'Executive Chef'}
              </p>
              {/* ZH name large */}
              <div
                style={{
                  fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
                  fontWeight: 700,
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  color: 'var(--heading-on-light)',
                  lineHeight: 1.1,
                  marginBottom: '0.25rem',
                }}
                lang="zh-Hans"
              >
                {isZh && chef.nameZh ? chef.nameZh : chef.nameZh || chef.name}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--body-on-light)', marginBottom: '0.25rem' }}>
                {chef.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted-on-light)', marginBottom: '1.5rem' }}>
                {isZh && chef.titleZh ? chef.titleZh : chef.title}
              </div>

              {/* Credentials */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                {(isZh ? (chef.credentialsZh || chef.credentials) : chef.credentials)?.map((cred: string, i: number) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.3rem 0.8rem',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-base)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--body-on-light)',
                    }}
                  >
                    {cred}
                  </span>
                ))}
              </div>

              {/* Training */}
              {chef.training && (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-on-light)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  {isZh && chef.trainingZh ? chef.trainingZh : chef.training}
                </p>
              )}

              {/* Quote */}
              {chef.quote && (
                <blockquote
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderLeft: '3px solid var(--seal-color, #8B0000)',
                    background: 'var(--backdrop-secondary)',
                    borderRadius: '0 var(--radius-base) var(--radius-base) 0',
                    marginBottom: '1.75rem',
                  }}
                >
                  <p style={{ fontStyle: 'italic', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--body-on-light)', margin: 0 }}>
                    &ldquo;{isZh && chef.quoteZh ? chef.quoteZh : chef.quote}&rdquo;
                  </p>
                </blockquote>
              )}

              {/* Bio */}
              {chef.bio && (
                <div>
                  {(isZh && chef.bioZh ? chef.bioZh : chef.bio).split('\n\n').map((para: string, i: number) => (
                    <p key={i} style={{ lineHeight: 1.8, color: 'var(--body-on-light)', marginBottom: '1rem', fontSize: '0.925rem' }}>
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Restaurant Story */}
      {story.heading && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading)',
                color: 'var(--heading-on-light)',
                marginBottom: '2rem',
              }}
            >
              {isZh && story.headingZh ? story.headingZh : story.heading}
            </h2>
            {(isZh && story.bodyZh ? story.bodyZh : story.body).split('\n\n').map((para: string, i: number) => (
              <p key={i} style={{ lineHeight: 1.85, color: 'var(--body-on-light)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <section style={{ padding: '4rem var(--container-px)', background: 'var(--primary)', color: 'var(--text-on-dark-primary)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((stat: any, i: number) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--secondary)', lineHeight: 1.1, marginBottom: '0.4rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.7))' }}>
                  {isZh && stat.labelZh ? stat.labelZh : stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Book CTA */}
      <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', marginBottom: '0.75rem' }}>
          {isZh ? '欢迎光临大观楼' : 'Join Us at Grand Pavilion'}
        </h2>
        <p style={{ color: 'var(--body-on-light)', marginBottom: '2rem' }}>
          {isZh ? '体验正宗粤菜的艺术与传承。' : 'Experience the art and tradition of authentic Cantonese cuisine.'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href={`/${locale}/reservations`}
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
            {isZh ? '预约餐桌' : 'Reserve a Table'}
          </a>
          <a
            href={`/${locale}/menu`}
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
            {isZh ? '查看菜单' : 'View Menu'}
          </a>
        </div>
      </section>
    </div>
  );
}
