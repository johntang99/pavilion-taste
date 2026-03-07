// O6 — Cleanup: Remove disabled locale directories
import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const CONTENT_DIR = path.join(ROOT, 'content');

const ALL_LOCALES = ['en', 'zh', 'es', 'ko'];

export default async function o6Cleanup(clientId, intake, dryRun = false) {
  const clientDir = path.join(CONTENT_DIR, clientId);
  const enabledLocales = intake.locales?.enabled || ['en', 'zh'];

  let removed = 0;
  for (const locale of ALL_LOCALES) {
    if (!enabledLocales.includes(locale)) {
      const localeDir = path.join(clientDir, locale);
      if (existsSync(localeDir)) {
        if (!dryRun) await rm(localeDir, { recursive: true });
        console.log(`  Removed disabled locale: ${locale}/`);
        removed++;
      }
    }
  }

  if (removed === 0) {
    console.log('  Nothing to clean up — all locales already correct');
  } else {
    console.log(`  ✓ Cleaned up ${removed} locale(s)`);
  }
}
