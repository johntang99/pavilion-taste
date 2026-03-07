#!/usr/bin/env node
// Utility: Delete a client site (for testing Pipeline B)
// Usage: node scripts/delete-site.mjs [client-id]

import { readFile, writeFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

const clientId = process.argv[2];
if (!clientId) {
  console.error('Usage: node scripts/delete-site.mjs [client-id]');
  process.exit(1);
}

// Safety: never delete grand-pavilion or meridian-diner
const PROTECTED = ['grand-pavilion', 'meridian-diner', 'the-meridian'];
if (PROTECTED.includes(clientId)) {
  console.error(`✗ "${clientId}" is a protected template site — cannot delete`);
  process.exit(1);
}

const clientDir = path.join(CONTENT_DIR, clientId);
if (!existsSync(clientDir)) {
  console.log(`Site "${clientId}" does not exist — nothing to delete`);
  process.exit(0);
}

// Remove from _sites.json
const sitesPath = path.join(CONTENT_DIR, '_sites.json');
const sites = JSON.parse(await readFile(sitesPath, 'utf-8'));
sites.sites = sites.sites.filter(s => s.id !== clientId);
await writeFile(sitesPath, JSON.stringify(sites, null, 2));

// Remove from _site-domains.json
const domainsPath = path.join(CONTENT_DIR, '_site-domains.json');
const domains = JSON.parse(await readFile(domainsPath, 'utf-8'));
domains.domains = domains.domains.filter(d => d.siteId !== clientId);
await writeFile(domainsPath, JSON.stringify(domains, null, 2));

// Delete content directory
await rm(clientDir, { recursive: true });

console.log(`✓ Site "${clientId}" deleted successfully`);
