# BAAM System F — Chinese Restaurant Premium
# Phase 5: 12-Month Growth Plan

**Baseline**: restaurant/meridian (fork + extend)
**Demo**: Grand Pavilion 大观楼, Flushing NY
**Purpose**: Post-launch growth playbook — SEO, content, CRM, upsell, analytics

---

## Overview

Phase 5 is an operator's guide, not a Cursor build session. It covers what to do after the site is live and Pipeline B clients are onboarded. The goal is to turn each client site into a compounding asset — traffic, reputation, and revenue — over 12 months.

**Timeline buckets:**
- Month 1–2: Foundation & monitoring
- Month 3–4: Content acceleration
- Month 5–6: Conversion optimization
- Month 7–9: Community & loyalty
- Month 10–12: Scale & system automation

---

## Prompt 5A: Analytics & Monitoring Foundation

### Context
Set up the measurement infrastructure so every growth action is traceable. Install on Grand Pavilion demo first; replicate the config per client via Pipeline B intake.

### Cursor Prompt

```
Set up comprehensive analytics for a Chinese restaurant site (Next.js 14 + Supabase).

## 1. Google Analytics 4 (GA4)

Install @next/third-parties GA4 integration:

// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
    </html>
  )
}

## 2. Custom GA4 Events

Create lib/analytics.ts with typed event helpers:

export const trackEvent = (name: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return
  window.gtag?.('event', name, params)
}

// Chinese restaurant-specific events
export const analytics = {
  reservationStarted: (source: string) =>
    trackEvent('reservation_started', { source }),
  reservationCompleted: (covers: number, type: string) =>
    trackEvent('reservation_completed', { covers, reservation_type: type }),
  dimSumOrderStarted: () =>
    trackEvent('dim_sum_order_started'),
  dimSumOrderCompleted: (items: number, total: number) =>
    trackEvent('dim_sum_order_completed', { items, total }),
  banquetInquirySubmitted: (packageName: string, guestCount: number) =>
    trackEvent('banquet_inquiry_submitted', { package_name: packageName, guest_count: guestCount }),
  festivalPageViewed: (festivalName: string) =>
    trackEvent('festival_page_viewed', { festival_name: festivalName }),
  menuItemViewed: (itemName: string, category: string) =>
    trackEvent('menu_item_viewed', { item_name: itemName, category }),
  cateringInquirySubmitted: () =>
    trackEvent('catering_inquiry_submitted'),
  phoneClicked: (source: string) =>
    trackEvent('phone_click', { source }),
  wechatQrViewed: () =>
    trackEvent('wechat_qr_viewed'),
  directionClicked: () =>
    trackEvent('direction_click'),
  zhLocaleToggled: () =>
    trackEvent('zh_locale_toggled'),
}

## 3. GA4 Conversions (configure in GA4 dashboard)

Mark these events as conversions:
- reservation_completed
- banquet_inquiry_submitted
- catering_inquiry_submitted
- dim_sum_order_completed

## 4. Google Search Console

- Verify domain via DNS TXT record (document in env vars as GSC_VERIFICATION_TOKEN)
- Submit sitemap: https://[domain]/sitemap.xml
- Enable performance reporting for:
  - EN queries (english restaurant keywords)
  - ZH queries (chinese-language search queries)
  - Impressions by page (programmatic dish pages should appear within 60 days)

## 5. Supabase Analytics Dashboard

Create /app/admin/analytics/page.tsx with these panels:

A. Reservation funnel
   - SELECT DATE(created_at), status, COUNT(*) FROM reservations GROUP BY 1, 2

B. Form submissions by type (last 30 days)
   - reservations, banquet_inquiries, catering_inquiries, dim_sum_orders, contact_submissions

C. Top menu items (by page view — log in Supabase from dish page visit)
   - Create table: menu_item_views (item_id, viewed_at, locale)
   - Log view in /app/menu/dish/[slug]/page.tsx on render

D. Festival conversion tracking
   - Reservations with notes mentioning festival name
   - festival_inquiry_submissions (add this column to reservations table)

## 6. Monthly Reporting Template

Create /admin/analytics with auto-generated monthly summary:
- Total reservations vs prior month
- Banquet inquiries vs prior month
- Dim sum orders vs prior month
- Top 5 menu items by page view
- Top 3 organic search queries (pull from GSC API if integrated)
- ZH locale traffic % of total

## Verify

- [ ] GA4 fires on page load (check Realtime in GA4)
- [ ] Custom events fire (test each form + interaction in GA4 Realtime)
- [ ] All 4 conversion events marked in GA4
- [ ] Sitemap submitted in GSC
- [ ] Admin analytics page loads with real data
- [ ] Monthly report renders correctly with last 30 days
```

