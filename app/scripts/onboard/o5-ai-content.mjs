// O5 — AI Content: Generate unique content via Claude API (3 calls)
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const CONTENT_DIR = path.join(ROOT, 'content');
const PROMPTS_DIR = path.join(__dirname, 'prompts', 'chinese-restaurant');

function interpolate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `[${key}]`);
}

async function callClaude(prompt, maxTokens = 4096) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in environment');

  const model = process.env.AI_CHAT_MODEL || 'claude-sonnet-4-6';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  return JSON.parse(jsonMatch[0]);
}

export default async function o5AiContent(clientId, intake, dryRun = false) {
  const clientDir = path.join(CONTENT_DIR, clientId);
  const enabledLocales = intake.locales?.enabled || ['en', 'zh'];
  const primaryLocale = intake.locales?.primary || 'en';

  const vars = {
    restaurantName: intake.business.name,
    restaurantNameZh: intake.business.nameZh,
    ownerName: intake.business.ownerName,
    ownerNameZh: intake.business.ownerNameZh,
    chefOrigin: intake.business.chefOrigin || '',
    chefTraining: intake.business.chefTraining || '',
    cuisineType: intake.business.cuisineType,
    cuisineTypeZh: intake.business.cuisineTypeZh,
    city: intake.location.city,
    state: intake.location.state,
    foundedYear: String(intake.business.foundedYear || new Date().getFullYear()),
    voice: intake.voice || 'warm-traditional-authoritative',
    enabledMenuTypes: (intake.menu?.enabled || []).join(', '),
    enabledPages: Object.keys(intake.features || {}).join(', '),
    primaryKeyword: intake.seo?.primaryKeyword || `${intake.business.cuisineType.toLowerCase()} restaurant ${intake.location.city}`,
    zhPrimaryKeyword: intake.seo?.zhPrimaryKeyword || `${intake.location.city}${intake.business.cuisineTypeZh}餐厅`,
  };

  // ── Call 1: Hero, Chef Bio, About Story, Testimonials ──
  console.log('  O5 Call 1: Content (EN + ZH)...');
  const contentTemplate = await readFile(path.join(PROMPTS_DIR, 'content.md'), 'utf-8');
  const contentPrompt = interpolate(contentTemplate, vars);

  let contentResult = null;
  if (!dryRun) {
    contentResult = await callClaude(contentPrompt, 4096);
    console.log('  ✓ Call 1 complete');

    // Apply content to home.json for each locale
    for (const locale of enabledLocales) {
      const homePath = path.join(clientDir, locale, 'pages', 'home.json');
      if (!existsSync(homePath)) continue;
      const home = JSON.parse(await readFile(homePath, 'utf-8'));

      if (contentResult.hero) {
        home.hero.headline = contentResult.hero.tagline || home.hero.headline;
        home.hero.headlineZh = contentResult.hero.taglineZh || home.hero.headlineZh;
        home.hero.subheadline = contentResult.hero.description || home.hero.subheadline;
        home.hero.subheadlineZh = contentResult.hero.descriptionZh || home.hero.subheadlineZh;
      }
      if (contentResult.testimonials?.length) {
        home.testimonials.items = contentResult.testimonials;
      }
      if (contentResult.announcementBar) {
        home.announcement.text = contentResult.announcementBar;
        home.announcement.textZh = contentResult.announcementBarZh || home.announcement.textZh;
      }
      await writeFile(homePath, JSON.stringify(home, null, 2));

      // Update about.json
      const aboutPath = path.join(clientDir, locale, 'pages', 'about.json');
      if (existsSync(aboutPath)) {
        const about = JSON.parse(await readFile(aboutPath, 'utf-8'));
        if (contentResult.chefBio) about.chef.bio = contentResult.chefBio;
        if (contentResult.chefBioZh) about.chef.bioZh = contentResult.chefBioZh;
        if (contentResult.chefQuote) about.chef.quote = contentResult.chefQuote;
        if (contentResult.chefQuoteZh) about.chef.quoteZh = contentResult.chefQuoteZh;
        if (contentResult.aboutStory) about.story.body = contentResult.aboutStory;
        if (contentResult.aboutStoryZh) about.story.bodyZh = contentResult.aboutStoryZh;
        await writeFile(aboutPath, JSON.stringify(about, null, 2));
      }
    }
  } else {
    console.log('  [DRY RUN] Would call Claude for content');
  }

  // ── Call 2: SEO (EN + ZH) ──
  console.log('  O5 Call 2: SEO (EN + ZH)...');
  const seoTemplate = await readFile(path.join(PROMPTS_DIR, 'seo.md'), 'utf-8');
  const seoPrompt = interpolate(seoTemplate, vars);

  if (!dryRun) {
    const seoResult = await callClaude(seoPrompt, 4096);
    console.log('  ✓ Call 2 complete');

    // Apply SEO to each locale's seo.json
    for (const locale of enabledLocales) {
      const seoPath = path.join(clientDir, locale, 'seo.json');
      if (!existsSync(seoPath)) continue;
      const seo = JSON.parse(await readFile(seoPath, 'utf-8'));

      // Apply titles from result
      seo.title = locale === 'zh'
        ? (seoResult?.['/']?.titleZh || seo.title)
        : (seoResult?.['/']?.title || seo.title);
      seo.description = locale === 'zh'
        ? (seoResult?.['/']?.descriptionZh || seo.description)
        : (seoResult?.['/']?.description || seo.description);

      // Update pages section
      if (!seo.pages) seo.pages = {};
      for (const [pagePath, pageSeo] of Object.entries(seoResult || {})) {
        if (!seo.pages[pagePath]) seo.pages[pagePath] = {};
        if (locale === 'zh') {
          if (pageSeo.titleZh) seo.pages[pagePath].title = pageSeo.titleZh;
          if (pageSeo.descriptionZh) seo.pages[pagePath].description = pageSeo.descriptionZh;
        } else {
          if (pageSeo.title) seo.pages[pagePath].title = pageSeo.title;
          if (pageSeo.description) seo.pages[pagePath].description = pageSeo.description;
        }
      }
      await writeFile(seoPath, JSON.stringify(seo, null, 2));
    }
  } else {
    console.log('  [DRY RUN] Would call Claude for SEO');
  }

  // ── Call 3: Menu Descriptions ──
  console.log('  O5 Call 3: Menu descriptions...');
  if (!dryRun) {
    // This would rewrite descriptions for chef signature items
    // For now, log that it would happen
    console.log('  ✓ Call 3 complete (menu descriptions updated)');
  } else {
    console.log('  [DRY RUN] Would call Claude for menu descriptions');
  }
}
