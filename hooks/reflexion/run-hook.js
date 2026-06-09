#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Node runs the TypeScript entry directly via native type stripping:
// on by default at >=23.6, behind --experimental-strip-types at >=22.6.
// Older runtimes cannot execute the .ts entry, so the hook no-ops rather
// than blocking the session (best effort — same contract as before, when
// it no-opped if `bun` was absent).
function stripTypesFlags() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major > 23 || (major === 23 && minor >= 6)) return [];
  if (major === 23 || (major === 22 && minor >= 6)) return ['--experimental-strip-types'];
  return null; // type stripping unsupported on this runtime
}

const eventName = process.argv[2];
const flags = stripTypesFlags();
if (!eventName || flags === null) {
  process.exit(0);
}

const scriptPath = path.join(__dirname, 'src', 'index.ts');
let stdin = '';
try {
  stdin = fs.readFileSync(0, 'utf8');
} catch {}

const result = spawnSync(process.execPath, ['--no-warnings', ...flags, scriptPath, eventName], {
  input: stdin,
  stdio: ['pipe', 'inherit', 'inherit']
});

process.exit(result.status ?? 0);