---

## Prompt 5B: Month 1–2 Content Sprint (SEO Foundation)

### Context
The programmatic dish pages from Phase 3D give dish-level coverage. Now build the pillar content that drives broader traffic: cuisine guides, neighborhood guides, occasion guides.

### Cursor Prompt

```
Create a content template system for Chinese restaurant blog SEO.

## 1. Blog Post Templates

Create 5 reusable blog post templates in /content/templates/:

A. cuisine-guide.mdx
   Purpose: "What is [dish/cuisine]" educational content
   Target keywords: "what is dim sum", "what is har gow", "cantonese cuisine guide"
   Structure:
   - H1: [Dish/Cuisine] Guide: Everything You Need to Know
   - H2: What is [Dish]?
   - H2: History & Origins
   - H2: How It's Made / What to Expect
   - H2: How to Order [at a Chinese restaurant]
   - H2: Best [Dish] in [City]: What to Look For
   - H2: Come Try Ours — CTA to menu/reservation

B. occasion-guide.mdx
   Purpose: "Where to eat for [occasion] in [city]"
   Target keywords: "chinese new year dinner flushing", "dim sum birthday brunch nyc"
   Structure:
   - H1: [Occasion] at a Chinese Restaurant: A Complete Guide
   - H2: Why Chinese Restaurants for [Occasion]
   - H2: What to Expect / How to Plan
   - H2: Menu Recommendations
   - H2: Private Dining Options → link to /private-dining
   - H2: Book Your Table — CTA

C. neighborhood-guide.mdx
   Purpose: "Best Chinese restaurant in [neighborhood]"
   Target keywords: "best chinese restaurant flushing", "cantonese restaurant queens ny"
   Structure:
   - H1: Best Chinese Restaurant in [Neighborhood]: Why [Restaurant Name]
   - H2: About [Neighborhood]'s Chinese Food Scene
   - H2: What Makes [Restaurant Name] Different
   - H2: Signature Dishes
   - H2: Reservations & Location

D. festival-preview.mdx
   Purpose: "What to expect at [festival dinner]"
   Target keywords: "chinese new year dinner 2025 nyc", "lunar new year restaurant menu"
   Structure:
   - H1: [Festival] Dinner at [Restaurant Name] — [Year] Menu Preview
   - H2: About the Festival
   - H2: This Year's Menu (prix fixe preview)
   - H2: Traditions & Meaning
   - H2: Book Now — urgency CTA

E. chef-profile.mdx
   Purpose: Build chef authority for branded search
   Target keywords: "[chef name] flushing", "cantonese chef nyc"
   Structure:
   - H1: Meet Chef [Name]: [Restaurant Name]'s [Title]
   - H2: Training & Background
   - H2: Philosophy
   - H2: Signature Dishes
   - H2: What the Critics Say

## 2. Content Calendar Seed (Month 1–6)

Create /content/calendar.json with 24 planned posts:

Month 1 (Foundation):
- "What Is Dim Sum? A Complete Guide for First-Timers" [cuisine-guide]
- "The History of Har Gow: Hong Kong's Most Iconic Dim Sum" [cuisine-guide]
- "Chinese New Year Dinner in Flushing: What to Expect" [occasion-guide — timing for CNY]

Month 2 (Festival):
- "Our Lunar New Year 2026 Prix Fixe Menu — Preview" [festival-preview]
- "What to Order at a Cantonese Restaurant: The Essential Guide" [cuisine-guide]
- "Private Dining for Chinese New Year: Group Booking Guide" [occasion-guide]

Month 3 (Neighborhood):
- "Best Chinese Restaurant in Flushing: Why [Restaurant Name]" [neighborhood-guide]
- "Dim Sum Brunch in Queens: What to Know Before You Go" [occasion-guide]
- "Meet Chef [Name]: [Restaurant Name]'s Executive Chef" [chef-profile]

Month 4–6: (fill from intake restaurant's city/neighborhood)

## 3. Blog Admin Enhancement

Extend the existing blog admin editor (admin/blog/[id]/page.tsx) to add:

- Template selector dropdown (cuisine-guide | occasion-guide | neighborhood | festival-preview | chef-profile)
- Auto-populate structure when template selected (H2 headings as placeholder blocks)
- SEO preview: estimated character count for title + description
- Target keyword field (stored in blog_posts.target_keyword)
- Internal links panel: suggest linking to /menu, /reservations, /private-dining, /festivals based on body content scan

## 4. Internal Linking System

Create lib/internal-links.ts:

const INTERNAL_LINK_TRIGGERS: Record<string, string> = {
  'dim sum': '/menu?category=dim-sum',
  'private dining': '/private-dining',
  'banquet': '/private-dining',
  'reserve': '/reservations',
  'reservation': '/reservations',
  'catering': '/catering',
  'lunar new year': '/festivals',
  'chinese new year': '/festivals',
  'mid-autumn': '/festivals',
}

export function autoLink(content: string): string {
  // Apply first-occurrence linking (not all occurrences)
  // Skip if already inside an <a> tag
}

## Verify

- [ ] 5 template MDX files created in /content/templates/
- [ ] Blog admin has template selector
- [ ] Auto-populate works when template selected
- [ ] target_keyword column added to blog_posts table
- [ ] Internal link suggestions panel functional
- [ ] Content calendar JSON has 24 planned posts
```

