# BAAM System F — Chinese Restaurant Premium
# Pipeline B: Client Onboarding Master Plan

> **Purpose:** Complete specification for onboarding any new Chinese restaurant client onto System F.
> **Method:** 7-step automated pipeline (O1–O7) — CLI or Admin UI — < 90 seconds.
> **Template site:** `grand-pavilion` (DO NOT modify this site for any client)
> **Reference:** `@RESTAURANT_CHINESE_COMPLETE_PLAN.md` Pipeline B section
> **Rule:** Never skip O7. Never edit client content manually to work around pipeline bugs — fix the pipeline.

---

## Table of Contents

1. [Pipeline B Overview](#1-pipeline-b-overview)
2. [What Changes Per Client](#2-what-changes-per-client)
3. [7-Step Pipeline O1–O7 — Implementation](#3-7-step-pipeline-o1o7--implementation)
4. [Intake Schema — Full Reference](#4-intake-schema--full-reference)
5. [Menu Catalog — O3 Pruning Reference](#5-menu-catalog--o3-pruning-reference)
6. [Replacement Pairs — O4](#6-replacement-pairs--o4)
7. [AI Prompt Spec — O5](#7-ai-prompt-spec--o5)
8. [Brand Variants Config](#8-brand-variants-config)
9. [O7 Contamination Verification](#9-o7-contamination-verification)
10. [Admin UI Wizard](#10-admin-ui-wizard)
11. [CLI Interface](#11-cli-interface)
12. [Post-Pipeline Content Checklist](#12-post-pipeline-content-checklist)
13. [Client Handoff Protocol](#13-client-handoff-protocol)
14. [Production Deployment Per Client](#14-production-deployment-per-client)
15. [Pipeline B Done-Gate](#15-pipeline-b-done-gate)
16. [Anti-Patterns](#16-anti-patterns)

---

## 1. Pipeline B Overview

```
Chinese Restaurant Intake JSON
             ↓
       Pipeline B (O1–O7)
             ↓
  Customized Client Site (EN + ZH)
  (~$0.15 Claude API cost · ~35–90 seconds)
```

**The core principle:** The Grand Pavilion template is never modified for any client. Each client gets their own `site_id` in the database. Pipeline B clones the template content, applies client-specific customizations, then verifies the output is clean.

**Economics:**
- Developer time per client: ~2 hours (menu data entry + photo upload + intake form)
- Pipeline execution time: < 90 seconds (with AI) · < 20 seconds (skip-AI mode)
- Claude API cost per client: ~$0.10–$0.20 depending on menu count
- Template code changes needed: zero

**Two execution methods:**
- Admin UI wizard at `/admin/onboarding` — browser-based, SSE progress streaming
- CLI: `node scripts/onboard-client.mjs {client-id}` — terminal, for developers

---

## 2. What Changes Per Client

| What | How | Step |
|---|---|---|
| Restaurant name (EN + ZH) | Deterministic string replacement | O4 |
| Chef name (EN + ZH) | Deterministic string replacement | O4 |
| Cuisine type (EN + ZH) | Deterministic string replacement | O4 |
| Brand colors, fonts | Variant selection from brand-variants JSON | O2 |
| Menu types offered | Prune disabled types from content_entries | O3 |
| Enabled festival pages | Prune disabled festivals from content_entries | O3 |
| Business hours | Structural rebuild in site.json | O4 |
| Phone, email, address, city, state | Deterministic string replacement | O4 |
| Social links (Instagram, Facebook, WeChat) | Structural rebuild | O4 |
| WeChat QR URL + account name | Structural replacement | O4 |
| Reservation provider + config | Structural rebuild | O4 |
| Feature flags | `sites` table + features object in site.json | O4 |
| Hero tagline (EN + ZH) | AI generation | O5 |
| About story (EN + ZH) | AI generation | O5 |
| Chef bio (EN + ZH) | AI generation | O5 |
| Testimonials (EN + ZH) | AI generation | O5 |
| All-page SEO titles + descriptions (EN + ZH) | AI generation | O5 |
| Menu item descriptions (rewrite) | AI generation | O5 |
| Languages supported | Delete unsupported locale rows | O6 |

**What stays (cloned from template):**
Page structure · React components · Admin UI · API endpoints · CSS variable pipeline · DB schema · QA scripts · Chinese decorative component library · Bilingual font system.

---

## 3. 7-Step Pipeline O1–O7 — Implementation

### Build the pipeline scripts in `scripts/onboard/`:

```
scripts/
├── onboard-client.mjs         (main orchestrator)
├── intake/                    (client intake JSON files)
│   └── [client-id].json
└── onboard/
    ├── o1-clone.mjs
    ├── o2-brand.mjs
    ├── o3-prune.mjs
    ├── o4-replace.mjs
    ├── o5-ai-content.mjs
    ├── o6-cleanup.mjs
    ├── o7-verify.mjs
    ├── brand-variants-chinese-restaurant.json
    └── prompts/
        └── chinese-restaurant/
            ├── content.md     (O5 Call 1: hero/bios/testimonials EN+ZH)
            ├── seo.md         (O5 Call 2: all-page SEO EN+ZH)
            └── menu.md        (O5 Call 3: menu descriptions rewrite)
```

---

### O1 — Clone

**File:** `scripts/onboard/o1-clone.mjs`

```javascript
// O1: Clone grand-pavilion content to new client site_id

export async function o1Clone(intake, supabase) {
  const { clientId, templateSiteId, locales } = intake

  console.log(`[O1] Cloning ${templateSiteId} → ${clientId}...`)

  // 1. Validate: clientId must not already exist
  const { data: existing } = await supabase
    .from('content_entries')
    .select('site_id')
    .eq('site_id', clientId)
    .limit(1)
  if (existing?.length > 0) throw new Error(`[O1] site_id '${clientId}' already exists. Aborting.`)

  // 2. Register new site in sites config
  // Read _sites.json content_entry, add new site, write back
  const sitesEntry = await getSiteConfig(supabase, templateSiteId)
  const newSiteConfig = {
    id: clientId,
    name: intake.business.name,
    nameZh: intake.business.nameZh,
    domain: intake.domains?.production || `${clientId}.local`,
    locales: locales.enabled,
    defaultLocale: locales.primary,
    enabled: true,
    type: 'chinese-restaurant',
    subType: intake.business.subType,
    cuisineType: intake.business.cuisineType,
    cuisineTypeZh: intake.business.cuisineTypeZh,
    features: intake.features
  }
  await upsertSiteConfig(supabase, clientId, newSiteConfig)

  // 3. Register domain aliases
  if (intake.domains) {
    await supabase.from('site_domains').insert([
      { site_id: clientId, domain: intake.domains.production, is_primary: true },
      intake.domains.dev && { site_id: clientId, domain: intake.domains.dev, is_primary: false }
    ].filter(Boolean))
  }

  // 4. Clone content_entries (all locales from template)
  const { data: templateRows } = await supabase
    .from('content_entries')
    .select('*')
    .eq('site_id', templateSiteId)

  const clonedRows = templateRows.map(row => ({
    ...row,
    id: undefined,           // let DB generate new UUID
    site_id: clientId,
    created_at: undefined,
    updated_at: undefined,
  }))

  // Insert in batches of 50
  for (let i = 0; i < clonedRows.length; i += 50) {
    await supabase.from('content_entries').insert(clonedRows.slice(i, i + 50))
  }
  console.log(`[O1] Cloned ${clonedRows.length} content_entries rows`)

  // 5. Clone menu_categories and menu_items
  // Build category ID mapping: old UUID → new UUID
  const { data: templateCategories } = await supabase
    .from('menu_categories').select('*').eq('site_id', templateSiteId)
  const categoryIdMap = {}
  for (const cat of templateCategories) {
    const { data: newCat } = await supabase.from('menu_categories')
      .insert({ ...cat, id: undefined, site_id: clientId }).select().single()
    categoryIdMap[cat.id] = newCat.id
  }

  const { data: templateItems } = await supabase
    .from('menu_items').select('*').eq('site_id', templateSiteId)
  const itemsToInsert = templateItems.map(item => ({
    ...item,
    id: undefined,
    site_id: clientId,
    category_id: categoryIdMap[item.category_id] || item.category_id
  }))
  for (let i = 0; i < itemsToInsert.length; i += 50) {
    await supabase.from('menu_items').insert(itemsToInsert.slice(i, i + 50))
  }
  console.log(`[O1] Cloned ${itemsToInsert.length} menu_items`)

  // 6. Clone team_members, gallery_items, press_items, festivals, banquet_packages
  for (const table of ['team_members', 'gallery_items', 'press_items', 'festivals', 'banquet_packages']) {
    const { data: rows } = await supabase.from(table).select('*').eq('site_id', templateSiteId)
    if (rows?.length) {
      await supabase.from(table).insert(rows.map(r => ({ ...r, id: undefined, site_id: clientId })))
      console.log(`[O1] Cloned ${rows.length} ${table} rows`)
    }
  }

  // DO NOT CLONE: bookings, events, blog_posts, contact_submissions,
  //               dim_sum_orders, catering_inquiries, private_dining_inquiries
  // Clients start fresh — no Grand Pavilion bookings or events

  console.log(`[O1] ✓ Clone complete`)
}
```

---

### O2 — Brand

**File:** `scripts/onboard/o2-brand.mjs`

```javascript
// O2: Apply brand variant to new client site

import brandVariants from './brand-variants-chinese-restaurant.json' assert { type: 'json' }

export async function o2Brand(intake, supabase) {
  const variantId = intake.brand?.variant || 'hao-zhan'
  const overrides = intake.brand?.overrides || {}

  console.log(`[O2] Applying brand variant: ${variantId}...`)

  const baseVariant = brandVariants[variantId]
  if (!baseVariant) throw new Error(`[O2] Unknown variant: ${variantId}`)

  // Deep merge overrides into base variant
  const theme = deepMerge(baseVariant, overrides)

  // Write theme.json to content_entries
  await supabase.from('content_entries').upsert({
    site_id: intake.clientId,
    locale: intake.locales.primary,
    path: 'theme.json',
    data: theme,
    updated_by: 'pipeline-o2'
  }, { onConflict: 'site_id,locale,path' })

  console.log(`[O2] ✓ Brand variant '${variantId}' applied`)
}
```

---

### O3 — Prune

**File:** `scripts/onboard/o3-prune.mjs`

```javascript
// O3: Remove disabled menu types and festival pages

export async function o3Prune(intake, supabase) {
  const clientId = intake.clientId
  const enabledMenuTypes = intake.menu?.enabled || []
  const enabledFestivals = intake.festivals?.enabled || []

  console.log(`[O3] Pruning disabled features...`)

  // Prune menu categories (and cascade to menu_items via FK)
  const { data: allCategories } = await supabase
    .from('menu_categories').select('id, menu_type').eq('site_id', clientId)

  const categoriesToDelete = allCategories.filter(
    cat => !enabledMenuTypes.includes(cat.menu_type)
  )
  if (categoriesToDelete.length > 0) {
    const idsToDelete = categoriesToDelete.map(c => c.id)
    await supabase.from('menu_categories').delete().in('id', idsToDelete)
    console.log(`[O3] Removed ${categoriesToDelete.length} disabled menu categories (items cascade-deleted)`)
  }

  // Prune festival content_entries
  const { data: festivalRows } = await supabase
    .from('content_entries')
    .select('id, path')
    .eq('site_id', clientId)
    .like('path', 'pages/festivals/%')

  const festivalsToDelete = festivalRows.filter(row => {
    const slug = row.path.replace('pages/festivals/', '').replace('.json', '')
    return !enabledFestivals.includes(slug)
  })
  if (festivalsToDelete.length > 0) {
    await supabase.from('content_entries')
      .delete().in('id', festivalsToDelete.map(r => r.id))
    console.log(`[O3] Removed ${festivalsToDelete.length} disabled festival content rows`)
  }

  // Prune festivals table rows
  const { data: allFestivals } = await supabase
    .from('festivals').select('id, slug').eq('site_id', clientId)
  const festivalTableToDelete = allFestivals.filter(f => !enabledFestivals.includes(f.slug))
  if (festivalTableToDelete.length > 0) {
    await supabase.from('festivals').delete().in('id', festivalTableToDelete.map(f => f.id))
  }

  // Prune banquet_packages if private_dining disabled
  if (!intake.features?.private_dining) {
    await supabase.from('banquet_packages').delete().eq('site_id', clientId)
    console.log(`[O3] Removed banquet packages (private_dining disabled)`)
  }

  console.log(`[O3] ✓ Pruning complete`)
}
```

---

### O4 — Replace

**File:** `scripts/onboard/o4-replace.mjs`

```javascript
// O4: Deep string replacement + structural rebuilds

export async function o4Replace(intake, supabase) {
  const clientId = intake.clientId
  console.log(`[O4] Running replacements...`)

  // Build replacement pairs — ORDER MATTERS (longest/most specific first)
  const pairs = buildReplacementPairs(intake)

  // Fetch all content_entries for client
  const { data: rows } = await supabase
    .from('content_entries').select('*').eq('site_id', clientId)

  let replacedCount = 0
  for (const row of rows) {
    const originalJson = JSON.stringify(row.data)
    let newJson = originalJson

    // Apply each replacement pair
    for (const [from, to] of pairs) {
      newJson = newJson.replaceAll(from, to)
    }

    if (newJson !== originalJson) {
      await supabase.from('content_entries').update({
        data: JSON.parse(newJson),
        updated_by: 'pipeline-o4'
      }).eq('id', row.id)
      replacedCount++
    }
  }
  console.log(`[O4] String replacement applied to ${replacedCount} content rows`)

  // Structural rebuilds
  await rebuildSiteJson(intake, supabase)
  await rebuildHeaderJson(intake, supabase)
  await rebuildNavigationJson(intake, supabase)
  await rebuildReservationConfig(intake, supabase)
  await updateSitesTableFeatures(intake, supabase)

  console.log(`[O4] ✓ Replacements complete`)
}

function buildReplacementPairs(intake) {
  const b = intake.business
  const l = intake.location
  const s = intake.social || {}

  // ORDER: longest strings first to prevent partial-match collisions
  return [
    // Chinese names first (longer, more specific)
    ['大观楼', b.nameZh],
    ['厨师长李伟', b.ownerNameZh || '厨师长'],
    ['粤菜', b.cuisineTypeZh || '中餐'],
    ['传统粤菜精髓', `正宗${b.cuisineTypeZh || '中餐'}精髓`],

    // English — multi-word first
    ['Grand Pavilion', b.name],
    ['Chef Li Wei', b.ownerName],
    ['Executive Chef & Founder', b.ownerTitle || 'Executive Chef'],
    ['Cantonese', b.cuisineType || 'Chinese'],
    ['Flushing, New York', `${l.city}, ${l.state}`],
    ['Flushing, NY', `${l.city}, ${l.state}`],
    ['Flushing', l.city],
    ['133-24 Roosevelt Ave', l.address],
    ['11354', l.zip],

    // Contact
    ['(718) 555-0188', l.phone],
    ['info@grandpavilionny.com', l.email],

    // Social
    ['@grandpavilionny', s.instagram || ''],
    ['facebook.com/grandpavilionny', s.facebook || ''],
    ['大观楼餐厅', s.wechatAccountName || b.nameZh || ''],

    // Domain
    ['grandpavilionny.com', intake.domains?.production || ''],
    ['grand-pavilion', clientId],
  ]
}

async function rebuildSiteJson(intake, supabase) {
  const b = intake.business
  const l = intake.location
  const s = intake.social || {}

  const newSiteJson = {
    id: intake.clientId,
    name: b.name,
    restaurantNameZh: b.nameZh,
    cuisineType: b.cuisineType,
    cuisineTypeZh: b.cuisineTypeZh,
    phone: l.phone,
    email: l.email,
    address: l.address,
    city: l.city,
    state: l.state,
    zip: l.zip,
    hours: intake.hours,
    dimSumHours: intake.dimSum?.hours || { open: '10:00', close: '15:00' },
    weekendBrunchHours: intake.dimSum?.weekendBrunchHours || null,
    seatingCapacity: intake.seatingCapacity || { regular: 80, banquet: 0 },
    parkingNote: intake.location?.parkingNote || '',
    parkingNoteZh: intake.location?.parkingNoteZh || '',
    wechatQrUrl: s.wechatQrUrl || '',
    wechatAccountName: s.wechatAccountName || '',
    social: {
      instagram: s.instagram || '',
      facebook: s.facebook || '',
      yelp: s.yelp || '',
    },
    announcementBar: `Now Accepting Reservations — ${b.name}`,
    features: intake.features
  }

  // Upsert for each enabled locale
  for (const locale of intake.locales.enabled) {
    await supabase.from('content_entries').upsert({
      site_id: intake.clientId,
      locale,
      path: 'site.json',
      data: newSiteJson,
      updated_by: 'pipeline-o4'
    }, { onConflict: 'site_id,locale,path' })
  }
}

async function rebuildReservationConfig(intake, supabase) {
  const res = intake.reservations
  if (!res) return

  const reservationConfig = {
    provider: res.provider || 'custom',
    opentableId: res.opentableId || null,
    resyVenueId: res.resyVenueId || null,
    privateDiningEnabled: res.privateDining || false,
    cateringEnabled: res.catering || false,
    maxPartySize: res.maxPartySize || 20,
  }

  // Update pages/reservations.json with new config
  const { data: resRow } = await supabase.from('content_entries')
    .select('*').eq('site_id', intake.clientId)
    .eq('locale', intake.locales.primary)
    .eq('path', 'pages/reservations.json').single()

  if (resRow) {
    const updated = { ...resRow.data, ...reservationConfig }
    await supabase.from('content_entries').update({ data: updated })
      .eq('id', resRow.id)
  }
}
```

---

### O5 — AI Content

**File:** `scripts/onboard/o5-ai-content.mjs`

```javascript
// O5: AI content generation — 3 Claude API calls

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const client = new Anthropic()

export async function o5AiContent(intake, supabase, options = {}) {
  if (options.skipAi) {
    console.log('[O5] Skipping AI content generation (--skip-ai flag)')
    return
  }

  console.log('[O5] Generating AI content (3 calls)...')
  const promptDir = path.join(process.cwd(), 'scripts/onboard/prompts/chinese-restaurant')

  // ── CALL 1: Hero/bios/testimonials EN + ZH ─────────────────
  console.log('[O5] Call 1: hero/bios/testimonials...')
  const contentPrompt = interpolate(
    fs.readFileSync(path.join(promptDir, 'content.md'), 'utf-8'),
    {
      restaurantName: intake.business.name,
      restaurantNameZh: intake.business.nameZh,
      ownerName: intake.business.ownerName,
      ownerNameZh: intake.business.ownerNameZh || '',
      ownerTitle: intake.business.ownerTitle,
      ownerTitleZh: intake.business.ownerTitleZh || '',
      chefOrigin: intake.business.chefOrigin || '',
      chefTraining: intake.business.chefTraining || '',
      cuisineType: intake.business.cuisineType,
      cuisineTypeZh: intake.business.cuisineTypeZh,
      subType: intake.business.subType || 'chinese-restaurant',
      city: intake.location.city,
      state: intake.location.state,
      foundedYear: intake.business.foundedYear || '2010',
      voice: intake.voice || 'warm-traditional-authoritative',
      teamMembers: JSON.stringify(intake.business.teamMembers || []),
    }
  )

  const contentRaw = await callClaude(contentPrompt)
  const aiContent = parseJson(contentRaw)

  // Merge AI content into site content_entries
  await mergeHeroContent(aiContent, intake, supabase)
  await mergeAboutContent(aiContent, intake, supabase)
  await mergeTestimonials(aiContent, intake, supabase)
  await mergeWhyChooseUs(aiContent, intake, supabase)

  // ── CALL 2: SEO titles + descriptions EN + ZH ──────────────
  console.log('[O5] Call 2: SEO...')
  const seoPrompt = interpolate(
    fs.readFileSync(path.join(promptDir, 'seo.md'), 'utf-8'),
    {
      restaurantName: intake.business.name,
      restaurantNameZh: intake.business.nameZh,
      cuisineType: intake.business.cuisineType,
      cuisineTypeZh: intake.business.cuisineTypeZh,
      city: intake.location.city,
      state: intake.location.state,
      enabledPages: getEnabledPageList(intake),
    }
  )
  const seoRaw = await callClaude(seoPrompt)
  const aiSeo = parseJson(seoRaw)
  await mergeSeoContent(aiSeo, intake, supabase)

  // ── CALL 3: Menu descriptions rewrite ──────────────────────
  console.log('[O5] Call 3: menu descriptions...')
  const menuPrompt = interpolate(
    fs.readFileSync(path.join(promptDir, 'menu.md'), 'utf-8'),
    {
      restaurantName: intake.business.name,
      restaurantNameZh: intake.business.nameZh,
      cuisineType: intake.business.cuisineType,
      cuisineTypeZh: intake.business.cuisineTypeZh,
      city: intake.location.city,
      voice: intake.voice || 'warm-traditional-authoritative',
      enabledMenuTypes: (intake.menu?.enabled || []).join(', '),
      dimSumEnabled: intake.menu?.enabled?.includes('dim-sum') ? 'yes' : 'no',
    }
  )
  const menuRaw = await callClaude(menuPrompt)
  const aiMenu = parseJson(menuRaw)
  await rewriteMenuDescriptions(aiMenu, intake, supabase)

  console.log('[O5] ✓ AI content generation complete')
}

async function callClaude(prompt) {
  const response = await client.messages.create({
    model: process.env.AI_CHAT_MODEL || 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  })
  return response.content[0].text
}

function parseJson(raw) {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    console.warn('[O5] JSON parse failed, returning null:', e.message)
    return null
  }
}

function interpolate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}
```

---

### O6 — Cleanup

**File:** `scripts/onboard/o6-cleanup.mjs`

```javascript
// O6: Remove unsupported locale rows

export async function o6Cleanup(intake, supabase) {
  const clientId = intake.clientId
  const enabledLocales = intake.locales.enabled

  console.log(`[O6] Cleaning up unsupported locales...`)

  // All possible locales in the template
  const allLocales = ['en', 'zh', 'es', 'ko']
  const localesToRemove = allLocales.filter(l => !enabledLocales.includes(l))

  for (const locale of localesToRemove) {
    const { count } = await supabase
      .from('content_entries')
      .delete()
      .eq('site_id', clientId)
      .eq('locale', locale)
    if (count > 0) {
      console.log(`[O6] Removed ${count} content_entries for locale: ${locale}`)
    }
  }

  console.log(`[O6] ✓ Locale cleanup complete. Enabled: ${enabledLocales.join(', ')}`)
}
```

---

### O7 — Verify

**File:** `scripts/onboard/o7-verify.mjs`

```javascript
// O7: Contamination check + required path verification

export async function o7Verify(intake, supabase) {
  const clientId = intake.clientId
  const errors = []
  const warnings = []

  console.log(`[O7] Verifying ${clientId}...`)

  // CHECK 1: Required paths exist
  const requiredPaths = [
    `pages/home.json`,
    `pages/menu.json`,
    `pages/about.json`,
    `pages/contact.json`,
    `site.json`,
    `header.json`,
    `seo.json`,
    `theme.json`,
  ]

  // Add conditional required paths
  if (intake.menu?.enabled?.includes('dim-sum')) {
    requiredPaths.push('menu/dim-sum.json')
  }
  if (intake.features?.private_dining) {
    requiredPaths.push('pages/private-dining.json')
  }

  for (const p of requiredPaths) {
    const { data } = await supabase.from('content_entries')
      .select('id').eq('site_id', clientId)
      .eq('locale', intake.locales.primary).eq('path', p).limit(1)
    if (!data?.length) errors.push(`Missing required path: ${p}`)
  }

  // CHECK 2: ZH locale exists (if enabled)
  if (intake.locales.enabled.includes('zh')) {
    const { data } = await supabase.from('content_entries')
      .select('id').eq('site_id', clientId).eq('locale', 'zh')
      .eq('path', 'pages/home.json').limit(1)
    if (!data?.length) errors.push('ZH locale: pages/home.json missing')
  }

  // CHECK 3: Contamination scan — no Grand Pavilion content
  const { data: allRows } = await supabase.from('content_entries')
    .select('path, data').eq('site_id', clientId)

  const contaminationTerms = ['Grand Pavilion', '大观楼', '133-24 Roosevelt Ave',
    'grandpavilionny.com', '(718) 555-0188', 'info@grandpavilionny.com']

  for (const row of allRows) {
    const json = JSON.stringify(row.data)
    for (const term of contaminationTerms) {
      if (json.includes(term)) {
        errors.push(`Contamination: "${term}" found in ${row.path}`)
      }
    }
  }

  // CHECK 4: Correct brand variant applied
  const { data: themeRow } = await supabase.from('content_entries')
    .select('data').eq('site_id', clientId)
    .eq('locale', intake.locales.primary).eq('path', 'theme.json').single()
  if (themeRow?.data?.preset?.id !== intake.brand?.variant) {
    errors.push(`Brand variant mismatch: expected ${intake.brand?.variant}, got ${themeRow?.data?.preset?.id}`)
  }

  // CHECK 5: Menu item count meets minimum
  const { count: menuCount } = await supabase
    .from('menu_items').select('id', { count: 'exact' }).eq('site_id', clientId)
  if (menuCount < 10) warnings.push(`Low menu item count: ${menuCount} (expected ≥ 10)`)

  // CHECK 6: Disabled locales removed
  const disabledLocales = ['en', 'zh', 'es', 'ko'].filter(l => !intake.locales.enabled.includes(l))
  for (const locale of disabledLocales) {
    const { count } = await supabase.from('content_entries')
      .select('id', { count: 'exact' }).eq('site_id', clientId).eq('locale', locale)
    if (count > 0) errors.push(`Locale not cleaned up: ${locale} has ${count} rows`)
  }

  // CHECK 7: Restaurant name matches intake
  const { data: siteRow } = await supabase.from('content_entries')
    .select('data').eq('site_id', clientId)
    .eq('locale', intake.locales.primary).eq('path', 'site.json').single()
  if (siteRow?.data?.name !== intake.business.name) {
    errors.push(`site.json name mismatch: expected "${intake.business.name}", got "${siteRow?.data?.name}"`)
  }

  // Report
  if (warnings.length > 0) {
    console.warn(`[O7] Warnings (${warnings.length}):`)
    warnings.forEach(w => console.warn(`  ⚠ ${w}`))
  }

  if (errors.length > 0) {
    console.error(`[O7] FAILED (${errors.length} errors):`)
    errors.forEach(e => console.error(`  ✗ ${e}`))
    throw new Error(`[O7] Verification failed with ${errors.length} errors`)
  }

  console.log(`[O7] ✓ ALL CHECKS PASSED`)
}
```

---

### Main Orchestrator

**File:** `scripts/onboard-client.mjs`

```javascript
#!/usr/bin/env node
// Usage: node scripts/onboard-client.mjs [client-id] [--skip-ai] [--dry-run]

import { createClient } from '@supabase/supabase-js'
import { o1Clone } from './onboard/o1-clone.mjs'
import { o2Brand } from './onboard/o2-brand.mjs'
import { o3Prune } from './onboard/o3-prune.mjs'
import { o4Replace } from './onboard/o4-replace.mjs'
import { o5AiContent } from './onboard/o5-ai-content.mjs'
import { o6Cleanup } from './onboard/o6-cleanup.mjs'
import { o7Verify } from './onboard/o7-verify.mjs'
import fs from 'fs'
import path from 'path'

const clientId = process.argv[2]
const skipAi = process.argv.includes('--skip-ai')
const dryRun = process.argv.includes('--dry-run')

if (!clientId) {
  console.error('Usage: node scripts/onboard-client.mjs [client-id] [--skip-ai] [--dry-run]')
  process.exit(1)
}

// Load intake JSON
const intakePath = path.join(process.cwd(), 'scripts/intake', `${clientId}.json`)
if (!fs.existsSync(intakePath)) {
  console.error(`Intake file not found: ${intakePath}`)
  process.exit(1)
}
const intake = JSON.parse(fs.readFileSync(intakePath, 'utf-8'))

// Supabase client (service role for pipeline operations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const startTime = Date.now()

if (dryRun) {
  console.log('=== DRY RUN — no changes will be made ===')
  console.log('[O1] Would clone:', intake.templateSiteId, '→', clientId)
  console.log('[O2] Would apply brand variant:', intake.brand?.variant)
  console.log('[O3] Would prune menu types:', intake.menu?.disabled)
  console.log('[O3] Would prune festivals:', intake.festivals?.disabled)
  console.log('[O4] Would apply', buildReplacementPairs(intake).length, 'replacement pairs')
  console.log('[O5] AI content:', skipAi ? 'SKIPPED' : '3 Claude API calls')
  console.log('[O6] Would remove locales:', ['en','zh','es','ko'].filter(l => !intake.locales.enabled.includes(l)))
  console.log('[O7] Would verify: required paths, contamination, brand variant, locale cleanup')
  process.exit(0)
}

try {
  await o1Clone(intake, supabase)
  await o2Brand(intake, supabase)
  await o3Prune(intake, supabase)
  await o4Replace(intake, supabase)
  await o5AiContent(intake, supabase, { skipAi })
  await o6Cleanup(intake, supabase)
  await o7Verify(intake, supabase)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n✓ Pipeline complete for '${clientId}' in ${elapsed}s`)
  console.log(`  Site URL: ${intake.domains?.production || `localhost:3060?site=${clientId}`}`)
} catch (err) {
  console.error('\n✗ Pipeline failed:', err.message)
  process.exit(1)
}
```

---

## 4. Intake Schema — Full Reference

Complete intake JSON schema for Chinese restaurant clients:

```json
{
  "clientId": "restaurant-slug",
  "templateSiteId": "grand-pavilion",
  "industry": "chinese-restaurant",

  "business": {
    "name": "Restaurant Name (EN)",
    "nameZh": "餐厅中文名",
    "ownerName": "Chef Full Name",
    "ownerNameZh": "厨师全名",
    "ownerTitle": "Executive Chef & Owner",
    "ownerTitleZh": "行政主厨 & 东主",
    "chefOrigin": "Hong Kong",
    "chefTraining": "Fook Lam Moon, Hong Kong · 25 years",
    "cuisineType": "Cantonese",
    "cuisineTypeZh": "粤菜",
    "subType": "dim-sum-cantonese | contemporary-sichuan | shanghainese | taiwanese | hong-kong-cafe",
    "foundedYear": 2015,
    "teamMembers": [
      {
        "slug": "chef-name",
        "name": "Chef Full Name",
        "nameZh": "厨师名",
        "role": "Executive Chef & Owner",
        "roleZh": "行政主厨",
        "credentials": ["25 Years Cantonese"],
        "bio": "Optional pre-written bio (if empty, AI generates)"
      }
    ]
  },

  "location": {
    "address": "123 Main Street",
    "city": "Flushing",
    "state": "NY",
    "zip": "11355",
    "phone": "(718) 555-0100",
    "email": "info@restaurantname.com",
    "lat": 40.7576,
    "lng": -73.8330,
    "parkingNote": "Street parking available",
    "parkingNoteZh": "街道停车可用"
  },

  "hours": {
    "monday":    { "open": "11:00", "close": "21:30" },
    "tuesday":   { "open": "11:00", "close": "21:30" },
    "wednesday": { "open": "11:00", "close": "21:30" },
    "thursday":  { "open": "11:00", "close": "21:30" },
    "friday":    { "open": "11:00", "close": "22:00" },
    "saturday":  { "open": "10:00", "close": "22:00" },
    "sunday":    { "open": "10:00", "close": "21:00" }
  },

  "dimSum": {
    "enabled": true,
    "hours": { "open": "10:00", "close": "15:00" },
    "weekendBrunchHours": { "open": "10:00", "close": "15:30" }
  },

  "social": {
    "instagram": "@restauranthandle",
    "facebook": "facebook.com/restaurantpage",
    "yelp": "yelp.com/biz/restaurant-slug",
    "wechatAccountName": "餐厅微信账号",
    "wechatQrUrl": "https://..."
  },

  "domains": {
    "production": "restaurantname.com",
    "dev": "restaurant-slug.local"
  },

  "menu": {
    "enabled": ["dim-sum", "dinner", "chef-signatures", "weekend-brunch", "beverages", "desserts"],
    "disabled": ["breakfast", "lunch", "cocktails", "wine", "kids", "tasting-menu"]
  },

  "festivals": {
    "enabled": ["chinese-new-year", "mid-autumn"],
    "disabled": ["dragon-boat", "wedding-banquet"]
  },

  "reservations": {
    "provider": "custom",
    "opentableId": null,
    "resyVenueId": null,
    "privateDining": true,
    "catering": true,
    "maxPartySize": 300
  },

  "seatingCapacity": {
    "regular": 80,
    "banquet": 300
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
    "vip_membership": false,
    "press_section": false,
    "cocktail_menu": false,
    "wine_list": false,
    "kids_menu": false,
    "tasting_menu": false,
    "weekend_brunch": true
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

## 5. Menu Catalog — O3 Pruning Reference

| Menu ID | Content Files | DB Table Filter | Required for |
|---|---|---|---|
| `dim-sum` | `menu/dim-sum.json` | menu_categories WHERE menu_type='dim-sum' | Dim Sum parlors, Cantonese |
| `dinner` | `menu/dinner.json` | menu_categories WHERE menu_type='dinner' | All |
| `chef-signatures` | `menu/chef-signatures.json` | is_chef_signature=true items | Fine dining, chef-driven |
| `weekend-brunch` | `menu/weekend-brunch.json` | menu_categories WHERE menu_type='weekend-brunch' | Cantonese, Dim Sum |
| `breakfast` | `menu/breakfast.json` | menu_type='breakfast' | Congee breakfast only |
| `lunch` | `menu/lunch.json` | menu_type='lunch' | Set lunch format |
| `seasonal` | `menu/seasonal.json` | menu_type='seasonal' | Rotating seasonal |
| `tasting-menu` | `menu/tasting-menu.json` | menu_type='tasting-menu' | Fine dining only |
| `cocktails` | `menu/cocktails.json` | menu_type='cocktails' | Licensed bars |
| `wine` | `menu/wine.json` | menu_type='wine' | Wine program |
| `beverages` | `menu/beverages.json` | menu_type='beverages' | All (tea/drinks) |
| `desserts` | `menu/desserts.json` | menu_type='desserts' | All |
| `kids` | `menu/kids.json` | menu_type='kids' | Family-focused |

**Festival Pruning:**

| Festival ID | Slug | Pages Pruned if Disabled |
|---|---|---|
| `chinese-new-year` | chinese-new-year | `pages/festivals/chinese-new-year.json` (all locales) |
| `mid-autumn` | mid-autumn | `pages/festivals/mid-autumn.json` (all locales) |
| `dragon-boat` | dragon-boat | `pages/festivals/dragon-boat.json` (all locales) |
| `wedding-banquet` | wedding-banquet | `pages/festivals/wedding-banquet.json` (all locales) |

---

## 6. Replacement Pairs — O4

**Replacement pairs applied in this exact order** (longest/most specific first to prevent collisions):

| # | From (Grand Pavilion) | To (Client value) |
|---|---|---|
| 1 | `大观楼` | `intake.business.nameZh` |
| 2 | `厨师长李伟` | `intake.business.ownerNameZh` |
| 3 | `粤菜` | `intake.business.cuisineTypeZh` |
| 4 | `传统粤菜精髓` | `正宗{cuisineTypeZh}精髓` |
| 5 | `传承粤菜精髓，2008年创立` | (AI rewrite in O5) |
| 6 | `Grand Pavilion` | `intake.business.name` |
| 7 | `Chef Li Wei` | `intake.business.ownerName` |
| 8 | `Executive Chef & Founder` | `intake.business.ownerTitle` |
| 9 | `Cantonese` | `intake.business.cuisineType` |
| 10 | `30 Years of Cantonese Mastery` | (AI rewrite in O5) |
| 11 | `Flushing, New York` | `{city}, {state}` |
| 12 | `Flushing, NY` | `{city}, {state}` |
| 13 | `Flushing` | `intake.location.city` |
| 14 | `133-24 Roosevelt Ave` | `intake.location.address` |
| 15 | `11354` | `intake.location.zip` |
| 16 | `(718) 555-0188` | `intake.location.phone` |
| 17 | `info@grandpavilionny.com` | `intake.location.email` |
| 18 | `grandpavilionny.com` | `intake.domains.production` |
| 19 | `@grandpavilionny` | `intake.social.instagram` |
| 20 | `facebook.com/grandpavilionny` | `intake.social.facebook` |
| 21 | `大观楼餐厅` | `intake.social.wechatAccountName` |
| 22 | `grand-pavilion` | `intake.clientId` |

**Structural rebuilds** (not string replacement — full object replacement):
- `site.json` → complete rebuild with intake data
- `header.json` → update logo.text, restaurantNameZh
- `navigation.json` → update cta.href if different
- Reservation config in `pages/reservations.json`
- Feature flags in site config

---

## 7. AI Prompt Spec — O5

### Call 1 — content.md

**Template file:** `scripts/onboard/prompts/chinese-restaurant/content.md`

```markdown
You are a Chinese restaurant copywriter. Write original content for a new restaurant.
Every restaurant must have unique copy — do NOT reuse Grand Pavilion's phrasing.

## Restaurant Profile
- Name (EN): {{restaurantName}}
- Name (ZH): {{restaurantNameZh}}
- Chef: {{ownerName}} ({{ownerTitle}})
- Chef (ZH): {{ownerNameZh}} ({{ownerTitleZh}})
- Chef Origin: {{chefOrigin}}
- Chef Training: {{chefTraining}}
- Cuisine: {{cuisineType}} · {{cuisineTypeZh}}
- Subtype: {{subType}}
- City: {{city}}, {{state}}
- Founded: {{foundedYear}}
- Voice/Tone: {{voice}}
- Team: {{teamMembers}}

## Task
Generate fresh, original bilingual content. Return ONLY raw JSON — no markdown, no fences.

{
  "hero": {
    "tagline": "6-8 words, memorable, mentions city or key differentiator",
    "taglineZh": "与英文对应的中文标语，6-10个字",
    "description": "1-2 sentences, mentions city, cuisine type, key offerings",
    "descriptionZh": "对应中文描述，1-2句"
  },
  "aboutStory": "3 paragraphs. Founding year, chef's journey, community roots. ~200 words.",
  "aboutStoryZh": "对应中文故事，3段，约200字",
  "chefBio": "3 paragraphs professional bio. Training, expertise, philosophy. ~250 words.",
  "chefBioZh": "对应中文厨师简介，3段，约250字",
  "chefQuote": "1 sentence, chef's philosophy on food or hospitality",
  "chefQuoteZh": "对应中文引言，1句话",
  "teamBios": [
    { "slug": "slugified-name", "bio": "~150 words", "bioZh": "对应中文简介，约150字" }
  ],
  "whyChooseUs": [
    { "icon": "heart|search|user|award|sparkles|shield|clock|book-open",
      "title": "3-5 words", "titleZh": "对应中文标题",
      "description": "1 sentence", "descriptionZh": "对应中文描述" }
  ],
  "testimonials": [
    { "patientName": "First Last", "text": "2-3 sentences", "textZh": "对应中文评价",
      "lang": "en", "serviceCategory": "dim-sum|dinner|private-dining|catering|chef-signature", "rating": 5 },
    { "patientName": "中文姓名", "text": "留英文原文", "textZh": "2-3句中文评价",
      "lang": "zh", "serviceCategory": "dim-sum", "rating": 5 }
  ],
  "announcementBar": "3-5 words, e.g. 'Now Accepting Reservations'"
}

Rules:
- Generate exactly 5 whyChooseUs items
- Generate exactly 6 testimonials: 4 EN + 2 ZH
- teamBios: 1 bio per team member listed above (skip if none)
- All content must sound natural and specific to THIS restaurant's cuisine and chef
- ZH content must be real Chinese — not romanized, not English with Chinese characters added
- Chef bio must mention chefOrigin and chefTraining if provided
```

### Call 2 — seo.md

**Template file:** `scripts/onboard/prompts/chinese-restaurant/seo.md`

```markdown
You are a bilingual Chinese restaurant SEO specialist.
Write unique SEO titles and descriptions for every page.

## Restaurant Profile
- Name (EN): {{restaurantName}}
- Name (ZH): {{restaurantNameZh}}
- Cuisine: {{cuisineType}} · {{cuisineTypeZh}}
- City: {{city}}, {{state}}
- Enabled pages: {{enabledPages}}

## Task
Generate SEO metadata for all enabled pages. Return ONLY raw JSON.

{
  "en": {
    "/": { "title": "...", "description": "..." },
    "/menu": { "title": "...", "description": "..." },
    "/menu/dim-sum": { "title": "...", "description": "..." },
    "/menu/dinner": { "title": "...", "description": "..." },
    "/menu/chef-signatures": { "title": "...", "description": "..." },
    "/about": { "title": "...", "description": "..." },
    "/reservations": { "title": "...", "description": "..." },
    "/private-dining": { "title": "...", "description": "..." },
    "/catering": { "title": "...", "description": "..." },
    "/gallery": { "title": "...", "description": "..." },
    "/contact": { "title": "...", "description": "..." },
    "/festivals/chinese-new-year": { "title": "...", "description": "..." },
    "/festivals/mid-autumn": { "title": "...", "description": "..." }
  },
  "zh": {
    "/": { "title": "...（中文）", "description": "..." },
    "/menu/dim-sum": { "title": "...", "description": "..." }
  }
}

Rules for EN titles: "[PageName] — [RestaurantName] | [CuisineType] in [City]"
Rules for ZH titles: "[页面名] — [餐厅中文名] | [城市][菜系]"
Description: 140-160 characters. Mention: restaurant name, cuisine, city, key selling point.
Only generate SEO for pages in enabledPages list.
```

### Call 3 — menu.md

**Template file:** `scripts/onboard/prompts/chinese-restaurant/menu.md`

```markdown
You are a Chinese restaurant menu copywriter.
Rewrite menu item descriptions — paraphrase, never copy.

## Restaurant
- Name: {{restaurantName}} · {{restaurantNameZh}}
- Cuisine: {{cuisineType}} · {{cuisineTypeZh}}
- City: {{city}}
- Voice: {{voice}}
- Dim Sum enabled: {{dimSumEnabled}}
- Menu types: {{enabledMenuTypes}}

## Task
Generate fresh descriptions for the enabled menu categories.
Return ONLY raw JSON — no markdown.

{
  "categories": [
    {
      "menuType": "dim-sum",
      "intro": "1-2 sentences introducing this menu section for this specific restaurant",
      "introZh": "对应中文介绍，1-2句"
    }
  ],
  "featuredItemDescriptions": [
    {
      "nameEn": "Har Gow",
      "nameZh": "虾饺",
      "description": "Fresh rewrite of the dim sum classic description. 1-2 sentences.",
      "descriptionZh": "对应中文描述，1-2句"
    }
  ]
}

Rules:
- Generate category intro for each enabled menu type
- Rewrite descriptions for: featured items + all chef signature items (is_chef_signature=true)
- Never copy Grand Pavilion's exact phrasing
- ZH descriptions must be authentic Chinese food writing
- featuredItemDescriptions: include all items where featured=true from the DB (passed via context)
```

---

## 8. Brand Variants Config

**File:** `scripts/onboard/brand-variants-chinese-restaurant.json`

```json
{
  "hao-zhan": {
    "preset": { "id": "hao-zhan", "name": "Hao Zhan 豪展", "category": "chinese-fine-dining" },
    "for": "Fine dining Cantonese / Shanghainese",
    "colors": { "primary": "#1A1A1A", "secondary": "#C9A84C", "backdrop": "#F5F0E8" },
    "typography": { "fontDisplay": "Cormorant Garamond", "fontDisplayZh": "Noto Serif SC" }
  },
  "hongxiang": {
    "preset": { "id": "hongxiang", "name": "Hong Xiang 鴻翔", "category": "chinese-dim-sum" },
    "for": "Dim Sum / Yum Cha / Traditional Banquet",
    "colors": { "primary": "#8B1A1A", "secondary": "#C9A84C", "backdrop": "#FDF6E3" },
    "typography": { "fontDisplay": "EB Garamond", "fontDisplayZh": "Noto Serif SC" }
  },
  "longmen": {
    "preset": { "id": "longmen", "name": "Long Men 龍門", "category": "chinese-contemporary" },
    "for": "Contemporary Fusion / Chef-Driven / Sichuan Modern",
    "colors": { "primary": "#2C1810", "secondary": "#C0392B", "backdrop": "#0A0A0A" },
    "typography": { "fontDisplay": "DM Serif Display", "fontDisplayZh": "Noto Serif SC" }
  },
  "shuimo": {
    "preset": { "id": "shuimo", "name": "Shui Mo 水墨", "category": "chinese-minimalist" },
    "for": "Modern Minimalist / Taiwanese / Tea House",
    "colors": { "primary": "#2F2F2F", "secondary": "#8B0000", "backdrop": "#F9F6F0" },
    "typography": { "fontDisplay": "Libre Baskerville", "fontDisplayZh": "Noto Serif SC" }
  }
}
```

**Variant selection guide for intake form:**
- Fine dining, Cantonese, Shanghainese → `hao-zhan`
- Dim Sum, Yum Cha, Traditional banquet, Teahouse → `hongxiang`
- Contemporary fusion, Chef's table, Sichuan modern → `longmen`
- Modern Chinese, Taiwanese, Tea bar adjacent → `shuimo`
- Hong Kong-style café (茶餐厅) → `shuimo`
- Seafood focus, Cantonese fine dining → `hao-zhan`

---

## 9. O7 Contamination Verification

O7 scans all content_entries for the new client and checks for any of these Grand Pavilion-specific strings. Finding any is a pipeline failure:

| String | Type |
|---|---|
| `Grand Pavilion` | Restaurant name EN |
| `大观楼` | Restaurant name ZH |
| `Chef Li Wei` | Chef name EN |
| `厨师长李伟` | Chef name ZH |
| `133-24 Roosevelt Ave` | Address |
| `grandpavilionny.com` | Domain |
| `(718) 555-0188` | Phone |
| `info@grandpavilionny.com` | Email |
| `@grandpavilionny` | Instagram handle |
| `grand-pavilion` | site_id (should have been replaced with clientId) |

If contamination found: log the affected `path` and the specific term. Pipeline exits with error. Fix the replacement pair or the source data, then re-run from O4.

---

## 10. Admin UI Wizard

The admin onboarding wizard at `/admin/onboarding` provides a browser-based interface for Pipeline B.

**Wizard steps (match O1–O7):**

1. **Client Info** — form inputs mapping to intake.business + intake.location
2. **Brand** — variant selector (shows preview thumbnail per variant)
3. **Menu Types** — checkboxes for each menu type
4. **Festivals** — checkboxes for each festival
5. **Features** — toggle switches for feature flags
6. **Languages** — checkbox group for enabled locales
7. **Review** — shows the generated intake JSON before running
8. **Run Pipeline** — triggers POST /api/admin/onboarding with SSE progress

**SSE progress events** (shown in real-time in browser):
```
{"step": "O1", "status": "running", "message": "Cloning grand-pavilion..."}
{"step": "O1", "status": "done", "message": "Cloned 142 content rows"}
{"step": "O2", "status": "running", "message": "Applying hongxiang theme..."}
{"step": "O2", "status": "done", "message": "Brand variant applied"}
...
{"step": "O7", "status": "done", "message": "ALL CHECKS PASSED"}
{"step": "complete", "status": "done", "siteUrl": "https://...", "elapsed": "72s"}
```

---

## 11. CLI Interface

```bash
# Standard run (with AI)
node scripts/onboard-client.mjs [client-id]

# Skip AI generation (fast, for testing structure)
node scripts/onboard-client.mjs [client-id] --skip-ai

# Dry run (preview what would happen, no DB writes)
node scripts/onboard-client.mjs [client-id] --dry-run

# Delete a site (for cleanup/testing)
node scripts/delete-site.mjs [client-id]

# Verify an existing site
node scripts/onboard/o7-verify.mjs [client-id]

# Run full QA on a client site
npm run qa -- --site=[client-id]
```

---

## 12. Post-Pipeline Content Checklist

After the automated pipeline completes, a developer must:

| Task | Who | Est. Time |
|---|---|---|
| Upload hero photos (food, chef, dining room) | Developer | 30 min |
| Upload gallery photos (20–50 images) | Developer | 45 min |
| Enter client's actual menu items (if using client's own menu) | Developer | 60–120 min |
| Upload WeChat QR image | Developer | 5 min |
| Add Google Maps embed URL | Developer | 5 min |
| Set correct reservation widget ID (OT/Resy if not custom) | Developer | 10 min |
| Review AI-generated hero copy with client | Account manager | 20 min |
| Review AI-generated chef bio with client | Account manager | 15 min |
| Add press mentions if any | Developer | 15 min |
| Test all 5 forms end-to-end | Developer | 20 min |
| Run QA scripts | Developer | 10 min |

**Total post-pipeline time: ~4–6 hours**

---

## 13. Client Handoff Protocol

After QA passes and client approves copy:

1. **Credentials email to client:**
   - Admin URL: `https://[domain]/admin`
   - Username: client-provided email
   - Temporary password: (auto-generated)
   - Admin training video link (record a 10-min Loom walkthrough)

2. **Client can self-manage:**
   - Menu: add/edit/delete items with name_zh
   - Gallery: upload photos
   - Blog: write posts (EN + ZH)
   - Events: add upcoming events
   - Festivals: update urgency count before festival season
   - Site settings: update hours (holiday hours)

3. **Client cannot change without developer:**
   - Domain (requires Vercel + DNS)
   - Theme variant (requires admin-level access)
   - Add new locales (requires Pipeline B re-run)

---

## 14. Production Deployment Per Client

Each client gets their own Supabase project OR shares the multi-tenant project.

**Recommended: Shared Supabase project** (same project as Grand Pavilion template)
- All clients isolated by `site_id` (RLS enforced)
- One Supabase project for all Chinese restaurant clients
- Cheaper, easier to manage

**Add client domain to Vercel:**
1. In Vercel project settings → Domains → Add domain: `[client-domain.com]`
2. Add DNS: A record `@` → `76.76.21.21`
3. Wait for SSL (1–5 min)
4. Update `site_domains` table: `INSERT INTO site_domains (site_id, domain, is_primary) VALUES ('[client-id]', '[client-domain.com]', true)`
5. The Meridian-inherited middleware resolves hostname → site_id automatically

---

## 15. Pipeline B Done-Gate

| Check | How to Verify | Pass Criteria |
|---|---|---|
| O7 passes | Pipeline output | "ALL CHECKS PASSED" |
| No contamination | O7 output | 0 Grand Pavilion strings found |
| Correct brand variant | Admin → theme picker | Shows client's selected variant |
| Restaurant name correct | /en/ home page | Shows client's restaurant name |
| ZH name correct | /zh/ home page | Shows client's Chinese name |
| Disabled menu types hidden | /menu/ | No tabs for disabled types |
| Disabled festivals 404 | /en/festivals/[disabled] | Returns 404 |
| Disabled locales removed | /[disabled-locale]/ | Returns 404 |
| AI hero tagline unique | /en/ home page | Different from "Cantonese Mastery Since 2008" |
| Forms work | Test submit each form | DB row created + email received |
| Execution time | Pipeline log | < 90 seconds (with AI) |
| Admin CMS works | Login to /admin | Can edit and save content |

---

## 16. Anti-Patterns

| Anti-Pattern | Why It Fails | BAAM Solution |
|---|---|---|
| Modifying grand-pavilion template for a client | Contaminates the template — future clones inherit the change | Never touch grand-pavilion content. Each client gets their own site_id |
| Running Pipeline B twice for same client | O1 fails (site_id exists) or creates duplicate content | Run `delete-site.mjs` first, then re-run |
| Skipping O7 | Contamination goes undetected → client sees wrong restaurant name | O7 is mandatory. Pipeline fails with error if O7 fails |
| Editing client content manually instead of fixing pipeline | Obscures pipeline bugs. Future clients face same bug | Fix the pipeline. Then re-run |
| Generating ZH content as auto-translated EN | Machine translation is detectable and offensive to Chinese readers | O5 generates ZH directly from Claude in the same prompt as EN — never translates |
| Setting name_zh as optional in pipeline intake | Pipeline completes but ZH site has no Chinese names | name_zh is validated in O1: pipeline fails if nameZh is empty |
| Using same Anthropic API key for all clients | No usage tracking per client | Use one key but log `clientId` in each API call metadata |
| Not testing --dry-run before first client | Unknown side effects in production | Always dry-run first for new intake format |
