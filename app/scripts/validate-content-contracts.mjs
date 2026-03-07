#!/usr/bin/env node
// ============================================================
// BAAM System F — Chinese Restaurant Premium
// validate-content-contracts.mjs
// Usage: node scripts/validate-content-contracts.mjs [site-id]
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

const siteId = process.argv[2] || 'grand-pavilion';
const siteDir = path.join(CONTENT_DIR, siteId);

let errors = 0;
let warnings = 0;
let passed = 0;

function check(condition, label, message, isWarning = false) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    if (isWarning) {
      console.warn(`  ⚠ ${label}: ${message}`);
      warnings++;
    } else {
      console.error(`  ✗ ${label}: ${message}`);
      errors++;
    }
  }
}

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

console.log(`\n🔍 Validating content contracts for site: ${siteId}`);
console.log(`   Directory: ${siteDir}\n`);

if (!fileExists(siteDir)) {
  console.error(`✗ Site directory not found: ${siteDir}`);
  process.exit(1);
}

// ============================================================
// 1. Site directory structure
// ============================================================
console.log('── Directory Structure ──');
check(fileExists(path.join(siteDir, 'en')), 'en/ locale exists', 'Missing en/ directory');
check(fileExists(path.join(siteDir, 'zh')), 'zh/ locale exists', 'Missing zh/ directory');
check(fileExists(path.join(siteDir, 'en/pages/festivals')), 'en/pages/festivals/ exists', 'Missing festivals directory');
check(fileExists(path.join(siteDir, 'zh')), 'zh/ locale directory', 'Missing zh/ locale directory');
check(fileExists(path.join(siteDir, 'theme.json')), 'theme.json exists', 'Missing theme.json');

// ============================================================
// 2. EN locale — required files
// ============================================================
console.log('\n── EN Locale Files ──');
const enRequired = [
  'site.json',
  'header.json',
  'footer.json',
  'seo.json',
  'pages/home.json',
  'pages/menu.json',
  'pages/dim-sum.json',
  'pages/about.json',
  'pages/reservations.json',
  'pages/contact.json',
  'pages/private-dining.json',
  'pages/festivals/chinese-new-year.json',
  'pages/festivals/mid-autumn.json',
];

for (const file of enRequired) {
  const filePath = path.join(siteDir, 'en', file);
  check(fileExists(filePath), `en/${file}`, `File missing`);
}

// ============================================================
// 3. ZH locale — required files
// ============================================================
console.log('\n── ZH Locale Files ──');
const zhRequired = [
  'site.json',
  'header.json',
  'footer.json',
  'seo.json',
  'pages/home.json',
];

for (const file of zhRequired) {
  const filePath = path.join(siteDir, 'zh', file);
  check(fileExists(filePath), `zh/${file}`, `File missing`);
}

// ============================================================
// 4. site.json validation
// ============================================================
console.log('\n── site.json Content Validation ──');
const enSite = loadJson(path.join(siteDir, 'en/site.json'));
if (enSite) {
  check(!!enSite.id, 'site.json: id', 'Missing id field');
  check(!!enSite.name, 'site.json: name', 'Missing name field');
  check(!!enSite.nameZh, 'site.json: nameZh', 'Missing nameZh (required for Chinese restaurant)');
  check(enSite.nameZh !== '', 'site.json: nameZh not empty', 'nameZh cannot be empty');
  check(!!enSite.cuisineType, 'site.json: cuisineType', 'Missing cuisineType');
  check(!!enSite.cuisineTypeZh, 'site.json: cuisineTypeZh', 'Missing cuisineTypeZh');
  check(!!enSite.phone, 'site.json: phone', 'Missing phone');
  check(!!enSite.hours, 'site.json: hours', 'Missing hours');
  check(!!enSite.dimSumHours, 'site.json: dimSumHours', 'Missing dimSumHours (required for dim sum restaurants)');
  check(
    enSite.dimSumHours && enSite.dimSumHours.open && enSite.dimSumHours.close,
    'site.json: dimSumHours.open + close',
    'dimSumHours must have open and close times'
  );
  check(
    Array.isArray(enSite.enabledLocales) && enSite.enabledLocales.includes('zh'),
    'site.json: zh in enabledLocales',
    'zh must be in enabledLocales for Chinese restaurant'
  );
} else {
  console.error('  ✗ en/site.json could not be loaded');
  errors++;
}

