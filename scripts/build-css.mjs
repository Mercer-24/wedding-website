#!/usr/bin/env node
/**
 * Pre-build Tailwind CSS as a static file.
 * Next.js 16 + Tailwind v4 doesn't always emit a static CSS file,
 * so we generate one explicitly and place it in public/.
 */
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function buildCSS() {
  const inputCSS = `@import "tailwindcss";\n`;
  const outputPath = path.join(rootDir, 'public', 'tailwind.css');

  console.log('[build-css] Generating Tailwind CSS...');

  const result = await postcss([tailwindcss()]).process(inputCSS, {
    from: 'src/app/globals.css',
  });

  // Add a comment header
  const output = `/* Tailwind CSS v4 - Auto-generated. Do not edit. */\n${result.css}`;

  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`[build-css] Wrote ${output.length} bytes to ${outputPath}`);
}

buildCSS().catch((err) => {
  console.error('[build-css] Error:', err);
  process.exit(1);
});