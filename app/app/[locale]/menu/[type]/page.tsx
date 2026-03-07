import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { ChineseMenuItem, MenuCategory, SiteInfoChinese } from '@/lib/chinese-restaurant-types';
import { getFeaturedMenuItems, getMenuCategoriesBySiteId, getMenuItemsBySiteId } from '@/lib/menuDb';
import DimSumStatusBadge from '@/components/ui/DimSumStatusBadge';

interface PageProps {
  params: { locale: Locale; type: string };
}

type SupportedMenuType =
  | 'dim-sum'
  | 'dinner'
  | 'chef-signatures'
  | 'weekend-brunch'
  | 'tasting-menu'
  | 'seasonal'
  | 'beverages'
  | 'desserts';

const SUPPORTED_MENU_TYPES: SupportedMenuType[] = [
  'dim-sum',
  'dinner',
  'chef-signatures',
  'weekend-brunch',
  'tasting-menu',
  'seasonal',
  'beverages',
  'desserts',
];

const MENU_TYPE_ALIASES: Record<string, SupportedMenuType> = {
  brunch: 'weekend-brunch',
};

const FALLBACK_TYPE_LABELS: Record<SupportedMenuType, { en: string; zh: string }> = {
  'dim-sum': { en: 'Dim Sum', zh: '点心' },
  dinner: { en: 'Cantonese Dinner', zh: '粤菜晚餐' },
  'chef-signatures': { en: "Chef's Signatures", zh: '厨师特色菜' },
  'weekend-brunch': { en: 'Weekend Brunch', zh: '周末早午餐' },
  'tasting-menu': { en: "Chef's Tasting Menu", zh: '主厨品鉴菜单' },
  seasonal: { en: 'Seasonal Menu', zh: '时令菜单' },
  beverages: { en: 'Beverages & Tea', zh: '饮品及茶' },
  desserts: { en: 'Desserts', zh: '甜品' },
};

const DIM_SUM_CATEGORY_LABELS: Record<string, { en: string; zh: string }> = {
  steamed: { en: 'Steamed', zh: '蒸点' },
  baked: { en: 'Baked & Pastry', zh: '烘焙' },
  fried: { en: 'Fried', zh: '酥炸' },
  'congee-noodle': { en: 'Congee & Noodles', zh: '粥面' },
  dessert: { en: 'Dessert', zh: '甜品' },
  other: { en: 'Chef Selection', zh: '主厨精选' },
};

function normalizeMenuType(rawType: string): SupportedMenuType | null {
  const normalized = (MENU_TYPE_ALIASES[rawType] || rawType) as SupportedMenuType;
  return SUPPORTED_MENU_TYPES.includes(normalized) ? normalized : null;
}

function localizeUrl(url: string, locale: string): string {
  if (!url || url.startsWith('http')) return url;
  if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
  if (url === '/') return `/${locale}`;
  return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
}

function shouldRenderHeroImage(url: string | null | undefined): boolean {
  if (!url) return false;
  const normalized = String(url).trim();
  if (!normalized) return false;
  // Local upload fallbacks are not present in this project and produce broken images.
  if (normalized.startsWith('/uploads/')) return false;
  return true;
}

function formatPrice(price?: number | null, note?: string | null, locale?: string): string {
  if (!price) return note || (locale === 'zh' ? '时价' : 'Market Price');
  return `$${(price / 100).toFixed(0)}`;
}

function getMetaForType(pageContent: any, type: SupportedMenuType) {
  const categories = Array.isArray(pageContent?.categories) ? pageContent.categories : [];
  return (
    categories.find((cat: any) => cat?.id === type) ||
    categories.find((cat: any) => String(cat?.href || '').endsWith(`/menu/${type}`)) ||
    null
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, type } = params;
  const normalizedType = normalizeMenuType(type);
  if (!normalizedType) return {};
  const siteId = await getRequestSiteId();
  const menuHub = await loadContent<any>(siteId, locale, 'pages/menu.json');
  const fallbackMenuHub = !menuHub && locale !== 'en'
    ? await loadContent<any>(siteId, 'en', 'pages/menu.json')
    : null;
  const menuMeta = getMetaForType(menuHub || fallbackMenuHub, normalizedType);
  const fallback = FALLBACK_TYPE_LABELS[normalizedType];
  const title = menuMeta ? `${menuMeta.name} — Grand Pavilion 大观楼` : `${fallback.en} — Grand Pavilion 大观楼`;
  const description = menuMeta?.description || (locale === 'zh' ? '探索我们的精选菜式。' : 'Explore our curated menu selections.');
  return buildPageMetadata({
    siteId,
    locale,
    slug: `menu/${type}`,
    title,
    description,
  });
}