---

## Prompt 5C: Month 3–4 Conversion Rate Optimization

### Context
With traffic coming in, optimize conversion — reservation completions, banquet inquiries, dim sum orders. Focus on the highest-leverage pages.

### Cursor Prompt

```
Implement CRO (Conversion Rate Optimization) improvements for Chinese restaurant site.

## 1. Reservation Page CRO

A. Social Proof Banner
Above the reservation form, add a banner that rotates recent reviews:

interface ReviewSnippet {
  author: string
  text: string
  stars: number
  source: 'google' | 'yelp' | 'tripadvisor'
  date: string
}

// reviews.json seeded with 5 recent snippets from client
// Auto-rotate every 5 seconds
// "★★★★★ [text snippet]... — [Author] via Google"

B. Availability Urgency Indicator
If it's Friday/Saturday after 4pm, show:
"Weekend slots fill fast — book now to secure your table"

Check: new Date().getDay() in [5,6] && new Date().getHours() >= 16

C. Party Size CTA Branching
- 1–4 guests: Standard reservation form (existing)
- 5–9 guests: "Considering a private room? View our banquet packages →" link appears below form
- 10+ guests: Automatically redirect to /private-dining with toast notification

D. After Submission — Thank You Optimization
Replace generic "Reservation received" with:
- Reservation summary card (date, time, covers, name)
- What to expect: "We'll confirm within 2 hours / Arrive 5 minutes early / Valet available"
- Upsell: "Planning something special? Add a cake / wine pairing / festival menu"
- Share: "Invite friends to join" → WhatsApp/iMessage deep link with prefilled text

## 2. Menu Page CRO

A. "Popular This Week" badge
Add a `is_popular` boolean to menu_items.
Admin can toggle. Show "Popular" badge (gold star + text) on up to 8 items.

B. Dim Sum Page — Cart Abandonment Recovery
If user has items in cart and navigates away, show exit-intent prompt:
"Your basket is waiting! Complete your dim sum order →"
(sessionStorage based — doesn't persist across sessions)

C. Chef Signature Page — Reservation CTA per Dish
Below each ChefSignatureCard, add inline CTA:
"Request this dish for your dinner — mention [dish name] in your reservation notes →"
Button → /reservations?note=Please+include+[dish slug]+if+available

D. Festival Page — Countdown + Scarcity
If festival is active (within activeDateStart/activeDateEnd):
- FestivalCountdown: show days/hours/minutes
- Seats remaining indicator: pull from reservations count vs. capacity
  - If >80% booked: "Few seats remaining — book now"
  - If <50% booked: show standard CTA

## 3. Private Dining Page CRO

A. ROI Calculator Widget
Input: # of guests
Output: estimated cost per head for each package

interface PackageCalculator {
  packageId: string
  name: string
  pricePerHead: number
  minGuests: number
  maxGuests: number
}

B. Video Testimonial Card
Add optional video_url field to testimonials table.
If present, show play button overlay on testimonial card.
On click: YouTube/Vimeo embed in modal.

C. Corporate Inquiry Fast Track
Add "Get a custom quote in 24h" CTA at top of page.
Pre-fill form with: event_type=corporate, and show only 4 fields:
name, company, guest_count, preferred_date
→ triggers high-priority email label in Resend

## 4. Contact Page CRO

A. WhatsApp Click-to-Chat (Mobile)
If user agent is mobile AND client has WhatsApp number in intake:
Show "Chat on WhatsApp" button → `https://wa.me/[number]?text=Hello, I'd like to make a reservation`
Track as whatsapp_click event in GA4

