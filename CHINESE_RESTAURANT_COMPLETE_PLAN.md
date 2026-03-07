# BAAM System F — Chinese Restaurant Premium · Complete Plan

> **System:** BAAM System F — Chinese Restaurant Premium
> **Template name:** DYNASTY (The Grand Pavilion)
> **Version:** 1.0
> **Date:** March 2026
> **Baseline codebase:** restaurant/meridian (fork + extend — do NOT rebuild from scratch)
> **Governance:** BAAM Master Plan V3.4 (all guardrails apply)
> **Languages:** English (primary), Chinese Simplified (required), Chinese Traditional (optional), Spanish (optional)
> **Demo restaurant:** Grand Pavilion 大观楼 — 133-24 Roosevelt Ave, Flushing, NY 11354
> **Template principle:** ALL restaurant identity lives in `content/[site-id]/` — zero hardcoded restaurant info in code

---

## Table of Contents

### Stage A — Strategy & Design
- [A1: Industry Deep Dive — Chinese Restaurant Market](#a1-industry-deep-dive)
- [A2: Brand Positioning & Differentiation](#a2-brand-positioning--differentiation)
- [A3: Site Architecture — All Pages Designed](#a3-site-architecture--all-pages-designed)
- [A4: Component Inventory — NEW vs REUSE from Meridian](#a4-component-inventory--new-vs-reuse)
- [A5: Visual Design Direction — Chinese Art Aesthetic](#a5-visual-design-direction)
- [A6: Content Strategy & Conversion Funnel](#a6-content-strategy--conversion-funnel)
- [Stage A Acceptance Gates](#stage-a-acceptance-gates)

### Stage B — Implementation Blueprint
- [Phase 0: Fork + Extend Meridian + Chinese Content Contracts](#phase-0-fork--extend-meridian)
- [Phase 1: Core Pages — Chinese Art Shell + Menu System](#phase-1-core-pages)
- [Phase 2: Industry Modules — Dim Sum Cart, Specials, Chef's Signature, Festival Pages](#phase-2-industry-modules)
- [Phase 3: Admin Hardening + Chinese SEO](#phase-3-admin-hardening--chinese-seo)
- [Phase 4: QA + Launch](#phase-4-qa--launch)
- [Phase 5: 12-Month Growth Plan](#phase-5-12-month-growth-plan)

### Pipeline B — Client Onboarding
- [Pipeline B Overview](#pipeline-b-overview)
- [7-Step Pipeline O1–O7](#7-step-pipeline-o1o7)
- [Chinese Restaurant Intake Schema](#chinese-restaurant-intake-schema)
- [Menu Catalog (O3 Pruning)](#menu-catalog-o3-pruning)
- [Brand Variant System (4 Chinese variants)](#brand-variant-system)
- [AI Prompt Spec (O5)](#ai-prompt-spec-o5)
- [Pipeline B Done-Gate](#pipeline-b-done-gate)

---

# STAGE A — Strategy & Design

---

## A1: Industry Deep Dive

### 1.1 The Chinese Restaurant Market — What Makes It Unique

Chinese restaurants in North America operate in a deeply layered cultural context that no generic restaurant template can serve. A visitor searching for "Flushing dim sum" is not the same as someone searching for "restaurant near me." They are seeking:

1. **Cultural authenticity** — Is this the real thing, or an Americanized version?
2. **Community trust** — Do people from my community recommend this?
3. **Bilingual access** — Can I read the full menu in Chinese? Does it have photos?
4. **Specific cuisine type** — Cantonese, Shanghainese, Sichuan, Dim Sum, Taiwanese are distinct categories with distinct audiences

The site must speak to both audiences simultaneously: **English-speaking guests discovering Chinese cuisine**, and **Chinese-speaking regulars who are the restaurant's core base**. Bilingual is not a feature — it is the product.

### 1.2 Market Size & Opportunity

| Segment | US Count (est.) | BAAM Opportunity |
|---|---|---|
| Full-service Chinese restaurants | ~45,000 | Premium tier, independently owned |
| Dim Sum parlors / Yum Cha | ~3,500 | High-volume, complex menu |
| Chinese fine dining | ~800 | Highest price point, underserved online |
| Taiwanese / Boba + food | ~12,000 | Youth-oriented, Instagram-heavy |
| Pan-Asian with Chinese anchor | ~8,000 | Fusion tier |

**Primary BAAM target:** Independently owned Chinese restaurants billing $1M–$10M/year that currently have no website or a generic, low-quality site. These owners want to compete with chain restaurants but can't afford custom agency builds.

### 1.3 Why Chinese Restaurant Sites Fail

**Failure 1: English-only menus with no photos**
A Chinese diner scanning for their preferred dish cannot read "Steamed Fish Filet in Chili Bean Sauce." They want the Chinese name and a photo. English-only menus lose the core audience.

**Failure 2: PDF menus**
PDFs are inaccessible on mobile, cannot be indexed by Google, and break frequently. Every competitor still using PDFs creates an SEO gap to exploit.

**Failure 3: No Dim Sum cart or ordering flow**
Dim Sum restaurants have unique ordering patterns (card-based, cart-based, or tap-to-order tablet). Sites that don't reflect this workflow lose the immersive dining experience digital representation opportunity.

**Failure 4: No seasonal/festival awareness**
Chinese New Year, Mid-Autumn Festival, Qingming, Dragon Boat Festival — these drive 20–40% of revenue spikes. Sites that don't have festival pages miss critical SEO windows.

**Failure 5: No chef identity**
The best Chinese restaurants are built around a chef's story and regional expertise. Sites that don't feature the chef as the authority lose the premium positioning argument.

**Failure 6: Unoptimized for Chinese search patterns**
"肥汁米线 Flushing" is a real Google search. Chinese community searches happen in Chinese characters. Most Chinese restaurant sites have zero Chinese-language SEO.

**Failure 7: No catering/private dining path**
Chinese restaurants do enormous catering/banquet business (birthdays, weddings, corporate). Sites that bury this lose 30–50% of potential high-ticket conversions.

### 1.4 Competitor Analysis

| Competitor Type | Strengths | Weaknesses | Gap |
|---|---|---|---|
| **Squarespace / Wix DIY** | Quick setup | English only, no Chinese menu system, generic templates | No cultural depth |
| **Local web agencies** | Custom look | $8–20K setup, no CMS, owner-dependent | No scalability |
| **OpenTable + stub site** | Reservation integration | No content, no SEO, no brand | No identity |
| **Yelp / Google profile only** | Free, traffic | Not a real site, no conversion control | No owned platform |
| **Chinese digital agencies** | Bilingual | Often WeChat-focused, poor SEO, no admin | Maintenance trap |

**The gap BAAM System F fills:** Premium Chinese art aesthetic + genuine bilingual CMS + Chinese menu system with photos + festival pages + chef identity + Dim Sum cart + Pipeline B for $0 per clone — owned, not SaaS.

### 1.5 The Five Visitor Types — Chinese Restaurant Edition

**Visitor 1: Chinese-speaking regular**
- Comes 2-4x per month. Reads the site in Chinese. Wants: full Chinese menu, photos, specials today, easy reservation.
- Conversion: Online reservation, save phone number.

**Visitor 2: English-speaking food adventurer**
- Discovered via Google, Yelp, or Instagram. Wants: "Is this authentic?", photos, cuisine type explanation, English menu with descriptions.
- Conversion: Make first reservation, explore the menu.

**Visitor 3: Event planner / Banquet booker**
- Planning a birthday, wedding banquet, or corporate lunch. High-ticket, time-sensitive.
- Conversion: Submit private dining inquiry or call.

**Visitor 4: Festival visitor (high-intent seasonal)**
- Googling "Chinese New Year dinner Flushing 2027" or "Mid-Autumn Festival restaurant NYC."
- Conversion: Reserve festival special menu, buy mooncake gift box.

**Visitor 5: Food delivery / Takeout customer**
- Wants to order online for delivery or pickup. Wants: fast-loading menu, easy cart.
- Conversion: Online order placed.

### 1.6 SEO Landscape — Chinese Restaurant

**High-value keyword clusters:**

| Cluster | Examples | Competition |
|---|---|---|
| Cuisine + City | "dim sum flushing ny", "cantonese restaurant flushing" | Medium |
| Festival searches | "chinese new year dinner nyc 2027", "lunar new year restaurant" | Seasonal, low comp |
| Dish-level | "xiao long bao flushing", "peking duck nyc", "seafood hot pot queens" | Low, high intent |
| Chinese-language | "法拉盛粤菜", "纽约中餐馆推荐", "维多利亚港附近餐厅" | Almost no competition |
| Event/Banquet | "chinese restaurant private dining nyc", "dim sum catering queens" | Medium |

**Programmatic SEO opportunity:** Menu item pages (`/menu/xiao-long-bao`) with schema markup rank for dish-level searches that competitors miss entirely.

---

## A2: Brand Positioning & Differentiation

### 2.1 Core Positioning Statement

> "Grand Pavilion 大观楼 is Flushing's premier destination for authentic Cantonese cuisine — where classic dim sum tradition meets an elevated dining experience, served in both English and Chinese for every guest who walks through our doors."

### 2.2 Five Pillars of Differentiation

| Pillar | Claim | How Site Communicates It | Evidence |
|---|---|---|---|
| **Authenticity** | "The real thing, from a master chef" | Chef profile + credentials + origin story + traditional technique photos | Chef bio, dish origin callouts |
| **Bilingual Hospitality** | "We speak your language — both of them" | Full EN + ZH site, Chinese menu names, bilingual staff callout | Language switcher, ZH menu, team bios |
| **Dim Sum Mastery** | "Over 80 hand-crafted dim sum varieties daily" | Dim Sum menu with photos + "order by 11am" ordering CTA | Item count, daily freshness callout |
| **Festival Tradition** | "Your family's celebration partner for every season" | Festival landing pages + seasonal menus + event booking | CNY, Mid-Autumn, Wedding Banquet pages |
| **Premium Catering** | "Banquet dining for up to 500 guests" | Private dining page + catering request form + gallery of events | Capacity, gallery, inquiry form |

### 2.3 Conversion Path

- **Primary conversion:** Online reservation (dinner seatings)
- **Secondary conversion:** Private dining / banquet inquiry
- **Tertiary conversion:** Online order for takeout/delivery
- **Seasonal conversion:** Festival special menu reservation
- **Trust builder:** Menu exploration + gallery browsing → triggers reservation

---

## A3: Site Architecture — All Pages Designed

### 3.1 Full Sitemap (22 Static + Dynamic)

**P0 — Core (launch critical):**

| Route | Purpose | Primary CTA |
|---|---|---|
| `/` | Home — first impression, cultural hook, specials | Reserve a Table |
| `/menu` | Menu hub — all menu types | Browse Menu |
| `/menu/dim-sum` | Dim Sum full menu with photo grid | Order / Reserve |
| `/menu/dinner` | Dinner menu — Cantonese classics | Reserve for Dinner |
| `/menu/chef-signatures` | Chef's Signature dishes — premium positioning | Reserve / Inquire |
| `/reservations` | Reservation widget — primary booking flow | Book Now |
| `/private-dining` | Banquet + private room — high-ticket conversion | Request Inquiry |
| `/about` | Chef story + restaurant history + team | Meet the Chef |
| `/contact` | Phone, address, hours, map | Call / Directions |

**P1 — Authority & Conversion:**

| Route | Purpose | Primary CTA |
|---|---|---|
| `/order-online` | Takeout / delivery — direct order flow | Order Now |
| `/gallery` | Food + restaurant + event photography | Reserve |
| `/catering` | Off-premise catering services | Get a Quote |
| `/events` | Upcoming events — tasting nights, chef tables | Reserve Seat |
| `/blog` | Food culture, recipes, restaurant news | Subscribe |
| `/faq` | Common questions — reservations, menu, parking | Book |
| `/gift-cards` | Digital gift card purchase | Buy Now |
| `/press` | Media coverage — authority signal | Reserve |
| `/careers` | Join the team | Apply |

**P2 — Festival + Seasonal (toggleable):**

| Route | Purpose |
|---|---|
| `/festivals/chinese-new-year` | CNY special menu + reservation |
| `/festivals/mid-autumn` | Moon cake + dinner specials |
| `/festivals/wedding-banquet` | Wedding banquet package inquiry |
| `/menu/weekend-brunch` | Weekend dim sum brunch |
| `/menu/tasting-menu` | Chef's tasting menu (fine dining tier) |

**Dynamic routes:**
- `/blog/[slug]` — individual blog posts
- `/events/[slug]` — individual event pages

### 3.2 Home Page Section Stack

```
1. AnnouncementBar        — Festival / special event alert (dismissible)
2. Header                 — Logo | Nav | Language | Reserve CTA | (Chinese name below logo)
3. HeroSection            — Full-screen editorial image with Chinese ink wash overlay
                            Headline in dual-font (English serif + Chinese brush)
                            Subline: cuisine type + city + founding year
                            CTA: "Reserve a Table" + "View Menu"
4. TodaySpecialSection    — 2-3 highlighted dishes today + Dim Sum availability badge
5. MenuPreview            — Category cards: Dim Sum / Dinner / Chef's Signatures / Seasonal
6. ChefHeroFull           — Full-bleed chef portrait + signature + credentials
                            "Trained in Hong Kong / 30 years experience / 80+ dim sum varieties"
7. GalleryPreviewSection  — Masonry grid: food photography + dining room + events
8. TestimonialsSection    — 5-star reviews in EN + ZH
9. FestivalHighlightSection (NEW) — Active festival CTA or upcoming event
10. PrivateDiningCTA      — "Hosting an event? We do banquets up to 500" + inquiry CTA
11. ReservationsCTA       — "Reserve your table today" + widget or phone prompt
12. BlogPreviewSection    — Latest from the kitchen (3 posts)
13. Footer                — Full bilingual footer: hours, address, social, language
```

### 3.3 Key Page Designs

**Menu Hub (`/menu`)**
- Category navigation bar: Dim Sum | Dinner | Chef's Signatures | Weekend Brunch | Seasonal | Beverages
- "Today's Dim Sum" availability status (open / closes at 3pm)
- Featured dish card at top (Chef's pick)
- Category cards with photo, item count, hours

**Dim Sum Page (`/menu/dim-sum`)**
- Sub-category nav: Steamed | Baked | Fried | Congee & Noodles | Desserts
- Each item: Chinese name (大字) + English name + description + price + photo + dietary badges
- "Dim Sum Cart" mode for walk-in ordering simulation
- Allergen legend at bottom

**Chef's Signatures Page (`/menu/chef-signatures`)**
- Full-bleed hero with chef photo
- Signature items with: story behind the dish, technique callout, wine pairing suggestion, prep time
- "Book a table to experience this dish" CTA below each

**Private Dining (`/private-dining`)**
- Room photos (masonry gallery)
- Capacity options: 10-person private room / 50-person banquet hall / 500-person grand ballroom
- Package tiers: Business Lunch | Celebration Dinner | Wedding Banquet | Corporate Event
- Inquiry form: date, occasion, guest count, cuisine preferences, budget range
- Testimonials from event clients

**Festival Pages (CNY example: `/festivals/chinese-new-year`)**
- Hero with CNY imagery (lanterns, red envelope aesthetic, NOT generic stock)
- "Lucky Menu" for CNY — full menu with auspicious dish names + meaning
- Availability calendar: sold-out dates shown
- Special package: prix-fixe CNY dinner + complimentary dessert
- Gift box section (mooncake / tea gift sets if applicable)
- Urgency: "Only 12 tables remaining — Reserve Now"

---

## A4: Component Inventory — NEW vs REUSE

### 4.1 REUSE from Meridian (restyle only)

| Component | File | Chinese Adaptation |
|---|---|---|
| Header | `layout/Header.tsx` | Add Chinese restaurant name below logo; ZH font; brush-stroke nav accent |
| Footer | `RestaurantFooter.tsx` | Add WeChat QR code slot; bilingual columns |
| HeroSection | `sections/HeroSection.tsx` | Add ink-wash overlay variant; dual-language headline |
| PageHero | `sections/PageHero.tsx` | Add decorative Chinese pattern border option |
| MenuSection + MenuItem | `menu/MenuSection.tsx`, `menu/MenuItem.tsx` | Add Chinese name field (large), dietary badge: halal/kosher |
| MenuCategoryNav | `menu/MenuCategoryNav.tsx` | Add ZH category names; sticky on scroll |
| DietaryLegend | `menu/DietaryLegend.tsx` | Add: Halal 清真, Kosher, Spicy Level icons |
| ChefHeroFull | `sections/ChefHeroFull.tsx` | No change needed — use as-is |
| TodaySpecialSection | `menu/TodaySpecialSection.tsx` | Reuse — add "Dim Sum Available Until 3pm" status badge |
| WeeklySpecialsSection | `menu/WeeklySpecialsSection.tsx` | Reuse |
| GalleryMasonry + Lightbox | `gallery/GalleryMasonry.tsx`, `gallery/Lightbox.tsx` | No change |
| ReservationWidgetCustom | `reservations/ReservationWidgetCustom.tsx` | No change |
| ReservationWidgetOpenTable | `reservations/ReservationWidgetOpenTable.tsx` | No change |
| TestimonialsSection | `sections/TestimonialsSection.tsx` | Add ZH testimonial support (PatientName in ZH) |
| BlogPreviewSection | `sections/BlogPreviewSection.tsx` | No change |
| FAQSection | `sections/FAQSection.tsx` | No change |
| ContactForm | `sections/ContactForm.tsx` | Add WeChat ID field |
| CTASection | `sections/CTASection.tsx` | No change |
| StickyBookingBar | `layout/StickyBookingBar.tsx` | No change |
| EventsPreview | `sections/EventsPreview.tsx` | Restyle for festival events |
| PrivateDiningForm | `forms/PrivateDiningForm.tsx` | Add fields: occasion type, banquet tier, dietary restrictions |

### 4.2 NEW Components (Chinese-Specific)

| Component | Effort | Description | Data Shape |
|---|---|---|---|
| **FestivalHighlightSection** | Medium | Seasonal banner/section showing active festival event — CNY, Mid-Autumn, Wedding Banquet, Dragon Boat. Auto-activates based on date range. Shows: hero image, festival name in ZH+EN, special menu teaser, urgency counter, CTA. | `{ festivals: [{ id, name, nameZh, dateRange, hero, tagline, ctaLink, urgency }] }` |
| **FestivalPage** | High | Full-page layout for individual festival. Sections: hero, story/meaning, special menu (prix-fixe or à la carte), booking calendar with availability, gift packages if applicable. Reusable for any Chinese festival. | `{ festivalId, heroImage, story, storyZh, menu: MenuItem[], prixFixe: PrixFixeTier[], giftBoxes: GiftBox[] }` |
| **DimSumCartSection** | High | Visual dim sum ordering simulation — grid of dim sum items with a "tap to select" interaction for walk-in clarity. Also functions as a "Pre-order Dim Sum" flow sending a basket summary via email. NOT a full checkout — it's an intent capture / novelty feature. | `{ dimSumItems: DimSumItem[], basketEnabled: boolean, submissionEmail }` |
| **ChefSignatureCard** | Medium | Individual signature dish component — hero image, Chinese name (large brush font), English name, dish origin story, chef's note in quote format, wine/tea pairing, price. | `{ id, nameZh, nameEn, story, chefNote, pairing, price, image }` |
| **BilinguaHeroHeadline** | Low | Headline component rendering two stacked lines: English serif line + Chinese brush-style line. Used in hero sections and festival pages. Controlled by theme variant (whether ZH appears above or below EN). | `{ en: string; zh: string; layout: 'zh-above' | 'zh-below' }` |
| **InkWashOverlay** | Low | CSS/SVG decorative element — a semi-transparent ink wash texture that sits over hero images giving them a traditional Chinese watercolor aesthetic. Configurable opacity. Variant-specific (hao-zhan = dark ink, hongxiang = red wash). | CSS/variant config only |
| **WeChatQR** | Low | Displays a WeChat public account QR code with prompt text in ZH + EN. Used in footer and contact page. | `{ qrImageUrl: string; accountName: string }` |
| **BanquetPackageCards** | Medium | Tier cards for private dining packages: Business Lunch / Celebration Dinner / Wedding Banquet / Corporate. Each card: price per head, min guests, menu highlights, includes, CTA. | `{ packages: [{ tier, pricePerHead, minGuests, includes, highlight }] }` |
| **FestivalCountdown** | Low | Countdown timer to next major Chinese festival with "Reserve before sold out" urgency. Auto-calculates next CNY, Mid-Autumn, etc. | Config: festival dates list |
| **ChinesePaperCutDecoration** | Low | SVG decorative border/divider using traditional Chinese paper-cut patterns (double happiness 囍, phoenix, lotus). Used as section dividers. Variant-configurable. | SVG library, variant config |

**Total: 20 REUSE + 10 NEW = 30 components**

---

## A5: Visual Design Direction

### 5.1 Color Palette — Chinese Art Aesthetic

**The palette is fixed across all 4 variants** — they share the same cultural roots but differ in tone and formality:

| Token | hao-zhan (豪展) | hongxiang (鴻翔) | longmen (龍門) | shuimo (水墨) |
|---|---|---|---|---|
| `--color-primary` | `#1A1A1A` Ink Black | `#8B1A1A` Deep Crimson | `#2C1810` Darkest Brown | `#2F2F2F` Charcoal |
| `--color-secondary` | `#C9A84C` Antique Gold | `#C9A84C` Imperial Gold | `#C0392B` Lacquer Red | `#8B0000` Cinnabar Red |
| `--color-backdrop` | `#F5F0E8` Aged Parchment | `#FDF6E3` Warm Ivory | `#0A0A0A` Near Black | `#F9F6F0` Off-White |
| `--color-accent` | `#8B0000` Cinnabar Red | `#F5DEB3` Wheat | `#C9A84C` Gold | `#2C2C2C` Deep Ink |
| `--color-text` | `#1A1A1A` | `#1A0A0A` | `#F5F0E8` | `#1A1A1A` |
| Character | Grand, authoritative | Festive, traditional | Dramatic, modern | Refined, minimal |
| For | Fine dining, Cantonese | Dim Sum, banquet | Contemporary fusion | Modern Chinese |

### 5.2 Typography — Bilingual System

**The typography system must handle two scripts with visual harmony:**

**English Display Font** (per variant):
- `hao-zhan`: Cormorant Garamond — elegant, editorial, high-contrast strokes that echo Chinese calligraphy rhythm
- `hongxiang`: EB Garamond — traditional, warm, conveys heritage
- `longmen`: DM Serif Display — sharp, contemporary, confident
- `shuimo`: Libre Baskerville — clean, refined, minimal

**Chinese Display Font (Web-safe ZH):**
- All variants: `"Noto Serif SC"` (Google Fonts — best coverage of traditional/simplified CJK characters) for headings
- Body ZH: `"Noto Sans SC"` — readable at small sizes, consistent rendering

**Font Weight Hierarchy:**
```
Display headline:   EN 300 (light) + ZH 700 (bold) — contrast is intentional
Section heading:    EN 400 (regular) + ZH 500 (medium)
Body:               EN 400 + ZH 400
Caption/label:      EN 500 uppercase + ZH 400
```

**Size Scale:**
```css
--font-display:     4.5rem (EN) / 3rem (ZH below) — hero headlines
--font-heading:     2.25rem
--font-subheading:  1.5rem
--font-body:        1rem
--font-small:       0.875rem
--font-caption:     0.75rem uppercase tracking-widest
```

### 5.3 Photography & Visual Style

**Essential photo categories:**
1. **Hero food photography** — lit from above on dark stone surfaces; painterly composition; single dish with white space
2. **Dim Sum spread** — overhead shots showing bamboo steamers, variety, abundance
3. **Chef action** — hands at work (dumplings, cleaving, wok), NOT posed corporate headshots
4. **Dining room ambiance** — warm light, table settings, red lanterns, wooden screens
5. **Festival imagery** — CNY red envelopes and lanterns; mooncake boxes; festive table settings; NOT generic stock
6. **Ingredients** — raw ingredients with Chinese provenance callouts (Sichuan peppercorn, dried scallop, aged Pu-erh)

**Image treatment by variant:**
- `hao-zhan`: High contrast, deep shadows, rich tones — almost editorial/luxury magazine
- `hongxiang`: Warm tones, golden hour light, festive warmth
- `longmen`: Dramatic, high-contrast, near-monochromatic with red accent
- `shuimo`: Clean, airy, natural light — minimal props, maximum dish focus

### 5.4 Chinese Art Decorative Elements

These decorative elements appear as CSS/SVG — NOT as stock image overlays:

1. **Ink wash texture** (`InkWashOverlay`) — soft watercolor wash behind hero images
2. **Paper cut pattern borders** (`ChinesePaperCutDecoration`) — section dividers with traditional motifs
3. **Seal/chop element** — small red square "stamp" accent near logo or chef section (SVG, not image)
4. **Brush stroke divider** — hand-drawn-style horizontal divider between sections
5. **Lantern icon set** — custom SVG icons for festival pages (red lantern, lotus, moon)

**Rule:** These are accent elements — ONE per section maximum. Never combine more than 2 on a single page view. Restraint = premium.

### 5.5 Layout Principles

| Principle | Implementation |
|---|---|
| **Breathing room** | Generous section padding (`--section-py: 6rem` for hao-zhan, 5rem for others) |
| **Dark anchors** | Every variant uses a dark/richly-colored hero — even shuimo uses deep ink in sections |
| **Image-first** | Photography is the hero — components frame it, not compete with it |
| **Vertical Chinese rhythm** | Occasional vertical text treatment for Chinese restaurant name in sidebar/logo area |
| **Two-column menus** | Desktop: dish photo left, name+description right. Mobile: stacked. |

### 5.6 Design Reference Sites

| Site | What to Reference |
|---|---|
| Eleven Madison Park | Fullscreen hero photography, generous white space, chef authority positioning |
| Hakkasan London | Dark premium Chinese dining aesthetic — color palette tone reference |
| Mott 32 Hong Kong | Bilingual sophistication — how to do ZH+EN elegantly |
| Lung King Heen (Four Seasons HK) | Traditional meets luxury — design restraint model |
| Momofuku (NYC group) | Chef-driven narrative, modern typography, component layout patterns |

---

## A6: Content Strategy & Conversion Funnel

### 6.1 Launch Content Requirements

| Content Type | Minimum | Target | Notes |
|---|---|---|---|
| Menu items (EN+ZH) | 60 | 120 | Dim sum: 40+, Dinner: 40+, Chef Sig: 8+ |
| Dish photos | 30 | 80 | Every chef signature + all featured items |
| Testimonials | 15 | 30 | Mix EN and ZH; 5-star Google reviews format |
| Blog posts | 4 | 8 | Cuisine origin, seasonal dishes, chef insights |
| Gallery images | 20 | 50 | Food, dining room, events, chef action |
| Team profiles | 1 (chef) | 4 | Chef, sous chef, host/GM, sommelier (if wine) |
| Festival pages | 2 | 4 | CNY + Mid-Autumn minimum |
| FAQ items | 15 | 25 | Reservations, menu, dietary, parking, events |
| Press mentions | 0 | 5 | Optional — adds authority |

### 6.2 Conversion Funnel Map

```
Awareness:
  Google search (dish + city) → SEO menu page
  Social media (Instagram food photo) → Home or Gallery
  Yelp / Google profile → About or direct reservation
     ↓
Interest:
  Home → Chef section → Menu preview → Specials
  Menu hub → Dim Sum page → full menu browsing
     ↓
Consideration:
  Gallery → Private Dining → Catering page
  Blog (cuisine education) → builds trust
  Testimonials → social proof
     ↓
Decision:
  Reservation widget → date + party size → confirm
  Private dining form → inquiry submitted
  Festival page → "Only 8 tables left" urgency → reserve
     ↓
Action:
  Reservation confirmed via email
  Banquet inquiry replied within 24h
  Online order placed
     ↓
Retention:
  Festival email reminders (CNY, Mid-Autumn)
  New seasonal menu announcement
  VIP membership offer (Phase 5)
```

### 6.3 CTA Placement Strategy

| Page | Primary CTA | Secondary CTA | Sticky |
|---|---|---|---|
| Home | Reserve a Table | View Menu | Yes — StickyBookingBar |
| Menu pages | Reserve for [Meal] | Order Online | Yes |
| Chef's Signatures | Reserve to Experience This | Meet the Chef | No |
| Private Dining | Submit Inquiry | Call Us | No |
| Festival pages | Reserve Festival Menu | View Menu | Yes — Urgency bar |
| Contact | Call Now | Directions | No |

### 6.4 Social Proof Strategy

- **Testimonials:** Home (rotating carousel), About page (full grid), Private Dining page (event testimonials)
- **Press mentions:** About page hero, footer logo strip
- **Stats bar:** "X years of tradition · Y dim sum varieties · Z guests served"
- **Gallery:** Home preview (6 photos), dedicated Gallery page (full masonry)
- **Google rating embed:** Near hero or contact section (3rd-party widget or static display)

---

## Stage A Acceptance Gates

| Gate | Criteria | Status |
|---|---|---|
| **A-Gate-1: Page Map** | All 22 routes defined with purpose, sections, CTAs | ✅ PASS |
| **A-Gate-2: Conversion Funnel** | Full funnel mapped EN + ZH paths | ✅ PASS |
| **A-Gate-3: Content Contracts** | JSON schemas defined for all page types (Phase 0) | Pending Phase 0 |
| **A-Gate-4: Variant Registry** | 4 brand variants with full token tables defined | ✅ PASS |
| **A-Gate-5: Content Minimums** | 60 menu items + 2 festival pages confirmed | ✅ PASS |
| **A-Gate-6: Visual Direction** | 4-variant palette, typography, photo style, decorative system | ✅ PASS |
| **A-Gate-7: Component Inventory** | 30 components (20 REUSE + 10 NEW) classified | ✅ PASS |

**6/7 Gates PASSED (A-Gate-3 completes in Phase 0). Stage B may begin with Phase 0.**

---

# STAGE B — Implementation Blueprint

---

## Phase 0: Fork + Extend Meridian

**File:** `CHINESE_RESTAURANT_PHASE_0.md` · **Duration:** Day 1–3

### Prompts

**0A — Fork the Meridian codebase**
```
Fork restaurant/meridian into restaurant/chinese.
- Strip all demo content (meridian-diner content files)
- Keep all components, lib/, admin/, scripts/
- Keep theme system — we'll ADD 4 new Chinese variants, not replace
- Create new demo site-id: `grand-pavilion`
- Update package.json name, env.local.example
```

**0B — Add 4 Chinese Brand Variants to theme system**
```
Create 4 new theme variants in /data/theme-presets/:
1. hao-zhan.json     (豪展 — Grand Display — fine dining)
2. hongxiang.json    (鴻翔 — Soaring Phoenix — dim sum/banquet)
3. longmen.json      (龍門 — Dragon Gate — contemporary fusion)
4. shuimo.json       (水墨 — Ink Wash — minimalist modern)

Each theme.json must include:
- All existing Meridian tokens (colors, typography, spacing, effects, motion)
- New Chinese-specific tokens:
  --font-display-zh: "Noto Serif SC"
  --font-body-zh: "Noto Sans SC"
  --ink-overlay-opacity: 0.15–0.35 (variant-specific)
  --paper-cut-color: (variant-specific decorative accent)
  --seal-color: #8B0000 (all variants — red stamp)
  --festival-accent: (variant-specific)
- Google Fonts URL: include Noto Serif SC + Noto Sans SC + EN display font
```

**0C — Global files: Header, Footer, Layout**
```
Update layout.tsx for Chinese-specific globals:
- Import Noto Serif SC + Noto Sans SC via Google Fonts (preload)
- Add lang attribute switching (zh-Hans for simplified, zh-Hant for traditional)
- Header: add Chinese restaurant name slot below logo (from site.json)
- Footer: add WeChat QR slot in footer JSON contract
- AnnouncementBar: add festival-aware mode (reads active festival from site config)
```

**0D — Content Contracts (A-Gate-3)**
```
Define TypeScript interfaces in lib/restaurant-chinese-types.ts:

interface ChineseMenuItem extends MenuItem {
  nameZh: string;          // Chinese name — required
  originRegion?: string;   // e.g. "Cantonese", "Shanghainese"
  isDimSum?: boolean;
  dimSumCategory?: 'steamed' | 'baked' | 'fried' | 'congee-noodle' | 'dessert';
  spiceLevel?: 0 | 1 | 2 | 3;
  isHalal?: boolean;
  isKosher?: boolean;
}

interface ChefSignature {
  id: string;
  nameZh: string;
  nameEn: string;
  story: string;
  storyZh: string;
  chefNote: string;
  chefNoteZh: string;
  pairing?: string;   // wine/tea pairing suggestion
  price: number;
  image: string;
  order: number;
}

interface Festival {
  id: string;
  name: string;           // e.g. "Chinese New Year"
  nameZh: string;         // e.g. "农历新年"
  slug: string;           // e.g. "chinese-new-year"
  activeDateRange: { start: string; end: string }; // ISO dates
  heroImage: string;
  tagline: string;
  taglineZh: string;
  specialMenu: ChineseMenuItem[];
  prixFixeTiers?: PrixFixeTier[];
  giftBoxes?: GiftBox[];
  urgencyMessage?: string;
  urgencyCount?: number;  // "Only X tables remaining"
}

interface BanquetPackage {
  tier: 'business-lunch' | 'celebration' | 'wedding-banquet' | 'corporate';
  nameEn: string;
  nameZh: string;
  pricePerHead: number;
  minGuests: number;
  maxGuests: number;
  includes: string[];
  highlight: string;
  image: string;
}

interface SiteInfoChinese extends SiteInfo {
  restaurantNameZh: string;     // Chinese name for display
  cuisineType: string;           // e.g. "Cantonese", "Dim Sum", "Sichuan"
  cuisineTypeZh: string;
  wechatQrUrl?: string;
  wechatAccountName?: string;
  dimSumHours?: { open: string; close: string };
  seatingCapacity?: { regular: number; banquet?: number };
}
```

**0E — Seed Content: Grand Pavilion demo restaurant**
```
Populate content/grand-pavilion/ with:
- en/ and zh/ locale folders
- 80 menu items (40 dim sum with nameZh + photos, 30 dinner, 10 chef signatures)
- 2 festival entries (CNY + Mid-Autumn)
- 3 banquet packages
- 25 testimonials (15 EN, 10 ZH)
- 5 blog posts (cuisine origin stories)
- 30 gallery images
- Full team: Executive Chef Li Wei + 2 others
- theme.json: hao-zhan variant (demo default)
```

**Phase 0 Gate:**
- App boots with grand-pavilion site
- All 4 Chinese variants switchable in admin
- ZH locale renders with Noto Serif SC
- Content contracts TypeScript-valid (no `any`)
- 80 menu items seeded with nameZh
- Header shows Chinese restaurant name
- `git tag v0.0-phase0-complete`

---

## Phase 1: Core Pages

**File:** `CHINESE_RESTAURANT_PHASE_1.md` · **Duration:** Week 1–2

### Prompts

**1A — Header / Footer / StickyBar**
- Header: Chinese name slot, brush-stroke accent, ZH font nav
- Footer: WeChat QR slot, bilingual columns, festival countdown (if active)
- StickyBookingBar: "Reserve / 预约" bilingual CTA

**1B — Home Page (full section stack)**
- All 13 sections from A3.2 section stack
- InkWashOverlay on hero
- BilinguaHeroHeadline component
- TodaySpecialSection: dim sum availability badge
- ChefHeroFull: chef portrait + credentials
- FestivalHighlightSection: active festival or upcoming event

**1C — Menu Hub + Navigation**
- MenuCategoryNav with ZH names
- MenuPreview with 6 category cards
- "Dim Sum Available Until 3pm" live status badge

**1D — Dim Sum Page**
- Sub-category nav: 蒸点 Steamed | 烘焙 Baked | 酥炸 Fried | 粥面 Congee & Noodles | 甜品 Desserts
- MenuItem with nameZh (large), nameEn (small), price, photo, dietary badges
- DimSumCartSection: visual basket selection, pre-order email intent capture

**1E — Dinner Menu + Chef's Signatures**
- Standard dinner menu with ChineseMenuItem
- ChefSignatureCard for each signature dish

**1F — About Page + Chef Profile**
- Chef hero full-bleed
- Origin story in EN + ZH (tabbed or side-by-side)
- Team grid
- Restaurant history timeline

**1G — Reservations Page**
- ReservationWidgetCustom (default) or OT/Resy based on client intake
- "Special Occasion?" prompt → links to Private Dining

**1H — Contact Page**
- Map embed
- Business hours (bilingual)
- WeChat QR code
- Phone prominently displayed
- Parking info (critical for Chinese restaurant audiences)

**1I — i18n Routing (EN / ZH-Hans)**
- Locale switcher in header (EN | 中文)
- Default locale: en
- ZH route: `/zh/` prefix
- All P0 pages translated

**Phase 1 Gate:**
- All P0 pages render from DB, theme-token colors only
- ZH locale works for all P0 pages
- Dim Sum page shows nameZh correctly
- Admin: Form mode for all page sections
- Roundtrip test: edit dish name → save → ZH frontend updated
- Lighthouse ≥ 90
- `git tag v0.1-core-pages`

---

## Phase 2: Industry Modules

**File:** `CHINESE_RESTAURANT_PHASE_2.md` · **Duration:** Week 3

### Prompts

**2A — Festival Pages (FestivalPage component)**
- Build FestivalPage layout (reusable for any festival)
- Implement `/festivals/chinese-new-year` and `/festivals/mid-autumn`
- FestivalCountdown widget
- Prix-fixe tier cards on festival page
- Urgency banner: "Only X tables remaining"
- Festival-aware AnnouncementBar (activates based on date range)

**2B — Private Dining + Banquet Packages**
- Full PrivateDiningPage build
- BanquetPackageCards (4 tiers)
- Enhanced PrivateDiningForm: occasion type + banquet tier + dietary + budget
- Gallery of event photos (sub-gallery)

**2C — Catering Page**
- Off-premise catering info
- Catering capacity and service areas
- Catering inquiry form
- Minimum order + lead time info

**2D — Order Online Page**
- Third-party embed OR link-out to delivery platform (DoorDash/UberEats/etc.)
- "Order for Pickup" form (simple — name, phone, items notes, pickup time) → email submission
- Direct link to full menu for browsing before ordering

**2E — Gallery (full masonry)**
- GalleryCategoryFilter: Food | Dining Room | Events | Festivals | Chef
- GalleryMasonry: responsive grid
- Lightbox: full-resolution with caption (EN + ZH if available)

**2F — Blog System**
- BlogGrid + BlogCard components
- Individual post pages with ZH translation support
- Categories: Cuisine Stories | Seasonal | Chef's Notes | Events
- 5 seeded posts at launch

**2G — Events Page**
- Events hub + individual event pages
- Event types: Tasting Dinner, Chef's Table, CNY Celebration, Moon Festival Night, Wine Pairing
- FullCalendar integration (reuse from Meridian)
- RSVP form per event

**2H — Supporting Pages**
- FAQ (15 items seeded: reservations, dietary, parking, private dining, menu questions)
- Gift Cards page + purchase flow
- Careers page
- Press page
- Privacy + Terms

**2I — Collection Admin Editors**
- Menu Editor: full CRUD with nameZh field, dim sum categories, dietary badges
- Festival Editor: create/edit festivals, toggle active date range, prix-fixe items
- Banquet Package Editor
- Team Editor
- Gallery Editor

**2J — Form Submissions → DB + Email**
- Reservation form → `reservations` table + email confirmation
- Private dining inquiry → `inquiries` table + email alert + admin notification
- Catering inquiry → same pipeline
- Festival reservation → `festival_reservations` table + confirmation

**2K — Responsive Polish**
- Chinese menu mobile layout: nameZh full-width top, EN + price below, photo right
- Festival hero: Chinese text treatment on mobile
- Dim Sum cart: mobile-first swipe-through layout
- 375px / 768px / 1440px breakpoint QA

**Phase 2 Gate:**
- All P1 + P2 pages built and admin-wired
- Festival pages activate/deactivate based on date range
- All forms submit to DB + email
- Blog Posts Editor separate from Content Editor (no overlap)
- Mobile layout correct on all menu pages
- ZH locale works on festival pages
- `git tag v0.2-complete-frontend`

---

## Phase 3: Admin Hardening + Chinese SEO

**File:** `CHINESE_RESTAURANT_PHASE_3.md` · **Duration:** Week 4

### Prompts

**3A — Admin Gap Audit**
- Every section of every page has admin Form mode fields
- Festival page sections editable
- Banquet packages editable
- FestivalCountdown dates editable from admin
- WeChatQR URL editable from site settings

**3B — Admin Certification SOP**
- One-pass checklist across all 22 pages
- Verify: BUILD → WIRE → VERIFY pattern complete
- Fix any section with missing Form mode

**3C — Chinese SEO Programmatic Pages**
- `/menu/[item-slug]` — individual dish pages with Schema.org MenuItem
- `/festivals/[festival-slug]` — dynamic festival routes
- Hreflang: `<link rel="alternate" hreflang="zh-Hans">` on all pages
- ZH-language meta titles + descriptions (separate from EN)

**3D — Schema.org Markup**
- `Restaurant` schema (site-wide): name + nameZh, cuisine type, address, hours, price range, accepts reservations
- `MenuItem` schema on individual dish pages: name, nameZh, description, price, image
- `Event` schema on festival and event pages
- `BreadcrumbList` on all interior pages
- `LocalBusiness` fallback

**3E — Chinese Keyword SEO Optimization**
- Page title pattern: `{nameZh} | {名字} — {CuisineType} in {City}`
- ZH-language sitemap entries
- ZH blog posts with Chinese keywords in headings
- Menu item pages: title = "{nameZh} ({nameEn}) — {RestaurantName}"

**3F — Sitemap + robots.txt + IndexNow**
- Sitemap: all static + dynamic pages, EN + ZH routes, festival pages
- robots.txt: allow all public, block admin
- IndexNow ping on new menu items + blog posts

**3G — Performance**
- Noto Serif SC: load only `wght@700` for display (reduce font weight download)
- Noto Sans SC: load `wght@400` only
- Hero images: use `priority` prop on above-fold
- Dim Sum page: virtualize if item count > 80

**3H — QA Automation Scripts**
- theme-compliance-check: verify no hardcoded colors in new Chinese components
- schema-check: validate ChineseMenuItem + Festival types
- ZH locale route check: all routes respond 200 in /zh/
- festival-activation-check: test date range logic
- contrast-audit: check ZH text on all 4 variant backgrounds

**Phase 3 Gate:**
- Admin coverage 100% (all sections editable)
- Hreflang correct on all EN/ZH pages
- Schema.org validates on Restaurant + 5 MenuItem + 2 Event
- Lighthouse ≥ 90 all core pages
- All QA scripts passing (0 errors)
- `git tag v0.3-launch-ready`

---

## Phase 4: QA + Launch

**File:** `CHINESE_RESTAURANT_PHASE_4.md` · **Duration:** Week 5

### Prompts

**4A — Full QA**
- All 22 pages: visual review, mobile, ZH locale
- All 4 variants: switch at admin level, verify no bleed-through
- Festival activation: manually set current date to CNY window, verify banner + page activates
- ZH testimonials: verify Chinese characters render correctly
- WeChat QR: verify image loads and is scannable
- Form submissions: end-to-end test all 4 forms

**4B — First Client Content Swap**
- Replace Grand Pavilion demo content with first real client's intake data
- Run Pipeline B manually to validate O1–O7

**4C — Production Deploy**
- Vercel deployment
- Supabase production project
- Custom domain + SSL
- Environment variables

**4D — GSC + GMB Submission**
- Submit sitemap (EN + ZH) to Google Search Console
- Claim Google My Business → link to site
- Submit to Bing Webmaster Tools
- IndexNow ping for all pages

**4E — Pipeline B Test Run**
- Run second client through full automated pipeline
- Verify < 2 minutes end-to-end
- Verify ZH content correct
- Verify theme variant applied

**Phase 4 Gate:**
- All pages live in production
- No placeholder content
- Both EN + ZH sitemaps submitted to GSC
- Pipeline B test: 0 errors, < 2 min
- `git tag v1.0-production`

---

## Phase 5: 12-Month Growth Plan

**File:** `CHINESE_RESTAURANT_PHASE_5.md` · **Duration:** Ongoing

**Month 1–2: Launch Burst**
- 6 blog posts (cuisine origin stories, seasonal dishes, chef behind the dish)
- Pitch to local food media + Chinese-language press (World Journal, Sing Tao)
- Set up Google Business Profile posts cadence (weekly specials photo)
- First 3 Pipeline B client onboardings

**Month 3–4: Festival SEO**
- Build festival pages for the next 2 festivals on the calendar
- Start CNY content 6 weeks before (blog, menu, reservation urgency)
- Target: rank for "[city] chinese new year dinner" before the holiday

**Month 5–6: Menu SEO Expansion**
- Launch dish-level programmatic pages for top 30 menu items
- Target dish-level searches: "xiao long bao [city]", "char siu bao near me"
- Chinese-language blog posts (3 posts in ZH) targeting ZH community search

**Month 7–9: VIP / Loyalty (Phase 5 Premium)**
- VIP membership module: monthly fee → priority reservations + chef's table access
- Birthday database: collect dob at reservation → send birthday offer
- Mooncake gift box pre-order page (Mid-Autumn commerce)

**Month 10–12: Multi-Location Expansion**
- Second location Pipeline B clone
- Location-specific menus (slight variations)
- `/locations/` hub page
- Cross-location reservation routing

**12-Month Targets Per Client:**
- 8,000+ organic visits/month
- 400+ monthly reservations from site
- 200+ Chinese-language keyword rankings
- 15+ Pipeline B clients onboarded
- Lighthouse ≥ 90

---

# PIPELINE B — Client Onboarding

---

## Pipeline B Overview

```
Chinese Restaurant Intake Form (JSON)
            ↓
      Pipeline B (7 steps)
            ↓
Customized Client Site (EN + ZH)
(~$0.15 · ~35–55 seconds)
```

### What Changes Per Client

| What | How |
|---|---|
| Restaurant name (EN + ZH) | Deterministic replacement (O4) |
| Cuisine type + sub-type | O3 menu pruning + O4 replacement |
| Brand colors, fonts | Variant selection (O2) |
| Menu types offered | O3 pruning (disable unsupported menu types) |
| Enabled festivals | O3 — disable festivals client doesn't use |
| Hero copy, chef bio, about story | AI generation via Claude API (O5) |
| ZH hero copy, ZH chef bio | AI generation — ZH version separately (O5) |
| SEO titles + descriptions (EN + ZH) | AI generation (O5) |
| Languages supported | O6 locale cleanup |
| Reservation provider + ID | O4 structural rebuild |
| WeChat QR + social links | O4 replacement |

---

## 7-Step Pipeline O1–O7

| Step | Name | Duration | What It Does |
|---|---|---|---|
| O1 | Clone | ~5s | Copy all Grand Pavilion `content_entries` to new `site_id`; register domain |
| O2 | Brand | <1s | Apply `brand-variants-chinese-restaurant.json` variant; override colors/fonts from intake |
| O3 | Prune | ~5s | Disable unsupported menu types, festival pages, locales |
| O4 | Replace | ~8s | Deep replacement (22 pairs); rebuild hours, team, social, WeChat, reservation config |
| O5 | AI Content | ~25s | Call 1: hero/chef bio/about/testimonials (EN+ZH) · Call 2: all-page SEO (EN+ZH) · Call 3: menu descriptions rewrite |
| O6 | Cleanup | <1s | Delete `content_entries` for unsupported locales |
| O7 | Verify | <1s | Required paths exist · no grand-pavilion contamination · menu count matches intake |

**Total:** ~35–55 seconds with AI · ~15 seconds skip-AI mode.

---

## Chinese Restaurant Intake Schema

```json
{
  "clientId": "golden-dynasty-flushing",
  "templateSiteId": "grand-pavilion",
  "industry": "chinese-restaurant",

  "business": {
    "name": "Golden Dynasty",
    "nameZh": "金朝代",
    "ownerName": "Chef Wong Kin-Man",
    "ownerNameZh": "黄建文",
    "ownerTitle": "Executive Chef & Owner",
    "ownerTitleZh": "行政主厨 & 东主",
    "chefOrigin": "Hong Kong",
    "chefTraining": "Fook Lam Moon, Hong Kong · 25 years Cantonese mastery",
    "cuisineType": "Cantonese",
    "cuisineTypeZh": "粤菜",
    "subType": "dim-sum-fine-dining",
    "foundedYear": 2015,
    "tagline": "Authentic Cantonese Mastery Since 2015",
    "taglineZh": "地道粤菜，2015年创立",
    "teamMembers": [
      {
        "slug": "chef-wong",
        "name": "Chef Wong Kin-Man",
        "nameZh": "黄建文",
        "role": "Executive Chef & Owner",
        "roleZh": "行政主厨",
        "credentials": ["25 Years Cantonese", "Former Fook Lam Moon HK"],
        "bio": "..."
      }
    ]
  },

  "location": {
    "address": "45-22 Main Street",
    "city": "Flushing",
    "state": "NY",
    "zip": "11355",
    "phone": "(718) 555-0188",
    "email": "info@goldendynastyny.com",
    "lat": 40.7576,
    "lng": -73.8330,
    "parkingNote": "Validated parking available at adjacent garage",
    "parkingNoteZh": "附近停车场可验证"
  },

  "social": {
    "instagram": "@goldendynastyny",
    "facebook": "facebook.com/goldendynastyny",
    "wechatAccountName": "金朝代餐厅",
    "wechatQrUrl": "https://..."
  },

  "hours": {
    "monday":    { "open": "10:00", "close": "21:30" },
    "tuesday":   { "open": "10:00", "close": "21:30" },
    "wednesday": { "open": "10:00", "close": "21:30" },
    "thursday":  { "open": "10:00", "close": "21:30" },
    "friday":    { "open": "10:00", "close": "22:00" },
    "saturday":  { "open": "09:30", "close": "22:00" },
    "sunday":    { "open": "09:30", "close": "21:00" }
  },

  "dimSum": {
    "enabled": true,
    "hours": { "open": "10:00", "close": "15:00" },
    "weekendBrunch": true,
    "cartStyle": "traditional-cart"
  },

  "menu": {
    "enabled": ["dim-sum", "dinner", "chef-signatures", "weekend-brunch", "beverages", "desserts"],
    "disabled": ["breakfast", "lunch", "cocktails", "wine", "kids", "tasting-menu"]
  },

  "festivals": {
    "enabled": ["chinese-new-year", "mid-autumn", "wedding-banquet"],
    "disabled": ["dragon-boat"]
  },

  "reservations": {
    "provider": "custom",
    "opentableId": null,
    "resyVenueId": null,
    "privateDining": true,
    "catering": true,
    "maxPartySize": 500
  },

  "brand": {
    "variant": "hongxiang",
    "overrides": {}
  },

  "locales": {
    "enabled": ["en", "zh"],
    "primary": "en",
    "disabled": ["es", "ko"]
  },

  "features": {
    "online_reservation": true,
    "private_dining": true,
    "events_section": true,
    "blog": true,
    "gallery": true,
    "gift_cards": false,
    "online_ordering": false,
    "catering": true,
    "careers": false,
    "festival_pages": true,
    "dim_sum_cart": true,
    "chef_signatures": true,
    "vip_membership": false
  },

  "seo": {
    "targetCity": "Flushing",
    "targetNeighborhood": "Downtown Flushing",
    "primaryKeyword": "cantonese restaurant flushing",
    "zhPrimaryKeyword": "法拉盛粤菜餐厅"
  },

  "voice": "warm-traditional-authoritative"
}
```

---

## Menu Catalog (O3 Pruning)

Supported menu types in the master template. O3 deletes content rows for any type NOT in `intake.menu.enabled`:

| Menu ID | Content File | Notes |
|---|---|---|
| `dim-sum` | `menu/dim-sum.json` | Core — 40+ items with nameZh |
| `dinner` | `menu/dinner.json` | Core — 30+ items with nameZh |
| `chef-signatures` | `menu/chef-signatures.json` | Core — 8–12 items |
| `weekend-brunch` | `menu/weekend-brunch.json` | Dim sum brunch format |
| `breakfast` | `menu/breakfast.json` | Optional — congee breakfast |
| `lunch` | `menu/lunch.json` | Optional — set lunch |
| `seasonal` | `menu/seasonal.json` | Optional — rotating seasonal |
| `tasting-menu` | `menu/tasting-menu.json` | Optional — fine dining only |
| `cocktails` | `menu/cocktails.json` | Optional — cocktail menu |
| `wine` | `menu/wine.json` | Optional — wine list |
| `beverages` | `menu/beverages.json` | Core — tea + soft drinks |
| `desserts` | `menu/desserts.json` | Core — Chinese desserts |
| `kids` | `menu/kids.json` | Optional |

**Festival pruning — O3 also deletes:**
- `pages/festivals/[festival-slug].json` for each disabled festival
- `content_entries` rows with `path LIKE 'pages/festivals/%'` for disabled IDs

---

## Brand Variant System

**File:** `scripts/onboard/brand-variants-chinese-restaurant.json`

| Variant ID | Chinese Name | For | Primary | Secondary | Backdrop | Display Font |
|---|---|---|---|---|---|---|
| `hao-zhan` | 豪展 | Fine dining, Cantonese/Shanghainese | `#1A1A1A` Ink Black | `#C9A84C` Antique Gold | `#F5F0E8` Aged Parchment | Cormorant Garamond |
| `hongxiang` | 鴻翔 | Dim Sum, Traditional Banquet | `#8B1A1A` Deep Crimson | `#C9A84C` Imperial Gold | `#FDF6E3` Warm Ivory | EB Garamond |
| `longmen` | 龍門 | Contemporary Fusion, Chef-Driven | `#2C1810` Darkest Brown | `#C0392B` Lacquer Red | `#0A0A0A` Near Black | DM Serif Display |
| `shuimo` | 水墨 | Modern Minimalist, Taiwanese | `#2F2F2F` Charcoal | `#8B0000` Cinnabar Red | `#F9F6F0` Off-White | Libre Baskerville |

**Variant selection guide (intake → O2):**
- Fine dining, Cantonese, Shanghainese → `hao-zhan`
- Dim Sum, Yum Cha, Traditional banquet, Teahouse → `hongxiang`
- Contemporary fusion, Chef's table, Sichuan modern → `longmen`
- Modern Chinese, Taiwanese, Tea bar adjacent → `shuimo`
- Hong Kong-style café (茶餐厅) → `shuimo` or `matin-clair` from Meridian

---

## AI Prompt Spec (O5)

Three Claude API calls in O5, each with interpolated templates:

**O5 Call 1 — Content (EN + ZH)** — prompt file: `scripts/onboard/prompts/chinese-restaurant/content.md`

Template variables: `{{restaurantName}}`, `{{restaurantNameZh}}`, `{{ownerName}}`, `{{ownerNameZh}}`, `{{chefOrigin}}`, `{{chefTraining}}`, `{{cuisineType}}`, `{{cuisineTypeZh}}`, `{{city}}`, `{{foundedYear}}`, `{{voice}}`

Generates:
```json
{
  "hero": { "tagline": "...", "taglineZh": "...", "description": "...", "descriptionZh": "..." },
  "aboutStory": "...",
  "aboutStoryZh": "...",
  "chefBio": "...",
  "chefBioZh": "...",
  "chefQuote": "...",
  "chefQuoteZh": "...",
  "testimonials": [{ "name": "...", "nameZh": "...", "text": "...", "textZh": "...", "rating": 5 }],
  "whyChooseUs": [{ "icon": "...", "title": "...", "titleZh": "...", "description": "..." }],
  "announcementBar": "..."
}
```

**O5 Call 2 — SEO (EN + ZH)** — prompt file: `scripts/onboard/prompts/chinese-restaurant/seo.md`

Generates `seo.json` with EN + ZH title/description for all 22 page routes.

**O5 Call 3 — Menu Descriptions Rewrite** — prompt file: `scripts/onboard/prompts/chinese-restaurant/menu.md`

Template variables: `{{restaurantName}}`, `{{restaurantNameZh}}`, `{{cuisineType}}`, `{{voice}}`, `{{enabledMenuTypes}}`

Generates unique dish descriptions for the enabled menu types — rewrites template copy so no two clients share identical menu text. Preserves `nameZh`, updates `description` and `shortDescription` only.

---

## Pipeline B Done-Gate

After O7, automated verification checks:

| Check | Pass Criteria |
|---|---|
| Required paths exist | `pages/home.json`, `pages/menu.json`, `menu/dim-sum.json` (if enabled), `menu/dinner.json` |
| ZH locale present | `zh/pages/home.json` exists and has content |
| No grand-pavilion contamination | Zero occurrences of "Grand Pavilion" or "大观楼" in client content |
| No grand-pavilion contamination (ZH) | Zero occurrences in ZH content |
| Menu count matches intake | Item count in dim-sum.json ≥ 30 if `dim-sum` enabled |
| Festival pages exist | Each enabled festival has a `pages/festivals/[id].json` |
| Disabled festivals removed | No content rows for disabled festival IDs |
| Theme variant applied | `theme.json` `preset.id` matches intake `brand.variant` |
| Disabled locales cleaned | Zero `content_entries` rows for locales not in `intake.locales.enabled` |

---

# Reference

## Multi-Tenant Architecture

Inherits from Meridian — no changes:
- `content_entries` table: `(site_id, locale, path)` composite key
- Host-based resolution: middleware → `site_domains` → `SiteContext`
- RLS enforced per site_id
- Supabase Storage: media paths prefixed with `site_id/`

## Platform Guardrails (Inherited from BAAM Master Plan V3.2)

1. **No hardcoded content in code** — all restaurant identity in `content/[site-id]/`
2. **Theme tokens only** — no hardcoded colors in Chinese-specific components
3. **nameZh required** — TypeScript enforces `nameZh: string` on ChineseMenuItem (not optional)
4. **ZH font must preload** — Noto Serif SC + Noto Sans SC in `<head>` preload
5. **Festival date ranges in DB** — not hardcoded in code (so admin can update without deploy)
6. **Import direction** — `lib/` ← `components/` ← `app/` (no reverse imports)
7. **One pipeline, two outputs** — O5 Call 1 generates EN + ZH in a single prompt (not two separate calls)

## Governance & Sign-Off

| Phase | Sign-Off Required |
|---|---|
| Stage A complete | All 7 A-Gates documented above |
| Phase 0 complete | App boots, 4 variants, ZH fonts, content contracts |
| Phase 1 complete | Core pages from DB, ZH locale, admin-wired |
| Phase 2 complete | All modules built, forms submit, festival pages active |
| Phase 3 complete | Admin 100%, SEO, Schema.org, QA scripts passing |
| Phase 4 complete | Production live, Pipeline B tested |

## Dual Timeline

| Mode | Duration | What's Deferred |
|---|---|---|
| **Lean Launch** | 3 weeks | Festivals, catering, blog, order online |
| **Full Launch** | 5 weeks | Everything above |

Lean launch includes: Home, Menu (Dim Sum + Dinner), Chef's Signatures, Reservations, About, Contact, Gallery, Private Dining.

## Anti-Patterns & Lessons Learned

| Anti-Pattern | Why It Fails | BAAM Solution |
|---|---|---|
| Treating ZH as translation-afterthought | ZH community IS the primary audience — they notice immediately if ZH is low quality | `nameZh` required field in TypeScript; O5 generates ZH in same prompt, not auto-translated |
| Using stock "Chinese restaurant" photos | Red lanterns + dragon = stereotype, not premium | Photography direction: food-first, editorial lit, painterly composition |
| Hardcoded festival dates | Festivals shift by lunar calendar; code changes = deploy | Festival date ranges in DB, editable in admin |
| Generic menu item descriptions | Two clients with same copy → SEO cannibalization + looks lazy | O5 Call 3 rewrites all descriptions per client |
| Building features before fixing typography | ZH text at wrong weight or wrong font destroys premium feel | 0B locks in ZH font system before any page work |
| One theme for all Chinese restaurants | Dim Sum parlor ≠ fine dining Cantonese ≠ Sichuan fusion | 4 distinct variants designed for sub-types |

---

## Cursor Attachment Protocol

| Work | Attach in Cursor |
|---|---|
| Phase 0 | `@RESTAURANT_CHINESE_COMPLETE_PLAN.md` + `@CHINESE_RESTAURANT_PHASE_0.md` |
| Phase 1 | `@RESTAURANT_CHINESE_COMPLETE_PLAN.md` + `@CHINESE_RESTAURANT_PHASE_1.md` |
| Phase 2 | `@CHINESE_RESTAURANT_PHASE_2.md` |
| Phase 3 | `@CHINESE_RESTAURANT_PHASE_3.md` |
| Phase 4 | `@CHINESE_RESTAURANT_PHASE_4.md` |
| Pipeline B | `@RESTAURANT_CHINESE_COMPLETE_PLAN.md` (Pipeline B section) |

---

*BAAM System F — Chinese Restaurant Premium Complete Plan v1.0 — March 2026*
*Baseline: restaurant/meridian (fork + extend) | Demo site: Grand Pavilion 大观楼 · Flushing NY*
