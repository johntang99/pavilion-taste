// O4 — Replace: Deep string replacement across all content JSON files
import { readFile, writeFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const CONTENT_DIR = path.join(ROOT, 'content');

// Template → Client replacement pairs (order matters: longest/most specific first)
function buildReplacementPairs(intake) {
  return [
    // Chinese names (most specific first)
    ['大观楼', intake.business.nameZh],
    ['厨师长李伟', intake.business.ownerNameZh],
    ['粤菜', intake.business.cuisineTypeZh],
    ['李伟主厨', intake.business.ownerNameZh],
    ['李伟', intake.business.ownerNameZh || ''],
    // English names
    ['Grand Pavilion', intake.business.name],
    ['Chef Li Wei', intake.business.ownerName],
    ['Executive Chef & Founder', intake.business.ownerTitle || 'Executive Chef & Owner'],
    ['Cantonese', intake.business.cuisineType],
    // Location
    ['133-24 Roosevelt Ave, Flushing, NY 11354', `${intake.location.address}, ${intake.location.city}, ${intake.location.state} ${intake.location.zip}`],
    ['133-24 Roosevelt Ave', intake.location.address],
    ['Flushing, New York', `${intake.location.city}, ${intake.location.state}`],
    ['Flushing, NY', `${intake.location.city}, ${intake.location.state}`],
    ['Flushing', intake.location.city],
    ['NY 11354', `${intake.location.state} ${intake.location.zip}`],
    ['11354', intake.location.zip],
    // Contact
    ['(718) 555-0188', intake.location.phone],
    ['info@grandpavilionny.com', intake.location.email],
    // Social
    ['@grandpavilionny', intake.social?.instagram || ''],
    ['facebook.com/grandpavilionny', intake.social?.facebook || ''],
    ['大观楼餐厅', intake.social?.wechatAccountName || intake.business.nameZh],
    ['grandpavilionny.com', intake.domains?.production || ''],
    // Site ID (last — catches slug references)
    ['grand-pavilion', intake.clientId],
  ].filter(([from, to]) => from && to && from !== to);
}

async function replaceInJson(filePath, pairs, dryRun) {
  const raw = await readFile(filePath, 'utf-8');
  let content = raw;
  for (const [from, to] of pairs) {
    content = content.split(from).join(to);
  }
  if (content !== raw) {
    if (!dryRun) await writeFile(filePath, content);
    return true;
  }
  return false;
}

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else if (entry.name.endsWith('.json')) {
      yield fullPath;
    }
  }
}

export default async function o4Replace(clientId, intake, dryRun = false) {
  const clientDir = path.join(CONTENT_DIR, clientId);
  if (!existsSync(clientDir)) throw new Error(`Client dir not found: ${clientDir}`);

  const pairs = buildReplacementPairs(intake);
  console.log(`  Applying ${pairs.length} replacement pairs`);

  let replaced = 0;
  let total = 0;
  for await (const filePath of walkDir(clientDir)) {
    total++;
    const changed = await replaceInJson(filePath, pairs, dryRun);
    if (changed) replaced++;
  }

  console.log(`  ✓ Updated ${replaced}/${total} JSON files`);

  // Also update site.json with structured fields
  if (!dryRun) {
    const enabledLocales = intake.locales?.enabled || ['en', 'zh'];
    for (const locale of enabledLocales) {
      const siteJsonPath = path.join(clientDir, locale, 'site.json');
      if (!existsSync(siteJsonPath)) continue;

      const siteJson = JSON.parse(await readFile(siteJsonPath, 'utf-8'));
      Object.assign(siteJson, {
        id: clientId,
        name: intake.business.name,
        nameZh: intake.business.nameZh,
        cuisineType: intake.business.cuisineType,
        cuisineTypeZh: intake.business.cuisineTypeZh,
        phone: intake.location.phone,
        email: intake.location.email,
        address: intake.location.address,
        city: intake.location.city,
        state: intake.location.state,
        zip: intake.location.zip,
        hours: intake.hours || siteJson.hours,
        dimSumHours: intake.dimSum?.hours || siteJson.dimSumHours,
        weekendBrunchHours: intake.dimSum?.weekendBrunchHours || siteJson.weekendBrunchHours,
        wechatAccountName: intake.social?.wechatAccountName || null,
        wechatQrUrl: intake.social?.wechatQrUrl || null,
        parkingNote: intake.location.parkingNote || null,
        parkingNoteZh: intake.location.parkingNoteZh || null,
        social: {
          instagram: intake.social?.instagram || null,
          facebook: intake.social?.facebook || null,
          yelp: intake.social?.yelp || null,
        },
        defaultLocale: intake.locales?.primary || 'en',
        enabledLocales: enabledLocales,
      });
      await writeFile(siteJsonPath, JSON.stringify(siteJson, null, 2));
    }
    console.log('  ✓ site.json rebuilt with intake data');
  }
}