B. WeChat Deep Link (if client has WeChat ID)
"Add us on WeChat" → wechat:// deep link
Fallback: show WeChatQR modal on desktop

## 5. A/B Test Framework (Simple)

Create lib/ab-test.ts:

type Variant = 'A' | 'B'

export function getVariant(testName: string): Variant {
  if (typeof window === 'undefined') return 'A'
  const stored = localStorage.getItem(`ab_${testName}`)
  if (stored === 'A' || stored === 'B') return stored
  const variant: Variant = Math.random() < 0.5 ? 'A' : 'B'
  localStorage.setItem(`ab_${testName}`, variant)
  return variant
}

// Usage: getVariant('reservation-cta') → 'A' | 'B'
// Track variant in GA4 event params: { variant: 'A' }

Implement 2 active A/B tests:
1. Hero CTA: "Reserve a Table" (A) vs "Book Your Experience" (B)
2. Reservation form header: "Make a Reservation" (A) vs "Secure Your Table" (B)

## Verify

- [ ] Social proof rotates on reservation page
- [ ] Party size branching works at 10+ guests
- [ ] Post-submission upsell shows on reservation thank you
- [ ] is_popular badge appears on menu items (toggle in admin)
- [ ] Festival countdown shows on active festival pages
- [ ] Banquet package calculator renders correct per-head cost
- [ ] WhatsApp button shows on mobile (use DevTools mobile UA)
- [ ] A/B test variants persist across page reloads (localStorage)
- [ ] GA4 receives variant param on CTA click events
```

---

## Prompt 5D: Month 5–6 Reputation & Reviews

### Context
Chinese restaurants live and die by Yelp, Google, and (for ZH-speaking communities) WeChat word-of-mouth. Automate the ask.

### Cursor Prompt

```
Implement a review generation system for Chinese restaurant site.

## 1. Post-Reservation Email Sequence (Resend)

After a reservation is marked 'completed' in admin, trigger a 2-email sequence:

Email 1: Same day (evening after reservation)
Subject: "Thank you for dining with us at [Restaurant Name]!"
Body:
- Thank you message
- Personalized: "We hope you enjoyed [party_size] guests celebrating with us"
- If special_occasion noted: "Hope your [birthday/anniversary] was memorable"
- Subtle CTA: "Loved it? Share your experience →" [Google Review link] [Yelp link]

Email 2: 3 days later (if no review click detected — use tracking pixel)
Subject: "A quick note from [Chef Name] at [Restaurant Name]"
Body:
- Personal tone, signed by chef
- "Your feedback helps us improve"
- "30 seconds" framing
- [Leave a Google Review] primary button
- [Yelp] [TripAdvisor] secondary links

## Implementation

