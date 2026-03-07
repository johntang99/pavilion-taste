import { type Locale } from '@/lib/i18n';

interface BilinguaHeroHeadlineProps {
  en: string;
  zh: string;
  layout?: 'zh-above' | 'zh-below';
  locale?: Locale;
  className?: string;
  enClassName?: string;
  zhClassName?: string;
}

/**
 * BilinguaHeroHeadline — stacked EN serif + ZH brush headline.
 * Used in hero sections and festival pages.
 *
 * Layout rules:
 * - EN: light-weight editorial serif, max 3rem (restrained for legibility)
 * - ZH: bold Noto Serif SC, 1.6rem — decorative accent below EN
 * - Both inherit color from parent (parent must set dark-surface color)
 * - overflow-wrap: break-word prevents clipping on any viewport
 */
export default function BilinguaHeroHeadline({
  en,
  zh,
  layout = 'zh-below',
  locale,
  className = '',
  enClassName = '',
  zhClassName = '',
}: BilinguaHeroHeadlineProps) {
  const zhEl = (
    <span
      className={`block ${zhClassName}`}
      style={{
        fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
        fontWeight: 700,
        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        letterSpacing: '0.08em',
        lineHeight: 1.4,
        color: 'inherit',
        opacity: 0.85,                    /* slightly softer than EN line */
        marginTop: '0.4rem',
        display: 'var(--zh-name-display, block)',
      }}
      lang="zh-Hans"
    >
      {zh}
    </span>
  );

  const enEl = (
    <span
      className={`block ${enClassName}`}
      style={{
        fontFamily: 'var(--font-display, Georgia, serif)',
        fontWeight: 300,
        fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',   /* capped at 3.5rem — never clips */
        letterSpacing: '0.04em',
        lineHeight: 1.1,
        color: 'inherit',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      {en}
    </span>
  );

  return (
    <h1
      className={`bilingual-hero-headline ${className}`}
      style={{
        display: 'block',
        margin: 0,
        overflowWrap: 'break-word',
      }}
    >
      {layout === 'zh-above' ? (
        <>
          {zhEl}
          {enEl}
        </>
      ) : (
        <>
          {enEl}
          {zhEl}
        </>
      )}
    </h1>
  );
}
