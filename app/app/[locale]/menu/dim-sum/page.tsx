import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfoChinese, ChineseMenuItem } from '@/lib/chinese-restaurant-types';
import { getDimSumItemsGrouped, getMenuCategoriesBySiteId } from '@/lib/menuDb';
import DimSumStatusBadge from '@/components/ui/DimSumStatusBadge';

interface PageProps {
  params: { locale: Locale };
}

function canUseDb() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function formatPrice(price?: number | null, priceNote?: string | null, locale?: string): string {
  if (!price) return priceNote || (locale === 'zh' ? '时价' : 'Market');
  return `$${(price / 100).toFixed(0)}`;
}

const DIM_SUM_ORDER = ['steamed', 'baked', 'fried', 'congee-noodle', 'dessert', 'other'];
const CATEGORY_LABELS: Record<string, { en: string; zh: string } | undefined> = {
  steamed:       { en: 'Steamed', zh: '蒸点' },
  baked:         { en: 'Baked & Pastry', zh: '烘焙' },
  fried:         { en: 'Fried', zh: '酥炸' },
  'congee-noodle': { en: 'Congee & Noodles', zh: '粥面' },
  dessert:       { en: 'Desserts', zh: '甜品' },
  other:         { en: 'Other', zh: '其他' },
};

function DietaryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.4rem',
      border: `1px solid ${color}`,
      borderRadius: '2px',
      fontSize: '0.65rem',
      fontWeight: 700,
      color,
      marginRight: '0.25rem',
    }}>
      {label}
    </span>
  );
}

function MenuItemRow({ item, locale }: { item: ChineseMenuItem; locale: string }) {
  const isZh = locale === 'zh';
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      padding: 'var(--menu-item-py, 1.1rem) 0',
      borderBottom: 'var(--menu-divider)',
      gap: '1rem',
    }}>
      <div style={{ flex: 1 }}>
        {/* ZH name — large */}
        <div
          style={{
            fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--heading-on-light)',
            lineHeight: 1.2,
            marginBottom: '0.15rem',
          }}
          lang="zh-Hans"
        >
          {item.nameZh}
        </div>
        {/* EN name (hidden in ZH mode) */}
        {!isZh && (
          <div style={{ fontSize: '0.8rem', color: 'var(--body-on-light)', marginBottom: '0.25rem' }}>
            {item.name}
          </div>
        )}
        {/* Description */}
        {(isZh ? item.descriptionZh : item.description) && (
          <div style={{ fontSize: '0.8rem', color: 'var(--muted-on-light)', lineHeight: 1.55, marginBottom: '0.3rem' }}>
            {isZh ? (item.descriptionZh || item.description) : item.description}
          </div>
        )}
        {/* Dietary badges */}
        <div>
          {item.isVegetarian && <DietaryBadge label="素" color="#22c55e" />}
          {item.isVegan && <DietaryBadge label="全素" color="#16a34a" />}
          {item.isHalal && <DietaryBadge label="清真" color="#0ea5e9" />}
          {item.isGlutenFree && <DietaryBadge label="无麸质" color="#f59e0b" />}
          {item.spiceLevel && item.spiceLevel > 0 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--color-error, #ef4444)' }}>
              {'🌶'.repeat(item.spiceLevel)}
            </span>
          )}
        </div>
      </div>
      {/* Price + image */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {item.image && (
          <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-base)', overflow: 'hidden', marginBottom: '0.4rem', marginLeft: 'auto' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
        )}
        <div style={{
          fontFamily: 'var(--font-display, Georgia, serif)',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--heading-on-light)',
          whiteSpace: 'nowrap',
        }}>
          {formatPrice(item.price, item.priceNote, locale)}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const pageContent = await loadContent<any>(siteId, locale, 'pages/dim-sum.json');
  return buildPageMetadata({ siteId, locale, title: pageContent?.seo?.title, description: pageContent?.seo?.description });
}