A. Add to reservations table:
   - review_email_1_sent_at timestamp
   - review_email_2_sent_at timestamp
   - review_clicked_at timestamp (webhook from Resend click tracking)

B. Create /api/review-sequence/trigger route:
   POST { reservation_id }
   - Marks reservation as completed
   - Sends Email 1 via Resend
   - Schedules Email 2 for 3 days later using Vercel Cron or Supabase pg_cron

C. Add "Mark Complete" button to admin/reservations table
   - Triggers review sequence
   - Shows "Review emails sent" status in admin

D. Create Resend email template for each email
   - Match brand colors (use theme variant)
   - Include restaurant logo
   - Mobile-optimized (60%+ of opens are mobile)

## 2. Google Review Link Generator

Create /admin/settings/review-links page:

Input: Google Place ID (admin pastes from Google Business Profile)
Output:
- Direct review link: https://g.page/r/[PLACE_ID]/review
- Short link suggestion (recommend Bitly or similar)
- QR code image (generate with qrcode npm package)
- "Copy link" button
- "Download QR" button (PNG for print use)

The QR code gets printed on:
- Table cards
- Receipt footer
- Thank you cards (for special occasion bookings)

## 3. ZH Community Review Management

Chinese-speaking customers often review on:
- 大众点评 (Dianping)
- 小红书 (Little Red Book / Xiaohongshu)
- WeChat Moments (referral-based)

Admin reminder section in /admin/settings/review-links:
- List of Chinese review platforms with links
- "Copy restaurant intro for WeChat" → textarea with pre-written ZH promo text
- QR codes for each platform

## 4. Testimonials Import from Google

Create /admin/testimonials/import page:

Manual flow (no API key required):
1. Admin pastes JSON export from Google Business (exported manually)
2. Parser extracts: author, rating, text, date
3. Preview grid: select which to import
4. Selected reviews inserted into testimonials table
5. Set is_featured=true on best ones → appear in homepage testimonial section

## 5. Review Badge on Website

Once 50+ Google reviews at 4.5+:

Create components/ReviewBadge.tsx:
- Shows: "★ [rating] · [count] Google reviews"
- Links to Google listing
- Optional: "Best Chinese Restaurant in [City]" if client has award/recognition
- Position: footer and contact page

Fetch rating from:
- Admin-maintained field in site.json: { "google_rating": 4.8, "google_review_count": 127 }
- Admin updates quarterly in /admin/settings

## Verify

- [ ] "Mark Complete" button in reservation admin triggers email sequence
- [ ] Email 1 sends with correct personalization (name, party_size, occasion)
- [ ] Email 2 sends 3 days later if review_clicked_at is null
- [ ] Google Place ID → QR code generates and downloads
- [ ] ZH platform links section visible in admin
- [ ] Testimonials import page parses pasted JSON
- [ ] ReviewBadge renders in footer with correct rating/count
```

---

## Prompt 5E: Month 7–9 Loyalty & Community

### Context
Chinese restaurant regulars are high-LTV customers — they return for dim sum weekly, bring family for occasions, and refer heavily within their community. Build simple loyalty mechanics without a full loyalty app.

### Cursor Prompt

```
Implement a lightweight loyalty and community system for Chinese restaurant site.

## 1. VIP Reservation Tier

Add guest_tier to reservations table:
- 'standard' (default)
- 'preferred' (3+ visits)
- 'vip' (8+ visits or manual admin upgrade)

Track visits:
- Create customer_visits table: { email, name, phone, visit_count, last_visit_date, tier, notes }
- On reservation completion, upsert by email: increment visit_count, update last_visit_date
- Auto-upgrade tier at thresholds

Admin view at /admin/customers:
- Table: email, name, visit_count, tier, last_visit, total_spend (if linked to orders)
- Filter by tier
- Manual tier override
- "Send VIP offer" button → triggers custom email

## 2. VIP Email Offers

Create email template: vip-offer.html

Trigger conditions (admin can set in /admin/settings/loyalty):
- Auto-send to preferred tier on their 3rd visit thank-you email
- Auto-send to VIP tier before major festivals (7 days before CNY, Mid-Autumn)
- Manual send from admin customer view

