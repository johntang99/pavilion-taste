#!/usr/bin/env node
// ============================================================
// BAAM System F — Chinese Restaurant Premium
// Pipeline B Orchestrator
// Usage: node scripts/onboard-client.mjs [client-id] [--skip-ai] [--dry-run]
// ============================================================

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const clientId = process.argv[2];
const skipAi = process.argv.includes('--skip-ai');
const dryRun = process.argv.includes('--dry-run');

if (!clientId) {
  console.error('Usage: node scripts/onboard-client.mjs [client-id] [--skip-ai] [--dry-run]');
  process.exit(1);
}

async function loadIntake(clientId) {
  const intakePath = path.join(ROOT, 'scripts', 'intake', `${clientId}.json`);
  if (!existsSync(intakePath)) {
    throw new Error(`Intake file not found: ${intakePath}\nCreate it at scripts/intake/${clientId}.json`);
  }
  return JSON.parse(await readFile(intakePath, 'utf-8'));
}

async function runStep(name, importPath, ...args) {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Step ${name}`);
  console.log(`${'─'.repeat(50)}`);
  const start = Date.now();
  const mod = await import(importPath);
  await mod.default(...args);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  ✓ ${name} complete (${elapsed}s)`);
}

async function main() {
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  BAAM System F — Pipeline B`);
  console.log(`  Client: ${clientId}`);
  if (dryRun) console.log(`  Mode: DRY RUN (no changes)`);
  if (skipAi) console.log(`  AI: SKIPPED`);
  console.log(`${'═'.repeat(50)}`);

  const intake = await loadIntake(clientId);

  // Validate intake has required fields
  if (!intake.business?.nameZh) {
    throw new Error('intake.business.nameZh is required (cannot be empty)');
  }
  if (!intake.brand?.variant) {
    throw new Error('intake.brand.variant is required (hao-zhan | hongxiang | longmen | shuimo)');
  }

  const pipelineStart = Date.now();

  await runStep('O1 · Clone', './onboard/o1-clone.mjs', clientId, intake, dryRun);
  await runStep('O2 · Brand', './onboard/o2-brand.mjs', clientId, intake, dryRun);
  await runStep('O3 · Prune', './onboard/o3-prune.mjs', clientId, intake, dryRun);
  await runStep('O4 · Replace', './onboard/o4-replace.mjs', clientId, intake, dryRun);

  if (!skipAi) {
    await runStep('O5 · AI Content', './onboard/o5-ai-content.mjs', clientId, intake, dryRun);
  } else {
    console.log('\n  O5 · AI Content — SKIPPED (--skip-ai)');
  }

  await runStep('O6 · Cleanup', './onboard/o6-cleanup.mjs', clientId, intake, dryRun);
  await runStep('O7 · Verify', './onboard/o7-verify.mjs', clientId, intake, dryRun);

  const totalElapsed = ((Date.now() - pipelineStart) / 1000).toFixed(1);
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  ✓ Pipeline B COMPLETE`);
  console.log(`  Client: ${clientId}`);
  console.log(`  Total time: ${totalElapsed}s`);
  if (dryRun) console.log(`  (Dry run — no actual changes made)`);
  console.log(`${'═'.repeat(50)}\n`);
}

main().catch((err) => {
  console.error('\n✗ Pipeline B FAILED:', err.message);
  process.exit(1);
});
