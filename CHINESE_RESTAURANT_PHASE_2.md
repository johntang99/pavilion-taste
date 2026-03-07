# BAAM System F — Chinese Restaurant Premium
# Phase 2: Industry Modules — Festival Pages, Dim Sum Cart, Private Dining, Catering, Gallery, Blog, Events

> **System:** BAAM System F — Chinese Restaurant Premium
> **Reference files:** `@RESTAURANT_CHINESE_COMPLETE_PLAN.md` + `@CHINESE_RESTAURANT_CONTENT_CONTRACTS.md` + `@CHINESE_RESTAURANT_PHASE_1.md`
> **Prerequisite:** Phase 1 gate fully passed. `v0.1-core-pages` tagged.
> **Method:** One Cursor prompt per session. BUILD → WIRE → VERIFY each module.
> **Rule:** A module is only "done" when all three steps pass. Never skip a done-gate.

---

## Phase 2 Overview

**Duration:** Week 3
**Goal:** Build all Chinese-restaurant-specific industry modules and remaining content pages. This is where the competitive differentiation lives — festival pages, dim sum cart, and bilingual banquet system.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 2A | Festival Pages — FestivalPage Component | CNY + Mid-Autumn pages, date-range activation | 120 min |
| 2B | Private Dining + Banquet Packages | High-ticket conversion pages | 90 min |
| 2C | Catering Page + Inquiry Form | Off-premise catering | 60 min |
| 2D | Dim Sum Cart Section | Pre-order intent capture feature | 90 min |
| 2E | Gallery — Full Masonry with Chinese Categories | Full gallery page | 60 min |
| 2F | Blog System — Cuisine Stories | Blog hub + posts | 45 min |
| 2G | Events Page — Festival Events + Chef's Table | Events hub | 45 min |
| 2H | Supporting Pages | FAQ, Gift Cards, Careers, Press, Order Online | 60 min |
| 2I | Collection Admin Editors | Menu, Festival, Banquet, Gallery admin editors | 90 min |
| 2J | Form Submissions → DB + Email | All 4 forms wired end-to-end | 60 min |
| 2K | Responsive Polish Pass | Mobile layout for all new pages | 45 min |

---

## Prompt 2A — Festival Pages: FestivalPage Component + CNY + Mid-Autumn

**Goal:** Build the reusable FestivalPage layout and implement two festival pages. Festival pages auto-activate based on `activeDateStart/End` in the festivals DB table. Admin can edit dates without a deploy.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A3.3 Festival Pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Dynamic Festival Route
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: app/[locale]/festivals/[slug]/page.tsx

generateStaticParams():
- Query festivals table WHERE published = true
- Return [{ slug: 'chinese-new-year' }, { slug: 'mid-autumn' }]
- ISR revalidate: 3600 (hourly — allows date changes to propagate)

Page data loading:
const festival = await getFestivalBySlug(siteId, params.slug)
const prixFixeItems = await getFestivalMenuItems(festival.id)
const activeFestival = await getActiveFestival(siteId)  // for urgency display
if (!festival || !festival.published) notFound()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — FestivalPage Component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/sections/FestivalPage.tsx

This is a layout orchestrator — not a single visual component.
It assembles the following sub-sections using existing + new components.

SECTION ORDER:

1. FestivalHero:
   - Full-screen background image (festival.heroImage)
   - InkWashOverlay (var(--ink-overlay-color), opacity from --ink-overlay-opacity)
   - BilinguaHeroHeadline: festival.name + festival.nameZh
   - Subline: festival.tagline + festival.taglineZh (stacked)
   - Date range display: "January 28 – February 14, 2027" (formatted from activeDateStart/End)
   - Background decoration: paper-cut pattern SVG border at bottom edge

2. FestivalUrgencyBar (only if festival is currently active AND urgency.enabled):
   - Sticky bar at top (below main header)
   - Background: var(--festival-accent)
   - Text: festival.urgencyMessage with {count} replaced by festival.urgencyCount
   - ZH version: festival.urgencyMessage_zh
   - CTA button: "Reserve Now · 立即预约" → /reservations
   - Pulse animation on the urgency count number