VIP offer examples:
- "Complimentary dessert platter on your next visit" (show code in email)
- "Priority access to our [Festival] prix fixe before public release"
- "Chef's table invitation — one table per night, 8 guests"

## 3. Birthday Program

Add birthday_month, birthday_day to customer_visits table.

Prompt on reservation form:
"Optional: Share your birthday month for a special surprise" [month selector only — no day for privacy]

Monthly Cron (1st of each month):
- Query customers where birthday_month = current_month AND tier != 'standard'
- Send birthday email with offer code
- Log in customer_visits.last_birthday_email_sent_at

Birthday email:
- "Happy [Month] Birthday from [Restaurant Name]!"
- Offer: complimentary dessert or wine
- "Reserve your birthday dinner → /reservations?occasion=Birthday"

## 4. WeChat Official Account Integration (optional)

If client has WeChat Official Account (公众号):

Create /admin/wechat page with:
- QR code for Official Account (admin uploads)
- Post templates (5 reusable ZH templates):
  1. Festival announcement
  2. New menu item announcement
  3. Event promotion
  4. Weekly specials
  5. Chef note
- Each template has fillable fields (date, dish name, price)
- "Copy to WeChat" → opens clipboard with formatted text + image placeholder note

## 5. Private Events Calendar (Public View)

Create /events/private-calendar page listing:
- Upcoming availability for private dining rooms (not booked dates)
- Purpose: attract "we need a venue for [date]" searches

Admin-maintained in /admin/events/private-availability:
- Simple calendar grid
- Toggle date as "available" or "booked" (no details shown publicly)
- Public page shows: "Room available [date] for groups of [min]–[max] guests"
- CTA: Request this date → pre-filled inquiry form

## 6. Referral Tracking (Simple)

Add ref param support: /reservations?ref=[customer_email_hash]

When reservation completes:
- Store referral_source in reservations table
- Log referral in customer_visits (referrer_email)

Admin /admin/referrals view:
- Top referrers (by count)
- Referral-sourced reservations this month
- "Thank top referrers" → manual email flow with VIP offer

## Verify

- [ ] customer_visits table exists and upserts on reservation completion
- [ ] Tier auto-upgrades at visit_count 3 (preferred) and 8 (vip)
- [ ] Admin /admin/customers renders with filter by tier
- [ ] VIP offer email sends via admin "Send VIP offer" button
- [ ] Birthday month collected on reservation form (optional field)
- [ ] Birthday cron sends correctly (test with test customer record)
- [ ] WeChat templates copyable from /admin/wechat (if enabled)
- [ ] ?ref param stored in reservation record
```

---

## Prompt 5F: Month 10–12 Scale & Automation

### Context
With 2–5 Chinese restaurant clients onboarded via Pipeline B, automate the operations that don't scale with manual effort.

### Cursor Prompt

```
Implement multi-client operations automation for Chinese restaurant template.

## 1. Pipeline B Client Dashboard

Create /admin/clients page (BAAM internal use, not client-facing):

Table columns:
- site_id
- Restaurant name (EN + ZH)
- Brand variant
- Domain
- Pipeline B run date
- QA status (pass/fail/pending)
- Last deploy
- Active features (checklist icons: dim-sum, festivals, banquet, catering, i18n)
- Admin login link (impersonate view)

Data source: sites table in shared Supabase project

Features:
- "Run QA" button per client → triggers npm run qa via API route and returns report
- "Trigger redeploy" → Vercel deploy hook per client
- "View analytics" → opens GA4 filtered by domain

## 2. Festival Sync (Cross-Client)

Major Chinese festivals are universal across clients:
- Lunar New Year (date varies year to year)
- Qingming (April 4–6)
- Dragon Boat Festival (5th day of 5th lunar month)
- Mid-Autumn Festival (15th day of 8th lunar month)

Create /admin/festivals/broadcast page:

1. Admin updates festival dates once (for the year) in a master_festivals table
2. "Push to all clients" → loops through all client site_ids, upserts festivals table in each client's schema
3. Each client keeps their own festival_menu_items (different menus)
4. Clients can override: start/end dates, prix fixe price, capacity

