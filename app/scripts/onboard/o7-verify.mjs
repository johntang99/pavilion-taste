// O7 — Verify: 7 mandatory checks — pipeline fails hard if any fail
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const CONTENT_DIR = path.join(ROOT, 'content');

// Strings that MUST NOT appear in client content
const CONTAMINATION_STRINGS = [
  'Grand Pavilion',
  '大观楼',
  'Chef Li Wei',
  '厨师长李伟',
  '133-24 Roosevelt Ave',
  'grandpavilionny.com',
  '(718) 555-0188',
  'info@grandpavilionny.com',
  '@grandpavilionny',
];

async function* walkDir(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        yield* walkDir(fullPath);
      } else if (entry.name.endsWith('.json')) {
        yield fullPath;
      }
    }
  } catch { /* skip inaccessible dirs */ }
}

export default async function o7Verify(clientId, intake, dryRun = false) {
  const clientDir = path.join(CONTENT_DIR, clientId);
  const enabledLocales = intake.locales?.enabled || ['en', 'zh'];
  const primaryLocale = intake.locales?.primary || 'en';

  const errors = [];
  const warnings = [];
  let passed = 0;

  // ── Check 1: Required paths exist ──
  const requiredPaths = [
    `${primaryLocale}/site.json`,
    `${primaryLocale}/pages/home.json`,
    `${primaryLocale}/pages/menu.json`,
    `${primaryLocale}/seo.json`,
    `${primaryLocale}/header.json`,
    'theme.json',
  ];

  if (intake.features?.private_dining !== false) {
    requiredPaths.push(`${primaryLocale}/pages/private-dining.json`);
  }

  for (const reqPath of requiredPaths) {
    const fullPath = path.join(clientDir, reqPath);
    if (existsSync(fullPath)) {
      passed++;
    } else {
      errors.push(`Required path missing: ${reqPath}`);
    }
  }
  console.log(`  Check 1 (Required paths): ${errors.length === 0 ? '✓' : '✗'}`);

  // ── Check 2: ZH locale exists ──
  if (enabledLocales.includes('zh')) {
    const zhHome = path.join(clientDir, 'zh', 'pages', 'home.json');
    if (existsSync(zhHome)) {
      passed++;
    } else {
      errors.push('ZH locale: zh/pages/home.json missing');
    }
  }
  console.log(`  Check 2 (ZH locale): ${errors.filter(e => e.includes('ZH')).length === 0 ? '✓' : '✗'}`);

  // ── Check 3: No template contamination ──
  let contamFound = 0;
  for await (const filePath of walkDir(clientDir)) {
    const content = await readFile(filePath, 'utf-8');
    for (const str of CONTAMINATION_STRINGS) {
      if (content.includes(str)) {
        errors.push(`Contamination: "${str}" found in ${path.relative(clientDir, filePath)}`);
        contamFound++;
        break;
      }
    }
  }
  if (contamFound === 0) passed++;
  console.log(`  Check 3 (Contamination): ${contamFound === 0 ? '✓' : '✗'} (${contamFound} files contaminated)`);

  // ── Check 4: Brand variant applied ──
  const themePath = path.join(clientDir, 'theme.json');
  const VALID_VARIANTS = ['hao-zhan', 'hongxiang', 'longmen', 'shuimo'];
  if (existsSync(themePath)) {
    const theme = JSON.parse(await readFile(themePath, 'utf-8'));
    const presetId = theme.preset?.id;
    if (presetId === intake.brand?.variant) {
      passed++;
    } else {
      errors.push(`Theme variant mismatch: expected "${intake.brand?.variant}", found "${presetId}"`);
    }
  } else {
    errors.push('theme.json missing');
  }
  console.log(`  Check 4 (Brand variant): ${errors.filter(e => e.includes('variant')).length === 0 ? '✓' : '✗'}`);

  // ── Check 5: Restaurant name in site.json ──
  const siteJsonPath = path.join(clientDir, primaryLocale, 'site.json');
  if (existsSync(siteJsonPath)) {
    const siteJson = JSON.parse(await readFile(siteJsonPath, 'utf-8'));
    if (siteJson.name === intake.business.name) {
      passed++;
    } else {
      errors.push(`site.json name mismatch: expected "${intake.business.name}", found "${siteJson.name}"`);
    }
    if (!siteJson.nameZh || siteJson.nameZh === '') {
      errors.push('site.json.nameZh is empty — required for Chinese restaurant');
    }
  } else {
    errors.push(`${primaryLocale}/site.json missing`);
  }
  console.log(`  Check 5 (Restaurant name): ${errors.filter(e => e.includes('name')).length === 0 ? '✓' : '✗'}`);

  // ── Check 6: Disabled locales removed ──
  const ALL_LOCALES = ['en', 'zh', 'es', 'ko'];
  let disabledLocaleFound = 0;
  for (const locale of ALL_LOCALES) {
    if (!enabledLocales.includes(locale)) {
      const localeDir = path.join(clientDir, locale);
      if (existsSync(localeDir)) {
        errors.push(`Disabled locale directory still exists: ${locale}/`);
        disabledLocaleFound++;
      }
    }
  }
  if (disabledLocaleFound === 0) passed++;
  console.log(`  Check 6 (Locale cleanup): ${disabledLocaleFound === 0 ? '✓' : '✗'}`);

  // ── Check 7: Disabled festivals removed ──
  const ALL_FESTIVALS = ['chinese-new-year', 'mid-autumn', 'wedding-banquet', 'dragon-boat'];
  const enabledFestivals = intake.festivals?.enabled || ALL_FESTIVALS;
  let disabledFestivalFound = 0;
  for (const festival of ALL_FESTIVALS) {
    if (!enabledFestivals.includes(festival)) {
      for (const locale of enabledLocales) {
        const festPath = path.join(clientDir, locale, 'pages', 'festivals', `${festival}.json`);
        if (existsSync(festPath)) {
          errors.push(`Disabled festival still exists: ${locale}/pages/festivals/${festival}.json`);
          disabledFestivalFound++;
        }
      }
    }
  }
  if (disabledFestivalFound === 0) passed++;
  console.log(`  Check 7 (Festival cleanup): ${disabledFestivalFound === 0 ? '✓' : '✗'}`);

  // ── Summary ──
  console.log(`\n  ${'─'.repeat(40)}`);
  console.log(`  Passed: ${passed} | Errors: ${errors.length} | Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.error('\n  VERIFICATION FAILED:');
    errors.forEach(e => console.error(`  ✗ ${e}`));
    throw new Error(`O7 verification failed with ${errors.length} error(s)`);
  } else {
    console.log('\n  ✓ ALL CHECKS PASSED');
  }
}
