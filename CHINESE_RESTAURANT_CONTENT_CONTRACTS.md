# BAAM System F — Chinese Restaurant Premium
# Content Contracts

> **Purpose:** This file is the single source of truth for all JSON shapes stored in `content_entries.data` and all TypeScript interfaces in `lib/chinese-restaurant-types.ts`.
> **Used by:** Cursor sessions for Phase 0D, Phase 1, and Phase 2. Always `@reference` this file alongside the relevant phase file.
> **Rule:** Frontend components and admin form panels MUST conform to these contracts. If the shape needs to change, update this file first.
> **Contract-First principle:** Define the JSON shape BEFORE coding any page or admin panel.

---

## File Index

| Contract | Path in content_entries | Type |
|---|---|---|
| [site.json](#siteJson) | `grand-pavilion/en/site.json` | Global config |
| [header.json](#headerJson) | `grand-pavilion/en/header.json` | Global nav |
| [footer.json](#footerJson) | `grand-pavilion/en/footer.json` | Global footer |
| [seo.json](#seoJson) | `grand-pavilion/en/seo.json` | Default SEO |
| [home.json](#homeJson) | `grand-pavilion/en/pages/home.json` | Home page |
| [about.json](#aboutJson) | `grand-pavilion/en/pages/about.json` | About page |
| [menu.json](#menuJson) | `grand-pavilion/en/pages/menu.json` | Menu page config |
| [dim-sum.json](#dimSumJson) | `grand-pavilion/en/pages/dim-sum.json` | Dim sum page |
| [chefs-table.json](#chefsTableJson) | `grand-pavilion/en/pages/chefs-table.json` | Chef signatures |
| [private-dining.json](#privateDiningJson) | `grand-pavilion/en/pages/private-dining.json` | Banquet page |
| [catering.json](#cateringJson) | `grand-pavilion/en/pages/catering.json` | Catering page |
| [reservations.json](#reservationsJson) | `grand-pavilion/en/pages/reservations.json` | Reservations config |
| [contact.json](#contactJson) | `grand-pavilion/en/pages/contact.json` | Contact page |
| [gallery.json](#galleryJson) | `grand-pavilion/en/pages/gallery.json` | Gallery config |
| [events.json](#eventsJson) | `grand-pavilion/en/pages/events.json` | Events config |
| [blog.json](#blogJson) | `grand-pavilion/en/pages/blog.json` | Blog config |
| [festivals/[slug].json](#festivalsJson) | `grand-pavilion/en/pages/festivals/[slug].json` | Festival pages |
| [press.json](#pressJson) | `grand-pavilion/en/pages/press.json` | Press config |
| [gift-cards.json](#giftCardsJson) | `grand-pavilion/en/pages/gift-cards.json` | Gift cards |
| [order-online.json](#orderOnlineJson) | `grand-pavilion/en/pages/order-online.json` | Online ordering |
| [faq.json](#faqJson) | `grand-pavilion/en/pages/faq.json` | FAQ page |
| [careers.json](#careersJson) | `grand-pavilion/en/pages/careers.json` | Careers page |

---

## TypeScript Interfaces {#typescript}

```typescript
// lib/chinese-restaurant-types.ts

// ─── Menu ──────────────────────────────────────────────────────────────────

export interface ChineseMenuItem {
  id: string
  site_id: string
  menu_category_id: string
  name: string               // EN name — required
  nameZh: string             // ZH name — REQUIRED (not optional)
  description: string | null
  descriptionZh: string | null
  price: number
  priceNote: string | null   // e.g. "per person", "market price"
  image: string | null
  // Dim sum specific
  isDimSum: boolean
  dimSumCategory: 'har-gow' | 'siu-mai' | 'bao' | 'cheung-fun' | 'taro' | 'egg-tart' | 'congee' | 'noodle' | 'turnip-cake' | 'other' | null
  // Chinese restaurant specific
  originRegion: string | null      // e.g. "Hong Kong", "Guangdong", "Shanghai"
  isChefSignature: boolean
  chefNote: string | null
  chefNoteZh: string | null
  pairingNote: string | null
  // Dietary
  isHalal: boolean
  isKosher: boolean
  isVegan: boolean
  isGlutenFree: boolean
  spiceLevel: 0 | 1 | 2 | 3 | null  // 0=none, 1=mild, 2=medium, 3=hot
  isPopular: boolean
  isAvailable: boolean
  sortOrder: number
  slug: string
}

export interface MenuCategory {
  id: string
  site_id: string
  name: string
  nameZh: string
  slug: string
  description: string | null
  descriptionZh: string | null
  isActive: boolean
  sortOrder: number
}

// ─── Festivals ─────────────────────────────────────────────────────────────

export interface Festival {
  id: string
  site_id: string
  name: string
  nameZh: string
  slug: string
  activeDateStart: string    // ISO date string
  activeDateEnd: string
  year: number
  heroImage: string
  tagline: string
  taglineZh: string
  description: string
  descriptionZh: string
  isLocked: boolean          // prevents Pipeline B broadcast from overwriting
}

export interface FestivalMenuItem {
  id: string
  festival_id: string
  tier: string               // e.g. "family-feast", "premium"
  tierName: string
  tierNameZh: string
  pricePerPerson: number
  minGuests: number
  courses: Array<{
    dish: string
    dishZh: string
    description: string | null
  }>
  sortOrder: number
}

// ─── Banquet / Private Dining ───────────────────────────────────────────────

export interface BanquetPackage {
  id: string
  site_id: string
  name: string
  nameZh: string
  slug: string
  description: string
  descriptionZh: string
  pricePerHead: number
  minGuests: number
  maxGuests: number
  includes: string[]         // EN bullet list
  includesZh: string[]       // ZH bullet list
  roomImage: string | null
  isActive: boolean
  sortOrder: number
}

// ─── Dim Sum Orders ──────────────────────────────────────────────────────────

export interface DimSumOrder {
  id: string
  site_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  preferred_date: string
  preferred_time: string
  items: Array<{
    menu_item_id: string
    name: string
    nameZh: string
    quantity: number
    price: number
  }>
  total_amount: number
  special_requests: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

// ─── Catering ────────────────────────────────────────────────────────────────

export interface CateringInquiry {
  id: string
  site_id: string
  contact_name: string
  contact_email: string
  contact_phone: string
  company_name: string | null
  event_type: 'corporate' | 'wedding' | 'birthday' | 'holiday' | 'other'
  event_date: string
  guest_count: number
  location: string
  budget_range: string | null
  cuisine_preferences: string | null
  additional_notes: string | null
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'declined'
  created_at: string
}

// ─── Banquet Inquiries ────────────────────────────────────────────────────────

export interface BanquetInquiry {
  id: string
  site_id: string
  contact_name: string
  contact_email: string
  contact_phone: string
  package_id: string | null      // links to banquet_packages.id
  package_name: string           // denormalized
  event_type: 'birthday' | 'anniversary' | 'wedding-banquet' | 'corporate' | 'other'
  event_date: string
  guest_count: number
  budget_per_head: string | null
  special_requirements: string | null
  wechat_id: string | null
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'declined'
  created_at: string
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export interface SiteInfoChinese {
  // Inherited from Meridian SiteInfo
  id: string
  name: string
  domain: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  hours: Record<string, string>
  // Chinese restaurant extensions
  nameZh: string                    // required
  cuisineType: string               // e.g. "Cantonese"
  cuisineTypeZh: string             // e.g. "粤菜"
  chefName: string
  chefNameZh: string
  wechatQrUrl: string | null
  wechatAccountName: string | null
  dimSumHours: { open: string; close: string }
  weekendBrunchHours: { open: string; close: string } | null
  seatingCapacity: { regular: number; banquet: number }
  parkingNote: string | null
  parkingNoteZh: string | null
  googleRating: number | null
  googleReviewCount: number | null
  googlePlaceId: string | null
  yelpUrl: string | null
  // Localization
  defaultLocale: 'en' | 'zh'
  enabledLocales: ('en' | 'zh')[]
}
```

---

## Contract: site.json {#siteJson}

**Path:** `content/[siteId]/[locale]/site.json`
**Admin form:** `/admin/content/site`
**Scope:** All pages use this for header, footer, contact, SEO defaults.

```json
{
  "id": "grand-pavilion",
  "name": "Grand Pavilion",
  "nameZh": "大观楼",
  "cuisineType": "Cantonese",
  "cuisineTypeZh": "粤菜",
  "tagline": "Authentic Cantonese Cuisine in Flushing",
  "taglineZh": "正宗粤菜，皇后区",
  "phone": "+1 (718) 555-0100",
  "email": "info@grandpavilion.com",
  "address": "136-20 Roosevelt Ave",
  "city": "Flushing",
  "state": "NY",
  "zip": "11354",
  "hours": {
    "monday": "11:00 AM – 10:00 PM",
    "tuesday": "11:00 AM – 10:00 PM",
    "wednesday": "11:00 AM – 10:00 PM",
    "thursday": "11:00 AM – 10:00 PM",
    "friday": "11:00 AM – 11:00 PM",
    "saturday": "09:30 AM – 11:00 PM",
    "sunday": "09:30 AM – 10:00 PM"
  },
  "hoursZh": {
    "monday": "周一：上午11时 – 晚上10时",
    "tuesday": "周二：上午11时 – 晚上10时",
    "wednesday": "周三：上午11时 – 晚上10时",
    "thursday": "周四：上午11时 – 晚上10时",
    "friday": "周五：上午11时 – 晚上11时",
    "saturday": "周六：上午9时30分 – 晚上11时",
    "sunday": "周日：上午9时30分 – 晚上10时"
  },
  "dimSumHours": {
    "open": "10:00",
    "close": "15:00"
  },
  "weekendBrunchHours": {
    "open": "09:30",
    "close": "15:00"
  },
  "seatingCapacity": {
    "regular": 120,
    "banquet": 500
  },
  "chefName": "Chef Wei Li",
  "chefNameZh": "厨师长李伟",
  "chefTitle": "Executive Chef",
  "chefTitleZh": "行政主厨",
  "wechatQrUrl": "",
  "wechatAccountName": "",
  "parkingNote": "Street parking available on Roosevelt Ave. Parking garage at 133rd St.",
  "parkingNoteZh": "Roosevelt Ave 沿街停车。133街停车场可用。",
  "googleRating": null,
  "googleReviewCount": null,
  "googlePlaceId": "",
  "yelpUrl": "",
  "instagramUrl": "",
  "facebookUrl": "",
  "defaultLocale": "en",
  "enabledLocales": ["en", "zh"]
}
```

**Admin form fields:**
- Text: name, nameZh, cuisineType, cuisineTypeZh, tagline, taglineZh, phone, email
- Address block: address, city, state, zip
- Hours editor (key-value): hours, hoursZh
- Time pickers: dimSumHours.open/close, weekendBrunchHours.open/close
- Number: seatingCapacity.regular, seatingCapacity.banquet
- Text: chefName, chefNameZh, chefTitle, chefTitleZh
- Image: wechatQrUrl
- Text: wechatAccountName
- Textarea: parkingNote, parkingNoteZh
- Number: googleRating, googleReviewCount
- Text: googlePlaceId, yelpUrl, instagramUrl, facebookUrl

---

## Contract: header.json {#headerJson}

**Path:** `content/[siteId]/[locale]/header.json`
**Admin form:** `/admin/content/header`

```json
{
  "logo": {
    "src": "/uploads/grand-pavilion/logo.svg",
    "alt": "Grand Pavilion",
    "altZh": "大观楼",
    "width": 160,
    "height": 48
  },
  "nameZhDisplay": "大观楼",
  "nameZhSubDisplay": "Grand Pavilion",
  "showChineseName": true,
  "dimSumBadge": {
    "enabled": true,
    "openMessage": "Dim Sum Now · 点心供应中",
    "closedMessage": "Dim Sum Daily 10am–3pm"
  },
  "cta": {
    "label": "Reserve a Table",
    "labelZh": "预约座位",
    "href": "/reservations"
  },
  "navigation": [
    { "label": "Menu", "labelZh": "菜单", "href": "/menu" },
    { "label": "Dim Sum", "labelZh": "点心", "href": "/dim-sum" },
    { "label": "Private Dining", "labelZh": "私人宴请", "href": "/private-dining" },
    { "label": "Festivals", "labelZh": "节日", "href": "/festivals" },
    { "label": "About", "labelZh": "关于我们", "href": "/about" },
    { "label": "Contact", "labelZh": "联系我们", "href": "/contact" }
  ],
  "mobileNavExtras": [
    { "label": "Catering", "labelZh": "餐饮外包", "href": "/catering" },
    { "label": "Gift Cards", "labelZh": "礼品卡", "href": "/gift-cards" }
  ]
}
```

**Admin form fields:**
- Image: logo.src (image picker), logo.alt, logo.altZh
- Text: nameZhDisplay, nameZhSubDisplay
- Toggle: showChineseName
- Toggle: dimSumBadge.enabled
- Text: dimSumBadge.openMessage, dimSumBadge.closedMessage
- Text: cta.label, cta.labelZh, cta.href
- Nav editor (add/remove/reorder): navigation items with label, labelZh, href
- Nav editor: mobileNavExtras items

---

## Contract: footer.json {#footerJson}

**Path:** `content/[siteId]/[locale]/footer.json`
**Admin form:** `/admin/content/footer`

```json
{
  "tagline": "Authentic Cantonese Cuisine Since 2010",
  "taglineZh": "正宗粤菜，2010年创立",
  "columns": [
    {
      "heading": "Visit Us",
      "headingZh": "拜访我们",
      "links": [
        { "label": "Reservations", "labelZh": "预约", "href": "/reservations" },
        { "label": "Private Dining", "labelZh": "私人宴请", "href": "/private-dining" },
        { "label": "Catering", "labelZh": "餐饮外包", "href": "/catering" },
        { "label": "Dim Sum", "labelZh": "点心", "href": "/dim-sum" }
      ]
    },
    {
      "heading": "Explore",
      "headingZh": "探索",
      "links": [
        { "label": "Our Menu", "labelZh": "我们的菜单", "href": "/menu" },
        { "label": "Festivals", "labelZh": "节日", "href": "/festivals" },
        { "label": "About", "labelZh": "关于我们", "href": "/about" },
        { "label": "Press", "labelZh": "媒体报道", "href": "/press" }
      ]
    }
  ],
  "wechatColumn": {
    "enabled": true,
    "heading": "Follow on WeChat",
    "headingZh": "关注微信公众号",
    "qrUrl": "",
    "accountName": ""
  },
  "cuisineCallout": "粤菜 · Cantonese",
  "copyrightName": "Grand Pavilion",
  "showLanguageSwitcher": true
}
```

---

## Contract: seo.json {#seoJson}

**Path:** `content/[siteId]/[locale]/seo.json`
**Admin form:** `/admin/content/seo`
**Scope:** Default fallback SEO. Each page overrides per-page title/description.

```json
{
  "defaultTitle": "Grand Pavilion — Authentic Cantonese Restaurant in Flushing, NY",
  "defaultTitleZh": "大观楼 — 纽约法拉盛正宗粤菜餐厅",
  "defaultDescription": "Grand Pavilion serves authentic Cantonese dim sum and dinner in Flushing, Queens. Celebrate festivals, host private banquets, and discover chef's signature dishes.",
  "defaultDescriptionZh": "大观楼供应正宗粤菜点心及晚餐，位于皇后区法拉盛。欢迎庆祝节日、举办私人宴会，品味厨师签名菜肴。",
  "ogImage": "/uploads/grand-pavilion/og-default.jpg",
  "ogType": "restaurant",
  "twitterCard": "summary_large_image",
  "localBusiness": {
    "type": "ChineseRestaurant",
    "priceRange": "$$",
    "servesCuisine": ["Cantonese", "Dim Sum", "Chinese"]
  }
}
```

---

## Contract: pages/home.json {#homeJson}

**Path:** `content/[siteId]/[locale]/pages/home.json`
**Admin form:** `/admin/content/pages/home`

```json
{
  "seo": {
    "title": "Grand Pavilion — Authentic Cantonese Dim Sum & Dinner, Flushing NY",
    "titleZh": "大观楼 — 法拉盛正宗粤式点心与晚餐",
    "description": "..."
  },
  "hero": {
    "_type": "hero",
    "_variant": "ink-wash",
    "headline": "Authentic Cantonese Cuisine",
    "headlineZh": "正宗粤菜",
    "subheadline": "Dim Sum · Private Dining · Seasonal Festivals",
    "subheadlineZh": "点心 · 私人宴请 · 节令盛宴",
    "image": "/uploads/grand-pavilion/hero/hero-main.jpg",
    "cta": {
      "primary": { "label": "Reserve a Table", "labelZh": "预约座位", "href": "/reservations" },
      "secondary": { "label": "View Menu", "labelZh": "查看菜单", "href": "/menu" }
    }
  },
  "festival_highlight": {
    "_type": "festival_highlight",
    "_variant": "banner",
    "activeFestivalId": null,
    "fallbackMessage": "Coming Soon: Mid-Autumn Festival 2026",
    "fallbackMessageZh": "即将推出：2026年中秋节",
    "showCountdown": true
  },
  "dim_sum_status": {
    "_type": "dim_sum_status",
    "enabled": true,
    "openMessage": "Dim Sum Available Now · 点心供应中",
    "closedMessage": "Dim Sum Available Daily 10am–3pm",
    "closedMessageZh": "点心每日上午10时至下午3时供应"
  },
  "intro": {
    "_type": "text_intro",
    "headline": "A Gathering Place for Generations",
    "headlineZh": "世代相聚之地",
    "body": "...",
    "bodyZh": "..."
  },
  "cuisine_highlights": {
    "_type": "cuisine_highlights",
    "items": [
      {
        "title": "Dim Sum",
        "titleZh": "点心",
        "description": "...",
        "descriptionZh": "...",
        "image": "/uploads/grand-pavilion/home/dim-sum-highlight.jpg",
        "href": "/dim-sum"
      },
      {
        "title": "Chef's Signatures",
        "titleZh": "厨师签名菜",
        "description": "...",
        "descriptionZh": "...",
        "image": "/uploads/grand-pavilion/home/chef-highlight.jpg",
        "href": "/chefs-table"
      },
      {
        "title": "Private Banquets",
        "titleZh": "私人宴席",
        "description": "...",
        "descriptionZh": "...",
        "image": "/uploads/grand-pavilion/home/banquet-highlight.jpg",
        "href": "/private-dining"
      }
    ]
  },
  "chef_intro": {
    "_type": "chef_intro",
    "name": "Chef Wei Li",
    "nameZh": "厨师长李伟",
    "title": "Executive Chef",
    "titleZh": "行政主厨",
    "quote": "...",
    "quoteZh": "...",
    "image": "/uploads/grand-pavilion/team/chef-wei-li.jpg",
    "href": "/about"
  },
  "testimonials": {
    "_type": "testimonials",
    "_source": "db",
    "displayCount": 3,
    "variant": "cards"
  },
  "private_dining_cta": {
    "_type": "private_dining_cta",
    "headline": "Host Your Celebration in Style",
    "headlineZh": "以风雅之姿，主持您的盛宴",
    "subline": "Private rooms for 10–500 guests. Full banquet menus available.",
    "sublineZh": "私人包厢可容纳10至500位宾客，提供完整宴席菜单。",
    "image": "/uploads/grand-pavilion/home/private-dining-cta.jpg",
    "cta": { "label": "Explore Banquet Packages", "labelZh": "探索宴席套餐", "href": "/private-dining" }
  },
  "press_strip": {
    "_type": "press_strip",
    "_source": "db",
    "displayCount": 4
  },
  "gallery_strip": {
    "_type": "gallery_strip",
    "_source": "db",
    "displayCount": 6,
    "category": "food"
  },
  "reservation_cta": {
    "_type": "reservation_cta",
    "headline": "Ready to Experience Grand Pavilion?",
    "headlineZh": "准备好体验大观楼了吗？",
    "cta": { "label": "Reserve a Table", "labelZh": "立即预约", "href": "/reservations" }
  }
}
```

---

## Contract: pages/about.json {#aboutJson}

```json
{
  "seo": {
    "title": "About Grand Pavilion — Our Story & Heritage",
    "titleZh": "关于大观楼 — 我们的故事与传承"
  },
  "hero": {
    "_type": "page_hero",
    "title": "Our Story",
    "titleZh": "我们的故事",
    "image": "/uploads/grand-pavilion/about/about-hero.jpg"
  },
  "story": {
    "headline": "A Legacy of Cantonese Excellence",
    "headlineZh": "粤菜卓越的传承",
    "body": "...",
    "bodyZh": "...",
    "image": "/uploads/grand-pavilion/about/dining-room.jpg"
  },
  "stats": [
    { "value": "15+", "label": "Years of Excellence", "labelZh": "卓越年份" },
    { "value": "80+", "label": "Menu Items", "labelZh": "菜品数量" },
    { "value": "500", "label": "Banquet Capacity", "labelZh": "宴会容量" },
    { "value": "3", "label": "Private Dining Rooms", "labelZh": "私人包厢" }
  ],
  "team": {
    "_type": "team",
    "_source": "db",
    "variant": "chef-profile"
  },
  "values": [
    {
      "title": "Authenticity",
      "titleZh": "正宗",
      "body": "...",
      "bodyZh": "..."
    }
  ],
  "cta": {
    "label": "Make a Reservation",
    "labelZh": "立即预约",
    "href": "/reservations"
  }
}
```

---

## Contract: pages/menu.json {#menuJson}

**Note:** Menu items come from DB (`menu_items` + `menu_categories` tables). This file is config only.

```json
{
  "seo": {
    "title": "Menu — Grand Pavilion Cantonese Restaurant",
    "titleZh": "菜单 — 大观楼粤菜餐厅"
  },
  "hero": {
    "_type": "page_hero",
    "title": "Our Menu",
    "titleZh": "菜单",
    "subtitle": "Authentic Cantonese cuisine from Hong Kong to your table",
    "subtitleZh": "正宗粤菜，从香港到您的餐桌"
  },
  "displayConfig": {
    "showChineseName": true,
    "showOriginRegion": false,
    "showDietaryBadges": true,
    "defaultCategory": null
  },
  "chefSignatureCta": {
    "enabled": true,
    "text": "Looking for Chef's Signatures?",
    "textZh": "寻找厨师签名菜？",
    "href": "/chefs-table"
  },
  "dimSumCta": {
    "enabled": true,
    "text": "Explore our Dim Sum selection →",
    "textZh": "探索我们的点心精选 →",
    "href": "/dim-sum"
  }
}
```

---

## Contract: pages/dim-sum.json {#dimSumJson}

```json
{
  "seo": {
    "title": "Dim Sum Menu — Grand Pavilion Flushing NY",
    "titleZh": "点心菜单 — 大观楼 法拉盛"
  },
  "hero": {
    "_type": "page_hero",
    "title": "Dim Sum",
    "titleZh": "点心",
    "subtitle": "Served daily 10am–3pm · Weekend brunch from 9:30am",
    "subtitleZh": "每日上午10时至下午3时供应 · 周末早午餐从9:30开始"
  },
  "cartConfig": {
    "enabled": true,
    "submitAction": "order",
    "orderLeadTimeDays": 1,
    "minItems": 1
  },
  "categories": [
    { "slug": "har-gow", "label": "Har Gow (Shrimp Dumplings)", "labelZh": "虾饺" },
    { "slug": "siu-mai", "label": "Siu Mai", "labelZh": "烧卖" },
    { "slug": "bao", "label": "Bao (Buns)", "labelZh": "包子" },
    { "slug": "cheung-fun", "label": "Cheung Fun (Rice Rolls)", "labelZh": "肠粉" },
    { "slug": "taro", "label": "Taro & Root Items", "labelZh": "芋头类" },
    { "slug": "egg-tart", "label": "Egg Tarts & Desserts", "labelZh": "蛋挞 & 甜点" },
    { "slug": "congee", "label": "Congee & Soups", "labelZh": "粥 & 汤" },
    { "slug": "noodle", "label": "Noodles", "labelZh": "面条" }
  ],
  "informationalNote": "All dim sum items made fresh daily in-house.",
  "informationalNoteZh": "所有点心每日现做。"
}
```

---

## Contract: pages/chefs-table.json {#chefsTableJson}

```json
{
  "seo": {
    "title": "Chef's Signatures — Grand Pavilion",
    "titleZh": "厨师签名菜 — 大观楼"
  },
  "hero": {
    "_type": "page_hero",
    "title": "Chef's Signatures",
    "titleZh": "厨师签名菜",
    "subtitle": "Exclusive creations from Executive Chef Wei Li",
    "subtitleZh": "行政主厨李伟的独家创作"
  },
  "chefIntro": {
    "name": "Chef Wei Li",
    "nameZh": "厨师长李伟",
    "quote": "...",
    "quoteZh": "...",
    "image": "/uploads/grand-pavilion/team/chef-wei-li.jpg"
  },
  "displayConfig": {
    "layout": "alternating",
    "showChefNote": true,
    "showPairing": true,
    "showSealDecoration": true
  },
  "reservationCta": {
    "text": "Request this dish — mention it in your reservation notes",
    "textZh": "预约时注明此菜品，即可安排专属享用",
    "href": "/reservations"
  }
}
```

---

## Contract: pages/private-dining.json {#privateDiningJson}

```json
{
  "seo": {
    "title": "Private Dining & Banquet Halls — Grand Pavilion",
    "titleZh": "私人宴请 & 宴会厅 — 大观楼"
  },
  "hero": {
    "_type": "page_hero",
    "title": "Private Dining & Banquets",
    "titleZh": "私人宴请 & 宴席",
    "subtitle": "Elegant spaces for every occasion — from intimate gatherings to grand celebrations",
    "subtitleZh": "从小型聚会到盛大庆典，优雅空间满足各类需求",
    "image": "/uploads/grand-pavilion/private-dining/banquet-hero.jpg"
  },
  "rooms": [
    {
      "name": "Jade Room",
      "nameZh": "翡翠厅",
      "capacity": 10,
      "description": "Intimate private room with floor-to-ceiling glass panels.",
      "descriptionZh": "亲密私人包厢，落地玻璃隔断。",
      "image": "/uploads/grand-pavilion/private-dining/jade-room.jpg"
    },
    {
      "name": "Phoenix Hall",
      "nameZh": "凤凰厅",
      "capacity": 80,
      "description": "Semi-private banquet space for mid-size celebrations.",
      "descriptionZh": "半私密宴会空间，适合中型庆典。",
      "image": "/uploads/grand-pavilion/private-dining/phoenix-hall.jpg"
    },
    {
      "name": "Grand Ballroom",
      "nameZh": "大礼堂",
      "capacity": 500,
      "description": "Our largest space — perfect for wedding banquets and corporate galas.",
      "descriptionZh": "最大空间，完美适合婚宴及企业晚宴。",
      "image": "/uploads/grand-pavilion/private-dining/grand-ballroom.jpg"
    }
  ],
  "banquetPackages": {
    "_type": "banquet_packages",
    "_source": "db",
    "displayStyle": "cards"
  },
  "testimonials": {
    "_type": "testimonials",
    "_source": "db",
    "filter": "private-dining",
    "displayCount": 3
  },
  "faqItems": [
    { "q": "What is the minimum guest count for private dining?", "qZh": "私人宴请最少需要多少位宾客？", "a": "Our Jade Room accommodates groups of 6–10 guests.", "aZh": "翡翠厅可容纳6至10位宾客。" }
  ]
}
```

---

## Contract: pages/catering.json {#cateringJson}

```json
{
  "seo": {
    "title": "Chinese Catering Services — Grand Pavilion",
    "titleZh": "中式餐饮外包服务 — 大观楼"
  },
  "hero": {
    "_type": "page_hero",
    "title": "Authentic Chinese Catering",
    "titleZh": "正宗中式餐饮服务",
    "subtitle": "From intimate gatherings to grand celebrations, we bring the Grand Pavilion experience to you.",
    "subtitleZh": "从小型聚会到盛大庆典，大观楼的体验送到您身边。",
    "image": "/uploads/grand-pavilion/catering/catering-hero.jpg"
  },
  "overview": {
    "body": "...",
    "bodyZh": "...",
    "minimumOrder": 500,
    "serviceRadius": "50 miles from Flushing, NY",
    "leadTime": "14 days minimum"
  },
  "serviceTypes": [
    { "id": "corporate", "name": "Corporate Events", "nameZh": "企业活动", "icon": "building" },
    { "id": "wedding", "name": "Wedding Banquet", "nameZh": "婚宴", "icon": "heart" },
    { "id": "birthday", "name": "Birthday Celebration", "nameZh": "生日宴", "icon": "cake" },
    { "id": "holiday", "name": "Holiday Party", "nameZh": "节日聚会", "icon": "star" }
  ],
  "gallery": {
    "_type": "gallery_strip",
    "_source": "db",
    "category": "catering",
    "displayCount": 6
  }
}
```

---

## Contract: pages/reservations.json {#reservationsJson}

```json
{
  "seo": {
    "title": "Reserve a Table — Grand Pavilion",
    "titleZh": "预约座位 — 大观楼"
  },
  "hero": {
    "title": "Make a Reservation",
    "titleZh": "预约座位"
  },
  "reservationConfig": {
    "provider": "custom",
    "alternativeProviders": ["opentable", "resy"],
    "maxPartySizeForOnline": 9,
    "largeGroupMessage": "For groups of 10 or more, please inquire about our private dining options.",
    "largeGroupMessageZh": "10位或以上宾客，请咨询私人宴请选项。",
    "largeGroupCta": { "label": "Private Dining Inquiry", "labelZh": "私人宴请咨询", "href": "/private-dining" }
  },
  "dimSumNote": {
    "enabled": true,
    "text": "Dim Sum is available daily 10am–3pm. Walk-ins welcome.",
    "textZh": "点心每日上午10时至下午3时供应，欢迎随时光临。"
  },
  "specialOccasionPrompt": {
    "enabled": true,
    "occasions": [
      { "id": "birthday", "label": "Birthday", "labelZh": "生日" },
      { "id": "anniversary", "label": "Anniversary", "labelZh": "周年纪念" },
      { "id": "business", "label": "Business Dinner", "labelZh": "商务晚宴" },
      { "id": "other", "label": "Other", "labelZh": "其他" }
    ]
  },
  "hours": {
    "weekday": "11:00 AM – 10:00 PM",
    "weekdayZh": "周一至周五：上午11时 – 晚上10时",
    "weekend": "9:30 AM – 11:00 PM",
    "weekendZh": "周六至周日：上午9时30分 – 晚上11时"
  }
}
```

---

## Contract: pages/contact.json {#contactJson}

```json
{
  "seo": {
    "title": "Contact Grand Pavilion — Flushing, NY",
    "titleZh": "联系大观楼 — 法拉盛"
  },
  "hero": {
    "title": "Get in Touch",
    "titleZh": "联系我们"
  },
  "mapEmbed": {
    "src": "https://www.google.com/maps/embed?pb=...",
    "address": "136-20 Roosevelt Ave, Flushing, NY 11354"
  },
  "wechat": {
    "enabled": true,
    "qrUrl": "",
    "accountName": "",
    "scanLabel": "Scan to follow us on WeChat",
    "scanLabelZh": "扫描二维码关注微信公众号"
  },
  "parking": {
    "note": "Street parking available on Roosevelt Ave. Parking garage at 133rd St.",
    "noteZh": "Roosevelt Ave 沿街停车。133街停车场可用。",
    "valetAvailable": false
  },
  "transit": {
    "note": "2 blocks from Flushing–Main St subway station (7 train).",
    "noteZh": "距法拉盛主街地铁站（7号线）2个街区。"
  },
  "formConfig": {
    "fields": ["name", "email", "phone", "subject", "message", "wechat_id"],
    "wechatIdLabel": "WeChat ID (optional)",
    "wechatIdLabelZh": "微信号（可选）"
  }
}
```

---

## Contract: pages/gallery.json {#galleryJson}

```json
{
  "seo": {
    "title": "Gallery — Grand Pavilion",
    "titleZh": "图片展示 — 大观楼"
  },
  "hero": {
    "title": "Gallery",
    "titleZh": "图片展示"
  },
  "categories": [
    { "slug": "food", "label": "Food", "labelZh": "菜品" },
    { "slug": "dim-sum", "label": "Dim Sum", "labelZh": "点心" },
    { "slug": "dining-room", "label": "Dining Room", "labelZh": "餐厅环境" },
    { "slug": "events", "label": "Events", "labelZh": "活动" },
    { "slug": "festivals", "label": "Festivals", "labelZh": "节日" },
    { "slug": "chef", "label": "Chef", "labelZh": "厨师" }
  ],
  "displayConfig": {
    "layout": "masonry",
    "lightboxEnabled": true,
    "showCaptionZh": true
  }
}
```

---

## Contract: pages/events.json {#eventsJson}

```json
{
  "seo": {
    "title": "Events — Grand Pavilion",
    "titleZh": "活动 — 大观楼"
  },
  "hero": {
    "title": "Events & Celebrations",
    "titleZh": "活动 & 庆典"
  },
  "eventTypes": [
    { "id": "cny-dinner", "label": "Chinese New Year Dinner", "labelZh": "农历新年晚宴" },
    { "id": "mid-autumn", "label": "Mid-Autumn Celebration", "labelZh": "中秋节庆典" },
    { "id": "chefs-table", "label": "Chef's Table", "labelZh": "厨师长餐桌" },
    { "id": "tasting-menu", "label": "Seasonal Tasting Menu", "labelZh": "时令品鉴菜单" }
  ],
  "emptyState": {
    "message": "No upcoming events. Follow us on WeChat for announcements.",
    "messageZh": "暂无近期活动。关注微信公众号获取最新资讯。"
  }
}
```

---

## Contract: pages/blog.json {#blogJson}

```json
{
  "seo": {
    "title": "Stories & Recipes — Grand Pavilion",
    "titleZh": "故事 & 食谱 — 大观楼"
  },
  "hero": {
    "title": "Stories & Recipes",
    "titleZh": "故事 & 食谱"
  },
  "categories": [
    { "slug": "cuisine-stories", "label": "Cuisine Stories", "labelZh": "饮食故事" },
    { "slug": "seasonal", "label": "Seasonal Highlights", "labelZh": "时令精选" },
    { "slug": "chef-notes", "label": "Chef's Notes", "labelZh": "厨师笔记" },
    { "slug": "events", "label": "Events & Festivals", "labelZh": "活动 & 节日" }
  ],
  "displayConfig": {
    "postsPerPage": 9,
    "showChineseTitle": true
  }
}
```

---

## Contract: pages/festivals/[slug].json {#festivalsJson}

**Path:** `content/[siteId]/[locale]/pages/festivals/chinese-new-year.json`
**Note:** One file per festival. Slug matches `festivals.slug` in DB.

```json
{
  "festivalId": "chinese-new-year",
  "seo": {
    "title": "Chinese New Year Dinner 2027 — Grand Pavilion",
    "titleZh": "2027年农历新年晚宴 — 大观楼",
    "description": "Celebrate Lunar New Year with an authentic Cantonese prix-fixe dinner at Grand Pavilion, Flushing.",
    "descriptionZh": "在大观楼，以正宗粤式套餐庆祝农历新年。"
  },
  "hero": {
    "image": "/uploads/grand-pavilion/festivals/cny-hero.jpg",
    "tagline": "Ring in the Year of the Goat",
    "taglineZh": "迎接羊年到来",
    "subline": "Special prix-fixe menus · January 28 – February 14, 2027",
    "sublineZh": "特别套餐 · 2027年1月28日 – 2月14日"
  },
  "story": {
    "title": "A Celebration of Prosperity & Reunion",
    "titleZh": "庆祝繁荣与团圆",
    "body": "...",
    "bodyZh": "..."
  },
  "prixFixeTiers": {
    "_type": "prix_fixe_tiers",
    "_source": "db",
    "festivalId": "chinese-new-year"
  },
  "urgency": {
    "enabled": true,
    "message": "Only {count} tables remaining — Reserve Now",
    "messageZh": "仅剩 {count} 个座位 — 立即预约",
    "count": 12
  },
  "giftBoxes": {
    "enabled": false,
    "items": []
  },
  "cta": {
    "primary": { "label": "Reserve Festival Menu", "labelZh": "预约节日套餐", "href": "/reservations" },
    "secondary": { "label": "View Full Menu", "labelZh": "查看完整菜单", "href": "/menu" }
  }
}
```

---

## Contract: pages/press.json {#pressJson}

```json
{
  "seo": {
    "title": "Press & Recognition — Grand Pavilion",
    "titleZh": "媒体报道 — 大观楼"
  },
  "hero": {
    "title": "Press & Recognition",
    "titleZh": "媒体报道"
  },
  "displayConfig": {
    "_source": "db",
    "showLogos": true,
    "layout": "grid"
  }
}
```

---

## Contract: pages/gift-cards.json {#giftCardsJson}

```json
{
  "seo": {
    "title": "Gift Cards — Grand Pavilion",
    "titleZh": "礼品卡 — 大观楼"
  },
  "hero": {
    "title": "Gift Cards",
    "titleZh": "礼品卡"
  },
  "provider": {
    "type": "square",
    "embedUrl": "",
    "fallbackMessage": "Purchase gift cards by calling us at (718) 555-0100.",
    "fallbackMessageZh": "请致电 (718) 555-0100 购买礼品卡。"
  },
  "occasions": [
    { "label": "Birthday", "labelZh": "生日" },
    { "label": "Wedding Gift", "labelZh": "婚礼礼物" },
    { "label": "Holiday", "labelZh": "节日" },
    { "label": "Thank You", "labelZh": "感谢" }
  ]
}
```

---

## Contract: pages/order-online.json {#orderOnlineJson}

```json
{
  "seo": {
    "title": "Order Online — Grand Pavilion",
    "titleZh": "在线订餐 — 大观楼"
  },
  "hero": {
    "title": "Order Online",
    "titleZh": "在线订餐"
  },
  "provider": {
    "type": "doordash",
    "url": "",
    "alternativeProviders": [
      { "name": "Uber Eats", "url": "" },
      { "name": "Grubhub", "url": "" }
    ]
  },
  "note": "Online ordering is available for pickup and delivery within 5 miles.",
  "noteZh": "在线订餐支持自取及5英里内外送。"
}
```

---

## Contract: pages/faq.json {#faqJson}

```json
{
  "seo": {
    "title": "FAQ — Grand Pavilion",
    "titleZh": "常见问题 — 大观楼"
  },
  "hero": {
    "title": "Frequently Asked Questions",
    "titleZh": "常见问题"
  },
  "categories": [
    {
      "id": "reservations",
      "label": "Reservations",
      "labelZh": "预约",
      "items": [
        {
          "q": "How far in advance should I book?",
          "qZh": "应提前多久预约？",
          "a": "We recommend booking 1–2 weeks in advance, especially for weekends.",
          "aZh": "建议提前1至2周预约，尤其是周末。"
        }
      ]
    },
    {
      "id": "dim-sum",
      "label": "Dim Sum",
      "labelZh": "点心",
      "items": [
        {
          "q": "What are dim sum hours?",
          "qZh": "点心供应时间是？",
          "a": "Dim Sum is served daily 10am–3pm, with weekend brunch starting at 9:30am.",
          "aZh": "点心每日上午10时至下午3时供应，周末早午餐从9时30分开始。"
        }
      ]
    },
    {
      "id": "private-dining",
      "label": "Private Dining",
      "labelZh": "私人宴请",
      "items": []
    },
    {
      "id": "dietary",
      "label": "Dietary",
      "labelZh": "饮食要求",
      "items": [
        {
          "q": "Do you have halal or kosher options?",
          "qZh": "是否提供清真或洁食选项？",
          "a": "Yes. Items marked with 清真 (Halal) or 洁食 (Kosher) on the menu meet those standards.",
          "aZh": "是的。菜单上标有清真或洁食标志的菜品符合相应标准。"
        }
      ]
    }
  ]
}
```

---

## Contract: pages/careers.json {#careersJson}

```json
{
  "seo": {
    "title": "Careers — Grand Pavilion",
    "titleZh": "招聘 — 大观楼"
  },
  "hero": {
    "title": "Join Our Team",
    "titleZh": "加入我们的团队"
  },
  "intro": {
    "body": "...",
    "bodyZh": "..."
  },
  "openings": [
    {
      "title": "Line Cook",
      "titleZh": "厨师",
      "type": "full-time",
      "description": "...",
      "descriptionZh": "..."
    }
  ],
  "applicationNote": "Send resume to careers@grandpavilion.com or speak with a manager in person.",
  "applicationNoteZh": "请将简历发送至 careers@grandpavilion.com，或到店直接与经理联系。"
}
```

---

## Admin Form Panel Registry

This table maps every content file to its admin panel component. Use this to audit admin coverage in Phase 3A.

| Content File | Admin Route | Panel Component | Notes |
|---|---|---|---|
| site.json | `/admin/content/site` | `SiteInfoPanel` | Extended with ZH fields |
| header.json | `/admin/content/header` | `HeaderPanel` | Extended with ZH nav |
| footer.json | `/admin/content/footer` | `FooterPanel` | Extended with WeChat column |
| seo.json | `/admin/content/seo` | `SeoPanel` | Extended with ZH fields |
| pages/home.json | `/admin/content/pages/home` | `HomePagePanel` | Chinese sections added |
| pages/about.json | `/admin/content/pages/about` | `AboutPagePanel` | ZH story + stats |
| pages/menu.json | `/admin/content/pages/menu` | `MenuConfigPanel` | Config only; items in `/admin/menu` |
| pages/dim-sum.json | `/admin/content/pages/dim-sum` | `DimSumConfigPanel` | Cart config + categories |
| pages/chefs-table.json | `/admin/content/pages/chefs-table` | `ChefsTableConfigPanel` | Display config |
| pages/private-dining.json | `/admin/content/pages/private-dining` | `PrivateDiningPanel` | Rooms + banquet packages ref |
| pages/catering.json | `/admin/content/pages/catering` | `CateringPanel` | Service types |
| pages/reservations.json | `/admin/content/pages/reservations` | `ReservationsConfigPanel` | Occasion types, hours |
| pages/contact.json | `/admin/content/pages/contact` | `ContactPagePanel` | WeChat, parking, transit |
| pages/gallery.json | `/admin/content/pages/gallery` | `GalleryConfigPanel` | Categories + display config |
| pages/events.json | `/admin/content/pages/events` | `EventsConfigPanel` | Event types, empty state |
| pages/blog.json | `/admin/content/pages/blog` | `BlogConfigPanel` | Categories, posts/page |
| pages/festivals/[slug].json | `/admin/festivals/[id]` | `FestivalEditor` | Full festival editor (not Content Editor) |
| pages/press.json | `/admin/content/pages/press` | `PressConfigPanel` | Display config only |
| pages/gift-cards.json | `/admin/content/pages/gift-cards` | `GiftCardsPanel` | Provider config |
| pages/faq.json | `/admin/content/pages/faq` | `FaqPanel` | Category + Q&A editor |

---

## Validation Script

**File:** `scripts/validate-content-contracts.mjs`
**Run:** `node scripts/validate-content-contracts.mjs [siteId]`

This script validates that all required content files exist and have the required top-level keys:

```javascript
#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const siteId = process.argv[2] || process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'grand-pavilion'
const locales = ['en', 'zh']

// Required top-level keys per file
const CONTRACTS = {
  'site.json': ['id', 'name', 'nameZh', 'cuisineType', 'cuisineTypeZh', 'phone', 'hours', 'dimSumHours'],
  'header.json': ['logo', 'nameZhDisplay', 'navigation'],
  'footer.json': ['columns'],
  'seo.json': ['defaultTitle', 'defaultTitleZh', 'defaultDescription'],
  'pages/home.json': ['seo', 'hero', 'festival_highlight', 'dim_sum_status'],
  'pages/about.json': ['seo', 'hero', 'story'],
  'pages/menu.json': ['seo', 'displayConfig'],
  'pages/dim-sum.json': ['seo', 'cartConfig', 'categories'],
  'pages/chefs-table.json': ['seo', 'hero', 'chefIntro'],
  'pages/private-dining.json': ['seo', 'rooms', 'banquetPackages'],
  'pages/catering.json': ['seo', 'overview', 'serviceTypes'],
  'pages/reservations.json': ['seo', 'reservationConfig', 'hours'],
  'pages/contact.json': ['seo', 'wechat', 'parking'],
  'pages/gallery.json': ['seo', 'categories'],
  'pages/faq.json': ['seo', 'categories'],
}

const issues = []

for (const locale of locales) {
  const localeRoot = join(ROOT, 'content', siteId, locale)
  if (!existsSync(localeRoot)) {
    issues.push(`Missing locale directory: ${locale}`)
    continue
  }

  for (const [file, requiredKeys] of Object.entries(CONTRACTS)) {
    const filePath = join(localeRoot, file)
    if (!existsSync(filePath)) {
      issues.push(`[${locale}] Missing: ${file}`)
      continue
    }
    try {
      const data = JSON.parse(readFileSync(filePath, 'utf-8'))
      for (const key of requiredKeys) {
        if (!(key in data)) {
          issues.push(`[${locale}] ${file}: missing required key "${key}"`)
        }
      }
    } catch {
      issues.push(`[${locale}] ${file}: invalid JSON`)
    }
  }

  // ZH-specific: site.json nameZh must not be empty
  const sitePath = join(localeRoot, 'site.json')
  if (existsSync(sitePath)) {
    const site = JSON.parse(readFileSync(sitePath, 'utf-8'))
    if (!site.nameZh || site.nameZh.trim() === '') {
      issues.push(`[${locale}] site.json: nameZh is empty — Chinese name is required`)
    }
  }

  // Festivals: at least one festival file must exist if dim sum enabled
  const festivalsDir = join(localeRoot, 'pages', 'festivals')
  if (!existsSync(festivalsDir)) {
    issues.push(`[${locale}] Missing pages/festivals/ directory`)
  }
}

if (issues.length > 0) {
  console.error(`Content contract validation FAILED for ${siteId}:`)
  issues.forEach(i => console.error(`  ✗ ${i}`))
  process.exit(1)
}

console.log(`✓ Content contracts valid for ${siteId}`)
```

**Add to package.json scripts:**
```json
"validate:contracts": "node scripts/validate-content-contracts.mjs"
```

**Add to `npm run qa` sequence (Phase 3H).**

---

## Chinese-Specific Field Rules

These rules apply across all content files. Cursor prompts must enforce them.

| Rule | Field | Behavior |
|---|---|---|
| **nameZh required** | `nameZh` in site.json, menu_items, banquet_packages, festivals | TypeScript: `string` not `string \| null`. Validation script fails if empty. |
| **ZH fields match EN structure** | Every EN `body` has `bodyZh`. Every EN `title` has `titleZh`. | Admin panels show EN + ZH side-by-side. |
| **No auto-translation** | ZH fields are authored, not Google Translated | O5 AI prompt instructs Claude to write authentic ZH copy |
| **Locale-aware rendering** | Components read `locale` from context, display EN or ZH based on active locale | Never hardcode EN text inside components |
| **hreflang on every page** | `<link rel="alternate" hreflang="zh-Hans" href="/zh/[path]" />` | `generateChineseRestaurantMetadata()` includes this automatically |
| **og:locale** | `og:locale="zh_CN"` on ZH pages, `og:locale="en_US"` on EN pages | Part of SEO utility in Phase 3C |
