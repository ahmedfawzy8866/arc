/**
 * fix-ease-types.mjs
 * 1. Replaces `ease: [...]` with `ease: [...] as [number, number, number, number]`
 * 2. Adds `type Variants` to framer-motion import where `Variants` type is used
 * 3. Adds `: Variants` type annotation to animation variant objects
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const COMPONENTS_DIR = join(ROOT, 'components');
const APP_DIR = join(ROOT, 'app');

let totalFixed = 0;

function getAllTsx(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...getAllTsx(full));
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const files = [...getAllTsx(COMPONENTS_DIR), ...getAllTsx(APP_DIR)];

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  let original = content;

  // Fix 1: ease: [x, y, z, w] → ease: [x, y, z, w] as [number, number, number, number]
  // Only where not already cast
  content = content.replace(
    /ease:\s*(\[\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\])(?!\s*as)/g,
    'ease: $1 as [number, number, number, number]'
  );

  // Fix 2: Add `type Variants` to framer-motion import if Variants is used
  if (content.includes(': Variants') && content.includes("from 'framer-motion'")) {
    content = content.replace(
      /import \{([^}]+)\} from 'framer-motion'/,
      (match, imports) => {
        if (imports.includes('Variants') || imports.includes('type Variants')) return match;
        return `import {${imports}, type Variants } from 'framer-motion'`;
      }
    );
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    console.log(`✓ Fixed: ${file.replace(ROOT, '.')}`);
    totalFixed++;
  }
}

console.log(`\nDone. Fixed ${totalFixed} files.`);
