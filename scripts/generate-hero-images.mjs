import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images');

const SIZES = [
  { width: 335, suffix: '-sm' },
  { width: 670, suffix: '-md' },
];

const SOURCES = ['screen-b', 'screen-w'];

for (const base of SOURCES) {
  const input = path.join(outDir, `${base}.webp`);
  if (!fs.existsSync(input)) {
    console.warn(`Skip ${base}: missing ${input}`);
    continue;
  }

  for (const { width, suffix } of SIZES) {
    const output = path.join(outDir, `${base}${suffix}.webp`);
    await sharp(input)
      .resize(width)
      .webp({ quality: 85 })
      .toFile(output);
    const stat = fs.statSync(output);
    console.log(`Wrote ${path.basename(output)} (${width}px, ${(stat.size / 1024).toFixed(1)} KiB)`);
  }
}