3. FestivalStory:
   - 2-column: decorative element left, story text right (desktop)
   - 1-column stacked (mobile)
   - Title: "The Meaning of {festivalName}" + ZH title
   - Body: festival.description (EN) + festival.descriptionZh (ZH)
   - Toggle tabs if both exist: "English · 中文"
   - Decorative left: SVG paper-cut element (lunar motif for CNY, lotus for Mid-Autumn)

4. PrixFixeSection (only if prixFixeEnabled = true):
   - Heading: "Special Festival Menu · 节日特别套餐"
   - One card per tier in prixFixeItems:
     Each card:
     - Tier name (EN + ZH)
     - Price per person: "$88 per person · 每位$88"
     - Minimum guests: "Minimum 4 guests · 最少4位"
     - Courses list: dish name EN + ZH on each line
     - CTA: "Reserve This Menu · 预约此套餐"

5. FestivalCountdown (only if festival is NOT yet active — it's upcoming):
   File: components/ui/FestivalCountdown.tsx
   - Client component with useEffect interval
   - Shows: days / hours / minutes until activeDateStart
   - Heading: "Accepting Reservations · {festivalName} begins in:"
   - Stop showing once festival is active (show urgency bar instead)

6. ReservationsCTA:
   - Full-width CTA band
   - "Reserve Your Table · 预约您的餐桌"
   - Sub-text: "Seating is limited — book early to avoid disappointment"
   - Sub-text ZH: "座位有限，建议提早预约"
   - CTA → /reservations

7. FestivalGiftBoxes section (only if giftBoxesEnabled = true):
   - Simple product-style grid
   - Each gift box: image, name (EN + ZH), price, "Order by [date]"
   - CTA: call to order (not e-commerce checkout)
   - Used for mooncake boxes, tea gift sets, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Paper-Cut Decoration Component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: components/ui/ChinesePaperCutDecoration.tsx

SVG-based decorative divider with Chinese paper-cut aesthetic.
Props:
- motif: 'floral' | 'geometric' | 'lunar' | 'phoenix' | 'minimal'
- color: defaults to var(--paper-cut-color)
- height: number (px), default 32
- width: '100%' | number

Implementation: Inline SVG patterns. The 'minimal' motif = a simple
repeating diamond/lattice pattern that looks traditional without being
culturally specific.

Use case: section dividers, festival hero bottom edge, chef signature section borders.
Rule: Use sparingly — one per page section maximum.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — FestivalHighlightSection (revisit — Section mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now that festivals are built, update FestivalHighlightSection on the home page:
- When an active festival exists: switch from fallback message to real festival data
- Show: festival nameZh (large), tagline, "Only {count} tables remaining" urgency
- Background: blurred festival heroImage at 20% opacity
- CTA → /festivals/{festival.slug}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Festival Admin Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

New admin page: app/admin/(dashboard)/festivals/page.tsx

List of festivals with: name, nameZh, dateRange, published toggle, edit link

Festival edit form:
- Name (EN) + Name (ZH) text inputs
- Active Date Start + End (date pickers)
- Hero Image (media picker)
- Tagline (EN + ZH)
- Description textarea (EN + ZH)
- Urgency: toggle, message (EN + ZH), count number input
- Prix fixe toggle + tier editor (add/remove tiers, courses)
- Gift boxes toggle
- Published toggle

Admin sidebar: add "Festivals" under site-scoped menu (between Events and Blog).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — AnnouncementBar festival automation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update the AnnouncementBar in layout (server component):
- Call getActiveFestival(siteId) at render time
- If active festival: override announcement with festival urgency message
- Background color: var(--festival-accent)
- Message interpolation: replace {count} with festival.urgencyCount
- If locale is zh: use urgencyMessage_zh (add this column to festivals table)

Add urgency_message_zh text column to festivals table if not present:
ALTER TABLE festivals ADD COLUMN IF NOT EXISTS urgency_message_zh text DEFAULT NULL;
```

**Done-Gate 2A:**
- `/en/festivals/chinese-new-year` renders FestivalPage with all sections
- `/zh/festivals/chinese-new-year` renders with ZH content
- FestivalCountdown shows days remaining (if CNY is not currently active)
- FestivalUrgencyBar shows when today is within date range
- AnnouncementBar auto-shows festival message when festival is active
- FestivalHighlightSection on home page shows live festival data
- Admin Festivals editor: create, edit, publish/unpublish festivals
- Paper-cut SVG divider renders as decorative border

---

## Prompt 2B — Private Dining + Banquet Packages

**Goal:** Full private dining page with BanquetPackageCards and enhanced inquiry form. High-ticket conversion page.

```
You are building BAAM System F — Chinese Restaurant Premium.
The Meridian codebase has an existing private-dining page. EXTEND it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: app/[locale]/private-dining/page.tsx (extend existing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add these sections to the existing private dining page:

NEW SECTION 1 — BanquetPackageCards
File: components/sections/BanquetPackageCards.tsx

Reads from: banquet_packages table WHERE active = true ORDER BY display_order

Each package card shows:
┌─────────────────────────────────────────────┐
│  [IMAGE — dining room photo]                │
│  WEDDING BANQUET         → tier badge       │
│  婚宴套餐                                    │  ← nameZh, Noto Serif SC 700
│                                             │
│  $128 per person · min. 50 guests           │
│  Up to 500 guests                           │
│                                             │
│  ✓ 10-course wedding banquet                │
│  ✓ Whole roasted suckling pig               │  ← includes list, bullet icons
│  ✓ Dedicated event coordinator              │
│  ✓ Free venue decoration                    │
│                                             │
│  [Inquire About This Package]               │
└─────────────────────────────────────────────┘

Layout: desktop 3-column grid, mobile single column.
On "Inquire" click: scroll to inquiry form + pre-fill tier in hidden field.

NEW SECTION 2 — Capacity Gallery
Show the 3 room options in a masonry or horizontal scroll:
Each room: image + name (EN + ZH) + capacity number + "Perfect for: ..."
Data from pages/private-dining.json capacityDisplay.rooms

NEW SECTION 3 — Enhanced Private Dining Inquiry Form
Extend existing PrivateDiningForm with Chinese restaurant fields:

Current fields (from Meridian): name, email, phone, date, party_size, occasion, message

ADD:
- "Event Type · 活动类型" dropdown:
  Birthday 生日宴 | Anniversary 周年纪念 | Wedding 婚礼 | Corporate 商务 | Other 其他
- "Cuisine Preferences · 餐饮偏好" text input:
  placeholder: "Any dietary restrictions or cuisine preferences? (e.g. seafood feast, vegetarian options)"
- "Budget per Person · 人均预算" select:
  Under $50 | $50–$80 | $80–$120 | $120+ | Flexible
- "Selected Package" hidden input (pre-filled from package card CTA)
- Form submits to: private_dining_inquiries table + email alert

FORM DATA SUBMISSION:
POST /api/contact/private-dining (existing route from Meridian — extend)
Add new fields to the private_dining_inquiries table:
ALTER TABLE private_dining_inquiries
  ADD COLUMN IF NOT EXISTS event_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cuisine_preferences text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS budget_range text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS selected_package text DEFAULT NULL;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin Banquet Packages editor: app/admin/(dashboard)/banquet-packages/page.tsx (NEW)
- List packages with tier, name, nameZh, price, min/max guests
- Edit form: all fields from BanquetPackage interface
- Includes list: add/remove items (EN + ZH per item)

Content Editor for pages/private-dining.json:
- Room gallery: add/edit/remove rooms with image picker
- Page copy: title, subtitle (EN + ZH), intro text

Add Banquet Packages to admin sidebar under site-scoped menu.
```

**Done-Gate 2B:**
- Private dining page shows BanquetPackageCards (3 tiers)
- Wedding Banquet card shows nameZh "婚宴套餐" in Noto Serif SC 700
- Clicking "Inquire About This Package" scrolls to form + pre-fills tier
- Form submits → private_dining_inquiries table row created + email sent to ALERT_TO
- Admin banquet packages editor: CRUD works
- `/zh/private-dining` fully in Chinese

---

## Prompt 2C — Catering Page + Inquiry Form

```
You are building BAAM System F — Chinese Restaurant Premium.

File: app/[locale]/catering/page.tsx (NEW page — not in Meridian)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE SECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PageHero: "Authentic Chinese Catering · 正宗中式餐饮服务"
   Image: /uploads/grand-pavilion/banquet/catering-hero.jpg
   Subline: "We bring the flavors of Grand Pavilion to your event"

2. OverviewSection:
   - EN + ZH text (2 paragraphs)
   - Key details in icon + text pairs:
     📍 "Service area: 50 miles from Flushing"
     👥 "Minimum 30 guests"
     📅 "14 days advance notice required"
     🍽️ "Full kitchen & serving staff included"

3. ServiceTypeCards (4 cards):
   Corporate Events 企业活动 | Wedding Banquet 婚宴 | Birthday Celebration 生日宴 | Holiday Party 节日聚会
   Each card: icon, name (EN + ZH), 1-line description

4. CateringGallery:
   Reuse GalleryMasonry with 6 catering/event photos from gallery (category: 'events')

5. CateringInquiryForm:
   Fields: name, email, phone, event_date, guest_count, event_type (dropdown),
           service_area (text, e.g. "Brooklyn, NY"),
           cuisine_preferences (text),
           budget_range (select),
           message (textarea)
   Submit → catering_inquiries table + email to ALERT_TO
   Confirmation message: "Thank you! We'll contact you within 24 hours."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Editor for pages/catering.json:
- Overview text EN + ZH
- Minimum guests, service radius, lead time (from JSON — not DB)
- Service type cards: name, nameZh, icon, description per type

Inquiries visible in admin at admin/inquiries/ (extend existing contact view to include
catering_inquiries with type label "Catering").
```

**Done-Gate 2C:**
- Catering page renders with 4 service type cards
- Catering form submits → DB row + email notification
- `/zh/catering` renders in Chinese
- Admin: catering page content editable

---

## Prompt 2D — Dim Sum Cart Section

**Goal:** Build the DimSumCartSection — a visual pre-order intent capture for dim sum. NOT a full e-commerce checkout. Visitors "tap to select" dim sum items and submit a basket summary via email for next-day or weekend pickup coordination.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A4 DimSumCartSection

This is a novelty/conversion feature on the Dim Sum menu page (/menu/dim-sum).
It appears as a section BELOW the full dim sum menu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT: DimSumCartSection
File: components/menu/DimSumCartSection.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a CLIENT component (user interactions).

Toggle controlled by: site.json features.dim_sum_cart (boolean)
If false: don't render the section at all.

VISUAL STRUCTURE:

Heading: "Pre-Order Dim Sum · 预订点心"
Subheading: "Build your basket and we'll have it ready at the table"
ZH subheading: "提前选好您的点心，我们将为您准备妥当"

Small disclaimer: "Pre-order is a courtesy service — subject to availability.
Our team will confirm your order by phone."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ITEM GRID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Shows only featured dim sum items (featured=true from menu_items WHERE is_dim_sum=true).
Limit to 12 items in the cart grid (not all 40+).

Each item in grid:
┌──────────────┐
│   [IMAGE]    │
│   虾饺        │  ← name_zh
│   Har Gow    │  ← name.en, smaller
│   $5.80      │
│              │
│  [─] 0 [+]  │  ← quantity selector
└──────────────┘

State management: useState for basket = { [itemId]: quantity }
When quantity > 0: item card gets var(--color-secondary) border highlight

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BASKET SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sticky bottom bar (appears when basket has items):
- "Your Basket: {N} items · 您的篮子: {N}项" + estimated total
- [Submit Pre-Order] button

On submit: open a modal with:
- Basket item list (name_zh + nameEn + qty)
- Fields: name, phone, pickup_date (date picker), pickup_time (time select: 10:00-15:00 in 30min intervals)
- Notes textarea
- [Confirm Pre-Order] button

On confirm:
- POST /api/dim-sum-order
- Server route: creates dim_sum_orders row, sends email to CONTACT_FALLBACK_TO
  with item list, pickup time, customer name + phone
- Show confirmation: "Thank you! We'll call to confirm your order · 谢谢！我们将致电确认您的订单"

API Route: app/api/dim-sum-order/route.ts
  POST: parse body, validate (name, phone, items non-empty, date/time),
  insert into dim_sum_orders, send Resend email

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLACEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add DimSumCartSection at the bottom of app/[locale]/menu/dim-sum/page.tsx.
Only render if features.dim_sum_cart === true from site config.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In admin site settings:
- "Dim Sum Pre-Order" toggle (features.dim_sum_cart)
- "Pre-Order Contact Email" text input → maps to CONTACT_FALLBACK_TO

Admin view of pre-orders: extend admin/inquiries/ or create
admin/dim-sum-orders/ page showing all dim_sum_orders with status toggle.
```

**Done-Gate 2D:**
- DimSumCartSection appears on /menu/dim-sum (when feature enabled)
- Items show name_zh + name.en
- Quantity selector works (0 → 3 per item)
- Basket sticky bar appears when items selected
- Modal opens on "Submit Pre-Order"
- On confirm: dim_sum_orders row created + email sent
- Admin: toggle for dim_sum_cart feature works

---

## Prompt 2E — Gallery: Full Masonry with Chinese Categories

```
You are building BAAM System F — Chinese Restaurant Premium.
The Meridian codebase has GalleryMasonry, GalleryCategoryFilter, and Lightbox.
EXTEND with Chinese-specific categories. No rebuild.

File: app/[locale]/gallery/page.tsx (extend existing)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chinese Gallery Categories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend GalleryCategoryFilter with these categories for Chinese restaurant:
- all (All Photos · 全部)
- food (Signature Dishes · 招牌菜肴)
- dim-sum (Dim Sum · 点心)
- dining-room (Dining Room · 用餐环境)
- events (Events & Banquets · 活动宴会)
- festivals (Festival Celebrations · 节日庆典)
- chef (Chef at Work · 厨师工作)

Category stored in gallery_items.category (existing text field).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bilingual Captions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gallery_items.alt is already jsonb: { en: string; zh?: string }
gallery_items.caption is already jsonb: { en?: string; zh?: string }

In Lightbox component:
- Show caption in current locale
- If locale=zh and caption.zh exists: show caption.zh
- If locale=zh and no caption.zh: show caption.en (fallback)
- Caption font: var(--font-body-zh) when locale=zh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin Gallery Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Existing Meridian admin/gallery/ — extend category dropdown with new Chinese categories.
Add "Caption (ZH)" text input alongside existing "Caption (EN)".
```

**Done-Gate 2E:**
- Gallery page shows Chinese category filter tabs
- All 7 categories filter correctly
- Lightbox shows ZH caption when locale=zh
- Admin gallery editor has ZH caption field + Chinese category options

---

## Prompt 2F — Blog System + 2G Events + 2H Supporting Pages

```
You are building BAAM System F — Chinese Restaurant Premium.

These use Meridian's existing systems with minor Chinese-specific additions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2F — BLOG SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse Meridian blog system entirely. No structural changes.

Chinese restaurant blog categories (add to blog config):
- cuisine-stories (Cuisine Stories · 美食故事)
- seasonal (Seasonal Specials · 时令推荐)
- chef-notes (Chef's Notes · 厨师日记)
- events (Events & Festivals · 活动节日)

Seed 5 blog posts:
1. "The Art of Dim Sum: A Morning Tradition" / "点心的艺术：清晨的传统"
2. "Peking Duck: The 3-Day Process Behind the Perfect Skin" / "北京烤鸭：三天的炙烤工艺"
3. "Celebrating Chinese New Year the Traditional Way" / "传统方式庆祝农历新年"
4. "From Hong Kong to Flushing: Chef Li Wei's Journey" / "从香港到法拉盛：厨师长李伟的故事"
5. "Understanding Pu-erh Tea: The Sommelier of the Tea World" / "了解普洱茶：茶世界的侍酒师"

Each post: title (EN + ZH), excerpt (EN + ZH), body (EN — ZH optional), author, date, image, category.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2G — EVENTS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reuse Meridian events system. Add Chinese event types:
- cny-dinner (Chinese New Year Dinner)
- mid-autumn-celebration (Mid-Autumn Festival Night)
- chefs-table (Chef's Table)
- wine-tea-pairing (Wine & Tea Pairing Evening)
- cooking-class (Dim Sum Making Class)

Seed 3 events:
1. "Chinese New Year Celebration Dinner" — Feb 2, 2027, $88/person, reservation required
2. "Mid-Autumn Festival Night" — Sept 25, 2026, $65/person, reservation required
3. "Dim Sum Making Class with Chef Li Wei" — Saturdays, $45/person, max 12 guests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2H — SUPPORTING PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build or adapt these pages from Meridian's existing templates:

FAQ: /[locale]/faq
25 FAQ items covering:
- Reservations (5 items) — "Do you accept walk-ins?", "Can I book for CNY?"
- Dim Sum (5 items) — "Until what time is dim sum served?", "How does ordering work?"
- Menu & Dietary (5 items) — "Do you have vegetarian options?", "Is anything halal certified?"
- Private Dining (4 items) — "What is the minimum guest count?", "Do you do weddings?"
- Practical (4 items) — "Where do I park?", "Do you have a kids menu?", "What is the dress code?"
- Payment (2 items) — "Do you accept credit cards?", "What is your cancellation policy?"

Order Online: /[locale]/order-online
- Redirect page: links out to DoorDash/UberEats/Grubhub (whichever client uses)
- "Order for Pickup" form (simple): name, phone, items notes, pickup date/time
- OR: "Online ordering coming soon — call (718) 555-0188 to order"

Gift Cards: /[locale]/gift-cards
- Reuse Meridian gift cards page
- Add: "Perfect for Chinese New Year gifts · 最佳新年礼物"

Careers: /[locale]/careers (simple, reuse Meridian template)
Press: /[locale]/press (simple, reuse Meridian template)
Privacy + Terms: standard pages, reuse Meridian

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN WIRING for 2F/2G/2H
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Blog: admin/blog-posts/ (existing Meridian editor — add ZH title/excerpt fields)
Events: admin/events/ (existing Meridian editor — add Chinese event types)
FAQ: Content Editor for pages/faq.json — add/edit questions with EN + ZH answer support
```

**Done-Gate 2F/2G/2H:**
- Blog shows 5 seeded posts, categories filter correctly
- Events page shows 3 seeded events with RSVP forms
- FAQ renders 25 items with accordion
- All supporting pages return 200 in both locales
- Blog/Events admin editors work (add/edit/delete)

---

## Prompt 2I — Collection Admin Editors

```
You are building BAAM System F — Chinese Restaurant Premium.

Verify or build these admin collection editors.
Most exist in Meridian — extend with Chinese fields.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN EDITORS STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Menu Editor (admin/menu/) — EXTEND:
   - Add name_zh required field (red asterisk, validation)
   - Add dim_sum_category, is_halal, is_kosher, is_chef_signature
   - Add chef note + chef note ZH text areas
   - Add pairing suggestion text input

2. Gallery Editor (admin/gallery/) — EXTEND:
   - Add caption.zh text input
   - Add Chinese category options to category dropdown

3. Team Editor (admin/team/) — EXTEND:
   - Add name_zh, chef_origin, chef_training fields

4. Festival Editor (admin/festivals/) — NEW (built in 2A):
   - Full CRUD for festivals and prix-fixe tiers

5. Banquet Packages Editor (admin/banquet-packages/) — NEW (built in 2B):
   - Full CRUD for banquet tiers

6. Blog Posts Editor (admin/blog-posts/) — EXTEND:
   - Add title_zh, excerpt_zh text inputs
   - Add Chinese category options

7. Events Editor (admin/events/) — EXTEND:
   - Add Chinese event types to event_type dropdown

8. Inquiries View (admin/inquiries/) — EXTEND:
   - Add tabs: Contact | Private Dining | Catering | Dim Sum Orders
   - Show status (new/contacted/closed) with update dropdown

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN SIDEBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update admin sidebar (site-scoped section) to include:
- Menu (existing)
- Festivals (NEW)
- Banquet Packages (NEW)
- Gallery (existing)
- Blog Posts (existing)
- Events (existing)
- Team (existing)
- Press (existing)
- Inquiries (existing + extended)
- Content Editor (existing)
- Site Settings (existing)
```

**Done-Gate 2I:**
- All 8 admin editors work correctly with Chinese fields
- Menu editor: saving item without name_zh shows validation error
- Festival editor: create new festival → appears on /festivals/ route
- Banquet editor: update price → updates on /private-dining page
- Inquiries view: shows all 4 inquiry types in tabs

---

## Prompt 2J — Form Submissions: DB + Email (All Forms)

```
You are building BAAM System F — Chinese Restaurant Premium.

Verify ALL form submissions are wired to DB and email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMS CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Reservation Form (custom widget) → bookings table + confirmation email to guest + alert to admin
2. Private Dining Inquiry → private_dining_inquiries table + alert to admin (ALERT_TO)
3. Catering Inquiry → catering_inquiries table + alert to admin
4. Contact Form → contact_submissions table + alert to admin
5. Dim Sum Pre-Order → dim_sum_orders table + notification email to CONTACT_FALLBACK_TO
6. Festival Reservation → /reservations (same booking flow) with festival noted in special_requests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMAIL TEMPLATES (Resend)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All emails use Resend. Create email templates for:

Reservation Confirmation (to guest):
- Subject: "Reservation Confirmed — {restaurantName} · 预约确认"
- Body: date, time, party size, confirmation code
- Footer: restaurant address, phone, cancellation policy

Admin Alert (to ALERT_TO):
- Subject: "New {type} — {restaurantName}"
- Body: all submitted fields in a readable list
- Include site_id and submission time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR HANDLING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All form API routes must:
- Return 400 with error message if required fields missing
- Return 200 with success JSON after successful DB insert
- Email failure: log error but still return 200 (DB insert succeeded)
- Form shows: success message on 200, error message on 400/500
```

**Done-Gate 2J:**
- Submit each of the 6 forms in browser → verify DB row created in Supabase
- Admin email received at ALERT_TO for private dining + catering + contact
- Guest confirmation email received for reservation
- Dim sum order: email received at CONTACT_FALLBACK_TO
- All forms show success state after submission

---

## Prompt 2K — Responsive Polish Pass

```
You are building BAAM System F — Chinese Restaurant Premium.

Perform a complete mobile responsive review of all Phase 2 pages.
Test at: 375px (iPhone SE), 768px (iPad), 1440px (Desktop).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIORITY FIXES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ChineseMenuItem (dim sum card) at 375px:
- name_zh: should wrap to 2 lines max before truncating with ellipsis
- Price: right-aligned, same row as name_zh or below
- Photo: 80×60px on mobile (reduce from desktop 120×90px)

FestivalPage at 375px:
- Hero: BilinguaHeroHeadline stacks vertically (ZH below EN or above)
- Prix-fixe tier cards: single column
- FestivalUrgencyBar: compact, 2 lines if needed

DimSumCartSection at 375px:
- Item grid: 2 columns (reduce from 3)
- Sticky basket bar: 100% width at bottom, above mobile Safari safe area
- Modal: full-screen on mobile (not centered dialog)

BanquetPackageCards at 375px:
- Single column cards
- "Includes" list: shown/hidden toggle (expand by default if ≤4 items)

ChefSignatureCard at 375px:
- Image full-width (not 50%)
- Text content below image
- Chef note in slightly smaller font

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ZH TEXT OVERFLOW CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chinese text wraps differently from English. Verify:
- No Chinese text overflows its container at 375px
- No orphaned single characters at end of line in headlines
- BilinguaHeroHeadline: both lines fit within 90% viewport width

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DARK VARIANT CHECK (longmen)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Switch to longmen theme and verify:
- White/light text on dark backgrounds — all readable
- Menu item card: dark card background, light text for both ZH and EN names
- Festival page: hero overlay renders correctly on dark backdrop
- No light-on-light or dark-on-dark text combinations
```

**Done-Gate 2K (= Phase 2 Complete Gate):**
- All pages render correctly at 375px / 768px / 1440px
- No text overflow in Chinese content on mobile
- longmen dark theme: all text readable
- ChineseMenuItem cards clean on all 4 variants
- DimSumCartSection modal is full-screen on mobile
- All forms mobile-friendly (inputs large enough, submit button accessible)
- `git tag v0.2-complete-frontend`