master_festivals table:
  id, name, name_zh, default_start_date, default_end_date, festival_year, description, description_zh

Broadcast function:
  For each client_site_id:
    UPSERT festivals WHERE festival_year = [year] AND name = [festival_name]
    SKIP if client has is_locked = true on that festival

## 3. Menu Price Update Workflow

Chinese restaurant menus shift prices seasonally (esp. dim sum and premium ingredients).

Create /admin/menu/price-update page:

1. Upload CSV: item_slug, new_price
2. Preview table: current price → new price, items not found highlighted
3. "Apply" → bulk UPDATE menu_items WHERE slug IN [list]
4. Auto-creates audit log entry: price_change_log table (item_id, old_price, new_price, changed_at, changed_by)

Price change log visible in /admin/menu/price-history:
- Filter by item or date range
- Revert individual item: one-click restore old price

## 4. Monthly SEO Report (Auto-Generated)

Create /admin/seo-report page that pulls from:
- Supabase: form submission counts (last 30 days vs prior 30 days)
- site.json: google_rating, review_count (admin-maintained)
- GA4 Reporting API (if API key provided in env): sessions, organic traffic %

Auto-generates printable report:

## [Restaurant Name] — Monthly SEO Report — [Month Year]

### Traffic
- Organic sessions: [X] ([+/-Y]% vs prior month)
- Top 3 landing pages by organic traffic

### Conversions
- Reservations: [X] ([+/-Y]%)
- Banquet inquiries: [X]
- Catering inquiries: [X]
- Dim sum orders: [X]

### Reputation
- Google rating: [X] ([X] reviews)
- Reviews added this month: [X] (manually updated)

### Content
- Blog posts published: [X]
- New dish pages indexed: [X] (based on sitemap additions)

### Recommended Actions
- [Auto-suggested based on thresholds]:
  - If reservations < prior month: "Consider publishing a seasonal menu blog post"
  - If no blog posts this month: "Publish at least 2 content pieces for SEO momentum"
  - If Google review count < 50: "Activate review sequence for all completions this month"

Report export: "Download PDF" → window.print() with print-only CSS

## 5. Content Republication System

Blog posts decay in rankings. Create a republication workflow:

In blog admin:
- "Last updated" date (separate from created_at)
- "Needs refresh" flag (admin sets manually, or auto-flagged if post > 6 months old)

/admin/blog/refresh-queue:
- Lists all posts with needs_refresh = true
- Sort by: age, traffic (if GA4 API connected), or manually prioritized
- For each: "Open in editor" → updates lastModified in blog_posts table when saved

In sitemap.xml:
- Use lastmod = blog_posts.updated_at
- Google re-crawls updated lastmod dates

In blog schema:
- Add "dateModified" to Article schema.org → signals freshness to Google

## 6. Client Onboarding Tracker

Create /admin/onboarding page:

Tracks each client through Pipeline B stages:

| Client | O1 | O2 | O3 | O4 | O5 | O6 | O7 | QA | Launch |
|--------|----|----|----|----|----|----|----|----|--------|
| site_a | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| site_b | ✅ | ✅ | ✅ | ⏳ | — | — | — | — | — |

Data from: pipeline_runs table
  site_id, step (O1-O7), status (pending|running|complete|failed), ran_at, output_log

Add to onboard-client.mjs: log each step to pipeline_runs table

## Verify

