# BAAM System F — Chinese Restaurant Premium
# Phase 4: QA + Launch + Pipeline B Test

> **System:** BAAM System F — Chinese Restaurant Premium
> **Reference files:** `@RESTAURANT_CHINESE_COMPLETE_PLAN.md` + `@CHINESE_RESTAURANT_PIPELINE_B.md`
> **Prerequisite:** Phase 3 gate fully passed. `v0.3-launch-ready` tagged.
> **Method:** Sequential — complete each prompt fully before starting the next.
> **Rule:** Nothing launches until every gate below is checked. No exceptions.

---

## Phase 4 Overview

**Duration:** Week 5
**Goal:** Full QA pass, first real client content swap, production deployment, Google Search Console submission, and Pipeline B validation. Grand Pavilion goes live. Pipeline B proves it works for client 2 in under 2 minutes.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 4A | Full QA Pass | All 22 pages, 4 variants, both locales | 120 min |
| 4B | Content Swap — Grand Pavilion to First Client | Manual Pipeline B test | 60 min |
| 4C | Production Deploy | Vercel + Supabase prod + SSL | 60 min |
| 4D | GSC + GMB Submission | Google Search Console, Google My Business, IndexNow | 30 min |
| 4E | Pipeline B Automated Test Run | Full end-to-end pipeline for client 2 | 60 min |

---

## Prompt 4A — Full QA Pass

**Goal:** Systematic visual and functional review of all 22 pages, all 4 Chinese variants, and both locales. Find and fix every remaining issue before launch.

```
You are building BAAM System F — Chinese Restaurant Premium.
This is the final QA pass before production deployment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA SECTION 1 — All Pages Visual Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review every page at 1440px desktop width, EN locale, hao-zhan theme.
Checklist for each page:

□ No placeholder text (Lorem ipsum, "TODO:", "[INSERT]", "coming soon" — unless intentional)
□ All images load (no broken images, no grey placeholders where content should be)
□ All section headings render in correct font (EN: Cormorant Garamond; ZH: Noto Serif SC)
□ CSS variables resolve (no var(--undefined) showing as literal text)
□ No horizontal scroll at 1440px
□ CTA buttons link to correct destinations
□ Footer renders correctly: logo, nav links, hours, WeChat section

Pages to check:
□ Home (all 11 sections)
□ /menu (hub)
□ /menu/dim-sum (all sub-categories)
□ /menu/dinner
□ /menu/chef-signatures
□ /menu/weekend-brunch (if enabled)
□ /about
□ /reservations
□ /private-dining (banquet cards visible)
□ /catering
□ /gallery
□ /blog
□ /events
□ /faq
□ /contact (WeChat QR or placeholder)
□ /order-online
□ /gift-cards
□ /press
□ /careers
□ /festivals/chinese-new-year
□ /festivals/mid-autumn
□ /menu/dish/har-gow (dish page example)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA SECTION 2 — All 4 Variants Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each variant, switch theme in admin → check home page + menu/dim-sum:

□ hao-zhan (豪展): Parchment background, ink black text, gold accents
  - InkWashOverlay is dark ink (not colored)
  - Paper cut decorations: gold color
  - No color bleed from other variants

□ hongxiang (鴻翔): Warm ivory background, deep crimson primary
  - Hero overlay: reddish wash (not dark ink)
  - Paper cut decorations: crimson red
  - Festival pages: festive warmth feel

□ longmen (龍門): Near-black background, text is light parchment
  - CRITICAL: all text must be readable on dark background
  - ChineseMenuItem cards: dark card bg, light text for ZH name
  - Chef's Signatures: dark dramatic feel
  - Check: no dark-text-on-dark-background anywhere

□ shuimo (水墨): Off-white, charcoal text, cinnabar red accents
  - Cleanest, most minimal feel
  - InkWashOverlay: subtlest opacity (0.15)
  - Paper cut decorations: dark cinnabar red

For each variant:
- Zero hardcoded colors (run theme-compliance-check.mjs after each switch)
- Switch back to grand-pavilion's default (hao-zhan) after each check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA SECTION 3 — ZH Locale Full Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Switch to /zh/ locale. Review these pages:

□ /zh/ — Home: taglineZh, sublineZh, chef ZH credentials, ZH testimonials first
□ /zh/menu/dim-sum — ZH-only dish names, sub-categories in ZH
□ /zh/menu/chef-signatures — nameZh in Noto Serif SC 700, chef note in ZH
□ /zh/about — ZH story paragraphs, ZH credentials
□ /zh/festivals/chinese-new-year — full ZH content, taglineZh in hero
□ /zh/contact — parking note in ZH, hours heading "营业时间"
□ /zh/private-dining — banquet package nameZh, includes list in ZH

Check for each ZH page:
□ Chinese characters render in Noto Serif SC (not SimSun, not system font)
□ Font weight: display text = 700 weight (bold)
□ No English text where ZH is expected
□ <html lang="zh-Hans"> in source
□ <title> contains Chinese characters
□ ZH testimonials appear before EN testimonials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA SECTION 4 — Mobile Review (375px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test these pages at 375px viewport:

□ Home: hero text fits in viewport (no overflow), CTA buttons full-width
□ /menu/dim-sum: 1-column layout, nameZh wraps cleanly, photo scales
□ Festival page: BilinguaHeroHeadline stacks, prix-fixe cards single column
□ /private-dining: BanquetPackageCards single column
□ /menu/chef-signatures: image full-width top, text below
□ DimSumCartSection: 2-column grid, sticky basket bar above safe-area
□ Navigation: hamburger opens, ZH language switcher visible in mobile menu
□ Footer: WeChat section visible and readable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA SECTION 5 — Functional Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Reservation form: submit → booking created in DB → confirmation email received
□ Private dining form: submit → inquiry created → admin alert email received
□ Catering form: submit → inquiry created → admin alert email received
□ Contact form: submit → contact_submissions row created
□ Dim Sum cart: add items → submit → dim_sum_orders row created → email sent
□ Festival urgency bar: manually set today to within CNY date range → bar appears
□ DimSumStatusBadge: if current time is 10–15: shows green. Outside: shows grey.
□ Language switcher: /en/menu → click 中文 → /zh/menu (same path, locale changes)
□ Google Maps embed: loads and is interactive
□ FestivalCountdown: shows decreasing countdown if festival is upcoming

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA SECTION 6 — Admin Smoke Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Login as admin → dashboard loads
□ Content Editor: edit home page hero tagline → save → /en/ updated
□ Menu Editor: add new dim sum item with name_zh → save → appears on /menu/dim-sum
□ Festival Editor: update CNY urgency count → save → festival page shows new count
□ Gallery Editor: upload new image → assign category → appears on /gallery
□ Blog editor: publish new post → appears on /blog
□ Banquet packages editor: update price → appears on /private-dining
□ Site settings: change theme to hongxiang → site updates to crimson/gold palette
□ Site settings: change theme back to hao-zhan
□ Admin logout → login page shows

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For every failure found in sections 1–6:
1. Fix it immediately (don't log for later)
2. Re-verify the specific check passes
3. Run npm run qa to confirm no regressions
4. Document the fix in a brief comment in the relevant file

Do not consider 4A complete until all checkboxes above pass.
```

