import type { BanquetPackage } from '@/lib/chinese-restaurant-types';
import type { Locale } from '@/lib/i18n';

interface BanquetPackageCardsProps {
  packages: BanquetPackage[];
  locale?: Locale;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

const TIER_ICONS: Record<string, string> = {
  'business-lunch': '💼',
  'celebration': '🎉',
  'wedding-banquet': '🥂',
  'corporate': '🤝',
};

/**
 * BanquetPackageCards — grid of banquet package tiers with includes list.
 * Data from Supabase `banquet_packages` table or content JSON.
 */
export default function BanquetPackageCards({
  packages,
  locale = 'en',
}: BanquetPackageCardsProps) {
  const isZh = locale === 'zh';

  if (!packages.length) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--grid-gap, 1.5rem)' }}>
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          style={{
            background: 'var(--backdrop-primary)',
            borderRadius: 'var(--radius-base)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Card header */}
          <div style={{ background: 'var(--primary)', color: 'var(--text-on-dark-primary)', padding: '1.5rem var(--card-pad)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {TIER_ICONS[pkg.tier] || '🍽'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
                fontWeight: 700,
                fontSize: '1.2rem',
                marginBottom: '0.2rem',
              }}
              lang={isZh ? 'zh-Hans' : undefined}
            >
              {isZh ? pkg.nameZh : pkg.name}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.65, marginBottom: '0.75rem' }}>
              {isZh ? pkg.name : pkg.nameZh}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--secondary)' }}>
                {formatPrice(pkg.pricePerHead)}
              </span>
              <span style={{ fontSize: '0.8rem', opacity: 0.65 }}>
                {isZh ? '/位' : '/person'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
              {isZh
                ? `${pkg.minGuests}–${pkg.maxGuests}位宾客`
                : `${pkg.minGuests}–${pkg.maxGuests} guests`}
            </div>
          </div>

          {/* Description */}
          {(pkg.description || pkg.descriptionZh) && (
            <div style={{ padding: '1.25rem var(--card-pad) 0' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--body-on-light)', lineHeight: 1.65 }}>
                {isZh && pkg.descriptionZh ? pkg.descriptionZh : pkg.description}
              </p>
            </div>
          )}

          {/* Includes list */}
          {(pkg.includes.length > 0 || pkg.includesZh.length > 0) && (
            <div style={{ padding: 'var(--card-pad)', flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                {isZh ? '套餐内容' : 'Package Includes'}
              </div>
              {(isZh ? (pkg.includesZh.length ? pkg.includesZh : pkg.includes) : pkg.includes).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--body-on-light)' }}>
                  <span style={{ color: 'var(--seal-color, #8B0000)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Highlight badge */}
          {pkg.highlight && (
            <div style={{ padding: '0 var(--card-pad) 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--muted-on-light)', borderTop: 'var(--menu-divider)', paddingTop: '0.75rem' }}>
                ✦ {pkg.highlight}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ padding: '0 var(--card-pad) var(--card-pad)', marginTop: 'auto' }}>
            <a
              href={`/${locale}/private-dining`}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.7rem',
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
              {isZh ? '查询此套餐' : 'Inquire About This Package'}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