// ============================================================
// 5. home.json validation
// ============================================================
console.log('\n── home.json Content Validation ──');
const enHome = loadJson(path.join(siteDir, 'en/pages/home.json'));
if (enHome) {
  check(!!enHome.seo, 'home.json: seo section', 'Missing seo section');
  check(!!enHome.hero, 'home.json: hero section', 'Missing hero section');
  check(!!enHome.festival_highlight, 'home.json: festival_highlight section', 'Missing festival_highlight (required for Chinese restaurant)');
  check(!!enHome.dim_sum_status, 'home.json: dim_sum_status section', 'Missing dim_sum_status (required for Chinese restaurant)');
  check(!!enHome.chef_hero, 'home.json: chef_hero section', 'Missing chef_hero section', true);
  check(!!enHome.private_dining_cta, 'home.json: private_dining_cta section', 'Missing private_dining_cta section', true);
} else {
  console.error('  ✗ en/pages/home.json could not be loaded');
  errors++;
}

// ============================================================
// 6. dim-sum.json validation
// ============================================================
console.log('\n── dim-sum.json Content Validation ──');
const enDimSum = loadJson(path.join(siteDir, 'en/pages/dim-sum.json'));
if (enDimSum) {
  check(!!enDimSum.seo, 'dim-sum.json: seo section', 'Missing seo section');
  check(!!enDimSum.cartConfig, 'dim-sum.json: cartConfig', 'Missing cartConfig (required for dim sum cart feature)');
  check(
    Array.isArray(enDimSum.categories) && enDimSum.categories.length > 0,
    'dim-sum.json: categories array',
    'Missing or empty categories array'
  );
} else {
  console.error('  ✗ en/pages/dim-sum.json could not be loaded');
  errors++;
}

// ============================================================
// 7. Festival pages validation
// ============================================================
console.log('\n── Festival Pages Validation ──');
const cnyFile = path.join(siteDir, 'en/pages/festivals/chinese-new-year.json');
const cny = loadJson(cnyFile);
if (cny) {
  check(!!cny.festival, 'cny.json: festival object', 'Missing festival object');
  check(!!cny.festival?.nameZh, 'cny.json: festival.nameZh', 'Missing festival.nameZh');
  check(!!cny.festival?.activeDateStart, 'cny.json: activeDateStart', 'Missing activeDateStart');
  check(!!cny.festival?.activeDateEnd, 'cny.json: activeDateEnd', 'Missing activeDateEnd');
  check(
    Array.isArray(cny.prixFixeTiers) && cny.prixFixeTiers.length > 0,
    'cny.json: prixFixeTiers',
    'Missing or empty prixFixeTiers',
    true
  );
} else {
  console.error('  ✗ en/pages/festivals/chinese-new-year.json could not be loaded');
  errors++;
}

// ============================================================
// 8. theme.json validation
// ============================================================
console.log('\n── theme.json Validation ──');
const theme = loadJson(path.join(siteDir, 'theme.json'));
if (theme) {
  check(!!theme.preset, 'theme.json: preset object', 'Missing preset object');
  check(!!theme.preset?.id, 'theme.json: preset.id', 'Missing preset.id');
  const validVariants = ['hao-zhan', 'hongxiang', 'longmen', 'shuimo'];
  check(
    validVariants.includes(theme.preset?.id),
    `theme.json: preset.id is valid Chinese variant`,
    `preset.id "${theme.preset?.id}" is not a valid Chinese variant. Use: ${validVariants.join(', ')}`
  );
} else {
  console.error('  ✗ theme.json could not be loaded');
  errors++;
}

// ============================================================
// Summary
// ============================================================
console.log(`\n${'═'.repeat(50)}`);
console.log(`Results: ${passed} passed · ${warnings} warnings · ${errors} errors`);

if (errors > 0) {
  console.error(`\n✗ VALIDATION FAILED — ${errors} error(s) must be resolved before launch.\n`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`\n⚠ VALIDATION PASSED with ${warnings} warning(s). Review before launch.\n`);
} else {
  console.log(`\n✓ ALL CHECKS PASSED — Content contracts valid for ${siteId}\n`);
}