**Done-Gate 4A:**
- All 22 pages visually correct at 1440px
- All 4 variants render without bleed-through or hardcoded colors
- ZH locale: Chinese font renders in Noto Serif SC
- Mobile 375px: no horizontal overflow on any page
- All 10 functional tests pass
- Admin smoke test: all actions work end-to-end
- `npm run qa` returns "ALL QA PASSED"

---

## Prompt 4B — Content Swap: Grand Pavilion to First Real Client

**Goal:** Replace Grand Pavilion demo content with the first real client's information. This validates the manual Pipeline B process before automation.

```
You are building BAAM System F — Chinese Restaurant Premium.
This is the manual Pipeline B test for the first real client.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Prepare first client intake JSON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create: scripts/intake/[first-client-id].json
(Fill in with real client data from their intake form)

Use the intake schema from @RESTAURANT_CHINESE_COMPLETE_PLAN.md
Pipeline B → Chinese Restaurant Intake Schema.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Run onboarding pipeline (skip-AI mode first)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

node scripts/onboard-client.mjs [first-client-id] --skip-ai --dry-run

Review the dry-run output:
- O1: What content rows will be cloned?
- O2: What theme variant will be applied?
- O3: What menu types / festivals will be pruned?
- O4: What replacement pairs will be applied?
- O7: What verification checks will run?

If dry-run looks correct:

node scripts/onboard-client.mjs [first-client-id] --skip-ai

Verify the new client site is accessible at the dev domain.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Visual verification of onboarded site
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check these on the new client site:
□ Restaurant name (EN + ZH) shows correctly in header
□ Cuisine type and ZH type in footer
□ Business hours correct
□ Phone number correct (no Grand Pavilion number remaining)
□ Address correct
□ Brand variant matches intake.brand.variant
□ Disabled menu types not visible (e.g., if dinner disabled, /menu/dinner returns 404)
□ Disabled festivals not visible
□ O7 contamination scan: zero occurrences of "Grand Pavilion" or "大观楼"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Run with AI content generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

node scripts/onboard-client.mjs [first-client-id]

(runs with AI enabled — generates unique copy for this client)

Verify:
□ Hero tagline is different from Grand Pavilion's ("Cantonese Mastery Since 2008")
□ Chef bio is unique to this client's chef
□ SEO titles contain the correct client restaurant name and city
□ ZH hero tagline is translated correctly (not the Grand Pavilion ZH version)
□ Menu descriptions are rewritten (not identical to Grand Pavilion copy)

Total time from: node scripts/onboard-client.mjs [client-id] → pipeline complete.
Target: under 90 seconds.
```

