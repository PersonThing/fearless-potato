import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve, extname, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.vite', '.claude']);
const TEXT_EXTENSIONS = new Set(['js', 'ts', 'svelte', 'css', 'json', 'md', 'html']);

export function searchCode(query, fileType) {
  const results = [];
  searchDir(ROOT, query, fileType, results);
  return (
    results
      .slice(0, 5)
      .map((r) => `--- ${r.path} ---\n${r.content}`)
      .join('\n\n') || `No results found for "${query}"`
  );
}

function searchDir(dir, query, fileType, results) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry) || entry.startsWith('.env')) continue;

    const full = resolve(dir, entry);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      searchDir(full, query, fileType, results);
      continue;
    }

    const ext = extname(entry).slice(1);
    if (fileType && ext !== fileType) continue;
    if (!TEXT_EXTENSIONS.has(ext)) continue;

    const relPath = relative(ROOT, full);
    const queryLower = query.toLowerCase();

    // Match on filename
    if (relPath.toLowerCase().includes(queryLower) || entry.toLowerCase().includes(queryLower)) {
      const content = safeRead(full);
      if (content) results.push({ path: relPath, content: content.substring(0, 2000) });
      continue;
    }

    // Content search (only for files under 50KB)
    if (stat.size < 50000) {
      const content = safeRead(full);
      if (content && content.toLowerCase().includes(queryLower)) {
        results.push({ path: relPath, content: content.substring(0, 2000) });
      }
    }
  }
}

function safeRead(path) {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

const LANG_MAP = {
  js: 'javascript',
  ts: 'typescript',
  svelte: 'svelte',
  css: 'css',
  json: 'json',
  md: 'markdown',
  html: 'html',
  sh: 'bash',
  py: 'python',
};

export function readSourceFile(filePath) {
  // Prevent path traversal
  const normalized = filePath.replace(/\\/g, '/').replace(/\.\.\//g, '');
  const full = resolve(ROOT, normalized);

  if (!full.startsWith(ROOT)) {
    return `Error: Path "${filePath}" is outside the project root.`;
  }

  const content = safeRead(full);
  if (!content) {
    return `Error: File "${filePath}" not found or unreadable.`;
  }

  const ext = extname(full).slice(1);
  const language = LANG_MAP[ext] || ext || 'text';

  return `--- ${normalized} [${language}] ---\n${content}`;
}