- [ ] /admin/clients lists all client sites with correct metadata
- [ ] Festival broadcast updates all clients (test with 2 test sites)
- [ ] Price update CSV import previews correctly and applies bulk UPDATE
- [ ] Price change log table stores audit trail
- [ ] Monthly SEO report renders with real submission counts
- [ ] Blog republication queue shows posts older than 6 months
- [ ] Pipeline runs table updates during onboard-client.mjs execution
- [ ] /admin/onboarding tracker shows correct step status per client
```

---

## 12-Month Milestone Checklist

| Month | Milestone | Owner |
|-------|-----------|-------|
| 1 | GA4 + GSC live. All events tracking. | Dev |
| 1 | Sitemap submitted. First GSC impressions within 28 days. | Dev |
| 2 | 5 pillar blog posts published from templates. | Content |
| 2 | Google review link + QR on all print materials. | Client |
| 3 | Review email sequence active. 10+ new Google reviews. | Dev + Client |
| 3 | Programmatic dish pages indexed (check GSC URL Inspection). | SEO |
| 4 | Post-reservation CRO live (social proof, party size branching). | Dev |
| 4 | First A/B test running on hero CTA. | Dev |
| 5 | Banquet inquiry ROI calculator live. | Dev |
| 5 | Festival page(s) live with countdown + scarcity. | Dev + Client |
| 6 | 50+ Google reviews. ReviewBadge showing on site. | Client |
| 6 | Monthly SEO report auto-generates. | Dev |
| 7 | customer_visits + tier system active. | Dev |
| 7 | Birthday program live. First birthday emails sent. | Dev |
| 8 | WeChat Official Account QR in footer (if applicable). | Client |
| 9 | VIP email to top customers before major festival. | Dev + Client |
| 10 | /admin/clients multi-client dashboard live. | Dev |
| 10 | Festival broadcast system live. | Dev |
| 11 | 2nd client onboarded via Pipeline B. Full QA passed. | Dev |
| 11 | Price update workflow live (seasonal menu adjustment). | Dev |
| 12 | Monthly SEO report reviewed. Year-over-year comparison. | Dev + Client |
| 12 | Phase 5 review: identify Phase 6 opportunities (app? loyalty card? OpenTable premium?). | Team |

---

## KPI Targets (12-Month)

| KPI | Month 3 Target | Month 6 Target | Month 12 Target |
|-----|---------------|----------------|-----------------|
| Organic sessions/month | 500 | 1,500 | 4,000 |
| Google reviews | 25 | 60 | 120 |
| Google rating | 4.4+ | 4.5+ | 4.6+ |
| Reservations/month (organic) | 30 | 80 | 200 |
| Banquet inquiries/month | 3 | 8 | 20 |
| Blog posts published | 6 | 18 | 36 |
| Programmatic dish pages indexed | 40 | 80 | 80+ |
| ZH locale traffic % | 10% | 20% | 30% |
| Email open rate (review seq.) | 35%+ | 35%+ | 35%+ |
| VIP customers (3+ visits) | — | 15 | 50 |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | What to Do Instead |
|---|---|---|
| Buying reviews | Google/Yelp detect and purge | Automate the ask after genuine visits |
| Posting in English on Xiaohongshu | Chinese platform users filter EN content | ZH-only posts with authentic food photos |
| Ignoring ZH search queries | Significant search volume in ZH for local Chinese restaurants | Monitor GSC for ZH queries, blog in ZH |
| Updating menu in code, not admin | Requires redeploy for price changes | All prices in DB, editable via admin |
| Sending festival emails too late | CNY emails sent 3 days before = no bookings | Festival emails go out 3–4 weeks before |
| Generic "great food!" testimonials | No trust signal, ignored by users | Use specific testimonials with occasion + dish |
| Building loyalty app for <500 customers | App adoption rate <20%, dev cost too high | Email + tiered perks are sufficient at this scale |
| Relying only on Yelp | Yelp charges for placement, filters real reviews | Prioritize Google + organic ZH community |

---

## Phase 5 → Phase 6 Signals

Start thinking about Phase 6 when any of these are true:

- **Revenue signal**: Client reports that website is primary reservation channel (>60% of bookings)
- **Review signal**: 100+ Google reviews, 4.6+ rating — ready for paid Google campaigns
- **SEO signal**: Site ranks page 1 for [restaurant type] + [city] — expand to neighboring cities
- **Client signal**: 5+ clients onboarded — build a multi-tenant admin dashboard
- **Community signal**: WeChat Official Account >500 followers — build loyalty mini-program (微信小程序)
- **Scale signal**: Pipeline B runs >10 clients — automate QA and add CI/CD per-client deployments

---

*Phase 5 complete. System F — Chinese Restaurant Premium is a full-stack, compounding growth asset.*
