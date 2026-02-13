import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..');
const README_PATH = resolve(ROOT, 'README.md');

function readAndFilter(filePath, section) {
  const content = readFileSync(filePath, 'utf-8');

  if (!section) return content;

  const lines = content.split('\n');
  const relevantLines = [];
  let capturing = false;

  for (const line of lines) {
    if (line.toLowerCase().includes(section.toLowerCase())) {
      capturing = true;
    }
    if (capturing) {
      relevantLines.push(line);
      if (relevantLines.length > 30) break;
    }
  }

  return relevantLines.length > 0 ? relevantLines.join('\n') : content;
}

export function readReadme(section) {
  return readAndFilter(README_PATH, section);
}
