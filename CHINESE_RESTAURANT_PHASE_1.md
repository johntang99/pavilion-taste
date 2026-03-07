# BAAM System F — Chinese Restaurant Premium
# Phase 1: Core Pages — Build / Wire / Verify

> **System:** BAAM System F — Chinese Restaurant Premium
> **Reference files:** `@RESTAURANT_CHINESE_COMPLETE_PLAN.md` + `@CHINESE_RESTAURANT_CONTENT_CONTRACTS.md` + `@CHINESE_RESTAURANT_PHASE_0.md`
> **Prerequisite:** Phase 0 gate fully passed. `v0.0-phase0-complete` tagged.
> **Method:** One Cursor prompt per session. BUILD → WIRE → VERIFY every page before moving on.
> **Rule:** A page is only "done" when all three steps pass. Never skip a done-gate.

---

## Phase 1 Overview

**Duration:** Week 1–2
**Goal:** Build all core pages of Grand Pavilion — the pages every Chinese restaurant visitor will hit. Every page must render from Supabase DB, be fully editable in admin, support variant switching, and work in EN + ZH locales.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 1A | Header + Footer + StickyBar | Chinese-extended shared layout | 90 min |
| 1B | Home Page — All 13 Sections | Sets visual language, festival highlight, dim sum status | 150 min |
| 1C | Menu System — Hub + Dim Sum + Dinner | Core restaurant feature with ZH names | 120 min |
| 1D | Chef's Signatures Page | Premium positioning page | 60 min |
| 1E | About + Team Pages | Chef identity + bilingual story | 60 min |
| 1F | Reservations Page | Conversion-critical + private dining link | 60 min |
| 1G | Contact Page | WeChat QR + bilingual hours + parking | 45 min |
| 1H | i18n Routing — EN / ZH | Full bilingual verification pass | 60 min |

---

## Build → Wire → Verify Checklist (Every Page)

| Check | How to Verify |
|---|---|
| **Renders from DB** | Change field in Supabase directly → reload page → change appears |
| **Form edit** | Admin → Content Editor → edit field → Save → frontend shows change |
| **JSON edit** | Admin → JSON tab → edit value → Save → Form tab reflects change |
| **Variant switch** | Admin → change section variant → Save → layout changes |
| **Theme compliance** | `grep -r "color:" app/components/` — no hex values in new Chinese components |
| **ZH locale** | Visit `/zh/[route]` — renders correctly with Noto Serif SC font |
| **Chinese name renders** | Menu items show `name_zh` in large text above English name |
| **Mobile** | 375px — no overflow, nav collapses, ZH text wraps correctly |
| **WeChat QR** | Contact page shows QR image (or placeholder if URL empty) |

---

## Prompt 1A — Header + Footer + StickyBookingBar (Chinese Extensions)

**Goal:** Extend the Meridian header/footer with Chinese-specific features: restaurant name in ZH below logo, WeChat QR in footer, bilingual nav labels, dim sum hours badge.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A4 Component Inventory

The Meridian codebase already has RestaurantHeader, RestaurantFooter,
and StickyBookingBar. DO NOT rebuild these from scratch.
EXTEND them with Chinese-specific additions only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXTENSION 1 — RestaurantHeader.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/RestaurantHeader.tsx (existing — extend)

Add these Chinese-specific features:

1. CHINESE NAME BELOW LOGO
   After the logo text/image, add a second line for restaurantNameZh:
   - Read from: site.json → restaurantNameZh
   - Font: var(--font-display-zh), Noto Serif SC
   - Weight: var(--weight-display-zh) — typically 700
   - Size: 0.85em of the logo size
   - Color: var(--color-text-secondary)
   - Only show if restaurantNameZh is non-empty
   - CSS var --zh-name-display controls position: 'above' | 'below'

   Example render (hao-zhan variant):
   THE GRAND PAVILION     ← English serif, var(--font-heading)
   大观楼                  ← Noto Serif SC 700, smaller

2. BRUSH STROKE NAV ACCENT (optional, variant-controlled)
   For hao-zhan and hongxiang variants, add a subtle decorative underline
   on the active nav item using var(--paper-cut-color) at 40% opacity.
   Implementation: CSS pseudo-element, 2px height, var(--paper-cut-color).
   Skip for longmen (active item uses outline) and shuimo (standard underline).

