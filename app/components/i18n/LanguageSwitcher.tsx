'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale, switchLocale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  variant?: 'default' | 'topbar';
  /** Locales enabled for this site. Defaults to ['en','zh'] for Chinese restaurant. */
  enabledLocales?: string[];
}

const ALL_LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'ES' },
  { code: 'ko', label: '한국' },
];

export default function LanguageSwitcher({
  currentLocale,
  variant = 'default',
  enabledLocales = ['en', 'zh'],
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Only show languages that are enabled for this site
  const languages = ALL_LANGUAGES.filter((l) => enabledLocales.includes(l.code));

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    const newPath = switchLocale(pathname, newLocale);
    router.push(newPath);
  };

  if (languages.length <= 1) return null;

  if (variant === 'topbar') {
    return (
      <div className="flex items-center gap-1">
        {languages.map((lang, i) => (
          <span key={lang.code} className="flex items-center">
            <button
              onClick={() => handleLocaleChange(lang.code)}
              style={{
                fontSize: 'var(--text-small, 0.8125rem)',
                fontWeight: currentLocale === lang.code ? 700 : 400,
                color: currentLocale === lang.code
                  ? 'var(--text-color-primary)'
                  : 'var(--text-color-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 0.1rem',
                transition: 'color var(--duration-fast, 150ms)',
              }}
            >
              {lang.label}
            </button>
            {i < languages.length - 1 && (
              <span style={{ color: 'var(--border-default)', marginLeft: '0.25rem', marginRight: '0.1rem' }}>|</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center overflow-hidden"
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-base)',
      }}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLocaleChange(lang.code)}
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: 'var(--text-small, 0.8125rem)',
            fontWeight: currentLocale === lang.code ? 700 : 500,
            background: currentLocale === lang.code
              ? 'var(--primary)'
              : 'var(--color-surface)',
            color: currentLocale === lang.code
              ? 'var(--text-on-dark-primary)'
              : 'var(--text-color-secondary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--duration-fast, 150ms)',
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
