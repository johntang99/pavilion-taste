# BAAM System F — Chinese Restaurant Premium
# Phase 3: Admin Hardening + Chinese SEO

> **System:** BAAM System F — Chinese Restaurant Premium
> **Reference files:** `@RESTAURANT_CHINESE_COMPLETE_PLAN.md`
> **Prerequisite:** Phase 2 gate fully passed. `v0.2-complete-frontend` tagged.
> **Method:** One Cursor prompt per session.
> **Rule:** No new features. Only hardening, coverage, and SEO. Fix everything before Phase 4.

---

## Phase 3 Overview

**Duration:** Week 4
**Goal:** Close every admin coverage gap. Implement Chinese SEO (hreflang, ZH meta, schema.org). Build programmatic pages for dish-level SEO. Run all QA scripts to zero errors. Leave nothing for Phase 4 to discover.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 3A | Admin Coverage Audit | Every section of every page has Form mode fields | 90 min |
| 3B | Admin Certification SOP | One-pass BUILD→WIRE→VERIFY checklist for all pages | 60 min |
| 3C | Chinese SEO — Hreflang + ZH Meta | EN + ZH meta on every page, hreflang correct | 60 min |
| 3D | Programmatic SEO — Dish Pages + Festival Pages | `/menu/[item-slug]` dish pages, MenuItem schema | 90 min |
| 3E | Schema.org Markup | Restaurant, MenuItem, Event, Festival, BreadcrumbList | 60 min |
| 3F | Sitemap + robots.txt + IndexNow | Full bilingual sitemap, all routes | 45 min |
| 3G | Performance Optimization | Font subsetting, image priority, ZH font load | 45 min |
| 3H | QA Automation Scripts | Run all QA scripts — fix every failure | 60 min |

---

## Prompt 3A — Admin Coverage Audit

**Goal:** Every section of every page must have admin Form mode fields. This prompt closes all gaps before the certification pass.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: BAAM Master Plan V3.4 — Admin Certification SOP

Perform a systematic audit: for EVERY page, open the admin Content Editor,
click Form mode, and verify every visible section has editable fields.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGES TO AUDIT (check Form mode for each)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Core pages:
□ pages/home.json
□ pages/menu.json
□ pages/about.json
□ pages/reservations.json
□ pages/contact.json
□ pages/private-dining.json
□ pages/catering.json
□ pages/gallery.json
□ pages/faq.json
□ pages/gift-cards.json
□ pages/careers.json
□ pages/press.json

Festival pages:
□ pages/festivals/chinese-new-year.json
□ pages/festivals/mid-autumn.json

Global content:
□ site.json (restaurantNameZh, WeChat fields, dim sum hours, parking notes)
□ header.json
□ footer.json
□ seo.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON GAPS TO FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each gap found, add the missing Form field in the relevant admin panel component.

Known gaps to check:
1. FestivalHighlightSection on home.json:
   - Form fields: variant dropdown (banner/section/hidden),
     fallbackMessage (EN), fallbackMessageZh (ZH), showCountdown toggle

2. DimSumStatusBadge config in site.json:
   - Form fields: dimSumHours.open, dimSumHours.close,
     weekendBrunchHours.open, weekendBrunchHours.close

3. BilinguaHeroHeadline on hero sections:
   - Form fields: taglineZh, sublineZh text inputs (EN already exists)

4. ChefHeroFull section:
   - Form fields: nameZh, titleZh, all 3 credentials ZH, quoteZh

