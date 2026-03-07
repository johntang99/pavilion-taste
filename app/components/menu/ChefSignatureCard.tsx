import Image from 'next/image';
import { type Locale } from '@/lib/i18n';

interface ChefSignatureCardProps {
  id: string;
  name: string;
  nameZh: string;
  description?: string | null;
  price?: number | null;
  priceNote?: string | null;
  image?: string | null;
  chefNote?: string | null;
  chefNoteZh?: string | null;
  pairingNote?: string | null;
  originRegion?: string | null;
  index?: number;
  locale?: Locale;
}

function formatPrice(price: number | null | undefined, priceNote: string | null | undefined, locale: string): string {
  if (price == null) return priceNote || (locale === 'zh' ? '时价' : 'Market Price');
  return `$${(price / 100).toFixed(0)}`;
}

/** Red seal (chop) SVG accent used in chef signature sections */
function SealAccent() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 28,
        height: 28,
        background: 'var(--seal-color, #8B0000)',
        flexShrink: 0,
        borderRadius: 2,
      }}
    />
  );
}

/**
 * ChefSignatureCard — individual signature dish card with:
 * - Alternating image left/right layout
 * - nameZh large in Noto Serif SC
 * - Chef's note in italic quote
 * - Red seal accent
 * - Tea/wine pairing suggestion
 */
export default function ChefSignatureCard({
  id,
  name,
  nameZh,
  description,
  price,
  priceNote,
  image,
  chefNote,
  chefNoteZh,
  pairingNote,
  originRegion,
  index = 0,
  locale = 'en',
}: ChefSignatureCardProps) {
  const isImageLeft = index % 2 === 0;
  const displayChefNote = locale === 'zh' && chefNoteZh ? chefNoteZh : chefNote;
  const displayPrice = formatPrice(price, priceNote, locale);

  return (
    <article
      id={`signature-${id}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        padding: '3rem 0',
        borderBottom: 'var(--menu-divider, 1px solid rgba(0,0,0,0.08))',
      }}
      className="chef-signature-card"
    >
      {/* Image */}
      <div
        style={{
          order: isImageLeft ? 0 : 1,
          position: 'relative',
          aspectRatio: '4/3',
          overflow: 'hidden',
          borderRadius: 'var(--card-radius, 2px)',
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={`${name} — ${nameZh}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--backdrop-secondary, #EBE4D8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '3rem', color: 'var(--text-color-muted)' }}>🍽</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ order: isImageLeft ? 1 : 0 }}>
        {/* ZH name — large brush treatment */}
        <div
          style={{
            fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
            lineHeight: 1.1,
            color: 'var(--heading-on-light, #1A1A1A)',
            marginBottom: '0.25rem',
          }}
          lang="zh-Hans"
        >
          {nameZh}
        </div>

        {/* EN name */}
        <div
          style={{
            fontFamily: 'var(--font-display, Georgia, serif)',
            fontWeight: 400,
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            color: 'var(--body-on-light, #4B5563)',
            marginBottom: '1rem',
            letterSpacing: '0.02em',
          }}
        >
          {name}
        </div>

        {/* Origin region badge */}
        {originRegion && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--secondary, #C9A84C)',
              border: '1px solid var(--secondary, #C9A84C)',
              borderRadius: 'var(--badge-radius, 2px)',
              padding: '0.2em 0.6em',
              marginBottom: '1rem',
            }}
          >
            {originRegion}
          </span>
        )}

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'var(--body-on-light, #4B5563)',
              marginBottom: '1.5rem',
            }}
          >
            {description}
          </p>
        )}

        {/* Chef's note */}
        {displayChefNote && (
          <blockquote
            style={{
              position: 'relative',
              padding: '1.25rem 1.5rem',
              background: 'var(--backdrop-secondary, #F5F0E8)',
              borderLeft: '3px solid var(--seal-color, #8B0000)',
              borderRadius: '0 var(--card-radius, 2px) var(--card-radius, 2px) 0',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
              }}
            >
              <SealAccent />
            </div>
            <p
              style={{
                fontStyle: 'italic',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: 'var(--body-on-light, #4B5563)',
                margin: 0,
                paddingRight: '2.5rem',
              }}
            >
              &ldquo;{displayChefNote}&rdquo;
            </p>
            <footer
              style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-color-muted)',
              }}
            >
              — {locale === 'zh' ? '李伟主厨' : 'Chef Li Wei'}
            </footer>
          </blockquote>
        )}

        {/* Pairing */}
        {pairingNote && (
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-color-muted)',
              marginBottom: '1rem',
              fontStyle: 'italic',
            }}
          >
            ✦ {locale === 'zh' ? '搭配建议：' : 'Pairing: '}{pairingNote}
          </p>
        )}

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'var(--heading-on-light, #1A1A1A)',
            }}
          >
            {displayPrice}
          </span>
          <a
            href="/reservations"
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.25rem',
              background: 'var(--primary, #1A1A1A)',
              color: 'var(--text-on-dark-primary, #F5F0E8)',
              borderRadius: 'var(--btn-radius, 2px)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            {locale === 'zh' ? '预约品尝' : 'Reserve to Experience'}
          </a>
        </div>
      </div>
    </article>
  );
}
