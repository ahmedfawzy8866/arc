/**
 * fix-style-jsx.mjs
 * Replaces all <style jsx> and <style jsx global> with plain <style> tags
 * so the Next.js App Router / Turbopack build succeeds.
 *
 * Usage: node scripts/fix-style-jsx.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

import { resolve } from 'path';
const ROOT = resolve(process.cwd());

let totalFixed = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.next', '.git', '.firebase'].includes(entry)) continue;
      walk(full);
    } else if (['.tsx', '.ts', '.jsx', '.js'].includes(extname(full))) {
      fix(full);
    }
  }
}

function fix(filePath) {
  const original = readFileSync(filePath, 'utf8');

  // Replace <style jsx global> and <style jsx> with plain <style>
  let updated = original
    .replace(/<style\s+jsx\s+global>/g, '<style>')
    .replace(/<style\s+jsx>/g, '<style>');

  if (updated !== original) {
    writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Fixed: ${filePath.replace(ROOT, '')}`);
    totalFixed++;
  }
}

walk(ROOT);
console.log(`\n🎯 Done. Fixed ${totalFixed} file(s).`);