**Done-Gate 4B:**
- First client site accessible at dev domain with correct restaurant info
- Zero Grand Pavilion contamination
- AI content: hero tagline unique to this client
- Pipeline execution time logged and < 90 seconds
- O7 verification script output: ALL CHECKS PASSED

---

## Prompt 4C — Production Deployment

```
You are building BAAM System F — Chinese Restaurant Premium.

Deploy the Grand Pavilion demo site (or first real client) to production.
Follow the BAAM deployment protocol.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Supabase Production Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a NEW Supabase project for production (separate from development).
Name: "BAAM-Chinese-Restaurant-PROD"

Run all schema migrations on production project:
- All base tables (content_entries, sites, site_domains, users, media_assets)
- All restaurant tables (menu_categories, menu_items, bookings, events, team_members, gallery_items, press_items, contact_submissions, private_dining_inquiries)
- All Chinese restaurant tables (festivals, festival_menu_items, banquet_packages, dim_sum_orders, catering_inquiries)
- All ALTER statements (menu_items extended columns)
- All RLS policies

Sync content from development to production:
node scripts/sync-content-to-db.mjs --env=production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Vercel Deployment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deploy to Vercel:
1. Connect GitHub repo to Vercel project
2. Framework: Next.js
3. Build command: next build
4. Output directory: .next

Set all production environment variables in Vercel dashboard:
NEXT_PUBLIC_DEFAULT_SITE=chinese-restaurant
NEXT_PUBLIC_DEFAULT_SITE_ID=grand-pavilion  (or first client ID)
NEXT_PUBLIC_SITE_URL=https://[domain.com]
APP_ENV=production
NEXT_PUBLIC_APP_ENV=production

SUPABASE_URL=[production Supabase URL]
NEXT_PUBLIC_SUPABASE_URL=[production Supabase URL]
SUPABASE_SERVICE_ROLE_KEY=[production service role key]

JWT_SECRET=[strong random string — generate with: openssl rand -hex 32]
RESEND_API_KEY=[production Resend API key]
RESEND_FROM=noreply@[client-domain.com]
CONTACT_FALLBACK_TO=[client-email]
ALERT_TO=[your-admin-email]

ANTHROPIC_API_KEY=[production Anthropic key]
AI_CHAT_MODEL=claude-sonnet-4-6
CRON_SECRET=[random string for cron auth]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Custom Domain + SSL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Vercel:
1. Add custom domain: [client-domain.com]
2. Add www redirect: www.[client-domain.com] → [client-domain.com]
3. Update DNS at client's registrar:
   - A record: @ → 76.76.21.21 (Vercel IP)
   - CNAME: www → cname.vercel-dns.com

Wait for SSL cert (1–5 minutes after DNS propagates).
Verify: https://[client-domain.com] loads with green lock.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Update NEXT_PUBLIC_SITE_URL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After domain is live:
1. Update NEXT_PUBLIC_SITE_URL in Vercel env vars to the live domain
2. Trigger redeploy in Vercel
3. Verify sitemap at: https://[domain]/sitemap.xml
4. Verify robots.txt at: https://[domain]/robots.txt
5. Verify hreflang in source: https://[domain]/en/ → view source

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Production smoke test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On the live production URL:
□ https://[domain]/en/ loads
□ https://[domain]/zh/ loads with Chinese content
□ https://[domain]/en/menu/dim-sum loads with menu items
□ Submit reservation form → booking created in PRODUCTION Supabase
□ Admin login: https://[domain]/admin → login works
□ Admin: edit a page section → save → live site updates
□ Resend email: submit contact form → email received
```

