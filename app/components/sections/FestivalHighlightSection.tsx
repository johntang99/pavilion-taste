import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import type { Festival } from '@/lib/chinese-restaurant-types';

interface FestivalHighlightSectionProps {
  festival?: Festival | null;
  fallbackHeading?: string;
  fallbackHeadingZh?: string;
  fallbackText?: string;
  fallbackTextZh?: string;
  fallbackCta?: { text: string; textZh?: string; href: string };
  locale?: Locale;
  variant?: 'banner' | 'section';
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * FestivalHighlightSection — auto-activates based on active festival from DB.
 * Two variants:
 * - 'banner': full-width announcement band (used in home page after gallery)
 * - 'section': larger full-bleed section with countdown
 */
export default function FestivalHighlightSection({
  festival,
  fallbackHeading = 'Upcoming Festival Events',
  fallbackHeadingZh = '即将到来的节庆活动',
  fallbackText = 'Celebrate Chinese holidays with us — special menus for Chinese New Year, Mid-Autumn Festival, and more.',
  fallbackTextZh = '与我们共庆中国传统节日——农历新年、中秋节等节庆特别菜单。',
  fallbackCta,
  locale = 'en',
  variant = 'section',
}: FestivalHighlightSectionProps) {
  const isZh = locale === 'zh';

  if (!festival) {
    // Fallback state — no active festival
    return (
      <section
        style={{
          padding: 'var(--section-py, 5rem) var(--container-px, 2rem)',
          background: 'var(--backdrop-secondary, #EBE4D8)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 'var(--container-max, 1200px)', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading, Georgia, serif)',
              fontSize: 'var(--text-heading, 2.25rem)',
              color: 'var(--heading-on-light, #1A1A1A)',
              marginBottom: '1rem',
            }}
          >
            {isZh ? fallbackHeadingZh : fallbackHeading}
          </h2>
          <p
            style={{
              maxWidth: '560px',
              margin: '0 auto 2rem',
              color: 'var(--body-on-light, #4B5563)',
              lineHeight: 1.7,
            }}
          >
            {isZh ? fallbackTextZh : fallbackText}
          </p>
          {fallbackCta && (
            <Link
              href={fallbackCta.href}
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'var(--primary, #1A1A1A)',
                color: 'var(--text-on-dark-primary, #F5F0E8)',
                borderRadius: 'var(--btn-radius, 2px)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
              }}
            >
              {isZh && fallbackCta.textZh ? fallbackCta.textZh : fallbackCta.text}
            </Link>
          )}
        </div>
      </section>
    );
  }

  const daysUntilEnd = getDaysUntil(festival.activeDateEnd);
  const heading = isZh ? festival.nameZh : festival.name;
  const tagline = isZh ? festival.taglineZh : festival.tagline;
  const urgency = isZh
    ? festival.urgencyMessage?.replace(/Only (\d+)/, '$1席')
    : festival.urgencyMessage;

  if (variant === 'banner') {
    return (
      <div
        style={{
          background: 'var(--festival-accent, #C9A84C)',
          padding: '1.25rem var(--container-px, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: isZh ? 'var(--font-display-zh, "Noto Serif SC", serif)' : 'var(--font-display, Georgia, serif)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--primary, #1A1A1A)',
            }}
          >
            {heading}
          </span>
          {tagline && (
            <span style={{ color: 'var(--primary, #1A1A1A)', opacity: 0.75, marginLeft: '0.75rem', fontSize: '0.9rem' }}>
              — {tagline}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          {urgency && (
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              ⚡ {urgency}
            </span>
          )}
          <Link
            href={`/festivals/${festival.slug}`}
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.25rem',
              background: 'var(--primary, #1A1A1A)',
              color: 'var(--text-on-dark-primary, #F5F0E8)',
              borderRadius: 'var(--btn-radius, 2px)',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {isZh ? '立即预约' : 'Reserve Now'}
          </Link>
        </div>
      </div>
    );
  }

  // 'section' variant — full-bleed with more info
  return (
    <section
      style={{
        padding: 'var(--section-py, 5rem) var(--container-px, 2rem)',
        background: festival.heroImage
          ? 'var(--primary, #1A1A1A)'
          : 'var(--backdrop-secondary, #EBE4D8)',
        color: festival.heroImage ? 'var(--text-on-dark-primary, #F5F0E8)' : 'var(--heading-on-light, #1A1A1A)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max, 1200px)', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Festival label */}
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            opacity: 0.7,
            marginBottom: '1rem',
            color: 'var(--festival-accent, #C9A84C)',
          }}
        >
          {isZh ? '节庆活动' : 'Festival Event'}
        </p>

        {/* Festival name */}
        <h2
          style={{
            fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
          }}
        >
          {heading}
        </h2>

        {/* Tagline */}
        {tagline && (
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              opacity: 0.85,
              marginBottom: '2rem',
              maxWidth: '560px',
              margin: '0 auto 2rem',
              lineHeight: 1.6,
            }}
          >
            {tagline}
          </p>
        )}

        {/* Urgency */}
        {urgency && (
          <p
            style={{
              display: 'inline-block',
              padding: '0.4rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: 'var(--color-error, #ef4444)',
              borderRadius: 'var(--badge-radius, 2px)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '2rem',
            }}
          >
            ⚡ {urgency}
          </p>
        )}

        {/* Days remaining */}
        {daysUntilEnd > 0 && daysUntilEnd < 30 && (
          <p style={{ opacity: 0.65, fontSize: '0.85rem', marginBottom: '2rem' }}>
            {isZh ? `活动还剩${daysUntilEnd}天` : `${daysUntilEnd} days remaining`}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href={`/festivals/${festival.slug}`}
            style={{
              display: 'inline-block',
              padding: '0.875rem 2.5rem',
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
            {isZh ? '查看节庆菜单' : 'View Festival Menu'}
          </Link>
          <Link
            href="/reservations"
            style={{
              display: 'inline-block',
              padding: '0.875rem 2.5rem',
              background: 'transparent',
              color: 'inherit',
              border: '1px solid currentColor',
              borderRadius: 'var(--btn-radius, 2px)',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              opacity: 0.85,
            }}
          >
            {isZh ? '立即预约' : 'Reserve Now'}
          </Link>
        </div>
      </div>
    </section>
  );
}
