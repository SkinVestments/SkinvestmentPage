import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const svg = readFileSync(join(publicDir, 'favicon.svg'));

const outputs = [
  { file: 'favicon-48.png', size: 48 },
  { file: 'favicon-192.png', size: 192 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: join('images', 'favicon.png'), size: 32 },
];

for (const { file, size } of outputs) {
  const outPath = join(publicDir, file);
  await sharp(svg).resize(size, size).png().toFile(outPath);
  console.log(`wrote ${file} (${size}x${size})`);
}