5. Festival pages (festivals/*.json):
   - Form fields: urgency count (number), urgency message ZH,
     prix-fixe tier editor (add/remove tiers), gift boxes toggle

6. Private dining page:
   - Form fields: banquet capacity rooms (name, nameZh, capacity, image per room)

7. About page:
   - Form fields: story layout toggle, each paragraph EN + ZH,
     all 4 stats (value, label, labelZh)

8. Footer:
   - Form fields: wechatQrUrl, wechatAccountName, cuisineTypeZh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE: If a section renders on the frontend, it MUST be editable in Form mode.
      No exceptions. "JSON-only" is not acceptable for any visible content.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Done-Gate 3A:**
- Every page listed above: open Form mode → all visible sections have fields
- No section is "JSON-only" (i.e., only editable via the JSON tab)
- All ZH fields present: taglineZh, sublineZh, nameZh, credentials ZH, quoteZh, etc.

---

## Prompt 3B — Admin Certification SOP (One-Pass Checklist)

**Goal:** Run the BUILD → WIRE → VERIFY pattern for every page in one systematic pass. Fix anything that fails.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: BAAM Master Plan V3.4 Section 29 — Admin Certification SOP

For EACH page in the list below, run the 3-step verification:

BUILD: Does the page render from DB content? (Not from hardcoded strings)
WIRE:  Does the admin Form mode show correct fields for every section?
VERIFY: Does editing in Form mode → Save → update the live frontend?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION SCRIPT FOR EACH PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run this test sequence for each page:

TEST 1 (BUILD): In Supabase table editor, find the content_entries row for
this page (site_id='grand-pavilion', locale='en', path='pages/[name].json').
Change one text field directly in Supabase.
Reload the page in browser. The change must appear.

TEST 2 (WIRE): Open admin → Content Editor → select page → Form mode.
Verify every section visible in the frontend has corresponding form fields.
Verify variant dropdown exists for sections with multiple variants.

TEST 3 (VERIFY): Edit a text field in Form mode → click Save.
Reload frontend page. The edit must appear.
Then go to JSON mode → verify the field updated.
Switch back to Form mode → verify Form reflects the change.

TEST 4 (ZH ROUNDTRIP): Switch admin language context to 'zh' locale.
Edit a ZH field (e.g., taglineZh) → Save.
Visit /zh/[page] → verify ZH content updated.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGES TO CERTIFY (all must PASS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Home (pages/home.json)
□ Menu Hub (pages/menu.json)
□ Dim Sum (renders from DB — menu_items table, no content_entries)
□ Dinner (renders from DB — menu_items table)
□ Chef's Signatures (renders from DB — menu_items table, is_chef_signature=true)
□ About (pages/about.json)
□ Reservations (pages/reservations.json)
□ Contact (site.json — verify site settings editor)
□ Private Dining (pages/private-dining.json)
□ Catering (pages/catering.json)
□ Gallery (gallery_items table — verify gallery admin editor)
□ Blog Hub (blog posts table — verify blog admin editor)
□ Events (events table — verify events admin editor)
□ FAQ (pages/faq.json)
□ Festival: CNY (pages/festivals/chinese-new-year.json)
□ Festival: Mid-Autumn (pages/festivals/mid-autumn.json)
□ Header + Footer (header.json + site.json)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If a test fails:
- BUILD fails → check that the page reads from content_entries (not hardcoded data)
- WIRE fails → add missing Form field to the relevant admin panel component
- VERIFY fails → check that the save handler writes to the correct path in content_entries
- ZH ROUNDTRIP fails → check that the zh content_entries row exists and is being read

Never move on until a page passes all 4 tests.
```

**Done-Gate 3B:**
- All 17 pages pass all 4 tests (BUILD + WIRE + VERIFY + ZH ROUNDTRIP)
- Zero "JSON-only" sections remain
- ZH content updates flow correctly to /zh/ routes

---

## Prompt 3C — Chinese SEO: Hreflang + ZH Meta Titles + Descriptions

```
You are building BAAM System F — Chinese Restaurant Premium.

Implement complete bilingual SEO: hreflang, ZH meta titles, ZH descriptions,
Open Graph, and canonical URLs for all 22+ pages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — generateMetadata() pattern (all pages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All page.tsx files must use generateMetadata() (Next.js App Router pattern).
Create a utility: lib/seo.ts → generateChineseRestaurantMetadata()

export function generateChineseRestaurantMetadata({
  titleEn, titleZh, descriptionEn, descriptionZh,
  locale, path, image
}: ChineseMetadataInput): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalUrl = `${siteUrl}/${locale}${path}`
  const enUrl = `${siteUrl}/en${path}`
  const zhUrl = `${siteUrl}/zh${path}`

  return {
    title: locale === 'zh' ? titleZh : titleEn,
    description: locale === 'zh' ? descriptionZh : descriptionEn,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': enUrl,
        'zh-Hans': zhUrl,
        'x-default': enUrl,
      }
    },
    openGraph: {
      title: locale === 'zh' ? titleZh : titleEn,
      description: locale === 'zh' ? descriptionZh : descriptionEn,
      url: canonicalUrl,
      images: image ? [{ url: image }] : [],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
    },
    robots: { index: true, follow: true }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — ZH Meta Title/Description Patterns
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implement these title/description patterns for each page.
Titles and descriptions are stored in seo.json per locale (content_entries).
The generateMetadata() reads from seo.json for the current locale.

EN title patterns:
- Home:          "{RestaurantName} | Cantonese Restaurant & Dim Sum in {City}"
- Dim Sum:       "Dim Sum Menu — {RestaurantName} | Authentic Cantonese in {City}"
- Dinner:        "Dinner Menu — {RestaurantName} | Cantonese Fine Dining {City}"
- Chef Sigs:     "Chef's Signature Dishes — {RestaurantName} | {City}"
- About:         "About {RestaurantName} | Chef {ChefName}'s Story"
- Private Dining: "Private Dining & Banquets — {RestaurantName} | {City}"
- Catering:      "Chinese Catering Services — {RestaurantName} | {City}"
- CNY:           "Chinese New Year Dinner {Year} — {RestaurantName} | {City}"
- Mid-Autumn:    "Mid-Autumn Festival Dinner — {RestaurantName} | {City}"

ZH title patterns (same pages):
- Home:          "{餐厅中文名} | {城市}正宗粤菜 · 点心"
- Dim Sum:       "点心菜单 — {餐厅中文名} | {城市}粤式点心"
- Dinner:        "晚餐菜单 — {餐厅中文名} | {城市}粤菜精选"
- Chef Sigs:     "主厨推荐 — {餐厅中文名}"
- About:         "关于我们 | {厨师名} 的故事 — {餐厅中文名}"
- Private Dining: "私宴 · 宴会服务 — {餐厅中文名} | {城市}"
- Catering:      "中式餐饮外卖服务 — {餐厅中文名} | {城市}"
- CNY:           "{年份}年农历新年晚宴 — {餐厅中文名}"
- Mid-Autumn:    "中秋节晚宴 — {餐厅中文名}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Seed seo.json with ZH meta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create/update content_entries for path='seo.json', locale='zh', site_id='grand-pavilion':
{
  "pages": {
    "/": { "title": "大观楼 | 法拉盛正宗粤菜 · 点心", "description": "法拉盛大观楼，提供正宗粤式点心及晚餐，包厢可容纳500人宴会，欢迎预约。" },
    "/menu/dim-sum": { "title": "点心菜单 — 大观楼 | 法拉盛粤式点心", "description": "每日新鲜手工点心80余种，早上10时至下午3时供应，欢迎光临。" },
    ...
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Open Graph Image for ZH pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For ZH locale, Open Graph og:locale = "zh_CN".
og:image: Use the same hero image as EN (no separate ZH OG image needed).
og:title and og:description: Use ZH versions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — lang attribute on <html>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In app/[locale]/layout.tsx, ensure:
<html lang={locale === 'zh' ? 'zh-Hans' : 'en'}>

This is critical for screen readers and search engine language detection.
```

**Done-Gate 3C:**
- View source of /en/ → `<html lang="en">`, hreflang EN + ZH present
- View source of /zh/ → `<html lang="zh-Hans">`, og:locale="zh_CN"
- `/zh/menu/dim-sum` → `<title>点心菜单 — 大观楼 | 法拉盛粤式点心</title>`
- Canonical URL on /en/ points to /en/ (not /zh/)
- Hreflang x-default points to /en/ URL

---

## Prompt 3D — Programmatic SEO: Dish Pages + Festival Routes

```
You are building BAAM System F — Chinese Restaurant Premium.

Build dish-level programmatic pages at /menu/[item-slug].
These pages rank for dish-level searches: "xiao long bao flushing", "har gow queens ny".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Individual Dish Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/menu/dish/[slug]/page.tsx

generateStaticParams():
- Query menu_items WHERE available = true
- Return { slug } for all items (both dim sum and dinner)
- ISR revalidate: 3600

Page data: loadMenuItem(siteId, params.slug)

Page layout:
1. BreadcrumbList: Home > Menu > {Category} > {Dish Name}
2. DishHero: large food photo + dish name (ZH huge + EN below) + price
3. DishDetails:
   - Description (EN) - 2-3 sentences
   - Chinese name explanation (if origin_region provided): "A classic {originRegion} preparation..."
   - Dietary badges: rendered as styled pills
   - Allergen information if any
4. ChefNote: if is_chef_signature, show chefNote + red seal accent
5. RelatedDishes: 4 items from same category (not same item)
6. ReservationsCTA: "Try {nameZh} at Grand Pavilion · Reserve a Table"

generateMetadata():
- EN title: "{nameEn} ({nameZh}) — {restaurantName} | {city}"
- ZH title: "{nameZh} — {restaurantName中文名} · {city}粤菜"
- EN description: "Order {nameEn} at Grand Pavilion in Flushing, NY..."
- ZH description: "在大观楼品尝正宗{nameZh}..."
- Schema.org: MenuItem (see 3E)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Dim Sum Category as SEO Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The existing /menu/dim-sum page already serves as a category SEO page.
Ensure its generateMetadata() is specific enough:

EN: "Dim Sum Menu — {restaurantName} | Authentic Cantonese in {city}"
ZH: "点心菜单 — {nameZh} | {city}粤式点心"

Add a short intro paragraph at the top of the page (editable in admin):
"Grand Pavilion serves over 80 handcrafted dim sum varieties daily,
from classic har gow and siu mai to seasonal specialties.
Served Monday–Sunday, 10am–3pm."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Festival Pages SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Festival pages already exist at /festivals/[slug].
Update generateMetadata() for festival pages:

CN New Year:
- EN: "Chinese New Year Dinner {year} — {restaurantName} | {city}"
- ZH: "{year}年农历新年晚宴 — {nameZh} | {city}"
- Description EN: "Celebrate the Lunar New Year at {restaurantName} in {city}.
  Special prix-fixe menus, traditional dishes, and limited seating available."

Mid-Autumn:
- EN: "Mid-Autumn Festival Dinner — {restaurantName} | {city}"
- ZH: "中秋节晚宴 — {nameZh} | {city}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Chinese Language Blog SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each blog post with title_zh, generate ZH metadata:
- <html lang="zh-Hans"> when viewing ZH version
- Blog post in /zh/blog/[slug] uses title_zh + excerpt_zh for title/description

This enables ranking for Chinese-language searches like "法拉盛粤菜推荐".
```

**Done-Gate 3D:**
- `/en/menu/dish/har-gow` → renders dish page with ZH name, description, RelatedDishes
- `/zh/menu/dish/har-gow` → renders with ZH name full-width, ZH description
- View source: title contains both "Har Gow (虾饺)"
- 80 dish pages created (all menu items)
- Festival pages: view source shows year-specific title

---

## Prompt 3E — Schema.org Markup

```
You are building BAAM System F — Chinese Restaurant Premium.

Add Schema.org structured data to all key pages.
All schema injected via Next.js <script type="application/ld+json"> in generateMetadata
or in a JsonLd component rendered in page layout.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 1 — Restaurant (site-wide, in layout.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": site.name,
  "alternateName": site.restaurantNameZh,
  "description": "Authentic Cantonese dim sum and fine dining restaurant in {city}",
  "url": siteUrl,
  "telephone": site.phone,
  "email": site.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": site.address,
    "addressLocality": site.city,
    "addressRegion": site.state,
    "postalCode": site.zip,
    "addressCountry": "US"
  },
  "servesCuisine": [site.cuisineType, site.cuisineTypeZh],
  "priceRange": "$$–$$$",
  "acceptsReservations": true,
  "openingHoursSpecification": [ ...from site.hours ],
  "image": heroImageUrl,
  "sameAs": [
    site.social.instagram && `https://instagram.com/{handle}`,
    site.social.facebook,
    site.social.yelp
  ].filter(Boolean)
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 2 — MenuItem (on dish pages /menu/dish/[slug])
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "@context": "https://schema.org",
  "@type": "MenuItem",
  "name": item.name.en,
  "alternateName": item.nameZh,
  "description": item.description?.en,
  "offers": {
    "@type": "Offer",
    "price": (item.price / 100).toFixed(2),
    "priceCurrency": "USD",
    "availability": item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
  },
  "suitableForDiet": buildDietSchema(item.dietaryFlags),
  "menuAddOn": item.pairing ? [{ "@type": "MenuItem", "name": item.pairing }] : [],
  "image": item.image
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 3 — Event (on event pages and festival pages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "@context": "https://schema.org",
  "@type": "FoodEvent",
  "name": festival.name,
  "alternateName": festival.nameZh,
  "startDate": festival.activeDateStart,
  "endDate": festival.activeDateEnd,
  "location": {
    "@type": "Place",
    "name": site.name,
    "address": { ...site.address }
  },
  "description": festival.tagline,
  "organizer": { "@type": "Restaurant", "name": site.name },
  "offers": {
    "@type": "Offer",
    "price": prixFixe?.pricePerPerson / 100,
    "priceCurrency": "USD",
    "availability": "https://schema.org/LimitedAvailability"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA 4 — BreadcrumbList (all interior pages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For /menu/dim-sum:
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "{siteUrl}/en/" },
    { "@type": "ListItem", "position": 2, "name": "Menu", "item": "{siteUrl}/en/menu" },
    { "@type": "ListItem", "position": 3, "name": "Dim Sum", "item": "{siteUrl}/en/menu/dim-sum" }
  ]
}

Create a reusable BreadcrumbSchema component that takes a breadcrumb array and renders the JSON-LD.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After implementation, test all schemas using Google's Rich Results Test:
https://search.google.com/test/rich-results

Check these URLs:
- /en/ (Restaurant schema)
- /en/menu/dish/har-gow (MenuItem schema)
- /en/festivals/chinese-new-year (Event schema)
- /en/menu/dim-sum (BreadcrumbList schema)
```

**Done-Gate 3E:**
- Google Rich Results Test passes for all 4 schema types
- Restaurant schema: `servesCuisine` includes ZH cuisine type
- MenuItem schema: `alternateName` has Chinese dish name
- Festival/Event schema: `FoodEvent` type with date range
- BreadcrumbList on all interior pages

---

## Prompt 3F — Sitemap + robots.txt + IndexNow

```
You are building BAAM System F — Chinese Restaurant Premium.
The Meridian codebase has existing sitemap and SEO infrastructure. EXTEND it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Sitemap (extend existing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/sitemap.ts (Next.js App Router)

The sitemap must include:

STATIC ROUTES (EN + ZH for each):
['/', '/menu', '/menu/dim-sum', '/menu/dinner', '/menu/chef-signatures',
 '/menu/weekend-brunch', '/about', '/reservations', '/private-dining',
 '/catering', '/gallery', '/blog', '/events', '/faq', '/contact',
 '/order-online', '/gift-cards', '/careers', '/press', '/privacy', '/terms']

For each route, generate two entries:
{ url: `{siteUrl}/en{route}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }
{ url: `{siteUrl}/zh{route}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }

DYNAMIC ROUTES:
- /menu/dish/[slug] (all menu items, EN + ZH)
- /festivals/[slug] (all published festivals, EN + ZH): priority: 0.9 during active period
- /blog/[slug] (all published posts, EN + ZH): priority: 0.7
- /events/[slug] (all published events, EN + ZH): priority: 0.7

Priority overrides:
- '/' (home): priority 1.0
- '/menu/dim-sum': priority 0.95
- '/menu/chef-signatures': priority 0.9
- '/festivals/*' (when active): priority 0.95
- '/private-dining': priority 0.9
- '/catering': priority 0.85

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — robots.txt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/robots.ts

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: {NEXT_PUBLIC_SITE_URL}/sitemap.xml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — IndexNow integration (extend Meridian's indexnow.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Trigger IndexNow ping when:
- New menu item added (admin Menu editor → on save)
- New blog post published
- Festival published or dates changed
- Any content_entries save via admin Content Editor

The Meridian codebase has lib/seo/indexnow.ts. Integrate it into:
- Menu admin save handler
- Festival admin save handler
- Blog post publish handler
- Content Editor save handler (for page changes)

Ping both EN and ZH URLs for the changed page.
```

**Done-Gate 3F:**
- `/sitemap.xml` renders all EN + ZH routes (verify: should have 100+ entries)
- `/robots.txt` blocks /admin/ and /api/
- Festival pages appear in sitemap with priority 0.95
- Dish pages appear in sitemap (80 items × 2 locales = 160 dish page entries)

---

## Prompt 3G — Performance Optimization

```
You are building BAAM System F — Chinese Restaurant Premium.

Optimize for Lighthouse ≥ 90 score on all core pages.
Focus on Chinese font loading (the most common performance trap).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTIMIZATION 1 — Chinese Font Subset (Critical)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Noto Serif SC full weight 700 = ~800KB. This is too heavy.

Optimization strategy:
- Request only weight 700 for Noto Serif SC (display use only): `wght@700`
- Request only weight 400+500 for Noto Sans SC (body use): `wght@400;500`
- Add `&subset=chinese-simplified` to Google Fonts URL where supported
- Add `font-display: swap` to Google Fonts URL: `&display=swap` (already in URL)

Updated Google Fonts URL pattern:
https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700&family=Noto+Sans+SC:wght@400;500&display=swap
(plus the EN display font for the active variant)

Verify in Lighthouse: "Avoid render-blocking resources" — fonts should not block render.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTIMIZATION 2 — Hero Image Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The hero image on every page is the LCP (Largest Contentful Paint) element.

In HeroSection and PageHero:
- Add priority={true} to the Next.js <Image> component for hero images
- Add sizes prop: "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
- Festival hero pages: also add priority to festival hero image
- ChefHeroFull: add priority to chef portrait image

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTIMIZATION 3 — Menu Page Virtualization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If dim sum item count > 60 items: implement windowed rendering.
Use @tanstack/react-virtual or a simple intersection observer approach:
- Initial render: first 20 items
- On scroll near bottom: load next 20
- Prevents 80+ items causing long main thread blocking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTIMIZATION 4 — DimSumStatusBadge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DimSumStatusBadge uses client-side date check.
Wrap in Suspense with a server-rendered fallback to prevent hydration flash:
- Server: render neutral "Dim Sum Available 10am–3pm" (always correct, no flash)
- Client (after hydration): update to real-time status if different

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTIMIZATION 5 — FestivalCountdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FestivalCountdown runs a setInterval every second.
Only mount the interval when the countdown section is visible (IntersectionObserver).
Clear the interval when component unmounts.
```

**Done-Gate 3G:**
- Lighthouse ≥ 90 on: home, menu/dim-sum, festivals/chinese-new-year, about
- LCP < 2.5s on home page (measure in Lighthouse)
- Font download: Noto Serif SC weight 700 only (check Network tab)
- No render-blocking resources in Lighthouse report

---

## Prompt 3H — QA Automation Scripts

```
You are building BAAM System F — Chinese Restaurant Premium.
The Meridian codebase has QA scripts in scripts/qa/.
EXTEND them with Chinese-restaurant-specific checks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN EXISTING QA SCRIPTS — fix all failures
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run each script and fix failures before moving to custom scripts:

node scripts/qa/theme-compliance-check.mjs
→ Must report 0 hardcoded hex values in new Chinese components:
  FestivalHighlightSection, FestivalPage, ChefSignatureCard,
  DimSumCartSection, BanquetPackageCards, WeChatQR,
  BilinguaHeroHeadline, InkWashOverlay, ChinesePaperCutDecoration

node scripts/qa/route-check.mjs
→ Must report 200 for all routes including /zh/ routes

node scripts/qa/seo-check.mjs
→ Must report meta title + description on all pages (EN + ZH)

node scripts/qa/link-check.mjs
→ No broken internal links on any page

node scripts/qa/contrast-audit.mjs
→ All text passes WCAG AA contrast ratio — especially ZH text on
  parchment background (hao-zhan) and near-black background (longmen)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW QA SCRIPTS — Create these for Chinese restaurant
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE: scripts/qa/zh-locale-check.mjs

Checks:
1. All static routes return 200 at /zh/ prefix
2. <html lang="zh-Hans"> on ZH pages
3. <title> contains Chinese characters on ZH pages (not English copy)
4. og:locale="zh_CN" on ZH pages
5. hreflang="zh-Hans" present on EN pages
6. hreflang="en" present on ZH pages

Run: node scripts/qa/zh-locale-check.mjs grand-pavilion
Output: PASS / FAIL per check

CREATE: scripts/qa/menu-items-check.mjs

Checks:
1. All menu_items for site_id have name_zh (not null, not empty string)
2. All dim sum items have dim_sum_category set
3. All chef signature items have is_chef_signature = true
4. All items with price: price > 0 OR price_note.en is non-empty
5. Item count by menu type matches expected minimums:
   - dim-sum: ≥ 30
   - dinner: ≥ 20
   - chef-signatures: ≥ 6

Run: node scripts/qa/menu-items-check.mjs grand-pavilion
Output: summary with pass/fail per check + item count table

CREATE: scripts/qa/festival-check.mjs

Checks:
1. All published festivals have heroImage, tagline, taglineZh
2. All festivals with prixFixeEnabled = true have ≥ 1 prix-fixe tier
3. activeDateStart < activeDateEnd for all festivals
4. Festival page routes return 200: /en/festivals/[slug] and /zh/festivals/[slug]
5. No festival has urgencyCount = 0 while urgencyEnabled = true (would look wrong)

Run: node scripts/qa/festival-check.mjs grand-pavilion

CREATE: scripts/qa/zh-content-check.mjs

Checks every content_entries row WHERE locale='zh':
1. No row has English-only text (heuristic: check if value contains only ASCII)
2. ZH site.json has restaurantNameZh non-empty
3. ZH home.json has taglineZh non-empty
4. All ZH seo.json page titles contain Chinese characters

Run: node scripts/qa/zh-content-check.mjs grand-pavilion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MASTER QA RUN COMMAND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to package.json scripts:
"qa": "node scripts/qa/theme-compliance-check.mjs && node scripts/qa/route-check.mjs && node scripts/qa/seo-check.mjs && node scripts/qa/zh-locale-check.mjs grand-pavilion && node scripts/qa/menu-items-check.mjs grand-pavilion && node scripts/qa/festival-check.mjs grand-pavilion && node scripts/qa/zh-content-check.mjs grand-pavilion && echo 'ALL QA PASSED'"

Run: npm run qa
Expected output: "ALL QA PASSED"
```

**Done-Gate 3H (= Phase 3 Complete Gate):**
- `npm run qa` runs to completion with "ALL QA PASSED"
- Zero theme compliance failures (no hardcoded hex in Chinese components)
- All /zh/ routes return 200
- All menu items have name_zh
- Festival check: all festivals have required fields
- Contrast audit: all text WCAG AA pass (including ZH text on all 4 variant backgrounds)
- Lighthouse ≥ 90 on all core pages
- `git tag v0.3-launch-ready`
