import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';

interface PageProps {
  params: { locale: Locale };
}

interface OrderOnlineContent {
  seo?: { title?: string; description?: string };
  hero?: {
    heading?: string;
    headingZh?: string;
    subheading?: string;
    subheadingZh?: string;
  };
  providers?: Array<{
    name: string;
    nameZh?: string;
    description?: string;
    descriptionZh?: string;
    href: string;
    eta?: string;
    feeNote?: string;
  }>;
  pickup?: {
    heading?: string;
    headingZh?: string;
    description?: string;
    descriptionZh?: string;
    ctaText?: string;
    ctaTextZh?: string;
    href?: string;
  };
}

function localizeUrl(url: string, locale: string): string {
  if (!url || url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:')) return url;
  if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
  if (url === '/') return `/${locale}`;
  return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const content =
    (await loadContent<OrderOnlineContent>(siteId, locale, 'pages/order-online.json')) ||
    (locale !== 'en' ? await loadContent<OrderOnlineContent>(siteId, 'en', 'pages/order-online.json') : null);
  return buildPageMetadata({
    siteId,
    locale,
    title: content?.seo?.title || (locale === 'zh' ? '在线订餐 — 大观楼' : 'Order Online — Grand Pavilion'),
    description: content?.seo?.description || (locale === 'zh' ? '在线下单，支持外送与自取。' : 'Order online for pickup or delivery.'),
  });
}

export default async function OrderOnlinePage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const siteId = await getRequestSiteId();
  const content =
    (await loadContent<OrderOnlineContent>(siteId, locale, 'pages/order-online.json')) ||
    (locale !== 'en' ? await loadContent<OrderOnlineContent>(siteId, 'en', 'pages/order-online.json') : null);

  const hero = content?.hero || {};
  const providers = Array.isArray(content?.providers) ? content!.providers! : [];
  const pickup = content?.pickup || {};

  return (
    <div className="order-online-page">
      <section style={{ padding: '5rem var(--container-px) 3rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
          {isZh ? (hero.headingZh || hero.heading || '在线订餐') : (hero.heading || 'Order Online')}
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {isZh ? (hero.subheadingZh || hero.subheading || '外送与自取，快捷便利。') : (hero.subheading || 'Fast pickup and delivery options.')}
        </p>
      </section>

      <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          {providers.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {providers.map((provider, idx) => (
                <article key={`${provider.name}-${idx}`} style={{ background: 'var(--backdrop-secondary)', borderRadius: 'var(--radius-base)', padding: 'var(--card-pad)', boxShadow: 'var(--shadow-card)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--heading-on-light)', marginBottom: '0.4rem' }}>
                    {isZh ? (provider.nameZh || provider.name) : provider.name}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--body-on-light)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {isZh ? (provider.descriptionZh || provider.description || '') : (provider.description || '')}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-on-light)', marginBottom: '1rem' }}>
                    {provider.eta || ''}{provider.eta && provider.feeNote ? ' · ' : ''}{provider.feeNote || ''}
                  </div>
                  <a
                    href={localizeUrl(provider.href, locale)}
                    style={{ display: 'inline-block', padding: '0.7rem 1.4rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', borderRadius: 'var(--radius-base)', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                  >
                    {isZh ? '立即下单' : 'Order Now'}
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', borderRadius: 'var(--radius-base)', background: 'var(--backdrop-secondary)', color: 'var(--muted-on-light)' }}>
              {isZh ? '在线订餐即将开放，请稍后查看。' : 'Online ordering will be available soon.'}
            </div>
          )}

          <div style={{ marginTop: '2.5rem', textAlign: 'center', padding: '1.5rem', background: 'var(--backdrop-secondary)', borderRadius: 'var(--radius-base)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--heading-on-light)', marginBottom: '0.5rem' }}>
              {isZh ? (pickup.headingZh || pickup.heading || '到店自取') : (pickup.heading || 'Pickup at Restaurant')}
            </h3>
            <p style={{ color: 'var(--body-on-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {isZh ? (pickup.descriptionZh || pickup.description || '预订后可在餐厅前台快速取餐。') : (pickup.description || 'Order ahead and pick up quickly at our front desk.')}
            </p>
            <a
              href={localizeUrl(pickup.href || '/contact', locale)}
              style={{ display: 'inline-block', padding: '0.75rem 1.5rem', border: '1px solid var(--primary)', color: 'var(--heading-on-light)', borderRadius: 'var(--radius-base)', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {isZh ? (pickup.ctaTextZh || pickup.ctaText || '致电下单') : (pickup.ctaText || 'Call to Order')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
