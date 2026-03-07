// O1 — Clone: Copy grand-pavilion content to new client site_id
import { readFile, writeFile, cp, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const CONTENT_DIR = path.join(ROOT, 'content');
const TEMPLATE_ID = 'grand-pavilion';

export default async function o1Clone(clientId, intake, dryRun = false) {
  const templateSiteId = intake.templateSiteId || TEMPLATE_ID;
  const templateDir = path.join(CONTENT_DIR, templateSiteId);
  const clientDir = path.join(CONTENT_DIR, clientId);

  // Check template exists
  if (!existsSync(templateDir)) {
    throw new Error(`Template site not found: ${templateDir}`);
  }

  // Check client doesn't already exist
  if (existsSync(clientDir)) {
    throw new Error(
      `Client site already exists: ${clientDir}\n` +
      `Run 'node scripts/delete-site.mjs ${clientId}' first to reset.`
    );
  }

  console.log(`  Cloning ${templateSiteId} → ${clientId}`);

  if (!dryRun) {
    // Copy template content directory
    await cp(templateDir, clientDir, { recursive: true });

    // Register new site in _sites.json
    const sitesPath = path.join(CONTENT_DIR, '_sites.json');
    const sitesData = JSON.parse(await readFile(sitesPath, 'utf-8'));
    const newSite = {
      id: clientId,
      name: intake.business.name,
      nameZh: intake.business.nameZh,
      domain: intake.domains?.production || `${clientId}.com`,
      enabled: true,
      defaultLocale: intake.locales?.primary || 'en',
      supportedLocales: intake.locales?.enabled || ['en', 'zh'],
      cuisineType: intake.business.cuisineType,
      cuisineTypeZh: intake.business.cuisineTypeZh,
      features: intake.features || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sitesData.sites.push(newSite);
    await writeFile(sitesPath, JSON.stringify(sitesData, null, 2));

    // Register domains in _site-domains.json
    const domainsPath = path.join(CONTENT_DIR, '_site-domains.json');
    const domainsData = JSON.parse(await readFile(domainsPath, 'utf-8'));
    if (intake.domains?.production) {
      domainsData.domains.push({
        siteId: clientId,
        domain: intake.domains.production,
        environment: 'prod',
        enabled: true,
      });
    }
    if (intake.domains?.dev) {
      domainsData.domains.push({
        siteId: clientId,
        domain: intake.domains.dev,
        environment: 'dev',
        enabled: true,
      });
    }
    await writeFile(domainsPath, JSON.stringify(domainsData, null, 2));

    console.log(`  ✓ Content cloned to ${clientDir}`);
    console.log(`  ✓ Site registered: ${clientId}`);
  } else {
    console.log(`  [DRY RUN] Would clone ${templateSiteId} → ${clientId}`);
  }
}