**Done-Gate 4C:**
- Site live at https://[domain]/en/ with SSL
- All form submissions write to production Supabase
- Admin CMS works on production
- Sitemap accessible at /sitemap.xml
- robots.txt accessible

---

## Prompt 4D — Google Search Console + GMB Submission

```
You are building BAAM System F — Chinese Restaurant Premium.

Submit the production site to Google Search Console and Google My Business.
Provide instructions for the client to complete these steps (requires their Google login).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Google Search Console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to: https://search.google.com/search-console/
2. Add property: [client-domain.com]
3. Verify via DNS TXT record (Vercel domain) or HTML file upload
4. After verification: Sitemaps → Submit sitemap:
   - https://[domain]/sitemap.xml

5. Submit for crawling (Request Indexing) on these priority pages:
   - https://[domain]/en/
   - https://[domain]/zh/
   - https://[domain]/en/menu/dim-sum
   - https://[domain]/en/festivals/chinese-new-year (if active)
   - https://[domain]/en/private-dining

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Google My Business
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Claim or create GMB profile at: https://business.google.com/
2. Verify restaurant: name, address, phone must match site exactly
3. Add website URL: https://[domain]
4. Add business hours (must match site hours exactly)
5. Add cuisine type: Cantonese Restaurant (or as appropriate)
6. Upload 10+ photos: interior, food, dim sum, chef
7. Enable Google Messaging (optional)
8. Request first reviews from existing customers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Bing Webmaster Tools
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. https://www.bing.com/webmasters/
2. Add site, verify, submit sitemap
3. Enable IndexNow (Bing supports it natively)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — IndexNow Ping
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Trigger IndexNow for all pages:
node scripts/indexnow-submit.mjs --all

This pings Bing + Google IndexNow API with all sitemap URLs.
Confirms: "Successfully submitted X URLs"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Chinese Search (Baidu) — Optional
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If client serves a significant Mainland Chinese audience:
- Submit to Baidu Webmaster: https://zhanzhang.baidu.com/
- Baidu requires a Chinese business entity for full verification
- Can still submit sitemap without verification for basic indexing

For US-based Chinese restaurant (Flushing, NY): Google + Bing sufficient.
Baidu optional — most Flushing Chinese community uses Google.
```

**Done-Gate 4D:**
- GSC property verified and sitemap submitted
- GMB profile updated with website link and correct hours
- IndexNow ping sent for all pages
- GSC shows "Sitemap submitted" (may take hours to fully process)

---

## Prompt 4E — Pipeline B Automated Test Run

**Goal:** Run the complete automated Pipeline B for a second client to prove the system scales.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @CHINESE_RESTAURANT_PIPELINE_B.md

Run a complete automated Pipeline B test for client 2.
This validates the entire O1–O7 pipeline without manual content editing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Prepare client 2 intake
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create: scripts/intake/client-2-test.json

Use a DIFFERENT sub-type from Grand Pavilion (which is dim-sum-cantonese).
Example: client-2 is a Sichuan fusion restaurant using longmen variant.

