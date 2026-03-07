#!/usr/bin/env node
// ============================================================
// Seed superadmin user into Supabase admin_users table
// Usage: node scripts/seed-admin-user.mjs
// Optional flags:
//   --email admin@example.com
//   --password YourPassword123
//   --name "Super Admin"
// ============================================================

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ── Load .env.local ──────────────────────────────────────
async function loadDotEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx <= 0) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {}
}

function readArg(flag, fallback = '') {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? (process.argv[i + 1] || fallback) : fallback;
}

// ── Simple bcrypt using the bcryptjs package ──────────────
async function hashPassword(password) {
  try {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, 10);
  } catch {
    // Fallback: use crypto SHA256 (not for production, just for seeding)
    console.warn('  ⚠ bcryptjs not found — using SHA256 fallback. Install bcryptjs for proper security.');
    return '$2b$10$' + createHash('sha256').update(password).digest('hex').slice(0, 53);
  }
}

async function main() {
  await loadDotEnv();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('✗ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const email    = readArg('--email',    'admin@grandpavilionny.com');
  const password = readArg('--password', 'Admin@Pavilion2026');
  const name     = readArg('--name',     'Super Admin');
  const siteId   = readArg('--site',     'grand-pavilion');

  console.log('\n══════════════════════════════════════');
  console.log('  Seeding admin user');
  console.log(`  Email:    ${email}`);
  console.log(`  Name:     ${name}`);
  console.log(`  Site:     ${siteId}`);
  console.log('══════════════════════════════════════\n');

  const passwordHash = await hashPassword(password);

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Check if user already exists
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    console.log(`  User already exists (id: ${existing.id}) — updating password and sites`);
    const { error } = await supabase
      .from('admin_users')
      .update({
        password_hash: passwordHash,
        sites: [siteId],
        name,
        role: 'super_admin',
        last_login_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (error) {
      console.error('✗ Update failed:', error.message);
      process.exit(1);
    }
    console.log('  ✓ Admin user updated');
  } else {
    const { error } = await supabase.from('admin_users').insert({
      id: 'admin-1',
      email,
      name,
      role: 'super_admin',
      sites: [siteId],
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    });

    if (error) {
      // ID conflict — try without fixed ID
      if (error.code === '23505') {
        const { error: e2 } = await supabase.from('admin_users').insert({
          email,
          name,
          role: 'super_admin',
          sites: [siteId],
          password_hash: passwordHash,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        });
        if (e2) { console.error('✗ Insert failed:', e2.message); process.exit(1); }
      } else {
        console.error('✗ Insert failed:', error.message);
        process.exit(1);
      }
    }
    console.log('  ✓ Admin user created');
  }

  console.log('\n══════════════════════════════════════');
  console.log('  ✓ Done! Admin credentials:');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Login at: http://localhost:3022/admin/login`);
  console.log('══════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