export default async function MenuTypePage({ params }: PageProps) {
  const { locale, type } = params;
  const normalizedType = normalizeMenuType(type);
  if (!normalizedType) notFound();

  const siteId = await getRequestSiteId();
  const isZh = locale === 'zh';
  const [siteInfo, menuHub] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/menu.json'),
  ]);
  const fallbackMenuHub = !menuHub && locale !== 'en'
    ? await loadContent<any>(siteId, 'en', 'pages/menu.json')
    : null;
  const menuMeta = getMetaForType(menuHub || fallbackMenuHub, normalizedType);
  const typeLabel = FALLBACK_TYPE_LABELS[normalizedType];

  type Group = { id: string; name: string; nameZh: string; items: ChineseMenuItem[] };
  let groups: Group[] = [];

  if (normalizedType === 'weekend-brunch') {
    const items = await getMenuItemsBySiteId(siteId, { isDimSum: true });
    const grouped = new Map<string, ChineseMenuItem[]>();
    for (const item of items) {
      const key = item.dimSumCategory || 'other';
      grouped.set(key, [...(grouped.get(key) || []), item]);
    }
    groups = Array.from(grouped.entries()).map(([key, list]) => ({
      id: key,
      name: DIM_SUM_CATEGORY_LABELS[key]?.en || key,
      nameZh: DIM_SUM_CATEGORY_LABELS[key]?.zh || key,
      items: list,
    }));
  } else if (normalizedType === 'seasonal') {
    let items = await getFeaturedMenuItems(siteId, 24);
    if (items.length === 0) {
      const all = await getMenuItemsBySiteId(siteId);
      items = all.filter((item) => item.isPopular || item.isChefSignature).slice(0, 24);
    }
    groups = [{
      id: 'seasonal-highlights',
      name: 'Seasonal Highlights',
      nameZh: '时令精选',
      items,
    }];
  } else if (normalizedType === 'tasting-menu') {
    let items = await getMenuItemsBySiteId(siteId, { isChefSignature: true });
    if (items.length < 6) {
      const premium = await getFeaturedMenuItems(siteId, 12);
      const seen = new Set(items.map((item) => item.id));
      for (const item of premium) {
        if (!seen.has(item.id)) {
          items.push(item);
          seen.add(item.id);
        }
      }
    }
    groups = [{
      id: 'tasting-menu',
      name: "Chef's Tasting Menu",
      nameZh: '主厨品鉴菜单',
      items: items.slice(0, 12),
    }];
  } else {
    const categories = await getMenuCategoriesBySiteId(siteId, normalizedType);
    const allItems = await getMenuItemsBySiteId(siteId);
    if (categories.length > 0) {
      groups = categories
        .map((category: MenuCategory) => ({
          id: category.slug || category.id,
          name: category.name,
          nameZh: category.nameZh || category.name,
          items: allItems.filter((item) => item.menuCategoryId === category.id),
        }))
        .filter((group) => group.items.length > 0);
    } else if (normalizedType === 'desserts') {
      let items = allItems.filter((item) => item.dimSumCategory === 'dessert');
      if (items.length === 0) {
        // Graceful fallback if desserts are not categorized yet in DB.
        items = allItems
          .filter((item) =>
            /dessert|custard|pudding|mango|sesame|mochi|tapioca|豆花|糖水|甜品|芝麻糊|杨枝甘露|蛋挞|龟苓膏|双皮奶/i.test(
              `${item.name} ${item.nameZh || ''} ${item.description || ''} ${item.descriptionZh || ''}`
            )
          )
          .slice(0, 24);
      }
      groups = [{
        id: 'desserts',
        name: 'Desserts',
        nameZh: '甜品',
        items,
      }];
    } else if (normalizedType === 'dinner') {
      const items = allItems.filter((item) => !item.isDimSum && !item.isChefSignature);
      groups = [{
        id: 'dinner',
        name: 'Dinner',
        nameZh: '晚餐',
        items,
      }];
    } else if (normalizedType === 'beverages') {
      const items = allItems.filter((item) =>
        /tea|drink|beverage|juice|soda|wine|cocktail/i.test(`${item.name} ${item.description || ''}`)
      );
      groups = [{
        id: 'beverages',
        name: 'Beverages & Tea',
        nameZh: '饮品及茶',
        items,
      }];
    }
  }

  if (groups.length === 0 && normalizedType === 'desserts') {
    const dessertItems = (await getMenuItemsBySiteId(siteId))
      .filter((item) => item.dimSumCategory === 'dessert')
      .slice(0, 24);
    groups = [{
      id: 'desserts',
      name: 'Desserts',
      nameZh: '甜品',
      items: dessertItems,
    }];
  }

  const hasItems = groups.some((group) => group.items.length > 0);
  const heroTitle = isZh
    ? (menuMeta?.nameZh || typeLabel.zh)
    : (menuMeta?.name || typeLabel.en);
  const heroSubtitle = isZh
    ? (menuMeta?.descriptionZh || menuMeta?.description || '精选菜式，欢迎品鉴。')
    : (menuMeta?.description || 'Curated selections from our kitchen.');
  const heroImage = menuMeta?.image || (menuHub?.hero?.image ?? fallbackMenuHub?.hero?.image ?? null);

  return (
    <div className="menu-type-page">
      <section style={{ padding: '5rem var(--container-px) 3rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          {isZh ? '菜单' : 'Menu'}
        </p>
        <h1
          style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}
          lang={isZh ? 'zh-Hans' : undefined}
        >
          {heroTitle}
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '620px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {heroSubtitle}
        </p>
        {normalizedType === 'weekend-brunch' && (
          <div style={{ marginTop: '1.25rem' }}>
            <DimSumStatusBadge
              dimSumHours={siteInfo?.dimSumHours}
              weekendBrunchHours={siteInfo?.weekendBrunchHours}
              locale={locale}
            />
          </div>
        )}
      </section>

      {shouldRenderHeroImage(heroImage) && (
        <div style={{ maxWidth: 'var(--container-max)', margin: '1.25rem auto 0', padding: '0 var(--container-px)' }}>
          <div style={{ borderRadius: 'var(--radius-base)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', aspectRatio: '16/5', background: 'var(--backdrop-secondary)' }}>
            <div
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </div>
      )}

      {groups.length > 1 && (
        <nav style={{ position: 'sticky', top: 'var(--nav-height, 72px)', background: 'var(--backdrop-secondary)', borderBottom: 'var(--menu-divider)', zIndex: 20, overflowX: 'auto' }}>
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'flex', gap: '0.25rem', padding: '0.75rem var(--container-px)', minWidth: 'max-content' }}>
            {groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                style={{ display: 'inline-block', padding: '0.45rem 1rem', borderRadius: 'var(--btn-radius, 2px)', border: '1px solid var(--border-default)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--heading-on-light)', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                {isZh ? group.nameZh : group.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--section-py) var(--container-px)' }}>
        {hasItems ? (
          groups.map((group) => (
            <section key={group.id} id={group.id} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '2px solid var(--border-emphasis)' }}>
                <h2 style={{ fontFamily: 'var(--font-display-zh, \"Noto Serif SC\", serif)', fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', color: 'var(--heading-on-light)', lineHeight: 1.2 }} lang={isZh ? 'zh-Hans' : undefined}>
                  {isZh ? group.nameZh : group.name}
                </h2>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--muted-on-light)' }}>
                  {group.items.length} {isZh ? '款' : 'items'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 2rem' }}>
                {group.items.map((item) => (
                  <article key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.85rem', padding: '1rem 0', borderBottom: 'var(--menu-divider)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display-zh, \"Noto Serif SC\", serif)', fontWeight: 700, color: 'var(--heading-on-light)', fontSize: '1.05rem', marginBottom: '0.1rem' }} lang="zh-Hans">
                        {item.nameZh || item.name}
                      </div>
                      {!isZh && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--body-on-light)', marginBottom: '0.25rem' }}>
                          {item.name}
                        </div>
                      )}
                      {(() => {
                        const localizedDescription = isZh
                          ? (item.descriptionZh && item.descriptionZh.trim() !== '正在加载...' ? item.descriptionZh : '')
                          : item.description;
                        if (!localizedDescription) return null;
                        return (
                        <p style={{ fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--muted-on-light)', marginBottom: '0.25rem' }}>
                          {localizedDescription}
                        </p>
                        );
                      })()}
                      <div style={{ fontSize: '0.68rem', color: 'var(--secondary)', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700 }}>
                        {item.isChefSignature ? (isZh ? '主厨推荐' : 'Signature') : item.isPopular ? (isZh ? '热门' : 'Popular') : ''}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      {item.image && (
                        <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-base)', overflow: 'hidden', marginLeft: 'auto', marginBottom: '0.35rem' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>
                      )}
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--heading-on-light)' }}>
                        {formatPrice(item.price, item.priceNote, locale)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', borderRadius: 'var(--radius-base)', background: 'var(--backdrop-secondary)', color: 'var(--muted-on-light)' }}>
            {isZh ? '该菜单正在更新中，请稍后查看或联系客服。' : 'This menu is being updated. Please check back soon or contact us.'}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a
            href={localizeUrl('/reservations', locale)}
            style={{ display: 'inline-block', padding: '0.875rem 2.25rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', borderRadius: 'var(--radius-base)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}
          >
            {isZh ? '预约餐桌' : 'Reserve a Table'}
          </a>
        </div>
      </div>
    </div>
  );
}
