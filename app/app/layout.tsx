import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter, Playfair_Display } from 'next/font/google';
import { locales, defaultLocale } from '@/lib/i18n';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Grand Pavilion 大观楼 — Cantonese Restaurant Flushing NY',
  description: 'Authentic Cantonese cuisine with over 80 dim sum varieties daily. Fine dining, private banquets, and festival menus in Flushing, New York.',
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
  },
};

const LOCALE_TO_LANG: Record<string, string> = {
  en: 'en',
  zh: 'zh-Hans',
  es: 'es',
  ko: 'ko',
};

function getLocaleFromPath(): string {
  try {
    const headersList = headers();
    const pathname = headersList.get('x-invoke-path') || headersList.get('x-next-url') || '';
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    if (firstSegment && locales.includes(firstSegment as any)) {
      return firstSegment;
    }
  } catch {}
  return defaultLocale;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocaleFromPath();
  const lang = LOCALE_TO_LANG[locale] || locale;
  return (
    <html lang={lang} suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
