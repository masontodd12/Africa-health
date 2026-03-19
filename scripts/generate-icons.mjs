#!/usr/bin/env node
// Run this once: node scripts/generate-icons.mjs
// Generates public/icons/icon-192.png and icon-512.png
// Requires: npm install sharp

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/icons");
mkdirSync(OUT, { recursive: true });

// SVG icon — the + logo on dark background
const svg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#050A14"/>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#grad)"/>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0D1825"/>
      <stop offset="100%" stop-color="#050A14"/>
    </linearGradient>
  </defs>
  <!-- Blue glow circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.32}" fill="rgba(66,153,225,0.12)"/>
  <!-- + symbol -->
  <rect x="${size*0.44}" y="${size*0.26}" width="${size*0.12}" height="${size*0.48}" rx="${size*0.04}" fill="#4299E1"/>
  <rect x="${size*0.26}" y="${size*0.44}" width="${size*0.48}" height="${size*0.12}" rx="${size*0.04}" fill="#4299E1"/>
  <!-- Subtle ring -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.42}" fill="none" stroke="rgba(99,179,237,0.15)" stroke-width="${size*0.01}"/>
</svg>`;

for (const size of [192, 512]) {
  const buf = await sharp(Buffer.from(svg(size)))
    .png()
    .toBuffer();
  writeFileSync(join(OUT, `icon-${size}.png`), buf);
  console.log(`✓ icon-${size}.png`);
}

console.log("Done. Icons saved to public/icons/");