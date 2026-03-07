import type { Festival, PrixFixeTier } from '@/lib/chinese-restaurant-types';
import type { Locale } from '@/lib/i18n';
import FestivalCountdown from '@/components/ui/FestivalCountdown';
import InkWashOverlay from '@/components/ui/InkWashOverlay';

interface FestivalPageProps {
  festival: Festival;
  locale: Locale;
  ctaPrimary?: { text: string; textZh?: string; href: string };
  ctaSecondary?: { text: string; textZh?: string; href: string };
  giftBoxes?: any;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

/**
 * FestivalPage — reusable full-page layout for any Chinese festival.
 * Sections: hero, story/meaning, prix-fixe tiers, booking, gift boxes (optional).
 */
export default function FestivalPage({
  festival,
  locale,
  ctaPrimary,
  ctaSecondary,
  giftBoxes,
}: FestivalPageProps) {
  const isZh = locale === 'zh';
  const name = isZh ? festival.nameZh : festival.name;
  const tagline = isZh ? festival.taglineZh : festival.tagline;
  const description = isZh ? festival.descriptionZh : festival.description;
  const urgency = festival.urgencyMessage;

  const localizeUrl = (url: string) => {
    if (!url || url.startsWith('http')) return url;
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="festival-page">

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: festival.heroImage ? 'var(--primary)' : 'var(--backdrop-secondary)',
          color: festival.heroImage ? 'var(--text-on-dark-primary)' : 'var(--heading-on-light)',
        }}
      >
        {festival.heroImage && (
          <>
            <div
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${festival.heroImage})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />
            <InkWashOverlay />
          </>
        )}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '6rem var(--container-px) 4rem',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Festival label */}
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--festival-accent, #C9A84C)', marginBottom: '1rem' }}>
            {isZh ? '节庆活动' : 'Festival Menu'} · {festival.year}
          </p>

          {/* Festival name — large ZH/EN */}
          <h1
            style={{
              fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
            lang={isZh ? 'zh-Hans' : undefined}
          >
            {name}
          </h1>

          {tagline && (
            <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', opacity: 0.85, maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              {tagline}
            </p>
          )}

          {/* Urgency */}
          {urgency && (
            <div style={{ marginBottom: '2rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.4rem 1rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: 'var(--color-error, #ef4444)',
                borderRadius: 'var(--badge-radius, 2px)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}>
                ⚡ {urgency}
              </span>
            </div>
          )}

          {/* Countdown */}
          <FestivalCountdown
            targetDate={festival.activeDateStart}
            locale={locale}
            className="mb-8"
          />

          {/* CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {ctaPrimary && (
              <a
                href={localizeUrl(ctaPrimary.href)}
                style={{
                  display: 'inline-block',
                  padding: '0.9rem 2.5rem',
                  background: 'var(--festival-accent, #C9A84C)',
                  color: 'var(--primary, #1A1A1A)',
                  borderRadius: 'var(--btn-radius, 2px)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                }}
              >
                {isZh && ctaPrimary.textZh ? ctaPrimary.textZh : ctaPrimary.text}
              </a>
            )}
            {ctaSecondary && (
              <a
                href={localizeUrl(ctaSecondary.href)}
                style={{
                  display: 'inline-block',
                  padding: '0.9rem 2.5rem',
                  background: 'transparent',
                  color: 'inherit',
                  border: '1px solid currentColor',
                  borderRadius: 'var(--btn-radius, 2px)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  opacity: 0.8,
                }}
              >
                {isZh && ctaSecondary.textZh ? ctaSecondary.textZh : ctaSecondary.text}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Description / Story */}
      {description && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', marginBottom: '1.5rem' }}>
              {isZh ? `关于${name}` : `About ${festival.name}`}
            </h2>
            {description.split('\n\n').map((para, i) => (
              <p key={i} style={{ lineHeight: 1.85, color: 'var(--body-on-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Prix-Fixe Tiers */}
      {festival.prixFixeTiers && festival.prixFixeTiers.length > 0 && (
        <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', textAlign: 'center', marginBottom: '0.75rem' }}>
              {isZh ? '节庆套餐' : 'Festival Menus'}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--muted-on-light)', marginBottom: '3rem', fontSize: '0.9rem' }}>
              {isZh ? '每位价格，含服务费' : 'Per person, includes service'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {festival.prixFixeTiers.map((tier: PrixFixeTier) => (
                <div
                  key={tier.id}
                  style={{
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-base)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-card)',
                    background: 'var(--backdrop-primary)',
                  }}
                >
                  {/* Tier header */}
                  <div style={{ background: 'var(--primary)', color: 'var(--text-on-dark-primary)', padding: '1.5rem var(--card-pad)' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        marginBottom: '0.25rem',
                      }}
                      lang="zh-Hans"
                    >
                      {isZh ? tier.tierNameZh : tier.tierName}
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                      {tier.tierName !== tier.tierNameZh && (isZh ? tier.tierName : tier.tierNameZh)}
                    </div>
                    <div style={{ marginTop: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--secondary)' }}>
                      {formatPrice(tier.pricePerPerson)}
                      <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.7, marginLeft: '0.25rem' }}>
                        {isZh ? '/位' : '/person'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: '0.25rem' }}>
                      {isZh ? `${tier.minGuests}位起` : `Min. ${tier.minGuests} guests`}
                    </div>
                  </div>

                  {/* Courses */}
                  <div style={{ padding: 'var(--card-pad)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', marginBottom: '1rem' }}>
                      {isZh ? '菜单内容' : 'Menu Courses'}
                    </div>
                    {tier.courses.map((course, i) => (
                      <div key={i} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: i < tier.courses.length - 1 ? 'var(--menu-divider)' : 'none' }}>
                        <div style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--heading-on-light)', marginBottom: '0.15rem' }} lang="zh-Hans">
                          {isZh ? course.dishZh : course.dish}
                        </div>
                        {!isZh && <div style={{ fontSize: '0.75rem', color: 'var(--muted-on-light)', fontStyle: 'italic' }} lang="zh-Hans">{course.dishZh}</div>}
                        {course.description && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--body-on-light)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                            {course.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ padding: '0 var(--card-pad) var(--card-pad)' }}>
                    {ctaPrimary && (
                      <a
                        href={localizeUrl(ctaPrimary.href)}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '0.75rem',
                          background: 'var(--secondary)',
                          color: 'var(--primary)',
                          borderRadius: 'var(--radius-base)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          textDecoration: 'none',
                        }}
                      >
                        {isZh ? '预约此套餐' : 'Reserve This Menu'}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift Boxes (optional) */}
      {giftBoxes?.enabled && giftBoxes.items?.length > 0 && (
        <section style={{ padding: 'var(--section-py) var(--container-px)', background: 'var(--backdrop-secondary)' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', textAlign: 'center', marginBottom: '3rem' }}>
              {isZh && giftBoxes.headingZh ? giftBoxes.headingZh : giftBoxes.heading}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {giftBoxes.items.map((item: any, i: number) => (
                <div key={i} style={{ background: 'var(--backdrop-primary)', borderRadius: 'var(--radius-base)', padding: 'var(--card-pad)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--heading-on-light)', marginBottom: '0.4rem' }} lang="zh-Hans">
                    {isZh && item.nameZh ? item.nameZh : item.name}
                  </div>
                  {item.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--body-on-light)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                      {item.description}
                    </p>
                  )}
                  <div style={{ fontWeight: 700, color: 'var(--heading-on-light)' }}>
                    ${(item.price / 100).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
            {giftBoxes.orderDeadline && (
              <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--muted-on-light)' }}>
                {isZh && giftBoxes.orderDeadlineZh ? giftBoxes.orderDeadlineZh : `Order by: ${giftBoxes.orderDeadline}`}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Final booking CTA */}
      <section style={{ padding: '4rem var(--container-px)', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', marginBottom: '0.75rem' }}>
          {isZh ? '立即预约' : 'Reserve Your Table'}
        </h2>
        {urgency && (
          <p style={{ opacity: 0.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ⚡ {urgency}
          </p>
        )}
        {ctaPrimary && (
          <a
            href={localizeUrl(ctaPrimary.href)}
            style={{
              display: 'inline-block',
              padding: '0.9rem 2.5rem',
              background: 'var(--festival-accent, #C9A84C)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius-base)',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textDecoration: 'none',
            }}
          >
            {isZh && ctaPrimary.textZh ? ctaPrimary.textZh : ctaPrimary.text}
          </a>
        )}
      </section>
    </div>
  );
}