export default async function DimSumPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const isZh = locale === 'zh';

  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/dim-sum.json'),
  ]);

  // Load dim sum items from DB, grouped by category
  const dbItems: Record<string, ChineseMenuItem[]> = canUseDb() ? await getDimSumItemsGrouped(siteId).catch(() => ({})) : {};
  const hasDbItems = Object.keys(dbItems).length > 0 && Object.values(dbItems).some(items => items.length > 0);

  const hero = pageContent?.hero || {};
  const pageCategories = pageContent?.categories || [
    { id: 'steamed', name: 'Steamed 蒸点', nameZh: '蒸点', slug: 'steamed' },
    { id: 'baked', name: 'Baked 烘焙', nameZh: '烘焙', slug: 'baked' },
    { id: 'fried', name: 'Fried 酥炸', nameZh: '酥炸', slug: 'fried' },
    { id: 'congee-noodle', name: 'Congee & Noodles 粥面', nameZh: '粥面', slug: 'congee-noodle' },
    { id: 'dessert', name: 'Desserts 甜品', nameZh: '甜品', slug: 'dessert' },
  ];

  // Build category list from DB data or page config
  const categoriesToShow = hasDbItems
    ? DIM_SUM_ORDER.filter(cat => dbItems[cat]?.length > 0)
    : pageCategories.map((c: any) => c.id || c.slug);

  return (
    <div className="dim-sum-page">

      {/* Header */}
      <section style={{ padding: '5rem var(--container-px) 3rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          {isZh ? '每日点心' : 'Daily Dim Sum'}
        </p>
        <h1
          style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '0.75rem', lineHeight: 1.1 }}
          lang="zh-Hans"
        >
          {isZh ? '点心' : 'Dim Sum 点心'}
        </h1>
        <p style={{ opacity: 0.75, fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          {isZh && hero.subheadingZh ? hero.subheadingZh : hero.subheading || '80+ hand-crafted varieties · Served daily 10am – 3pm'}
        </p>
        <DimSumStatusBadge
          dimSumHours={siteInfo?.dimSumHours}
          weekendBrunchHours={siteInfo?.weekendBrunchHours}
          locale={locale}
        />
      </section>

      {/* Sub-category sticky nav */}
      <nav
        aria-label={isZh ? '点心分类' : 'Dim Sum Categories'}
        style={{ position: 'sticky', top: 'var(--nav-height, 72px)', background: 'var(--backdrop-secondary)', borderBottom: 'var(--menu-divider)', zIndex: 20, overflowX: 'auto' }}
      >
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'flex', gap: '0.25rem', padding: '0.75rem var(--container-px)', minWidth: 'max-content' }}>
          {categoriesToShow.map((catId: string) => {
            const label = CATEGORY_LABELS[catId] ?? { en: catId, zh: catId };
            return (
              <a
                key={catId}
                href={`#${catId}`}
                style={{ display: 'inline-block', padding: '0.45rem 1rem', borderRadius: 'var(--btn-radius, 2px)', border: '1px solid var(--border-default)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--heading-on-light)', textDecoration: 'none', whiteSpace: 'nowrap' }}
                lang={isZh ? 'zh-Hans' : undefined}
              >
                {isZh ? label.zh : `${label.zh} ${label.en}`}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Menu items */}
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--section-py) var(--container-px)' }}>

        {hasDbItems ? (
          // ── DB items available — show real menu ──
          categoriesToShow.map((catId: string) => {
            const items = dbItems[catId] || [];
            if (!items.length) return null;
            const label = CATEGORY_LABELS[catId] ?? { en: catId, zh: catId };
            return (
              <section key={catId} id={catId} style={{ marginBottom: '4rem' }}>
                {/* Category heading */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--border-emphasis)' }}>
                  <h2
                    style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--heading-on-light)', lineHeight: 1.1 }}
                    lang="zh-Hans"
                  >
                    {label.zh}
                  </h2>
                  {!isZh && (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--muted-on-light)' }}>
                      {label.en}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--muted-on-light)' }}>
                    {items.length} {isZh ? '款' : 'items'}
                  </span>
                </div>

                {/* Items — 2-col grid on desktop */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 3rem' }}>
                  {items.map((item) => (
                    <MenuItemRow key={item.id} item={item} locale={locale} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          // ── No DB — show categories with "ask server" placeholder ──
          pageCategories.map((cat: any) => (
            <section key={cat.id || cat.slug} id={cat.slug || cat.id} style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--border-emphasis)' }}>
                <h2 style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--heading-on-light)' }} lang="zh-Hans">
                  {cat.nameZh}
                </h2>
                {!isZh && <span style={{ fontSize: '0.9rem', color: 'var(--muted-on-light)' }}>{cat.name}</span>}
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--backdrop-secondary)', borderRadius: 'var(--radius-base)', color: 'var(--muted-on-light)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                {isZh ? '请向服务员查询今日供应' : 'Please ask your server for today\'s selection or call us at ' + (siteInfo?.phone || '')}
              </div>
            </section>
          ))
        )}

        {/* Dietary legend */}
        {pageContent?.dietaryLegend && (
          <div style={{ padding: '2rem', background: 'var(--backdrop-secondary)', borderRadius: 'var(--radius-base)', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--heading-on-light)', marginBottom: '1rem' }}>
              {isZh ? '饮食指南' : 'Dietary Guide'}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {[
                { label: '素', desc: isZh ? '素食' : 'Vegetarian', color: '#22c55e' },
                { label: '全素', desc: isZh ? '纯素' : 'Vegan', color: '#16a34a' },
                { label: '清真', desc: isZh ? '清真' : 'Halal', color: '#0ea5e9' },
                { label: '无麸质', desc: isZh ? '无麸质' : 'Gluten-Free', color: '#f59e0b' },
                { label: '🌶', desc: isZh ? '辣' : 'Spicy', color: 'var(--color-error, #ef4444)' },
              ].map(({ label, desc, color }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--body-on-light)' }}>
                  <span style={{ fontWeight: 700, color }}>{label}</span> {desc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {pageContent?.notes && (
          <p style={{ fontSize: '0.8rem', color: 'var(--muted-on-light)', marginTop: '2rem', lineHeight: 1.7, textAlign: 'center', fontStyle: 'italic' }}>
            {isZh && pageContent.notesZh ? pageContent.notesZh : pageContent.notes}
          </p>
        )}

        {/* Reserve CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: 'var(--menu-divider)' }}>
          <a
            href={`/${locale}/reservations`}
            style={{ display: 'inline-block', padding: '0.875rem 2.5rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', borderRadius: 'var(--radius-base)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}
          >
            {isZh ? '预约点心早市' : 'Reserve for Dim Sum'}
          </a>
        </div>
      </div>
    </div>
  );
}