3. BILINGUAL CTA BUTTON
   The "Reserve a Table" CTA in nav — if locale is 'zh', show "预约餐桌".
   Read from navigation.json cta.labelZh (add this field to the contract).

4. DIM SUM STATUS BADGE (in top bar, if header.top_bar enabled)
   After the phone number in top bar, show a small pill badge:
   - If current time is within site.json dimSumHours: "🍵 Dim Sum Available · 点心供应中" (green)
   - Otherwise: "Dim Sum Available 10am–3pm" (muted)
   - This is a client-side calculation (useEffect with new Date())
   - Hide on mobile top bar (show in mobile menu instead)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXTENSION 2 — RestaurantFooter.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/RestaurantFooter.tsx (existing — extend)

Add these Chinese-specific sections:

1. WECHAT QR CODE COLUMN
   Add a 4th footer column (or integrate into contact column) for WeChat:
   - Heading: "Follow Us on WeChat · 关注我们的微信"
   - QR image: from site.json → wechatQrUrl (show placeholder if empty)
   - Account name: from site.json → wechatAccountName
   - Only render this column if wechatQrUrl is non-empty OR wechatAccountName non-empty
   - Image size: 100×100px with 4px border using var(--border)

2. CHINESE CUISINE CALLOUT
   In the footer tagline or below restaurant name, add:
   - Cuisine type in ZH: site.json → cuisineTypeZh
   - Example: "传统粤菜 · Est. 2008"
   - Font: var(--font-body-zh), 0.875rem, var(--color-text-muted)

