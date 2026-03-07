import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfoChinese } from '@/lib/chinese-restaurant-types';
import WeChatQR from '@/components/ui/WeChatQR';

interface PageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/contact.json'),
  ]);
  return buildPageMetadata({ siteId, locale, title: pageContent?.seo?.title, description: pageContent?.seo?.description });
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, { en: string; zh: string }> = {
  monday:    { en: 'Monday',    zh: '周一' },
  tuesday:   { en: 'Tuesday',   zh: '周二' },
  wednesday: { en: 'Wednesday', zh: '周三' },
  thursday:  { en: 'Thursday',  zh: '周四' },
  friday:    { en: 'Friday',    zh: '周五' },
  saturday:  { en: 'Saturday',  zh: '周六' },
  sunday:    { en: 'Sunday',    zh: '周日' },
};

function formatHours(open: string, close: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}${m ? ':' + String(m).padStart(2, '0') : ''} ${period}`;
  };
  return `${fmt(open)} – ${fmt(close)}`;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [siteInfo, pageContent] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoChinese | null>,
    loadContent<any>(siteId, locale, 'pages/contact.json'),
  ]);

  const isZh = locale === 'zh';
  const hours = siteInfo?.hours as Record<string, { open: string; close: string }> | undefined;

  return (
    <div className="contact-page">
      {/* Header */}
      <section style={{ padding: '5rem var(--container-px) 3rem', background: 'var(--primary)', color: 'var(--text-on-dark-primary)', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 1.1,
          }}
        >
          {isZh ? '联系我们' : 'Contact & Hours'}
        </h1>
      </section>

      <section style={{ padding: 'var(--section-py) var(--container-px)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

          {/* Left: Contact Info + WeChat */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--heading-on-light)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isZh ? '联系方式' : 'Contact'}
            </h2>

            <div style={{ marginBottom: '2.5rem' }}>
              {siteInfo?.address && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--secondary)', marginBottom: '0.4rem' }}>
                    {isZh ? '地址' : 'Address'}
                  </div>
                  <div style={{ color: 'var(--body-on-light)', lineHeight: 1.7 }}>
                    {isZh && (siteInfo as any)?.addressZh ? (siteInfo as any).addressZh : siteInfo.address}
                    <br />
                    {siteInfo.city}, {siteInfo.state} {siteInfo.zip}
                  </div>
                </div>
              )}
              {siteInfo?.phone && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--secondary)', marginBottom: '0.4rem' }}>
                    {isZh ? '电话' : 'Phone'}
                  </div>
                  <a href={`tel:${siteInfo.phone.replace(/\D/g, '')}`} style={{ color: 'var(--body-on-light)', fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>
                    {siteInfo.phone}
                  </a>
                </div>
              )}
              {siteInfo?.email && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--secondary)', marginBottom: '0.4rem' }}>
                    {isZh ? '电子邮件' : 'Email'}
                  </div>
                  <a href={`mailto:${siteInfo.email}`} style={{ color: 'var(--body-on-light)', textDecoration: 'none' }}>
                    {siteInfo.email}
                  </a>
                </div>
              )}

              {/* Parking note */}
              {(siteInfo?.parkingNote || siteInfo?.parkingNoteZh) && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--secondary)', marginBottom: '0.4rem' }}>
                    {isZh ? '停车' : 'Parking'}
                  </div>
                  <p style={{ color: 'var(--body-on-light)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    {isZh && siteInfo?.parkingNoteZh ? siteInfo.parkingNoteZh : siteInfo?.parkingNote}
                  </p>
                </div>
              )}
            </div>

            {/* WeChat QR */}
            <WeChatQR
              qrUrl={siteInfo?.wechatQrUrl}
              accountName={siteInfo?.wechatAccountName}
              heading="Follow Us on WeChat"
              headingZh="微信关注我们"
              locale={locale}
            />
          </div>

          {/* Right: Hours */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--heading-on-light)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isZh ? '营业时间' : 'Hours'}
            </h2>

            {hours && (
              <div style={{ marginBottom: '2rem' }}>
                {DAY_ORDER.map((day) => {
                  const dayHours = hours[day];
                  if (!dayHours) return null;
                  return (
                    <div
                      key={day}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0',
                        borderBottom: 'var(--menu-divider)',
                        fontSize: '0.875rem',
                        color: 'var(--body-on-light)',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{isZh ? DAY_LABELS[day].zh : DAY_LABELS[day].en}</span>
                      <span>{formatHours(dayHours.open, dayHours.close)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dim Sum hours callout */}
            {siteInfo?.dimSumHours && (
              <div
                style={{
                  padding: '1.25rem',
                  background: 'var(--backdrop-secondary)',
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                  {isZh ? '点心供应时间' : 'Dim Sum Hours'}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--body-on-light)' }}>
                  {isZh ? '周一至周五 ' : 'Mon–Fri: '}
                  {formatHours(siteInfo.dimSumHours.open, siteInfo.dimSumHours.close)}
                </div>
                {siteInfo.weekendBrunchHours && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--body-on-light)', marginTop: '0.25rem' }}>
                    {isZh ? '周六、日 ' : 'Sat–Sun: '}
                    {formatHours(siteInfo.weekendBrunchHours.open, siteInfo.weekendBrunchHours.close)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-on-light)', marginLeft: '0.5rem' }}>
                      {isZh ? '（早午餐）' : '(Brunch)'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Reserve CTA */}
            <div style={{ marginTop: '2rem' }}>
              <a
                href={`/${locale}/reservations`}
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  background: 'var(--primary)',
                  color: 'var(--text-on-dark-primary)',
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                }}
              >
                {isZh ? '立即预约' : 'Reserve a Table'}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
