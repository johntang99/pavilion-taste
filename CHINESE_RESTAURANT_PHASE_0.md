# BAAM System F — Chinese Restaurant Premium
# Phase 0: Fork Meridian + Chinese Variants + Content Contracts

> **System:** BAAM System F — Chinese Restaurant Premium
> **Reference files:** `@RESTAURANT_CHINESE_COMPLETE_PLAN.md`
> **Baseline codebase:** `restaurant/meridian` — fork this workspace (NOT drhuangclinic)
> **Prerequisite:** Stage A all 6 artifacts complete, all 7 A-Gates passed
> **Method:** One Cursor prompt per session. Verify done-gate before next prompt.
> **Rule:** Never skip a done-gate. Never run the next prompt until the current one is clean.

---

## Phase 0 Overview

**Duration:** Day 1–3
**Goal:** Fork Meridian into a Chinese restaurant codebase. Keep ALL existing restaurant components. Add Chinese-specific tables, brand variants, typography, content contracts, and seed the Grand Pavilion 大观楼 demo site — so Phase 1 can build Chinese-specific pages immediately.

## Prompt Index

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 0A | Fork Meridian → Chinese Restaurant | New repo, strip Meridian demo, setup `grand-pavilion` site | 45 min |
| 0B | 4 Chinese Brand Variants + ZH Typography | hao-zhan · hongxiang · longmen · shuimo + Noto SC fonts | 60 min |
| 0C | DB — New Chinese-Specific Tables | festivals, chef_signatures, banquet_packages, dim_sum_orders | 45 min |
| 0D | Content Contracts — Chinese Extensions | TypeScript interfaces + JSON schemas for all Chinese sections | 60 min |
| 0E | Seed Content — Grand Pavilion Demo | 80 menu items (ZH names), 2 festivals, 3 banquet tiers, 25 testimonials | 90 min |

---

## Prompt 0A — Fork Meridian → Chinese Restaurant Codebase

**Goal:** Establish the Chinese restaurant codebase from `restaurant/meridian`. Remove only Meridian demo content. Keep every restaurant component, admin system, lib/, and scripts/ intact.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md

START FROM: The restaurant/meridian codebase in this workspace.
This is a fork — NOT a rebuild from scratch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Remove Meridian demo content (content files only, NOT components)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Delete these content directories:
- content/meridian-diner/ (all demo JSON)
- content/the-meridian/ (if present)
- public/uploads/meridian-diner/ (demo images)

Keep everything else — every component, lib file, admin page, and script is reused.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Create new demo site: grand-pavilion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace content/_sites.json with:

{
  "grand-pavilion": {
    "id": "grand-pavilion",
    "name": "Grand Pavilion",
    "nameZh": "大观楼",
    "domain": "grandpavilion.local",
    "locales": ["en", "zh"],
    "defaultLocale": "en",
    "enabled": true,
    "type": "chinese-restaurant",
    "subType": "dim-sum-cantonese",
    "cuisineType": "Cantonese",
    "cuisineTypeZh": "粤菜",
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
      "press_section": true,
      "cocktail_menu": false,
      "wine_list": false,
      "kids_menu": false,
      "tasting_menu": false,
      "weekend_brunch": true
    }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Create directory structure for grand-pavilion content
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these empty directories (we'll populate them in 0E):

content/grand-pavilion/
├── en/
│   ├── pages/
│   │   ├── festivals/   (new — Chinese restaurant only)
│   └── menu/
└── zh/
    ├── pages/
    │   ├── festivals/
    └── menu/

Create image directories:
public/uploads/grand-pavilion/
├── hero/
├── menu/
├── chef/
├── gallery/
├── festivals/
└── banquet/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — New Supabase project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL: Create a new Supabase project named "BAAM-Chinese-Restaurant".
Never reuse the Meridian Supabase project.

Update .env.local.example with placeholders:
NEXT_PUBLIC_DEFAULT_SITE=chinese-restaurant
NEXT_PUBLIC_DEFAULT_SITE_ID=grand-pavilion
NEXT_PUBLIC_SITE_URL=http://localhost:3060
APP_ENV=development

SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=change-me-to-a-long-random-string
RESEND_API_KEY=
RESEND_FROM=noreply@yourdomain.com
CONTACT_FALLBACK_TO=restaurant@yourdomain.com
ALERT_TO=admin@yourdomain.com

ANTHROPIC_API_KEY=
AI_CHAT_MODEL=claude-sonnet-4-6

CRON_SECRET=

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Update package.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update name field: "baam-chinese-restaurant"
Update description: "BAAM System F — Chinese Restaurant Premium Template"
Update dev port: add "dev": "next dev -p 3060"
```

**Done-Gate 0A:**
- `npm run dev` starts on port 3060 with no errors
- `http://localhost:3060` loads (may show 404 — content not seeded yet, that's OK)
- `content/grand-pavilion/en/` directory exists
- No `meridian-diner` content files remain

---

## Prompt 0B — 4 Chinese Brand Variants + ZH Typography

**Goal:** Add 4 Chinese-specific brand variants to the theme system. Extend the theme token set with Chinese typography tokens. Update `layout.tsx` to preload Noto SC fonts.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A5: Visual Design Direction

The existing Meridian theme system handles brand variants via JSON files in
/data/theme-presets/ (or equivalent theme preset directory — check where
the Meridian theme presets live and use that exact location).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — Create 4 Chinese brand variant theme files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the same directory where Meridian's noir-saison.json, terre-vivante.json,
velocite.json, and matin-clair.json live — create these 4 new files.

Each file must include ALL existing theme token groups from the Meridian
variants (colors, typography, spacing, effects, motion, layout) PLUS
the new Chinese-specific tokens listed below.

--- FILE 1: hao-zhan.json ---
Variant for: Fine dining Cantonese / Shanghainese
Character: Grand, authoritative, ink black and antique gold

{
  "preset": {
    "id": "hao-zhan",
    "name": "Hao Zhan 豪展",
    "nameZh": "豪展",
    "category": "chinese-fine-dining",
    "description": "Grand Display — ink black and antique gold for elevated Cantonese dining"
  },
  "colors": {
    "primary": "#1A1A1A",
    "primaryDark": "#0A0A0A",
    "primaryLight": "#2F2F2F",
    "primary50": "#8A8A8A",
    "primary100": "#6A6A6A",
    "secondary": "#C9A84C",
    "secondaryDark": "#A88A3A",
    "secondaryLight": "#DFC070",
    "backdrop": "#F5F0E8",
    "backdropSurface": "#EDE8DF",
    "backdropMuted": "#FAF7F2",
    "text": "#1A1A1A",
    "textSecondary": "#5A5248",
    "textMuted": "#8A8278",
    "textOnDark": "#F5F0E8",
    "border": "#D4C9B8",
    "borderSubtle": "#E8E0D4",
    "accent": "#8B0000",
    "accentMuted": "#C0392B",
    "success": "#2D6A4F",
    "warning": "#C9A84C",
    "error": "#8B0000"
  },
  "typography": {
    "fontDisplay": "Cormorant Garamond",
    "fontHeading": "Cormorant Garamond",
    "fontBody": "Lato",
    "fontUi": "Lato",
    "fontDisplayZh": "Noto Serif SC",
    "fontBodyZh": "Noto Sans SC",
    "sizeDisplay": "4.5rem",
    "sizeHeading": "2.25rem",
    "sizeSubheading": "1.5rem",
    "sizeBody": "1rem",
    "sizeSmall": "0.875rem",
    "sizeCaption": "0.75rem",
    "weightDisplay": "300",
    "weightHeading": "400",
    "weightBody": "400",
    "weightDisplayZh": "700",
    "weightHeadingZh": "600",
    "trackingDisplay": "0.12em",
    "trackingHeading": "0.08em",
    "trackingNav": "0.15em",
    "trackingCaption": "0.1em",
    "lineHeightDisplay": "1.1",
    "lineHeightBody": "1.7"
  },
  "spacing": {
    "sectionPy": "6rem",
    "sectionPySmall": "4rem",
    "containerMaxWidth": "1280px",
    "containerPx": "1.5rem",
    "cardPadding": "2rem",
    "navHeight": "72px",
    "gridGap": "1.5rem",
    "gridGapLarge": "2.5rem"
  },
  "effects": {
    "cardRadius": "0px",
    "btnRadius": "0px",
    "imageRadius": "0px",
    "inputRadius": "2px",
    "cardShadow": "0 1px 3px rgba(0,0,0,0.08)",
    "cardShadowHover": "0 4px 16px rgba(0,0,0,0.12)",
    "overlayDark": "rgba(10,10,10,0.55)",
    "overlayLight": "rgba(245,240,232,0.85)",
    "divider": "1px solid #D4C9B8"
  },
  "motion": {
    "durationFast": "150ms",
    "durationBase": "300ms",
    "durationSlow": "600ms",
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)",
    "hoverLift": "translateY(-2px)",
    "entranceDistance": "24px"
  },
  "layout": {
    "heroVariant": "fullscreen",
    "featureVariant": "editorial",
    "spacingDensity": "generous"
  },
  "chinese": {
    "inkOverlayOpacity": "0.25",
    "inkOverlayColor": "#1A1A1A",
    "paperCutColor": "#C9A84C",
    "sealColor": "#8B0000",
    "festivalAccent": "#C9A84C",
    "brushDividerColor": "#D4C9B8",
    "zhNameDisplay": "below",
    "lanternColor": "#8B0000"
  },
  "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lato:wght@300;400;700&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500&display=swap"
}

--- FILE 2: hongxiang.json ---
Variant for: Dim Sum / Yum Cha / Traditional Banquet
Character: Festive, traditional, deep crimson and imperial gold

{
  "preset": { "id": "hongxiang", "name": "Hong Xiang 鴻翔", "nameZh": "鴻翔", "category": "chinese-dim-sum", "description": "Soaring Phoenix — deep crimson and imperial gold for traditional Cantonese dim sum and banquet" },
  "colors": {
    "primary": "#8B1A1A",
    "primaryDark": "#6B0A0A",
    "primaryLight": "#B02020",
    "primary50": "#D08080",
    "primary100": "#C06060",
    "secondary": "#C9A84C",
    "secondaryDark": "#A88A3A",
    "secondaryLight": "#DFC070",
    "backdrop": "#FDF6E3",
    "backdropSurface": "#F5EDD6",
    "backdropMuted": "#FFFBF0",
    "text": "#1A0A0A",
    "textSecondary": "#5A3838",
    "textMuted": "#8A6868",
    "textOnDark": "#FDF6E3",
    "border": "#D4B898",
    "borderSubtle": "#E8D8C4",
    "accent": "#1A1A1A",
    "accentMuted": "#3A3A3A",
    "success": "#2D6A4F",
    "warning": "#C9A84C",
    "error": "#6B0A0A"
  },
  "typography": {
    "fontDisplay": "EB Garamond",
    "fontHeading": "EB Garamond",
    "fontBody": "Lato",
    "fontUi": "Lato",
    "fontDisplayZh": "Noto Serif SC",
    "fontBodyZh": "Noto Sans SC",
    "sizeDisplay": "4rem",
    "sizeHeading": "2.25rem",
    "sizeSubheading": "1.5rem",
    "sizeBody": "1rem",
    "sizeSmall": "0.875rem",
    "sizeCaption": "0.75rem",
    "weightDisplay": "400",
    "weightHeading": "400",
    "weightBody": "400",
    "weightDisplayZh": "700",
    "weightHeadingZh": "600",
    "trackingDisplay": "0.06em",
    "trackingHeading": "0.04em",
    "trackingNav": "0.12em",
    "trackingCaption": "0.08em",
    "lineHeightDisplay": "1.15",
    "lineHeightBody": "1.75"
  },
  "spacing": { "sectionPy": "5rem", "sectionPySmall": "3.5rem", "containerMaxWidth": "1280px", "containerPx": "1.5rem", "cardPadding": "1.75rem", "navHeight": "68px", "gridGap": "1.5rem", "gridGapLarge": "2.5rem" },
  "effects": { "cardRadius": "4px", "btnRadius": "2px", "imageRadius": "4px", "inputRadius": "4px", "cardShadow": "0 2px 8px rgba(139,26,26,0.08)", "cardShadowHover": "0 6px 20px rgba(139,26,26,0.14)", "overlayDark": "rgba(26,10,10,0.6)", "overlayLight": "rgba(253,246,227,0.88)", "divider": "1px solid #D4B898" },
  "motion": { "durationFast": "150ms", "durationBase": "300ms", "durationSlow": "500ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)", "hoverLift": "translateY(-3px)", "entranceDistance": "20px" },
  "layout": { "heroVariant": "fullscreen", "featureVariant": "centered", "spacingDensity": "standard" },
  "chinese": { "inkOverlayOpacity": "0.30", "inkOverlayColor": "#8B1A1A", "paperCutColor": "#8B1A1A", "sealColor": "#8B1A1A", "festivalAccent": "#C9A84C", "brushDividerColor": "#D4B898", "zhNameDisplay": "above", "lanternColor": "#8B1A1A" },
  "googleFontsUrl": "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;700&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500&display=swap"
}

--- FILE 3: longmen.json ---
Variant for: Contemporary Fusion, Chef-Driven, Sichuan Modern
Character: Dramatic, near-black + lacquer red

{
  "preset": { "id": "longmen", "name": "Long Men 龍門", "nameZh": "龍門", "category": "chinese-contemporary", "description": "Dragon Gate — dramatic dark with lacquer red for bold chef-driven Chinese cuisine" },
  "colors": {
    "primary": "#2C1810",
    "primaryDark": "#1A0A05",
    "primaryLight": "#3F2518",
    "primary50": "#8A7060",
    "primary100": "#6A5040",
    "secondary": "#C0392B",
    "secondaryDark": "#9B2D22",
    "secondaryLight": "#D95B4A",
    "backdrop": "#0A0A0A",
    "backdropSurface": "#141414",
    "backdropMuted": "#1E1E1E",
    "text": "#F5F0E8",
    "textSecondary": "#C8BFB5",
    "textMuted": "#8A8278",
    "textOnDark": "#F5F0E8",
    "border": "#2F2520",
    "borderSubtle": "#241C18",
    "accent": "#C9A84C",
    "accentMuted": "#A88A3A",
    "success": "#4A9B6F",
    "warning": "#C9A84C",
    "error": "#C0392B"
  },
  "typography": {
    "fontDisplay": "DM Serif Display",
    "fontHeading": "DM Serif Display",
    "fontBody": "DM Sans",
    "fontUi": "DM Sans",
    "fontDisplayZh": "Noto Serif SC",
    "fontBodyZh": "Noto Sans SC",
    "sizeDisplay": "5rem",
    "sizeHeading": "2.5rem",
    "sizeSubheading": "1.5rem",
    "sizeBody": "1rem",
    "sizeSmall": "0.875rem",
    "sizeCaption": "0.75rem",
    "weightDisplay": "400",
    "weightHeading": "400",
    "weightBody": "400",
    "weightDisplayZh": "700",
    "weightHeadingZh": "700",
    "trackingDisplay": "-0.03em",
    "trackingHeading": "-0.02em",
    "trackingNav": "0.1em",
    "trackingCaption": "0.06em",
    "lineHeightDisplay": "1.05",
    "lineHeightBody": "1.65"
  },
  "spacing": { "sectionPy": "5.5rem", "sectionPySmall": "4rem", "containerMaxWidth": "1280px", "containerPx": "1.5rem", "cardPadding": "2rem", "navHeight": "76px", "gridGap": "2rem", "gridGapLarge": "3rem" },
  "effects": { "cardRadius": "0px", "btnRadius": "0px", "imageRadius": "0px", "inputRadius": "0px", "cardShadow": "none", "cardShadowHover": "0 0 0 1px #C0392B", "overlayDark": "rgba(0,0,0,0.70)", "overlayLight": "rgba(10,10,10,0.85)", "divider": "1px solid #2F2520" },
  "motion": { "durationFast": "100ms", "durationBase": "250ms", "durationSlow": "500ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)", "hoverLift": "none", "entranceDistance": "32px" },
  "layout": { "heroVariant": "fullscreen-dark", "featureVariant": "editorial-dark", "spacingDensity": "generous" },
  "chinese": { "inkOverlayOpacity": "0.20", "inkOverlayColor": "#000000", "paperCutColor": "#C0392B", "sealColor": "#C0392B", "festivalAccent": "#C9A84C", "brushDividerColor": "#2F2520", "zhNameDisplay": "below", "lanternColor": "#C0392B" },
  "googleFontsUrl": "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500&display=swap"
}

--- FILE 4: shuimo.json ---
Variant for: Modern Minimalist Chinese, Taiwanese, Tea House
Character: Refined, off-white and charcoal with cinnabar accent

{
  "preset": { "id": "shuimo", "name": "Shui Mo 水墨", "nameZh": "水墨", "category": "chinese-minimalist", "description": "Ink Wash — refined off-white and charcoal for modern minimal Chinese dining" },
  "colors": {
    "primary": "#2F2F2F",
    "primaryDark": "#1A1A1A",
    "primaryLight": "#444444",
    "primary50": "#969696",
    "primary100": "#767676",
    "secondary": "#8B0000",
    "secondaryDark": "#6B0000",
    "secondaryLight": "#B01010",
    "backdrop": "#F9F6F0",
    "backdropSurface": "#F0ECE4",
    "backdropMuted": "#FDFAF6",
    "text": "#1A1A1A",
    "textSecondary": "#4A4A4A",
    "textMuted": "#7A7A7A",
    "textOnDark": "#F9F6F0",
    "border": "#DDD8D0",
    "borderSubtle": "#EDE8E0",
    "accent": "#8B0000",
    "accentMuted": "#B01010",
    "success": "#3A7A5A",
    "warning": "#B8860B",
    "error": "#8B0000"
  },
  "typography": {
    "fontDisplay": "Libre Baskerville",
    "fontHeading": "Libre Baskerville",
    "fontBody": "Source Sans 3",
    "fontUi": "Source Sans 3",
    "fontDisplayZh": "Noto Serif SC",
    "fontBodyZh": "Noto Sans SC",
    "sizeDisplay": "4rem",
    "sizeHeading": "2rem",
    "sizeSubheading": "1.375rem",
    "sizeBody": "1rem",
    "sizeSmall": "0.875rem",
    "sizeCaption": "0.75rem",
    "weightDisplay": "400",
    "weightHeading": "700",
    "weightBody": "400",
    "weightDisplayZh": "700",
    "weightHeadingZh": "500",
    "trackingDisplay": "0.02em",
    "trackingHeading": "0.01em",
    "trackingNav": "0.08em",
    "trackingCaption": "0.06em",
    "lineHeightDisplay": "1.2",
    "lineHeightBody": "1.75"
  },
  "spacing": { "sectionPy": "5rem", "sectionPySmall": "3.5rem", "containerMaxWidth": "1200px", "containerPx": "1.5rem", "cardPadding": "1.5rem", "navHeight": "64px", "gridGap": "1.5rem", "gridGapLarge": "2.5rem" },
  "effects": { "cardRadius": "2px", "btnRadius": "2px", "imageRadius": "2px", "inputRadius": "4px", "cardShadow": "0 1px 4px rgba(47,47,47,0.06)", "cardShadowHover": "0 4px 12px rgba(47,47,47,0.10)", "overlayDark": "rgba(26,26,26,0.5)", "overlayLight": "rgba(249,246,240,0.90)", "divider": "1px solid #DDD8D0" },
  "motion": { "durationFast": "150ms", "durationBase": "300ms", "durationSlow": "500ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)", "hoverLift": "translateY(-2px)", "entranceDistance": "20px" },
  "layout": { "heroVariant": "split", "featureVariant": "clean", "spacingDensity": "standard" },
  "chinese": { "inkOverlayOpacity": "0.15", "inkOverlayColor": "#2F2F2F", "paperCutColor": "#8B0000", "sealColor": "#8B0000", "festivalAccent": "#8B0000", "brushDividerColor": "#DDD8D0", "zhNameDisplay": "below", "lanternColor": "#8B0000" },
  "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500&display=swap"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — Extend theme CSS variable injection in layout.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In app/[locale]/layout.tsx (or wherever theme tokens are injected into :root),
extend the CSS variable generation to include the new Chinese tokens:

// Add to the existing token → CSS var mapping:
'--font-display-zh': theme.typography.fontDisplayZh,
'--font-body-zh': theme.typography.fontBodyZh,
'--weight-display-zh': theme.typography.weightDisplayZh,
'--weight-heading-zh': theme.typography.weightHeadingZh,
'--ink-overlay-opacity': theme.chinese?.inkOverlayOpacity ?? '0.20',
'--ink-overlay-color': theme.chinese?.inkOverlayColor ?? '#000000',
'--paper-cut-color': theme.chinese?.paperCutColor ?? '#C9A84C',
'--seal-color': theme.chinese?.sealColor ?? '#8B0000',
'--festival-accent': theme.chinese?.festivalAccent ?? '#C9A84C',
'--brush-divider-color': theme.chinese?.brushDividerColor ?? '#D4C9B8',
'--zh-name-display': theme.chinese?.zhNameDisplay ?? 'below',
'--lantern-color': theme.chinese?.lanternColor ?? '#8B0000',

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3 — Preload Chinese fonts in <head>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In app/[locale]/layout.tsx, update the Google Fonts preload logic to use
theme.googleFontsUrl (which already includes Noto Serif SC + Noto Sans SC
for all 4 Chinese variants).

Also add <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
if not already present.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4 — Update theme preset registry
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In lib/theme-presets.ts (or equivalent), register the 4 new Chinese variants
so they appear in the admin theme selector.

Add to the presets array:
{ id: 'hao-zhan', name: 'Hao Zhan 豪展', category: 'chinese-fine-dining' },
{ id: 'hongxiang', name: 'Hong Xiang 鴻翔', category: 'chinese-dim-sum' },
{ id: 'longmen', name: 'Long Men 龍門', category: 'chinese-contemporary' },
{ id: 'shuimo', name: 'Shui Mo 水墨', category: 'chinese-minimalist' },

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 5 — Set grand-pavilion default theme
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create content/grand-pavilion/theme.json — copy hao-zhan.json content
(Grand Pavilion uses the fine dining variant as its default).
```

**Done-Gate 0B:**
- Admin → site settings → theme picker shows all 8 presets (4 Meridian + 4 Chinese)
- Switch grand-pavilion to `hongxiang` → page background changes to warm ivory
- Switch to `longmen` → page background changes to near-black
- Switch back to `hao-zhan` → parchment background returns
- `var(--font-display-zh)` resolves to "Noto Serif SC" in browser dev tools
- `var(--seal-color)` resolves to `#8B0000`
- No hardcoded hex values in CSS variable injection code

---

## Prompt 0C — DB: New Chinese-Specific Tables

**Goal:** Add 3 new tables to the Supabase schema for Chinese restaurant-specific features. Extend existing `menu_items` table with Chinese fields.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A4 Content Contracts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Run this SQL in Supabase (new BAAM-Chinese-Restaurant project)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

First, run all the base tables from RESTAURANT_PHASE_0.md (content_entries,
sites, site_domains, users, media_assets, menu_categories, menu_items,
bookings, events, team_members, gallery_items, press_items,
contact_submissions, private_dining_inquiries).

THEN run these additional Chinese-specific tables:

-- Alter menu_items to add Chinese-specific columns
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS name_zh text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS description_zh text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS origin_region text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_dim_sum boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS dim_sum_category text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_halal boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_kosher boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_chef_signature boolean DEFAULT false;

-- Alter team_members to add Chinese name support
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS name_zh text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS chef_origin text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS chef_training text DEFAULT NULL;

-- Festivals table (Chinese-restaurant specific)
CREATE TABLE festivals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  name_zh text NOT NULL,
  active_date_start date NOT NULL,
  active_date_end date NOT NULL,
  hero_image text DEFAULT NULL,
  tagline text DEFAULT NULL,
  tagline_zh text DEFAULT NULL,
  description text DEFAULT NULL,
  description_zh text DEFAULT NULL,
  urgency_message text DEFAULT NULL,
  urgency_count integer DEFAULT NULL,
  prix_fixe_enabled boolean DEFAULT false,
  gift_boxes_enabled boolean DEFAULT false,
  published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

-- Festival menu items (prix-fixe tiers)
CREATE TABLE festival_menu_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_id uuid REFERENCES festivals(id) ON DELETE CASCADE,
  site_id text NOT NULL,
  tier_name text DEFAULT NULL,
  tier_name_zh text DEFAULT NULL,
  price_per_person integer DEFAULT NULL,
  min_guests integer DEFAULT 2,
  courses jsonb DEFAULT '[]',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Banquet packages
CREATE TABLE banquet_packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  tier text NOT NULL,
  name text NOT NULL,
  name_zh text NOT NULL,
  price_per_head integer NOT NULL,
  min_guests integer NOT NULL,
  max_guests integer NOT NULL,
  includes jsonb DEFAULT '[]',
  includes_zh jsonb DEFAULT '[]',
  highlight text DEFAULT NULL,
  highlight_zh text DEFAULT NULL,
  image text DEFAULT NULL,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(site_id, tier)
);

-- Dim sum pre-orders (optional feature)
CREATE TABLE dim_sum_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text DEFAULT NULL,
  pickup_date date NOT NULL,
  pickup_time text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  notes text DEFAULT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Catering inquiries
CREATE TABLE catering_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT NULL,
  event_date date,
  guest_count integer,
  event_type text,
  service_area text,
  cuisine_preferences text,
  budget_range text,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- RLS Policies for new tables
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE festival_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banquet_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_sum_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read festivals" ON festivals FOR SELECT USING (published = true);
CREATE POLICY "Public read festival_menu_items" ON festival_menu_items FOR SELECT USING (true);
CREATE POLICY "Public read banquet_packages" ON banquet_packages FOR SELECT USING (active = true);
CREATE POLICY "Service full access festivals" ON festivals USING (auth.role() = 'service_role');
CREATE POLICY "Service full access festival_menu_items" ON festival_menu_items USING (auth.role() = 'service_role');
CREATE POLICY "Service full access banquet_packages" ON banquet_packages USING (auth.role() = 'service_role');
CREATE POLICY "Service full access dim_sum_orders" ON dim_sum_orders USING (auth.role() = 'service_role');
CREATE POLICY "Service full access catering_inquiries" ON catering_inquiries USING (auth.role() = 'service_role');

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Add TypeScript types for new tables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create lib/chinese-restaurant-types.ts:

export interface ChineseMenuItem {
  id: string;
  siteId: string;
  categoryId: string;
  slug: string;
  name: { en: string; zh: string };          // both required
  nameZh: string;                             // required — TypeScript enforces this
  description?: { en?: string; zh?: string };
  price?: number;
  priceNote?: { en?: string; zh?: string };
  image?: string;
  dietaryFlags?: string[];
  allergens?: string[];
  featured?: boolean;
  seasonal?: boolean;
  newItem?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
  available?: boolean;
  displayOrder?: number;
  // Chinese-specific
  originRegion?: string;
  isDimSum?: boolean;
  dimSumCategory?: 'steamed' | 'baked' | 'fried' | 'congee-noodle' | 'dessert';
  isHalal?: boolean;
  isKosher?: boolean;
  isChefSignature?: boolean;
}

export interface Festival {
  id: string;
  siteId: string;
  slug: string;
  name: string;
  nameZh: string;
  activeDateStart: string;   // ISO date
  activeDateEnd: string;     // ISO date
  heroImage?: string;
  tagline?: string;
  taglineZh?: string;
  description?: string;
  descriptionZh?: string;
  urgencyMessage?: string;
  urgencyCount?: number;
  prixFixeEnabled?: boolean;
  giftBoxesEnabled?: boolean;
  published?: boolean;
  displayOrder?: number;
}

export interface FestivalMenuItem {
  id: string;
  festivalId: string;
  tierName?: string;
  tierNameZh?: string;
  pricePerPerson?: number;
  minGuests?: number;
  courses?: Array<{ dish: string; dishZh: string; description?: string }>;
  displayOrder?: number;
}

export interface BanquetPackage {
  id: string;
  siteId: string;
  tier: 'business-lunch' | 'celebration' | 'wedding-banquet' | 'corporate';
  name: string;
  nameZh: string;
  pricePerHead: number;
  minGuests: number;
  maxGuests: number;
  includes: string[];
  includesZh: string[];
  highlight?: string;
  highlightZh?: string;
  image?: string;
  displayOrder?: number;
}

export interface SiteInfoChinese {
  restaurantNameZh: string;
  cuisineType: string;
  cuisineTypeZh: string;
  wechatQrUrl?: string;
  wechatAccountName?: string;
  dimSumHours?: { open: string; close: string };
  weekendBrunchHours?: { open: string; close: string };
  seatingCapacity?: { regular: number; banquet?: number };
  parkingNote?: string;
  parkingNoteZh?: string;
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Create DB service functions for new tables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create lib/festivalsDb.ts:
- getFestivalsBySiteId(siteId): Festival[]
- getActiveFestival(siteId): Festival | null  — returns festival where today is within activeDateStart..activeDateEnd
- getFestivalBySlug(siteId, slug): Festival | null
- upsertFestival(festival): Festival
- deleteFestival(id): void

Create lib/banquetDb.ts:
- getBanquetPackagesBySiteId(siteId): BanquetPackage[]
- upsertBanquetPackage(pkg): BanquetPackage

These functions use supabase service role client (same pattern as existing
menuDb.ts or contentDb.ts in the codebase).
```

**Done-Gate 0C:**
- All tables created in Supabase with no errors
- `lib/chinese-restaurant-types.ts` compiles with no TypeScript errors
- `getActiveFestival('grand-pavilion')` returns null (no festivals seeded yet — that's OK)
- `ChineseMenuItem.nameZh` is `string` (NOT `string | undefined`) — TypeScript enforces it

---

## Prompt 0D — Content Contracts: Create All JSON Schema Files

**Goal:** Implement the complete content contract JSON files for every page and global config. The full schema definitions live in `@CHINESE_RESTAURANT_CONTENT_CONTRACTS.md` — use that as the source of truth. This prompt creates the actual files in the repo.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md A4 Component Inventory
Reference: @CHINESE_RESTAURANT_CONTENT_CONTRACTS.md ← ALL JSON shapes defined here

Create all content contract files as specified in @CHINESE_RESTAURANT_CONTENT_CONTRACTS.md.
One file per contract entry in the File Index table.
File paths: content/grand-pavilion/[locale]/[path] for both "en" and "zh" locales.

For the "zh" locale files: copy the EN file, then translate all visible text fields (title, titleZh → same value, body, bodyZh, label, labelZh etc). ZH locale files serve the /zh route.

After creating all files, run:
  node scripts/validate-content-contracts.mjs grand-pavilion

Fix any issues reported before declaring done.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY CONTRACTS TO IMPLEMENT (see full spec in @CHINESE_RESTAURANT_CONTENT_CONTRACTS.md)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Global:
  content/grand-pavilion/en/site.json
  content/grand-pavilion/en/header.json
  content/grand-pavilion/en/footer.json
  content/grand-pavilion/en/seo.json

Pages:
  content/grand-pavilion/en/pages/home.json
  content/grand-pavilion/en/pages/about.json
  content/grand-pavilion/en/pages/menu.json
  content/grand-pavilion/en/pages/dim-sum.json
  content/grand-pavilion/en/pages/chefs-table.json
  content/grand-pavilion/en/pages/private-dining.json
  content/grand-pavilion/en/pages/catering.json
  content/grand-pavilion/en/pages/reservations.json
  content/grand-pavilion/en/pages/contact.json
  content/grand-pavilion/en/pages/gallery.json
  content/grand-pavilion/en/pages/events.json
  content/grand-pavilion/en/pages/blog.json
  content/grand-pavilion/en/pages/festivals/chinese-new-year.json
  content/grand-pavilion/en/pages/festivals/mid-autumn.json
  content/grand-pavilion/en/pages/press.json
  content/grand-pavilion/en/pages/gift-cards.json
  content/grand-pavilion/en/pages/order-online.json
  content/grand-pavilion/en/pages/faq.json
  content/grand-pavilion/en/pages/careers.json

Repeat all above for zh locale.

Also create:
  lib/chinese-restaurant-types.ts  ← TypeScript interfaces from @CHINESE_RESTAURANT_CONTENT_CONTRACTS.md#typescript
  scripts/validate-content-contracts.mjs  ← validation script from @CHINESE_RESTAURANT_CONTENT_CONTRACTS.md#validation-script

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRACT 1 — pages/home.json (Chinese extension)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend the Meridian home.json contract with these additional section types:

"festival_highlight": {
  "_type": "festival_highlight",
  "_variant": "banner",           // "banner" | "section" | "hidden"
  "activeFestivalId": null,       // null = auto-detect from DB
  "fallbackMessage": "Coming Soon: Chinese New Year 2027",
  "fallbackMessageZh": "即将推出：2027年农历新年",
  "showCountdown": true
}

"dim_sum_status": {
  "_type": "dim_sum_status",
  "enabled": true,
  "openTime": "10:00",
  "closeTime": "15:00",
  "weekendOpenTime": "09:30",
  "openMessage": "Dim Sum Available Now · 点心供应中",
  "closedMessage": "Dim Sum Available Daily 10am–3pm",
  "closedMessageZh": "点心每日上午10时至下午3时供应"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRACT 2 — pages/festivals/chinese-new-year.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "festivalId": "chinese-new-year",
  "seo": {
    "title": "Chinese New Year Dinner 2027 — Grand Pavilion",
    "titleZh": "2027年农历新年晚宴 — 大观楼",
    "description": "..."
  },
  "hero": {
    "image": "/uploads/grand-pavilion/festivals/cny-hero.jpg",
    "tagline": "Ring in the Year of the Goat",
    "taglineZh": "迎接羊年到来",
    "subline": "Special prix-fixe menus · January 28 – February 14, 2027"
  },
  "story": {
    "title": "A Celebration of Prosperity",
    "titleZh": "庆祝繁荣",
    "body": "...",
    "bodyZh": "..."
  },
  "prixFixeTiers": [
    {
      "tier": "family-feast",
      "name": "Family Feast Menu",
      "nameZh": "全家福套餐",
      "pricePerPerson": 88,
      "minGuests": 4,
      "courses": [
        { "dish": "Prosperity Abalone & Sea Cucumber", "dishZh": "发财鲍鱼海参" },
        { "dish": "Steamed Whole Fish", "dishZh": "清蒸鱼" },
        { "dish": "Lotus Leaf Sticky Rice", "dishZh": "荷叶糯米鸡" },
        { "dish": "New Year Sweet Soup", "dishZh": "新年甜汤圆" }
      ]
    }
  ],
  "urgency": {
    "enabled": true,
    "message": "Only {count} tables remaining — Reserve Now",
    "messageZh": "仅剩 {count} 个座位 — 立即预约",
    "count": 12
  },
  "cta": {
    "primary": { "label": "Reserve Festival Menu", "labelZh": "预约节日套餐", "href": "/reservations" }
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRACT 3 — pages/private-dining.json (Chinese extension)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend Meridian's private-dining.json contract with:

"banquetPackages": {
  "_type": "banquet_packages",
  "_source": "db",              // loads from banquet_packages table
  "displayStyle": "cards"       // "cards" | "table"
},
"capacityDisplay": {
  "rooms": [
    { "name": "Private Room A", "nameZh": "私人厅A", "capacity": 10, "image": "..." },
    { "name": "Banquet Hall", "nameZh": "宴会厅", "capacity": 80, "image": "..." },
    { "name": "Grand Ballroom", "nameZh": "大礼堂", "capacity": 500, "image": "..." }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRACT 4 — pages/catering.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "seo": { "title": "Chinese Catering Services — Grand Pavilion", "description": "..." },
  "hero": {
    "_type": "page_hero",
    "title": "Authentic Chinese Catering",
    "titleZh": "正宗中式餐饮服务",
    "subtitle": "From intimate gatherings to grand celebrations",
    "image": "/uploads/grand-pavilion/banquet/catering-hero.jpg"
  },
  "overview": {
    "body": "...",
    "bodyZh": "...",
    "minimumOrder": 500,
    "serviceRadius": "50 miles from Flushing, NY",
    "leadTime": "14 days minimum"
  },
  "serviceTypes": [
    { "id": "corporate", "name": "Corporate Events", "nameZh": "企业活动" },
    { "id": "wedding", "name": "Wedding Banquet", "nameZh": "婚宴" },
    { "id": "birthday", "name": "Birthday Celebration", "nameZh": "生日宴" },
    { "id": "holiday", "name": "Holiday Party", "nameZh": "节日聚会" }
  ],
  "cta": { "label": "Request Catering Quote", "labelZh": "索取餐饮报价", "href": "#catering-form" }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRACT 5 — site.json (Chinese restaurant extension)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extend the existing site.json contract (used by header/footer/contact) with:

"restaurantNameZh": "大观楼",
"cuisineType": "Cantonese",
"cuisineTypeZh": "粤菜",
"wechatQrUrl": "",
"wechatAccountName": "",
"dimSumHours": { "open": "10:00", "close": "15:00" },
"weekendBrunchHours": { "open": "09:30", "close": "15:00" },
"seatingCapacity": { "regular": 120, "banquet": 500 },
"parkingNote": "Street parking available. Garage at Roosevelt Ave.",
"parkingNoteZh": "街道停车可用。Roosevelt Ave 停车场。"
```

**Done-Gate 0D:**
- All 5 JSON contract files created (or documented as TypeScript types)
- `content/grand-pavilion/en/pages/festivals/` directory exists
- `lib/chinese-restaurant-types.ts` has no TypeScript errors

---

## Prompt 0E — Seed Content: Grand Pavilion Demo Restaurant

**Goal:** Populate the Grand Pavilion demo site with realistic bilingual content for all menus, festivals, team, gallery, and testimonials. This is what the demo site looks like before any client customization.

```
You are building BAAM System F — Chinese Restaurant Premium.
Reference: @RESTAURANT_CHINESE_COMPLETE_PLAN.md

Create seed content for demo site: grand-pavilion (大观楼)
Restaurant profile:
- Name: Grand Pavilion · 大观楼
- Chef: Chef Li Wei · 厨师长李伟
- Cuisine: Cantonese Dim Sum & Fine Dining
- Location: 133-24 Roosevelt Ave, Flushing, NY 11354
- Founded: 2008
- Specialty: 80+ dim sum varieties, Cantonese seafood, private banquet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED 1 — menu_categories (via DB insert or seed script)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create these menu categories for site_id = 'grand-pavilion':

Dim Sum categories (available 10:00-15:00):
- slug: "dim-sum-steamed",  name: { en: "Steamed Dim Sum", zh: "蒸点" }, menu_type: "dim-sum", display_order: 1, available_from: "10:00", available_until: "15:00"
- slug: "dim-sum-baked",    name: { en: "Baked & Roasted", zh: "烤点" }, menu_type: "dim-sum", display_order: 2
- slug: "dim-sum-fried",    name: { en: "Fried Dim Sum", zh: "炸点" }, menu_type: "dim-sum", display_order: 3
- slug: "dim-sum-noodles",  name: { en: "Congee & Noodles", zh: "粥面" }, menu_type: "dim-sum", display_order: 4
- slug: "dim-sum-desserts", name: { en: "Dim Sum Desserts", zh: "甜点" }, menu_type: "dim-sum", display_order: 5

Dinner categories (available 17:00-22:00):
- slug: "dinner-seafood",     name: { en: "Seafood", zh: "海鲜" }, menu_type: "dinner", display_order: 1
- slug: "dinner-poultry",     name: { en: "Poultry & Meat", zh: "禽肉" }, menu_type: "dinner", display_order: 2
- slug: "dinner-vegetables",  name: { en: "Vegetables & Tofu", zh: "蔬菜豆腐" }, menu_type: "dinner", display_order: 3
- slug: "dinner-rice-noodles", name: { en: "Rice & Noodles", zh: "饭面" }, menu_type: "dinner", display_order: 4
- slug: "dinner-soups",       name: { en: "Soups", zh: "汤类" }, menu_type: "dinner", display_order: 5

Chef Signatures:
- slug: "chef-signatures", name: { en: "Chef's Signatures", zh: "主厨推荐" }, menu_type: "chef-signatures", display_order: 1

Beverages:
- slug: "teas",    name: { en: "Chinese Teas", zh: "中国茶" }, menu_type: "beverages", display_order: 1
- slug: "juices",  name: { en: "Fresh Juices", zh: "鲜榨果汁" }, menu_type: "beverages", display_order: 2
- slug: "desserts", name: { en: "Desserts", zh: "甜品" }, menu_type: "desserts", display_order: 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED 2 — menu_items (40 dim sum + 25 dinner + 8 signatures + 7 beverages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All items: name_zh required. is_dim_sum = true for dim sum items.

STEAMED DIM SUM (15 items):
1. slug: "har-gow", name_zh: "虾饺", name: { en: "Har Gow (Shrimp Dumplings)", zh: "虾饺" }, price: 650, description: { en: "Delicate rice flour wrappers filled with fresh whole shrimp", zh: "精薄澄粉皮包裹新鲜整虾" }, is_dim_sum: true, dim_sum_category: "steamed", featured: true, image: "/uploads/grand-pavilion/menu/har-gow.jpg"
2. slug: "siu-mai", name_zh: "烧卖", name: { en: "Siu Mai (Pork & Shrimp)", zh: "烧卖" }, price: 650, is_dim_sum: true, dim_sum_category: "steamed", featured: true
3. slug: "xiao-long-bao", name_zh: "小笼包", name: { en: "Xiao Long Bao (Soup Dumplings)", zh: "小笼包" }, price: 780, is_dim_sum: true, dim_sum_category: "steamed", featured: true
4. slug: "cheung-fun-shrimp", name_zh: "虾肠粉", name: { en: "Shrimp Rice Noodle Roll", zh: "虾肠粉" }, price: 680, is_dim_sum: true, dim_sum_category: "steamed"
5. slug: "spare-ribs-black-bean", name_zh: "豉汁排骨", name: { en: "Spare Ribs in Black Bean Sauce", zh: "豉汁排骨" }, price: 620, is_dim_sum: true, dim_sum_category: "steamed"
6. slug: "lotus-leaf-sticky-rice", name_zh: "荷叶糯米鸡", name: { en: "Lotus Leaf Sticky Rice", zh: "荷叶糯米鸡" }, price: 780, is_dim_sum: true, dim_sum_category: "steamed"
7. slug: "beef-meatballs", name_zh: "牛肉球", name: { en: "Steamed Beef Meatballs", zh: "牛肉球" }, price: 580, is_dim_sum: true, dim_sum_category: "steamed"
8. slug: "chicken-feet-black-bean", name_zh: "豉汁凤爪", name: { en: "Chicken Feet in Black Bean Sauce", zh: "豉汁凤爪" }, price: 580, is_dim_sum: true, dim_sum_category: "steamed"
9. slug: "tofu-skin-roll", name_zh: "腐皮卷", name: { en: "Tofu Skin Roll with Shrimp", zh: "腐皮卷" }, price: 620, is_dim_sum: true, dim_sum_category: "steamed"
10. slug: "shanghainese-wonton", name_zh: "上海云吞", name: { en: "Shanghai Wonton Soup", zh: "上海云吞" }, price: 700, is_dim_sum: true, dim_sum_category: "steamed"

[Continue pattern for: 5 baked, 5 fried, 5 congee/noodle, 5 dim sum desserts,
25 dinner items, 8 chef signatures, 7 beverages]

Note: Generate realistic, accurate Cantonese dim sum and dinner items.
Use actual dish names in Traditional/Simplified Chinese.
Price in cents (integer): 580 = $5.80, 1280 = $12.80, 3800 = $38.00.

CHEF SIGNATURES (8 items — is_chef_signature: true):
1. slug: "peking-duck-whole", name_zh: "片皮鸭（全只）", price: 8800, featured: true, is_chef_signature: true, description: { en: "Chef Li Wei's 3-day marinated Peking duck — crispy skin, 2 courses served tableside", zh: "厨师长李伟历时三天腌制的北京烤鸭 — 皮脆肉嫩，两吃桌边呈现" }
2. slug: "lobster-ginger-scallion", name_zh: "姜葱炒龙虾", price: 0, description: { en: "Market price. Live Maine lobster stir-fried with ginger, scallion, and oyster sauce", zh: "时价。活缅因龙虾配姜葱蚝油翻炒" }, price_note: { en: "Market price", zh: "时价" }, is_chef_signature: true
3. slug: "abalone-oyster-sauce", name_zh: "蚝油鲍鱼", price: 4800, is_chef_signature: true
4. slug: "peking-duck-half", name_zh: "片皮鸭（半只）", price: 4800, is_chef_signature: true
5. slug: "crispy-roast-suckling-pig", name_zh: "脆皮烤乳猪", price: 5800, is_chef_signature: true
6. slug: "steamed-whole-fish-ginger", name_zh: "清蒸鱼", price: 0, price_note: { en: "Market price", zh: "时价" }, is_chef_signature: true
7. slug: "braised-sea-cucumber", name_zh: "红烧海参", price: 5200, is_chef_signature: true
8. slug: "wok-fried-snow-crab", name_zh: "蒜蓉炒雪蟹", price: 0, price_note: { en: "Market price", zh: "时价" }, is_chef_signature: true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED 3 — festivals table
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT two festivals:

1. Chinese New Year 2027:
   slug: "chinese-new-year", name: "Chinese New Year", name_zh: "农历新年",
   active_date_start: "2027-01-18", active_date_end: "2027-02-14",
   hero_image: "/uploads/grand-pavilion/festivals/cny-hero.jpg",
   tagline: "Welcome the Year of the Goat", tagline_zh: "迎接羊年到来",
   urgency_message: "Only {count} tables remaining", urgency_count: 12,
   prix_fixe_enabled: true, published: true

2. Mid-Autumn Festival 2026:
   slug: "mid-autumn", name: "Mid-Autumn Festival", name_zh: "中秋节",
   active_date_start: "2026-09-15", active_date_end: "2026-10-06",
   hero_image: "/uploads/grand-pavilion/festivals/mid-autumn-hero.jpg",
   tagline: "Celebrate the Full Moon Together", tagline_zh: "共赏明月，共庆中秋",
   prix_fixe_enabled: true, gift_boxes_enabled: true, published: true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED 4 — banquet_packages table (3 tiers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT:
1. tier: "celebration", name: "Celebration Dinner", name_zh: "庆典晚宴",
   price_per_head: 68, min_guests: 10, max_guests: 80,
   includes: ["8-course set menu", "Cantonese roasted meats", "Dessert platter", "Non-alcoholic beverages"],
   includes_zh: ["8道菜套餐", "粤式烧味拼盘", "甜品拼盘", "非酒精饮品"],
   highlight: "Perfect for birthdays, anniversaries, and family reunions"

2. tier: "wedding-banquet", name: "Wedding Banquet", name_zh: "婚宴套餐",
   price_per_head: 128, min_guests: 50, max_guests: 500,
   includes: ["10-course wedding banquet", "Whole roasted suckling pig", "Shark fin soup", "Lobster", "Wedding cake tier", "Free venue decoration", "Dedicated event coordinator"],
   highlight: "Our most popular package — includes dedicated event coordinator"

3. tier: "corporate", name: "Corporate Lunch", name_zh: "商务午宴",
   price_per_head: 45, min_guests: 10, max_guests: 50,
   includes: ["5-course business lunch", "Choice of entrée", "Tea service", "Private room"],
   highlight: "Ideal for business meetings and client entertainment"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED 5 — content_entries: site.json, header.json, footer.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create site.json for grand-pavilion/en with:
{
  "id": "grand-pavilion",
  "name": "Grand Pavilion",
  "restaurantNameZh": "大观楼",
  "cuisineType": "Cantonese",
  "cuisineTypeZh": "粤菜",
  "phone": "(718) 555-0188",
  "email": "info@grandpavilionny.com",
  "address": "133-24 Roosevelt Ave",
  "city": "Flushing",
  "state": "NY",
  "zip": "11354",
  "hours": {
    "monday": { "open": "10:00", "close": "21:30" },
    "tuesday": { "open": "10:00", "close": "21:30" },
    "wednesday": { "open": "10:00", "close": "21:30" },
    "thursday": { "open": "10:00", "close": "21:30" },
    "friday": { "open": "10:00", "close": "22:00" },
    "saturday": { "open": "09:30", "close": "22:00" },
    "sunday": { "open": "09:30", "close": "21:00" }
  },
  "dimSumHours": { "open": "10:00", "close": "15:00" },
  "weekendBrunchHours": { "open": "09:30", "close": "15:00" },
  "seatingCapacity": { "regular": 120, "banquet": 500 },
  "parkingNote": "Validated parking at adjacent garage on Prince Street",
  "parkingNoteZh": "毗邻Prince Street停车场可享优惠停车",
  "wechatQrUrl": "",
  "wechatAccountName": "大观楼餐厅",
  "social": {
    "instagram": "@grandpavilionny",
    "facebook": "facebook.com/grandpavilionny",
    "yelp": "yelp.com/biz/grand-pavilion-flushing"
  },
  "announcementBar": "Now Accepting Reservations for Chinese New Year 2027",
  "features": { "see _sites.json for feature flags" }
}

Create zh version of site.json in grand-pavilion/zh/ with Chinese translations.

Create team_members entry for Chef Li Wei with credentials and bio (EN + ZH).

Create 20 testimonials (mix 12 EN + 8 ZH) with ratings of 5,
covering dim sum, private dining, and special events.
```

**Done-Gate 0E:**
- `http://localhost:3060` renders Grand Pavilion home page (may be unstyled — that's OK for now)
- Admin → Menu shows 80+ menu items with Chinese names visible
- Admin → check menu item "har-gow" → `name_zh` field = "虾饺"
- Festivals table has 2 rows
- Banquet packages table has 3 rows
- `getActiveFestival('grand-pavilion')` returns CNY festival if today is between dates (or null otherwise)
- `git tag v0.0-phase0-complete`

---

## Phase 0 Final Checklist

Before moving to Phase 1, confirm ALL of these:

| Check | How to Verify | Status |
|---|---|---|
| App boots on port 3060 | `npm run dev` — no console errors | |
| All 4 Chinese theme variants load | Admin → theme picker → switch each | |
| `--font-display-zh` CSS var set | Browser dev tools → :root | |
| `--seal-color: #8B0000` | Browser dev tools → :root | |
| DB tables created (all 15+) | Supabase dashboard → table list | |
| `name_zh` column on menu_items | Supabase → menu_items schema | |
| 80+ menu items seeded | Admin → Menu page | |
| 2 festivals seeded | Supabase → festivals table | |
| 3 banquet packages seeded | Supabase → banquet_packages | |
| ZH locale directory exists | `content/grand-pavilion/zh/` | |
| TypeScript compiles clean | `npm run build` — 0 type errors | |
| Git tag created | `git log --oneline | head -1` shows v0.0-phase0-complete | |
```
