/**
 * Parse lightweight inline markup into HTML.
 *
 * Supported syntax:
 *   `code`              → <code>code</code>
 *   {{color:text}}      → <span class="theme-color">text</span>
 *   **bold**            → <strong>bold</strong>
 *   *italic*            → <em>italic</em>
 *   [text](url)         → <a href="url">text</a>
 *
 * Text is HTML-escaped first to prevent injection.
 */
export function parseInlineMarkup(text) {
  if (!text) return '';

  // Escape HTML entities
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 1. Backtick code (process first to protect contents)
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 2. Theme color: {{color:text}}
  result = result.replace(
    /\{\{(accent|electric|potato|success|primary|secondary|muted):([^}]+)\}\}/g,
    '<span class="theme-$1">$2</span>',
  );

  // 3. Markdown links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // 4. Bold: **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 5. Italic: *text* (but not inside **)
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

  return result;
}
