#!/usr/bin/env node
/**
 * fetch-chinese-restaurant-images.mjs
 *
 * Fetches Chinese restaurant images from Unsplash and:
 *   1. Saves to public/uploads/grand-pavilion/  (local fallback, always)
 *   2. Uploads to Supabase Storage bucket (if configured)
 *   3. Updates content JSON files to reference the correct URLs
 *
 * Usage: node scripts/fetch-chinese-restaurant-images.mjs [--site=grand-pavilion]
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load .env.local ───────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx <= 0) continue;
    const key = t.slice(0, idx).trim();
    let val = t.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const SITE_ID    = process.argv.find(a => a.startsWith('--site='))?.split('=')[1] || 'grand-pavilion';
const UNSPLASH   = process.env.UNSPLASH_ACCESS_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET     = process.env.SUPABASE_STORAGE_BUCKET || 'media';

if (!UNSPLASH) { console.error('Missing UNSPLASH_ACCESS_KEY'); process.exit(1); }

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

const PUBLIC_UPLOADS = path.join(ROOT, 'public', 'uploads', SITE_ID);

// ── Unsplash fetch ────────────────────────────────────────
async function searchUnsplash(query, count = 1) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&client_id=${UNSPLASH}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${query}`);
  const data = await res.json();
  return (data.results || []).map(p => ({
    id: p.id,
    url: p.urls.regular,
    download: p.links.download_location,
  }));
}

async function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'BAAM-Restaurant/1.0' } }, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function saveImage(buffer, localPath, storagePath) {
  // Always save locally
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, buffer);
  const kb = Math.round(buffer.length / 1024);
  console.log(`    ✓ Local: ${path.relative(ROOT, localPath)} (${kb} KB)`);

  // Upload to Supabase if available
  if (supabase) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: 'image/jpeg', upsert: true });
    if (error) {
      console.log(`    ⚠ Storage skip: ${error.message}`);
    } else {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      console.log(`    ✓ Storage: ${data.publicUrl}`);
      return data.publicUrl;
    }
  }
  // Return local path as fallback
  return `/uploads/${SITE_ID}/${storagePath.split(`${SITE_ID}/`)[1] || path.basename(localPath)}`;
}

// ── Image catalog for Chinese restaurant ─────────────────
const IMAGE_SETS = [
  // Hero
  { query: 'chinese restaurant elegant interior dark moody', category: 'hero', filename: 'hero-main.jpg', slot: 'hero' },
  { query: 'dim sum bamboo steamer chinese restaurant', category: 'hero', filename: 'hero-dim-sum.jpg', slot: 'hero_dim_sum' },
  { query: 'chinese fine dining private room', category: 'hero', filename: 'reservations-hero.jpg', slot: 'hero_reservations' },
  // Menu - Dim Sum
  { query: 'har gow crystal dumpling chinese dim sum', category: 'menu', filename: 'har-gow.jpg', slot: 'har_gow' },
  { query: 'siu mai pork shrimp dumpling', category: 'menu', filename: 'siu-mai.jpg', slot: 'siu_mai' },
  { query: 'char siu bao bbq pork bun', category: 'menu', filename: 'char-siu-bao.jpg', slot: 'char_siu_bao' },
  { query: 'dim sum spread overhead bamboo steamer', category: 'menu', filename: 'dim-sum-spread.jpg', slot: 'dim_sum_spread' },
  { query: 'xiao long bao soup dumpling', category: 'menu', filename: 'xiao-long-bao.jpg', slot: 'xiao_long_bao' },
  { query: 'egg tart hong kong pastry', category: 'menu', filename: 'egg-tart.jpg', slot: 'egg_tart' },
  // Menu - Dinner
  { query: 'peking duck crispy skin chinese roast', category: 'menu', filename: 'peking-duck.jpg', slot: 'peking_duck' },
  { query: 'chinese whole steamed fish ginger scallion', category: 'menu', filename: 'steamed-fish.jpg', slot: 'steamed_fish' },
  { query: 'cantonese roast duck chinese restaurant', category: 'menu', filename: 'dinner.jpg', slot: 'dinner' },
  // Chef
  { query: 'asian chef cooking professional kitchen', category: 'chef', filename: 'chef-li-wei.jpg', slot: 'chef_hero' },
  { query: 'chef hands making dumpling dim sum', category: 'chef', filename: 'chef-li-wei-kitchen.jpg', slot: 'chef_action' },
  { query: 'chef portrait asian restaurant', category: 'chef', filename: 'chef-li-wei-portrait.jpg', slot: 'chef_portrait' },
  // Gallery
  { query: 'chinese restaurant interior elegant red gold', category: 'gallery', filename: 'food-1.jpg', slot: 'gallery_food_1' },
  { query: 'cantonese cuisine food photography dark', category: 'gallery', filename: 'food-2.jpg', slot: 'gallery_food_2' },
  { query: 'dim sum morning service overhead', category: 'gallery', filename: 'food-3.jpg', slot: 'gallery_food_3' },
  { query: 'chinese restaurant dining room table setting', category: 'gallery', filename: 'dining-room-1.jpg', slot: 'gallery_dining_1' },
  { query: 'private dining room chinese restaurant', category: 'gallery', filename: 'dining-room-2.jpg', slot: 'gallery_dining_2' },
  { query: 'chinese wedding banquet ballroom dinner', category: 'gallery', filename: 'event-1.jpg', slot: 'gallery_event_1' },
  // Festivals
  { query: 'chinese new year red lanterns festive decoration', category: 'festivals', filename: 'cny-hero.jpg', slot: 'festival_cny' },
  { query: 'mid autumn festival mooncake moon', category: 'festivals', filename: 'mid-autumn-hero.jpg', slot: 'festival_mid_autumn' },
  // Banquet
  { query: 'banquet hall chinese restaurant grand ballroom', category: 'banquet', filename: 'grand-ballroom.jpg', slot: 'banquet_ballroom' },
  { query: 'private dining room chinese restaurant table', category: 'banquet', filename: 'private-room.jpg', slot: 'banquet_private' },
  { query: 'cantonese wedding banquet dinner', category: 'banquet', filename: 'banquet-hall.jpg', slot: 'banquet_hall' },
  // Weekend brunch
  { query: 'weekend dim sum brunch table spread chinese', category: 'menu', filename: 'weekend-brunch.jpg', slot: 'weekend_brunch' },
  // Tea
  { query: 'chinese tea ceremony jasmine pu-erh teapot', category: 'menu', filename: 'tea.jpg', slot: 'tea' },
  // Chef signatures
  { query: 'whole roast duck chinese restaurant plating', category: 'menu', filename: 'chef-signatures.jpg', slot: 'chef_sigs' },
  // Gallery chef
  { query: 'chef cooking action professional wok', category: 'gallery', filename: 'chef-1.jpg', slot: 'gallery_chef_1' },
  { query: 'chinese new year dinner celebration restaurant', category: 'gallery', filename: 'festival-1.jpg', slot: 'gallery_festival_1' },
];

// ── Update content JSON with image URLs ───────────────────
function updateContentFile(filePath, updates) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [placeholder, newUrl] of Object.entries(updates)) {
    content = content.split(placeholder).join(newUrl);
  }
  fs.writeFileSync(filePath, content);
}

// ── Main ─────────────────────────────────────────────────
async function main() {
  console.log(`\n══════════════════════════════════════════`);
  console.log(`  Chinese Restaurant Image Fetcher`);
  console.log(`  Site: ${SITE_ID}`);
  console.log(`  Supabase: ${supabase ? '✓ connected' : '✗ local only'}`);
  console.log(`══════════════════════════════════════════\n`);

  const urlMap = {}; // slot → resolved URL

  for (const item of IMAGE_SETS) {
    const localDir = path.join(PUBLIC_UPLOADS, item.category);
    const localPath = path.join(localDir, item.filename);

    // Skip if already downloaded locally
    if (fs.existsSync(localPath)) {
      const localUrl = `/uploads/${SITE_ID}/${item.category}/${item.filename}`;
      urlMap[item.slot] = localUrl;
      console.log(`  [cached] ${item.category}/${item.filename}`);
      continue;
    }

    console.log(`  → ${item.query}`);
    try {
      const photos = await searchUnsplash(item.query, 1);
      if (!photos.length) { console.log(`    ⚠ No results`); continue; }
      const buf = await downloadBuffer(photos[0].url);
      const storagePath = `${SITE_ID}/${item.category}/${item.filename}`;
      const resolvedUrl = await saveImage(buf, localPath, storagePath);
      urlMap[item.slot] = resolvedUrl;
    } catch (e) {
      console.log(`    ✗ Error: ${e.message}`);
    }

    // Throttle Unsplash (50 req/hr on free)
    await new Promise(r => setTimeout(r, 300));
  }

  // ── Patch content JSON files with resolved URLs ────────
  console.log('\n  Patching content JSON files...');

  const CONTENT_DIR = path.join(ROOT, 'content', SITE_ID);
  const locales = ['en', 'zh'];

  const patches = [
    // home.json patches
    { files: locales.map(l => `${l}/pages/home.json`), replacements: {
      '/uploads/grand-pavilion/hero/hero-main.jpg': urlMap.hero || '',
      '/uploads/grand-pavilion/chef/chef-li-wei.jpg': urlMap.chef_hero || '',
      '/uploads/grand-pavilion/menu/dim-sum-spread.jpg': urlMap.dim_sum_spread || '',
      '/uploads/grand-pavilion/menu/peking-duck.jpg': urlMap.peking_duck || '',
      '/uploads/grand-pavilion/menu/char-siu-bao.jpg': urlMap.char_siu_bao || '',
      '/uploads/grand-pavilion/menu/dinner.jpg': urlMap.dinner || '',
      '/uploads/grand-pavilion/menu/chef-signatures.jpg': urlMap.chef_sigs || '',
      '/uploads/grand-pavilion/menu/weekend-brunch.jpg': urlMap.weekend_brunch || '',
      '/uploads/grand-pavilion/menu/tea.jpg': urlMap.tea || '',
      '/uploads/grand-pavilion/banquet/grand-ballroom.jpg': urlMap.banquet_ballroom || '',
      '/uploads/grand-pavilion/gallery/food-1.jpg': urlMap.gallery_food_1 || '',
      '/uploads/grand-pavilion/gallery/food-2.jpg': urlMap.gallery_food_2 || '',
      '/uploads/grand-pavilion/gallery/food-3.jpg': urlMap.gallery_food_3 || '',
      '/uploads/grand-pavilion/gallery/dining-room-1.jpg': urlMap.gallery_dining_1 || '',
      '/uploads/grand-pavilion/gallery/event-1.jpg': urlMap.gallery_event_1 || '',
      '/uploads/grand-pavilion/gallery/dim-sum-spread.jpg': urlMap.dim_sum_spread || '',
    }},
    // about.json patches
    { files: locales.map(l => `${l}/pages/about.json`), replacements: {
      '/uploads/grand-pavilion/chef/chef-li-wei-kitchen.jpg': urlMap.chef_action || '',
      '/uploads/grand-pavilion/chef/chef-li-wei-portrait.jpg': urlMap.chef_portrait || '',
    }},
    // reservations.json patches
    { files: locales.map(l => `${l}/pages/reservations.json`), replacements: {
      '/uploads/grand-pavilion/hero/reservations-hero.jpg': urlMap.hero_reservations || '',
    }},
    // private-dining.json patches
    { files: locales.map(l => `${l}/pages/private-dining.json`), replacements: {
      '/uploads/grand-pavilion/banquet/grand-ballroom.jpg': urlMap.banquet_ballroom || '',
      '/uploads/grand-pavilion/banquet/private-room.jpg': urlMap.banquet_private || '',
      '/uploads/grand-pavilion/banquet/banquet-hall.jpg': urlMap.banquet_hall || '',
    }},
    // festivals patches
    { files: ['en/pages/festivals/chinese-new-year.json', 'zh/pages/festivals/chinese-new-year.json'], replacements: {
      '/uploads/grand-pavilion/festivals/cny-hero.jpg': urlMap.festival_cny || '',
    }},
    { files: ['en/pages/festivals/mid-autumn.json', 'zh/pages/festivals/mid-autumn.json'], replacements: {
      '/uploads/grand-pavilion/festivals/mid-autumn-hero.jpg': urlMap.festival_mid_autumn || '',
    }},
    // gallery.json patches
    { files: locales.map(l => `${l}/pages/gallery.json`), replacements: {
      '/uploads/grand-pavilion/gallery/food-1.jpg': urlMap.gallery_food_1 || '',
    }},
  ];

  let patched = 0;
  for (const { files, replacements } of patches) {
    // Filter out empty replacements
    const validRep = Object.fromEntries(Object.entries(replacements).filter(([, v]) => v));
    if (!Object.keys(validRep).length) continue;
    for (const file of files) {
      const fullPath = path.join(CONTENT_DIR, file);
      if (fs.existsSync(fullPath)) {
        updateContentFile(fullPath, validRep);
        patched++;
      }
    }
  }
  console.log(`  ✓ Patched ${patched} content files`);

  // Re-sync to DB
  if (supabase) {
    console.log('\n  Re-syncing content to DB...');
    const { execSync } = await import('child_process');
    try {
      execSync('node scripts/sync-content-to-db.mjs', { cwd: ROOT, stdio: 'pipe' });
      console.log('  ✓ Content synced to DB');
    } catch (e) {
      console.log('  ⚠ DB sync failed — run manually: node scripts/sync-content-to-db.mjs');
    }
  }

  console.log('\n══════════════════════════════════════════');
  console.log(`  ✓ Done! ${Object.keys(urlMap).length} images processed`);
  console.log(`  View at: http://localhost:3022/en`);
  console.log('══════════════════════════════════════════\n');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