3. BILINGUAL HOURS
   Footer hours display should show:
   - "Hours · 营业时间" as the section heading
   - Days in EN only (Mon, Tue...) but times in pure numbers (no change needed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXTENSION 3 — StickyBookingBar.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/layout/StickyBookingBar.tsx (existing — extend)

Add bilingual CTA text:
- If locale is 'en': "Reserve a Table" (existing)
- If locale is 'zh': "预约餐桌"
- Read locale from usePathname() (existing pattern in codebase)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the admin Content Editor for header.json, add form fields:
- "Restaurant Name (Chinese)" → site.json.restaurantNameZh (text input)
- "WeChat QR URL" → site.json.wechatQrUrl (text input, shows preview)
- "WeChat Account Name" → site.json.wechatAccountName (text input)
- "Dim Sum Hours — Open" → site.json.dimSumHours.open (time input)
- "Dim Sum Hours — Close" → site.json.dimSumHours.close (time input)
- "Parking Note (EN)" → site.json.parkingNote (text)
- "Parking Note (ZH)" → site.json.parkingNoteZh (text)
```

**Done-Gate 1A:**
- Header shows "大观楼" below "GRAND PAVILION" logo text
- `/zh/` routes show "预约餐桌" in StickyBar
- Footer shows WeChat section (even if QR is placeholder)
- Dim sum status badge appears in top bar (green between 10am–3pm)
- All new fields editable in admin Site Settings or Content Editor

---

## Prompt 1B — Home Page: All 13 Sections

**Goal:** Build the complete Chinese restaurant home page with all sections from the A3 section stack. Every section renders from DB, is admin-editable, and works in EN + ZH.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A3.2 Home Page Section Stack

Build the home page at app/[locale]/page.tsx.
Reads from content_entries path: 'pages/home.json' + site.json.
All content: DB-first. No hardcoded strings. No hardcoded colors.

The section stack (in order):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — AnnouncementBar (REUSE existing, extend)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend existing AnnouncementBar to support festival-aware mode:
- Read site.json.announcementBar for default message
- Also call getActiveFestival(siteId) — if active festival exists,
  override the announcement bar with festival urgency message
- Festival announcement style: var(--festival-accent) background
- Dismissible via localStorage key 'announcement-dismissed-{festivalId}'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — HeroSection (REUSE, add InkWashOverlay + BilinguaHeroHeadline)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend existing HeroSection. No rebuild.

Add InkWashOverlay component:
File: components/ui/InkWashOverlay.tsx

  A div absolutely positioned over the hero image with:
  - background: radial-gradient(ellipse at bottom,
      var(--ink-overlay-color) 0%,
      transparent 70%)
  - opacity: var(--ink-overlay-opacity)
  - Pointer events: none
  - z-index: 1 (hero text sits at z-index 2)

Add BilinguaHeroHeadline component:
File: components/ui/BilinguaHeroHeadline.tsx

Props: { en: string; zh: string; layout?: 'zh-above' | 'zh-below' }

Renders:
  [zh-below layout]
  <div class="bilingual-headline">
    <h1 class="headline-en">{en}</h1>       ← var(--font-display), var(--weight-display)
    <p class="headline-zh">{zh}</p>         ← var(--font-display-zh), var(--weight-display-zh)
  </div>

  [zh-above layout — for hongxiang variant]
  <div class="bilingual-headline">
    <p class="headline-zh">{zh}</p>         ← smaller, var(--tracking-caption) UPPERCASE
    <h1 class="headline-en">{en}</h1>
  </div>

layout defaults to var(--zh-name-display) (from theme token).

Hero section data shape in home.json:
{
  "_type": "hero",
  "_variant": "fullscreen",          // "fullscreen" | "split" | "fullscreen-dark"
  "image": "/uploads/grand-pavilion/hero/main-hero.jpg",
  "imageMobile": "/uploads/grand-pavilion/hero/main-hero-mobile.jpg",
  "tagline": "Cantonese Mastery Since 2008",
  "taglineZh": "传承粤菜精髓，2008年创立",
  "subline": "Authentic dim sum · Private banquets · Flushing's finest",
  "sublineZh": "正宗点心 · 私人宴会 · 法拉盛首选",
  "ctaPrimary": { "label": "Reserve a Table", "labelZh": "预约餐桌", "href": "/reservations" },
  "ctaSecondary": { "label": "View Menu", "labelZh": "查看菜单", "href": "/menu" },
  "overlayEnabled": true
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — TodaySpecialSection (REUSE, extend with Dim Sum status)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend existing TodaySpecialSection:

Add DimSumStatusBadge sub-component:
- Client-side component (useEffect)
- If current time is within dimSumHours: show green pill "🍵 Dim Sum Now Available · 点心供应中"
- If outside dimSumHours: show grey pill "Dim Sum Available {open}–{close} Daily · 每日供应"
- Position: above the specials cards

Today's specials: loads featured=true items from menu_items (first 3)
OR reads from home.json todaySpecials array if manually set.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — MenuPreview (REUSE, adapt for Chinese categories)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Show 4–6 category cards from home.json menuPreview.categories:
Each card: { id, icon, title, titleZh, description, descriptionZh, href, image }

Default categories:
- Dim Sum 点心 → /menu/dim-sum
- Dinner 晚餐 → /menu/dinner
- Chef's Signatures 主厨推荐 → /menu/chef-signatures
- Weekend Brunch 周末早午餐 → /menu/weekend-brunch

Card shows: image | titleZh (large, Noto Serif SC) | title (small, EN) | arrow
On hover: image scales 1.03, arrow translates right

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — ChefHeroFull (REUSE existing — no changes needed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reads from home.json chefHero:
{
  "image": "/uploads/grand-pavilion/chef/chef-li-wei-portrait.jpg",
  "name": "Chef Li Wei",
  "nameZh": "厨师长李伟",
  "title": "Executive Chef & Founder",
  "titleZh": "行政主厨及创始人",
  "credential1": "30 Years of Cantonese Mastery",
  "credential1Zh": "三十年粤菜经验",
  "credential2": "Trained at Fook Lam Moon, Hong Kong",
  "credential2Zh": "师承香港富临饭店",
  "credential3": "80+ Hand-crafted Dim Sum Varieties",
  "credential3Zh": "80余种手工点心",
  "quote": "Every dish carries the memory of where it came from.",
  "quoteZh": "每道菜肴，都承载着食材的记忆与产地的情怀。"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — GalleryPreviewSection (REUSE existing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Shows first 6 gallery_items (featured=true) from DB.
No changes needed. Caption supports { en, zh } — show zh caption if locale=zh.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — TestimonialsSection (REUSE, add ZH testimonial support)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend existing TestimonialsSection to support ZH-language testimonials:
- Each testimonial: { name, text, rating, lang } where lang: 'en' | 'zh'
- If locale is 'zh': show ZH testimonials first, then EN
- If locale is 'en': show EN testimonials only (or all, mixed)
- ZH testimonial text: render in var(--font-body-zh) font
- Reviewer name in ZH: use var(--font-body-zh)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — FestivalHighlightSection (NEW)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/FestivalHighlightSection.tsx

NEW component. Two variants: 'banner' (compact) and 'section' (full-width card).

Data source: getActiveFestival(siteId) — returns the currently active festival.
If no active festival: fallback to home.json festival_highlight.fallbackMessage.

VARIANT 'banner':
  A full-width band between two sections:
  - Background: var(--festival-accent) at 15% opacity, border-top/bottom: 1px var(--festival-accent)
  - Left: festival name (EN + ZH stacked), date range
  - Right: urgency pill "Only {count} tables remaining · 仅剩{count}位" + CTA button
  - Mobile: stacked, CTA full-width

VARIANT 'section':
  A distinct section with background from festival hero image (blurred):
  - Festival name large (BilinguaHeroHeadline)
  - 2-3 sentence teaser
  - Prix-fixe price preview if prixFixeEnabled
  - CTA: "Reserve Festival Menu · 预约节日套餐"
  - Countdown widget: "X days until the festival"

Home.json data shape:
{
  "_type": "festival_highlight",
  "_variant": "banner",
  "activeFestivalId": null,
  "fallbackMessage": "Coming Soon: Chinese New Year 2027",
  "fallbackMessageZh": "即将推出：2027年农历新年",
  "showCountdown": true
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — PrivateDiningCTA (REUSE, add banquet capacity callout)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend existing ReservationsCTA or CTASection:
Add a second CTA block specifically for private dining / banquets:
- Headline: "Hosting a Celebration? · 策划一场难忘的盛宴？"
- Subline: "From intimate 10-person dinners to grand 500-guest ballroom banquets"
- Subline ZH: "十人私宴至五百人豪华宴会，我们为您量身定制"
- CTA: "Inquire About Private Dining · 咨询私宴预约"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 — ReservationsCTA (REUSE existing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Standard CTA section. Add ZH label support:
ctaLabel: "Reserve a Table · 立即预约"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 11 — BlogPreviewSection (REUSE existing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Shows 3 latest published blog posts. No changes needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING — Home Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Content Editor for pages/home.json, ensure Form mode has:
- Hero: tagline (EN), taglineZh (ZH), subline (EN), sublineZh (ZH), image picker
- Chef section: name, nameZh, title, titleZh, 3 credentials each EN+ZH, quote+quoteZh
- Festival highlight: variant dropdown, fallbackMessage, fallbackMessageZh
- Menu preview: category list with title, titleZh, image, href per item
- All CTA labels: EN + ZH text inputs
```

**Done-Gate 1B:**
- All 11 sections render on home page from DB content
- BilinguaHeroHeadline shows EN + ZH stacked
- InkWashOverlay appears over hero image
- FestivalHighlightSection renders (banner variant) — shows fallback message if no active festival
- DimSumStatusBadge shows correct state based on current time
- `/zh/` home page renders with ZH content
- All sections editable in admin Form mode
- Lighthouse ≥ 90

---

## Prompt 1C — Menu System: Hub + Dim Sum + Dinner + ZH Names

**Goal:** Build the menu hub page, dim sum category page, and dinner page. Core feature: every item shows `name_zh` in large Noto Serif SC above the English name.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A3.3 Menu Hub Page Design

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 1 — Menu Hub: app/[locale]/menu/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reads from: content_entries 'pages/menu.json' + menu_categories (DB)

Sections:
1. PageHero: "Our Menu · 菜单", background image
2. DimSumStatusBadge: availability status (client-side, same as home)
3. MenuCategoryNav: horizontal scrollable tab bar of enabled menu types
   - Each tab: icon + EN label + ZH label below
   - "Dim Sum 点心" | "Dinner 晚餐" | "Chef's Signatures 主厨推荐" | "Weekend Brunch 周末早午餐"
   - Active tab: var(--color-primary) underline or background
   - Tabs scroll horizontally on mobile
4. Category cards grid: 2×2 or 3×2 depending on enabled types
   Each card: { image, titleZh (large), title (small EN), item count, hours if restricted }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 2 — Dim Sum: app/[locale]/menu/dim-sum/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reads from: menu_items WHERE is_dim_sum = true, grouped by dim_sum_category

Layout (desktop: 2 columns, mobile: 1 column):
- Sub-category sticky nav: 蒸点 Steamed | 烤点 Baked | 炸点 Fried | 粥面 Congee & Noodles | 甜点 Desserts
  (only show categories with items; hide empty ones)
- Each item renders with ChineseMenuItem layout (see below)
- DimSumStatusBadge at top (client-side)

CRITICAL: ChineseMenuItem layout for dim sum items:
The existing MenuItem component needs a Chinese-specific variant.
Extend MenuItem.tsx with a 'chinese' display variant:

VARIANT 'chinese' layout:
  ┌────────────────────────────────┐
  │ [PHOTO 120×90px]  虾饺          │  ← name_zh: Noto Serif SC 700, 1.25rem
  │                   Har Gow      │  ← name.en: lighter, 0.875rem, muted
  │                   Shrimp Dumplings  ← description, 0.8rem, muted
  │                   🥗 GF  🌶 Spicy  ← dietary badges
  │                   $5.80         │  ← price, primary color, right-aligned
  └────────────────────────────────┘

The name_zh MUST appear larger and above the English name.
This is not optional — it's the core Chinese restaurant UX.

If locale is 'zh': show name_zh only (no English name shown)
If locale is 'en': show name_zh above + name.en below

Dietary badge display for Chinese restaurants:
- 素 Vegetarian (green)
- 全素 Vegan (dark green)
- 无麸质 GF (blue)
- 清真 Halal (teal) — from isHalal field
- 洁食 Kosher (purple) — from isKosher field
- 🌶 Spice level 1/2/3 (red, intensity matches level)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 3 — Dinner: app/[locale]/menu/dinner/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reads from: menu_items WHERE menu_type = 'dinner', grouped by category

Layout: Same ChineseMenuItem 'chinese' variant
Sub-categories: Seafood 海鲜 | Poultry & Meat 禽肉 | Vegetables 蔬菜 | Rice & Noodles 饭面 | Soups 汤类

Featured dinner items (featured=true): appear in a "Chef's Picks" strip at top
with slightly larger card treatment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING — Menu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Menu Editor (existing Meridian admin/menu/ page):
Add these new fields to the item form:
- "Chinese Name · 中文名称" (name_zh) — text input, marked as REQUIRED with red asterisk
- "Origin Region" (origin_region) — text input, placeholder "e.g. Cantonese"
- "Dim Sum Category" (dim_sum_category) — dropdown: Steamed | Baked | Fried | Congee-Noodle | Dessert | (none)
- "Is Dim Sum" checkbox — auto-checked when dim_sum_category is selected
- "Is Chef Signature" checkbox
- "Halal" checkbox
- "Kosher" checkbox

Add filter/search by: is_dim_sum, is_chef_signature, category, name_zh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING — Menu Hub Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin Content Editor for pages/menu.json:
- Menu category cards: each card has image picker, titleZh input, href
- Dim sum hours: open/close time inputs (same as site.json — consider linking)
- Enabled menu types: checkboxes for each type (dim-sum, dinner, chef-signatures, etc.)
```

**Done-Gate 1C:**
- Menu hub shows category cards with ZH names
- Dim sum page shows 40+ items with name_zh in large Noto Serif SC
- English name appears smaller below ZH name
- Dietary badges show Halal (清真) and Kosher (洁食) options
- Spice level renders 🌶 indicators
- Sub-category sticky nav scrolls horizontally on mobile
- `/zh/menu/dim-sum` shows ZH-only names (no English)
- Admin menu editor shows "Chinese Name" field with required indicator
- Saving a menu item with empty name_zh shows validation error

---

## Prompt 1D — Chef's Signatures Page

**Goal:** Build the premium Chef's Signatures page. Each dish gets a full-bleed treatment with chef's story, technique callout, and pairing note.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A3.3 Chef's Signatures Page

File: app/[locale]/menu/chef-signatures/page.tsx

NEW component: ChefSignatureCard
File: components/menu/ChefSignatureCard.tsx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ChefHeroFull section (reuse): chef portrait + credentials header
   Tagline: "These are the dishes that define Grand Pavilion."
   TaglineZh: "这些菜肴，定义了大观楼。"

2. Grid of ChefSignatureCard components
   Desktop: 2-column alternating layout (image-left, text-right / image-right, text-left)
   Mobile: single column, image-top

3. CTA at bottom: "Reserve a Table to Experience These Dishes"
   CTA ZH: "预约餐桌，品尝主厨推荐佳肴"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ChefSignatureCard COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data loads from: menu_items WHERE is_chef_signature = true ORDER BY display_order

Each card shows:
┌─────────────────────────────────────────────────────┐
│  [LARGE DISH PHOTO — 50% width on desktop]          │
│                          │                          │
│                          │  片皮鸭                   │  ← name_zh: Noto Serif SC 700, 2.5rem
│                          │  Peking Duck             │  ← name.en: 1rem, muted
│                          │                          │
│                          │  ─── Chef's Note ───     │
│                          │  "Marinated for 3 days   │  ← quote style
│                          │  in our family recipe…"  │
│                          │                          │
│                          │  ORIGIN REGION: Cantonese │  ← small label
│                          │  TEA PAIRING: Pu-erh     │  ← pairing note
│                          │                          │
│                          │  $88 / whole             │
│                          │  [Reserve to Experience] │
└─────────────────────────────────────────────────────┘

Props:
- nameZh: string (large, Noto Serif SC 700)
- nameEn: string
- description: string (1–2 sentences)
- descriptionZh: string
- chefNote: string (displayed in italic quote format)
- chefNoteZh: string
- originRegion?: string
- pairing?: string (tea/wine suggestion)
- price: number | null
- priceNote?: string (for "Market price")
- image: string
- imageAlt: string
- layout: 'image-left' | 'image-right' (alternates per card)

Red seal accent:
- In corner of chef's note section, add a small red square "seal" SVG
- Color: var(--seal-color)
- Size: 32×32px, border: 2px solid var(--seal-color)
- Contains: a decorative brushstroke character or restaurant initials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These items are managed in the Menu Editor (admin/menu/).
"Is Chef Signature" checkbox already added in 1C.
The chef_signatures page reads directly from menu_items — no separate content_entries needed.

For chef note and pairing:
- Add "Chef's Note (EN)" text area to menu item form
- Add "Chef's Note (ZH)" text area
- Add "Pairing Suggestion" text input (tea/wine)
- These map to existing or extended jsonb fields on menu_items
```

**Done-Gate 1D:**
- Chef's Signatures page shows 8 items from DB
- Alternating image-left/right layout on desktop
- name_zh in large Noto Serif SC 700
- Red seal SVG appears in chef note section
- "Market price" items show "时价" text, no number
- Admin: menu item form has "Is Chef Signature", "Chef's Note", "Pairing" fields

---

## Prompt 1E — About + Team Pages

**Goal:** Build About page with chef origin story in EN + ZH, and Team page with bilingual bios.

```
You are building BAAM System F — Chinese Restaurant Premium.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 1 — About: app/[locale]/about/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reads from: content_entries 'pages/about.json' + team_members (DB)

Sections:
1. PageHero: "Our Story · 我们的故事", hero image
2. ChefPortraitSection:
   - Full-width or 60/40 split: chef portrait + restaurant name in large ZH brush font
   - "创立于2008年 · Est. 2008" callout
3. AboutStorySection:
   - Bilingual toggle tabs: "English · 中文" tab switcher
   - OR: side-by-side columns on desktop (EN left, ZH right)
   - Admin-controlled via 'storyLayout': 'tabbed' | 'side-by-side'
   - 3 paragraphs, each EN + ZH
4. StatsBar: "X Years · X Dim Sum Varieties · X Guests Served · X Banquet Capacity"
   - Reads from about.json stats: [{ value, label, labelZh }]
   - Animated count-up on scroll into view
5. ChefBioSection:
   - Chef photo (portrait style) + full bio text
   - Bio: 3 paragraphs, bilingual (EN + ZH)
   - Credentials list: each credential as a badge
   - chef_origin and chef_training from team_members.chef_origin/chef_training
6. TeamGrid: remaining team members (sous chef, GM, etc.)
7. CTA: "Meet Our Team Over Dinner · 餐桌相见，深入了解"

About page data shape:
{
  "seo": { "title": "Our Story — Grand Pavilion | Flushing Cantonese Restaurant" },
  "hero": { "image": "...", "title": "Our Story", "titleZh": "我们的故事" },
  "story": {
    "layout": "tabbed",
    "paragraphs": [
      { "en": "Founded in 2008 by Chef Li Wei...", "zh": "大观楼由厨师长李伟于2008年创立..." },
      { "en": "...", "zh": "..." },
      { "en": "...", "zh": "..." }
    ]
  },
  "stats": [
    { "value": "16", "label": "Years of Tradition", "labelZh": "年传统" },
    { "value": "80+", "label": "Dim Sum Varieties", "labelZh": "种点心" },
    { "value": "500", "label": "Banquet Capacity", "labelZh": "人宴会容量" },
    { "value": "15K+", "label": "Guests Monthly", "labelZh": "月接待客人" }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 2 — Team: app/[locale]/about/team/page.tsx (optional — can be section on About)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reads from: team_members table WHERE active = true ORDER BY display_order

Each team member card:
- Photo (portrait orientation)
- name (EN) + name_zh (if set) stacked
- role (localized)
- Short bio (bio.short[locale])
- Credentials badges
- Chef training callout (chef_training field)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin Team Editor (admin/team/):
- Add "Chinese Name" (name_zh) text input
- Add "Chef Origin" text input (e.g. "Hong Kong")
- Add "Chef Training" text input (e.g. "Fook Lam Moon, Hong Kong · 25 years")
- All bio fields: EN + ZH text areas

Admin Content Editor for pages/about.json:
- Story paragraphs: EN + ZH text areas per paragraph
- Stats: value + label + labelZh per stat
- Layout toggle: tabbed | side-by-side
```

**Done-Gate 1E:**
- About page renders with bilingual story (tabs or side-by-side)
- Stats bar shows 4 animated counters
- Team section shows Chef Li Wei with name_zh "李伟"
- `/zh/about` renders full Chinese content
- Admin Team editor shows Chinese Name field

---

## Prompt 1F — Reservations Page

**Goal:** Build the reservations page. Extend existing Meridian reservation widget system. Add Private Dining upgrade prompt.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: Meridian codebase already has ReservationWidgetCustom,
           ReservationWidgetOpenTable, ReservationWidgetResy.

DO NOT rebuild the reservation widget. EXTEND it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: app/[locale]/reservations/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sections:
1. PageHero: "Reserve Your Table · 预约餐桌"
   - Subline: "Dinner reservations · Party sizes 1–20"
   - Subline ZH: "晚餐预约 · 1至20人"

2. ReservationWidget (reuse appropriate variant from intake.reservations.provider)
   No changes to widget logic.
   Add bilingual labels above widget: "Select Date & Time · 选择日期和时间"

3. SpecialOccasionPrompt (NEW — small callout card below widget):
   - Background: var(--color-secondary) at 10% opacity
   - Text: "Planning for 20+ guests or a special occasion?"
   - Text ZH: "20人以上或特殊活动？"
   - CTA: "Inquire About Private Dining →" href: /private-dining
   - CTA ZH: "咨询私宴预约 →"

4. HoursDisplay: show full weekly hours with bilingual header
   "When We're Open · 营业时间"
   Plus: dim sum hours callout if enabled: "Dim Sum served daily 10am–3pm · 点心每日上午10时至下午3时"

5. ImportantNotes section (FAQ-mini, 3-4 items):
   - Cancellation policy
   - Large party (20+) → call or private dining
   - Festival reservations → link to festival page
   - Parking info (parkingNote from site.json)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/reservations.json:
- Widget provider dropdown: custom | opentable | resy
- OpenTable/Resy ID text inputs
- Max party size for custom widget
- SpecialOccasionPrompt: toggle enable/disable, CTA label EN+ZH
- ImportantNotes: array of { heading, headingZh, body, bodyZh }
```

**Done-Gate 1F:**
- Reservation widget renders correctly (custom or OT/Resy based on site config)
- SpecialOccasionPrompt callout appears below widget
- Hours display shows full week in bilingual format
- `/zh/reservations` renders with ZH labels
- All sections editable in admin

---

## Prompt 1G — Contact Page

**Goal:** Contact page with WeChat QR, bilingual hours, parking info, and map.

```
You are building BAAM System F — Chinese Restaurant Premium.

File: app/[locale]/contact/page.tsx

Sections:
1. PageHero: "Find Us · 联系我们"

2. ContactInfoGrid (2 columns desktop, 1 mobile):
   Left column:
   - Phone: large, clickable tel: link, "Call us · 致电"
   - Email: link, "Email us · 发送邮件"
   - Address: formatted, Google Maps link
   - Parking: site.json.parkingNote (EN) + parkingNoteZh (ZH)

   Right column (NEW — WeChat):
   WeChatQR component:
   File: components/ui/WeChatQR.tsx
   - Props: { qrUrl: string; accountName: string }
   - If qrUrl empty: show placeholder with "WeChat QR Coming Soon"
   - Border: 2px solid var(--border), padding: 0.5rem
   - Caption below: "Scan to follow us on WeChat · 扫码关注我们的微信"
   - Account name: var(--font-body-zh), bold

3. HoursDisplay: full week with bilingual header
   - "Hours · 营业时间"
   - Dim sum hours sub-note in smaller text
   - Weekend brunch hours if enabled

4. MapEmbed (reuse existing): Google Maps iframe for restaurant address

5. ContactForm (reuse existing):
   Add field: "WeChat ID (optional) · 微信号（选填）"
   This maps to contact_submissions with an extra weChat field in data jsonb.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact page content managed via site.json (phone, address, hours, WeChat).
All fields already added in 1A admin extension.
Just verify Content Editor surfaces them correctly.
```

**Done-Gate 1G:**
- Contact page shows WeChat QR placeholder (or real QR if URL set)
- Phone is a clickable `tel:` link
- Parking note shows EN + ZH
- Hours display is bilingual
- Map embed works
- Contact form has WeChat ID optional field
- `/zh/contact` renders fully in Chinese

---

## Prompt 1H — i18n Routing: EN + ZH Full Verification Pass

**Goal:** Verify all Phase 1 pages work in both locales. Fix any ZH rendering issues, font fallbacks, or missing translations.

```
You are building BAAM System F — Chinese Restaurant Premium.

Perform a complete i18n verification pass on all Phase 1 pages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Verify locale routing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All these routes must return HTTP 200 (no 404, no redirect loop):
EN routes:
- /en/ (or / which redirects to /en/)
- /en/menu, /en/menu/dim-sum, /en/menu/dinner, /en/menu/chef-signatures
- /en/about, /en/reservations, /en/contact

ZH routes:
- /zh/
- /zh/menu, /zh/menu/dim-sum, /zh/menu/dinner, /zh/menu/chef-signatures
- /zh/about, /zh/reservations, /zh/contact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — ZH content verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On /zh/menu/dim-sum:
- Verify menu items show ONLY name_zh (no English name in ZH locale)
- Verify Noto Serif SC font is loaded (check Network tab — fonts/noto-serif-sc)
- Verify sub-category nav shows: 蒸点 | 烤点 | 炸点 | 粥面 | 甜点

On /zh/ (home):
- Hero shows taglineZh
- ChefHeroFull shows nameZh, titleZh, credentials in ZH
- Testimonials shows ZH testimonials first

On /zh/about:
- Story shows ZH paragraphs (tabbed or side-by-side depending on config)
- Stats bar labels in ZH
- Team member name_zh shows if set

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Hreflang tags
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add hreflang to all pages:
<link rel="alternate" hreflang="en" href="https://grandpavilionny.com/en/[path]" />
<link rel="alternate" hreflang="zh-Hans" href="https://grandpavilionny.com/zh/[path]" />
<link rel="alternate" hreflang="x-default" href="https://grandpavilionny.com/en/[path]" />

This should be generated in the page metadata (generateMetadata) function.
Use NEXT_PUBLIC_SITE_URL env var as the base URL.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Language switcher
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The existing LanguageSwitcher must:
- Show: EN | 中文 (only enabled locales from site config)
- Switching EN → ZH: keeps same path, changes locale prefix
- Currently active locale: bold or underline indicator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Font rendering audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In browser dev tools on any page with ZH content:
- Open Elements tab → find a Chinese text node
- Computed styles → font-family should show "Noto Serif SC" or "Noto Sans SC"
- NOT "SimSun", NOT "system-ui" only

If wrong: fix font-family declaration in CSS so ZH font is applied via:
  .zh-text, [lang="zh"] { font-family: var(--font-body-zh), sans-serif; }
  h1, h2 in ZH: var(--font-display-zh), serif

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — LanguageSwitcher in mobile nav
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify the mobile hamburger menu includes:
- Navigation links in current locale
- Language switcher (EN | 中文) at bottom of mobile menu panel
```

**Done-Gate 1H (= Phase 1 Complete Gate):**
- All 14 routes return 200 (7 EN + 7 ZH)
- `/zh/menu/dim-sum` shows ONLY Chinese characters for dish names
- Noto Serif SC confirmed loaded in Network tab
- Hreflang tags present on all pages
- Language switcher works in both header and mobile nav
- Admin: BUILD → WIRE → VERIFY passed for all 7 pages
- Lighthouse ≥ 90 on home page
- `git tag v0.1-core-pages`