{
  "clientId": "client-2-test",
  "templateSiteId": "grand-pavilion",
  "industry": "chinese-restaurant",
  "business": {
    "name": "Red Dragon Kitchen",
    "nameZh": "红龙厨房",
    "ownerName": "Chef Wang Lei",
    "ownerNameZh": "王磊",
    "cuisineType": "Sichuan",
    "cuisineTypeZh": "川菜",
    "subType": "contemporary-sichuan"
  },
  "menu": {
    "enabled": ["dinner", "chef-signatures", "beverages", "desserts"],
    "disabled": ["dim-sum", "weekend-brunch", "breakfast", "lunch", "cocktails", "wine", "kids", "tasting-menu"]
  },
  "festivals": {
    "enabled": ["chinese-new-year"],
    "disabled": ["mid-autumn", "dragon-boat", "wedding-banquet"]
  },
  "brand": { "variant": "longmen" },
  "locales": { "enabled": ["en", "zh"], "primary": "en" },
  "features": {
    "festival_pages": true,
    "dim_sum_cart": false,
    "chef_signatures": true,
    "catering": false,
    "private_dining": true,
    "online_ordering": false
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Timed pipeline run
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

time node scripts/onboard-client.mjs client-2-test

Record the total time. Target: < 90 seconds with AI.

Watch console output for each step:
[O1] Cloning grand-pavilion → client-2-test... ✓ (5s)
[O2] Applying longmen theme variant... ✓ (<1s)
[O3] Pruning disabled menu types: dim-sum, weekend-brunch... ✓ (3s)
[O4] Replacing 22 pairs... ✓ (6s)
[O5] AI Call 1: generating content... ✓ (22s)
[O5] AI Call 2: generating SEO... ✓ (15s)
[O5] AI Call 3: rewriting menu descriptions... ✓ (18s)
[O6] Removing unsupported locales... ✓ (<1s)
[O7] Verifying... ✓ ALL CHECKS PASSED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Verify client 2 site
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Access client-2-test site at dev domain or localhost with ?site=client-2-test

□ Theme: longmen (near-black background, lacquer red accents)
□ Restaurant name: "Red Dragon Kitchen" + "红龙厨房"
□ Cuisine: "Sichuan" + "川菜"
□ /menu: shows dinner + chef-signatures only (no dim sum tab)
□ /menu/dim-sum: returns 404 (pruned)
□ /festivals/chinese-new-year: renders (enabled)
□ /festivals/mid-autumn: returns 404 (disabled)
□ DimSumCartSection: NOT visible on any page (feature disabled)
□ Catering page: returns 404 or is hidden from nav (disabled)
□ AI content: hero tagline is unique (not "Authentic Cantonese Mastery Since 2008")
□ AI content: chef bio mentions "Sichuan" cuisine, not "Cantonese"
□ Zero contamination: grep "Grand Pavilion" shows 0 results in client-2-test content

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Pipeline B edge case tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST A: Skip AI mode
time node scripts/onboard-client.mjs client-2-test --skip-ai
Target: < 20 seconds
Verify: all content is grand-pavilion copy (expected with --skip-ai), but business info replaced

TEST B: Dry run
node scripts/onboard-client.mjs client-2-test --dry-run
Should print what it WOULD do without writing to DB.
Verify: dry-run log shows correct operations for each O step.

TEST C: Locale-only site (English-only client)
Create client-3-test.json with locales.enabled: ["en"] only.
Run pipeline → verify /zh/ routes all return 404 (locale cleanup worked).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Clean up test clients
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After tests pass:
node scripts/delete-site.mjs client-2-test
node scripts/delete-site.mjs client-3-test

Verify: no content_entries remain for test site IDs.
```

**Done-Gate 4E (= Phase 4 Complete Gate):**
- Pipeline B client-2-test runs in < 90 seconds with AI
- Pipeline B runs in < 20 seconds with --skip-ai
- Dry run prints correct operations without writing to DB
- Client 2 site: correct theme, cuisine, no dim sum features, no mid-autumn festival
- Zero Grand Pavilion contamination in client 2 content
- English-only client test: /zh/ routes all 404
- Test clients cleaned up
- `git tag v1.0-production`

---

## Phase 4 Final Launch Checklist

| Category | Check | Status |
|---|---|---|
| **Content** | No placeholder text on any page | |
| **Content** | All images load (no 404s) | |
| **Content** | ZH content fully translated (not English) | |
| **Bilingual** | Language switcher works (EN ↔ 中文) | |
| **Bilingual** | ZH font (Noto Serif SC) renders correctly | |
| **Bilingual** | Hreflang correct on all pages | |
| **SEO** | Sitemap submitted to GSC | |
| **SEO** | Schema.org passes Google Rich Results Test | |
| **SEO** | Page titles: EN and ZH correct | |
| **Forms** | Reservation → email + DB | |
| **Forms** | Private dining → email + DB | |
| **Forms** | Contact → email + DB | |
| **Admin** | All pages editable in Form mode | |
| **Admin** | Festival editor works | |
| **Admin** | Menu editor shows name_zh required | |
| **Performance** | Lighthouse ≥ 90 on home page | |
| **Performance** | LCP < 2.5s | |
| **Pipeline B** | Full pipeline < 90 seconds | |
| **Pipeline B** | Zero contamination from template | |
| **Pipeline B** | Theme variant applied correctly | |
| **Production** | SSL certificate valid | |
| **Production** | Custom domain resolves | |
| **Production** | GMB profile linked to site | |

**All checkboxes checked → System F is live. Pipeline B is operational.**
