// O2 — Brand: Apply Chinese restaurant brand variant to client theme.json
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const CONTENT_DIR = path.join(ROOT, 'content');
const PRESETS_DIR = path.join(ROOT, 'data', 'theme-presets');
const VALID_VARIANTS = ['hao-zhan', 'hongxiang', 'longmen', 'shuimo'];

export default async function o2Brand(clientId, intake, dryRun = false) {
  const variantId = intake.brand?.variant || 'hao-zhan';

  if (!VALID_VARIANTS.includes(variantId)) {
    throw new Error(`Invalid brand variant: "${variantId}". Must be one of: ${VALID_VARIANTS.join(', ')}`);
  }

  const presetPath = path.join(PRESETS_DIR, `${variantId}.json`);
  if (!existsSync(presetPath)) {
    throw new Error(`Theme preset not found: ${presetPath}`);
  }

  const preset = JSON.parse(await readFile(presetPath, 'utf-8'));

  // Apply overrides from intake
  const themeConfig = {
    preset: {
      id: variantId,
      name: preset._preset?.name || variantId,
      category: preset._preset?.category || 'chinese-fine-dining',
    },
    overrides: intake.brand?.overrides || {},
  };

  console.log(`  Applying variant: ${variantId} (${preset._preset?.name || variantId})`);

  if (!dryRun) {
    const themePath = path.join(CONTENT_DIR, clientId, 'theme.json');
    await writeFile(themePath, JSON.stringify(themeConfig, null, 2));
    console.log(`  ✓ Theme written: ${themePath}`);
  } else {
    console.log(`  [DRY RUN] Would write theme: ${variantId}`);
  }
}
