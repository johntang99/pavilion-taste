// O3 — Prune: Remove disabled menu types, festivals, and locales from client content
import { readFile, writeFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const CONTENT_DIR = path.join(ROOT, 'content');

// All menu types supported by the template
const ALL_MENU_TYPES = ['dim-sum', 'dinner', 'chef-signatures', 'weekend-brunch', 'breakfast', 'lunch', 'seasonal', 'tasting-menu', 'cocktails', 'wine', 'beverages', 'desserts', 'kids'];
// All festival slugs supported by the template
const ALL_FESTIVALS = ['chinese-new-year', 'mid-autumn', 'wedding-banquet', 'dragon-boat'];

export default async function o3Prune(clientId, intake, dryRun = false) {
  const clientDir = path.join(CONTENT_DIR, clientId);
  const enabledMenuTypes = intake.menu?.enabled || ALL_MENU_TYPES;
  const enabledFestivals = intake.festivals?.enabled || ALL_FESTIVALS;
  const enabledLocales = intake.locales?.enabled || ['en', 'zh'];

  let pruned = 0;

  // 1. Prune disabled menu types from menu.json
  for (const locale of enabledLocales) {
    const menuPath = path.join(clientDir, locale, 'pages', 'menu.json');
    if (!existsSync(menuPath)) continue;

    const menu = JSON.parse(await readFile(menuPath, 'utf-8'));
    if (!Array.isArray(menu.categories)) continue;

    const before = menu.categories.length;
    menu.categories = menu.categories.filter((cat) => enabledMenuTypes.includes(cat.id));
    if (menu.categories.length < before) {
      if (!dryRun) await writeFile(menuPath, JSON.stringify(menu, null, 2));
      console.log(`  Pruned ${before - menu.categories.length} menu type(s) from ${locale}/pages/menu.json`);
      pruned += before - menu.categories.length;
    }
  }

  // 2. Prune disabled festival pages
  for (const festival of ALL_FESTIVALS) {
    if (!enabledFestivals.includes(festival)) {
      for (const locale of enabledLocales) {
        const festivalPath = path.join(clientDir, locale, 'pages', 'festivals', `${festival}.json`);
        if (existsSync(festivalPath)) {
          if (!dryRun) await rm(festivalPath);
          console.log(`  Removed festival: ${locale}/pages/festivals/${festival}.json`);
          pruned++;
        }
      }
    }
  }

  // 3. Prune unsupported locales (remove all files for disabled locales)
  const ALL_POSSIBLE_LOCALES = ['en', 'zh', 'es', 'ko'];
  for (const locale of ALL_POSSIBLE_LOCALES) {
    if (!enabledLocales.includes(locale)) {
      const localeDir = path.join(clientDir, locale);
      if (existsSync(localeDir)) {
        if (!dryRun) await rm(localeDir, { recursive: true });
        console.log(`  Removed locale directory: ${locale}/`);
        pruned++;
      }
    }
  }

  // 4. Remove private dining if not enabled
  if (!intake.features?.private_dining) {
    for (const locale of enabledLocales) {
      const pdPath = path.join(clientDir, locale, 'pages', 'private-dining.json');
      if (existsSync(pdPath)) {
        if (!dryRun) await rm(pdPath);
        console.log(`  Removed: ${locale}/pages/private-dining.json (private_dining disabled)`);
        pruned++;
      }
    }
  }

  if (pruned === 0) {
    console.log('  Nothing to prune — all features enabled');
  } else {
    console.log(`  ✓ Pruned ${pruned} item(s) total`);
  }
}
