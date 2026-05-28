import fs from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..');

const skipDirs = new Set(['node_modules', 'dist', 'scripts', '.git']);

const replacements = [
  [/bg-\[#1e232b\]/gi, 'bg-steam-card'],
  [/bg-\[#14171d\]/gi, 'bg-steam-bg'],
  [/bg-\[#171a21\]/gi, 'bg-steam-surface'],
  [/bg-\[#1b2028\]/gi, 'bg-steam-elevated'],
  [/bg-\[#252b36\]/gi, 'bg-steam-hover'],
  [/bg-\[#0B0D12\]/gi, 'bg-steam-bg'],
  [/bg-\[#161B24\]/gi, 'bg-steam-card'],
  [/bg-\[#12161E\]/gi, 'bg-steam-elevated'],
  [/bg-\[#2a303c\]/gi, 'bg-steam-hover'],
  [/border-gray-800/g, 'border-steam-border'],
  [/border-gray-700/g, 'border-steam-border'],
  [/divide-gray-800/g, 'divide-steam-border'],
  [/text-gray-400/g, 'text-steam-secondary'],
  [/text-gray-500/g, 'text-steam-tertiary'],
  [/text-gray-600/g, 'text-steam-tertiary'],
  [/text-gray-300/g, 'text-steam-secondary'],
  [/text-gray-200/g, 'text-steam-text'],
  [/hover:text-white/g, 'hover:text-steam-text'],
  [/hover:bg-\[#252b36\]/g, 'hover:bg-steam-hover'],
  [/hover:bg-white\/10/g, 'hover:bg-steam-hover'],
  [/hover:bg-white\/5/g, 'hover:bg-steam-hover'],
  [/border-white\/5/g, 'border-steam-border/50'],
  [/border-white\/10/g, 'border-steam-border'],
  [/bg-\[#212c3d\]/gi, 'bg-steam-surface'],
  [/bg-\[#2a384d\]/gi, 'bg-steam-hover'],
  [/bg-\[#1B2838\]/gi, 'bg-steam-surface'],
  [/bg-\[#1b2838\]/gi, 'bg-steam-surface'],
  [/bg-\[#14161b\]/gi, 'bg-steam-elevated'],
  [/bg-\[#0d0f12\]/gi, 'bg-steam-bg'],
  [/bg-\[#141619\]/gi, 'bg-steam-elevated'],
  [/bg-\[#1C222E\]/gi, 'bg-steam-hover'],
  [/bg-\[#3b82f6\]/gi, 'bg-steam-accent'],
  [/hover:bg-gray-800/g, 'hover:bg-steam-hover'],
  [/hover:border-gray-600/g, 'hover:border-steam-border'],
  [/hover:border-gray-500/g, 'hover:border-steam-border'],
  [/placeholder:text-gray-700/g, 'placeholder:text-steam-tertiary'],
  [/text-gray-700/g, 'text-steam-tertiary'],
  [/border-gray-600/g, 'border-steam-border'],
  [/bg-gray-800\/50/g, 'bg-steam-elevated/80'],
  [/bg-gray-700\/30/g, 'bg-steam-elevated/60'],
  [/bg-gray-800/g, 'bg-steam-elevated'],
  [/bg-gray-700/g, 'bg-steam-elevated'],
  [/border-\[#14171d\]/gi, 'border-steam-bg'],
  [/border-\[#0B0D12\]/gi, 'border-steam-bg'],
  [/border-\[#1F2937\]/gi, 'border-steam-border'],
  [/focus:border-blue-500/g, 'focus:border-steam-accent'],
  [/placeholder-gray-600/g, 'placeholder:text-steam-tertiary'],
];

const textWhiteExceptions =
  /(bg-steam-accent|bg-blue-|bg-red-|bg-green-|from-steam-accent|to-blue-|bg-gradient|shadow-blue|shadow-red|btn-primary)/;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  content = content.replace(/\btext-white\b/g, (match, offset) => {
    const lineStart = content.lastIndexOf('\n', offset) + 1;
    const lineEnd = content.indexOf('\n', offset);
    const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    if (textWhiteExceptions.test(line)) return match;
    if (/text-steam-accent|text-blue-|text-green-|text-red-|text-yellow-|text-purple-|text-pink-|text-orange-/i.test(line)) {
      return match;
    }
    return 'text-steam-text';
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    changed++;
    console.log('updated:', path.relative(root, file));
  }
}

console.log(`Done. ${changed} files updated.`);
