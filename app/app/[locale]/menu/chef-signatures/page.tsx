import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfoChinese, ChineseMenuItem } from '@/lib/chinese-restaurant-types';
import { getChefSignatures } from '@/lib/menuDb';
import ChefSignatureCard from '@/components/menu/ChefSignatureCard';

interface PageProps {
  params: { locale: Locale };
}

function canUseDb() { return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY); }

// Demo chef signatures — used only when DB is not configured

const DEMO_SIGNATURES = [
  {
    id: 'peking-duck',
    name: 'Peking Duck',
    nameZh: '北京烤鸭',
    description: 'Whole Peking duck roasted in our traditional oven — crispy lacquered skin, carved tableside. Served with steamed pancakes, cucumber, scallion, and hoisin. Order 24 hours in advance.',
    price: 8800,
    priceNote: null,
    image: '/uploads/grand-pavilion/menu/peking-duck.jpg',
    chefNote: 'This is the crown jewel of our kitchen. Every duck is prepared over three days using the traditional hung and roasted method I learned in Hong Kong. The skin must shatter like glass — that is the only standard I accept.',
    chefNoteZh: '这是我们厨房的镇店之宝。每只鸭子都按照我在香港学习的传统吊炉烤制方法，历经三天精心准备。鸭皮必须像玻璃一样酥脆——这是我唯一接受的标准。',
    pairingNote: 'Pair with a glass of Pinot Noir or our house Pu-erh tea',
    originRegion: 'Beijing/Cantonese',
  },
  {
    id: 'live-lobster',
    name: 'Steamed Live Lobster with Garlic Vermicelli',
    nameZh: '清蒸活龙虾配蒜蓉粉丝',
    description: 'Live lobster steamed with garlic and glass noodles, finished with house soy sauce and sesame oil. Market price — inquire with your server.',
    price: null,
    priceNote: 'Market Price 时价',
    image: '/uploads/grand-pavilion/menu/live-lobster.jpg',
    chefNote: 'I never freeze our lobsters. Every day we receive live lobsters and they are held until ordered. This dish should taste like the ocean — clean, sweet, and alive.',
    chefNoteZh: '我们的龙虾绝不冷冻。每天新鲜到货，直至点单才捞起烹制。这道菜应该有海洋的味道——清甜鲜活。',
    pairingNote: 'Best with our Longjing green tea or a dry Riesling',
    originRegion: 'Cantonese',
  },
  {
    id: 'dong-po-pork',
    name: 'Dong Po Pork Belly',
    nameZh: '东坡肉',
    description: 'Slow-braised pork belly in Shaoxing wine and soy for 4 hours. Meltingly tender, glazed to deep mahogany. Served with steamed buns.',
    price: 3600,
    priceNote: null,
    image: '/uploads/grand-pavilion/menu/dong-po-pork.jpg',
    chefNote: 'Dong Po Rou is one of the oldest preparations in Chinese cuisine — attributed to the poet Su Dongpo of the Song dynasty. My version uses a 12-hour marinade before braising.',
    chefNoteZh: '东坡肉是中国最古老的烹饪技法之一，相传源自宋代诗人苏东坡。我的版本在炖煮前先腌制12小时，这是令其出众的关键。',
    pairingNote: 'Shaoxing Hua Diao wine or a medium-bodied Pinot Noir',
    originRegion: 'Shanghainese/Cantonese',
  },
  {
    id: 'xo-fried-rice',
    name: 'XO Sauce Fried Rice with Dried Scallop',
    nameZh: '瑤柱XO酱炒饭',
    description: 'Premium fried rice with our house XO sauce, dried Hokkaido scallop, egg, and spring onion. A deceptively simple masterpiece.',
    price: 2800,
    priceNote: null,
    image: '/uploads/grand-pavilion/menu/xo-fried-rice.jpg',
    chefNote: 'Our house XO sauce takes 3 days to make. Every grain of rice should be coated separately and have a slight char — what the Cantonese call "wok hei." That is the breath of the wok.',
    chefNoteZh: '我们自制的XO酱需三天时间制作。每粒米饭都应均匀包裹酱汁，带有轻微的焦香——粤语称之为「镬气」，那是铁锅的呼吸。',
    pairingNote: 'Oolong or a glass of dry Champagne',
    originRegion: 'Cantonese/Hong Kong',
  },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfoChinese | null;
  return buildPageMetadata({
    siteId,
    locale,
    title: locale === 'zh' ? '厨师特色菜 — 大观楼' : "Chef's Signatures — Grand Pavilion",
    description: locale === 'zh' ? '行政主厨李伟的名牌菜式，包括北京烤鸭、活龙虾及东坡肉。' : "Executive Chef Li Wei's celebrated creations — Peking Duck, Live Lobster, and Braised Pork Belly.",
  });
}

