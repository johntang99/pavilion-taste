import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { getBaseUrlFromHost } from '@/lib/seo';
import { getDefaultSite, getSiteByHost } from '@/lib/sites';
import { locales } from '@/lib/i18n';
import { programmaticCatalog } from '@/lib/seo/programmatic-catalog';

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = headers().get('host');
  const baseUrl = getBaseUrlFromHost(host);
  const site = (await getSiteByHost(host)) || (await getDefaultSite());

  if (!site) return [];

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Load site features (from English site.json)
  const siteJson = await readJsonFile<any>(
    path.join(CONTENT_DIR, site.id, 'en', 'site.json'),
  );
  const features = siteJson?.features || {};

  // ── Static pages × 3 locales ──────────────────────────────

  // Chinese restaurant static pages — EN + ZH only (skip es, ko for this template)
  const enabledLocales = ['en', 'zh'];

  const staticPages: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
    priority: number;
    gateFeature?: string;
  }> = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/menu', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/menu/dim-sum', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/menu/dinner', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/menu/chef-signatures', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/menu/weekend-brunch', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/menu/tasting-menu', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/festivals/chinese-new-year', changeFrequency: 'weekly', priority: 0.9, gateFeature: 'festival_pages' },
    { path: '/festivals/mid-autumn', changeFrequency: 'weekly', priority: 0.85, gateFeature: 'festival_pages' },
    { path: '/festivals/wedding-banquet', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/reservations', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/private-dining', changeFrequency: 'monthly', priority: 0.85, gateFeature: 'private_dining' },
    { path: '/catering', changeFrequency: 'monthly', priority: 0.8, gateFeature: 'catering' },
    { path: '/about', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/about/team', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/gallery', changeFrequency: 'monthly', priority: 0.7, gateFeature: 'gallery' },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/events', changeFrequency: 'weekly', priority: 0.75, gateFeature: 'events_section' },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.7, gateFeature: 'blog' },
    { path: '/press', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/gift-cards', changeFrequency: 'monthly', priority: 0.6, gateFeature: 'gift_cards' },
    { path: '/order-online', changeFrequency: 'monthly', priority: 0.75, gateFeature: 'online_ordering' },
    { path: '/careers', changeFrequency: 'monthly', priority: 0.5, gateFeature: 'careers' },
  ];

  for (const locale of enabledLocales) {
    for (const page of staticPages) {
      if (page.gateFeature && features[page.gateFeature] === false) continue;
      entries.push({
        url: new URL(`/${locale}${page.path}`, baseUrl).toString(),
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // ── Dynamic pages: events ─────────────────────────────────

  const eventsData = await readJsonFile<{ events: any[] }>(
    path.join(CONTENT_DIR, site.id, 'en', 'events', 'events.json'),
  );
  const events = (eventsData?.events || []).filter(
    (e: any) => e.published !== false && !e.cancelled,
  );

  for (const locale of enabledLocales) {
    for (const event of events) {
      const eventRouteId = event.slug || event.id;
      if (!eventRouteId) continue;
      entries.push({
        url: new URL(`/${locale}/events/${eventRouteId}`, baseUrl).toString(),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  // ── Dynamic pages: blog posts ─────────────────────────────

  const blogData = await readJsonFile<{ posts?: any[] } | any[]>(
    path.join(CONTENT_DIR, site.id, 'en', 'blog', 'posts.json'),
  );
  const posts = Array.isArray(blogData)
    ? blogData
    : (blogData as any)?.posts || blogData || [];
  const publishedPosts = (Array.isArray(posts) ? posts : []).filter(
    (p: any) => p.published !== false,
  );

  for (const locale of enabledLocales) {
    for (const post of publishedPosts) {
      entries.push({
        url: new URL(`/${locale}/blog/${post.slug}`, baseUrl).toString(),
        lastModified: post.publishDate
          ? new Date(post.publishDate)
          : now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  }

  // ── Programmatic SEO: cuisine × city pages ──────────────
  for (const locale of enabledLocales) {
    for (const page of programmaticCatalog) {
      entries.push({
        url: new URL(`/${locale}/${page.cuisineSlug}/${page.citySlug}`, baseUrl).toString(),
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      });
    }
  }

  return entries;
}