export default async function ChefSignaturesPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfoChinese | null;
  const isZh = locale === 'zh';

  // Load from DB if available, otherwise use demo data
  const dbSignatures = canUseDb() ? await getChefSignatures(siteId).catch(() => []) : [];
  const signatures: ChineseMenuItem[] = dbSignatures.length > 0
    ? dbSignatures
    : DEMO_SIGNATURES.map((s, i) => ({
        id: s.id, siteId: 'grand-pavilion', slug: s.id,
        name: s.name, nameZh: s.nameZh, description: s.description,
        price: s.price, priceNote: s.priceNote, image: s.image,
        chefNote: s.chefNote, chefNoteZh: s.chefNoteZh,
        pairingNote: s.pairingNote, originRegion: s.originRegion,
        isDimSum: false, isChefSignature: true,
        isHalal: false, isKosher: false, isVegetarian: false, isVegan: false, isGlutenFree: false,
        isPopular: true, isAvailable: true, isFeatured: true, sortOrder: i,
      }));

  return (
    <div className="chef-signatures-page">
      {/* Hero */}
      <section
        style={{
          padding: '5rem var(--container-px) 3rem',
          background: 'var(--primary)',
          color: 'var(--text-on-dark-primary)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          {isZh ? '主厨特色菜' : "Chef's Signatures"}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display-zh, "Noto Serif SC", serif)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
          lang="zh-Hans"
        >
          {isZh ? '厨师特色菜' : 'Chef Li Wei\'s Signatures'}
        </h1>
        <p style={{ opacity: 0.75, maxWidth: '540px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {isZh
            ? '每道特色菜背后都有一个故事——技艺的传承、食材的坚持，以及数十年的磨砺。'
            : 'Each signature dish carries a story — of technique passed down, ingredients sourced with conviction, and decades of refinement.'}
        </p>
      </section>

      {/* Signature cards */}
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--section-py) var(--container-px)' }}>
        {signatures.map((item, index) => (
          <ChefSignatureCard
            key={item.id}
            id={item.id}
            name={item.name}
            nameZh={item.nameZh}
            description={item.description}
            price={item.price}
            priceNote={item.priceNote}
            image={item.image}
            chefNote={item.chefNote}
            chefNoteZh={item.chefNoteZh}
            pairingNote={item.pairingNote}
            originRegion={item.originRegion}
            index={index}
            locale={locale}
          />
        ))}
      </div>

      {/* Book CTA */}
      <section style={{ padding: '4rem var(--container-px)', background: 'var(--backdrop-secondary)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading)', color: 'var(--heading-on-light)', marginBottom: '0.75rem' }}>
          {isZh ? '预约品尝这些特色菜' : 'Reserve to Experience These Dishes'}
        </h2>
        <p style={{ color: 'var(--body-on-light)', marginBottom: '2rem' }}>
          {isZh ? '部分特色菜需提前预约，请在订座时注明。' : 'Some signatures require advance notice. Please mention when making your reservation.'}
        </p>
        <a
          href={`/${locale}/reservations`}
          style={{
            display: 'inline-block',
            padding: '0.875rem 2.5rem',
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
          {isZh ? '预约餐桌' : 'Reserve a Table'}
        </a>
      </section>
    </div>
  );
}
