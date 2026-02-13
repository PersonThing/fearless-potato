<script>
  import { parseInlineMarkup } from '../../lib/utils/inline-markup.js';

  let { block } = $props();

  let html = $derived(parseInlineMarkup(block.content));

  const sizeMap = { sm: '1rem', md: '1.4rem', lg: '1.8rem' };
  const colorVar = {
    accent: 'var(--color-accent)',
    electric: 'var(--color-electric)',
    potato: 'var(--color-potato)',
    success: 'var(--color-success)',
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
  };
</script>

<p
  class="text-block"
  style:font-size={sizeMap[block.size || 'md']}
  style:color={block.color ? colorVar[block.color] : undefined}
>
  {@html html}
</p>

<style>
  .text-block {
    font-family: var(--font-body);
    line-height: 1.6;
    margin: 0 0 1rem 0;
    color: var(--color-text-secondary);
  }

  .text-block :global(strong) {
    color: var(--color-text-primary);
    font-weight: 600;
  }

  .text-block :global(code) {
    font-family: var(--font-mono);
    background: var(--color-bg-surface);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .text-block :global(.theme-accent) { color: var(--color-accent); }
  .text-block :global(.theme-electric) { color: var(--color-electric); }
  .text-block :global(.theme-potato) { color: var(--color-potato); }
  .text-block :global(.theme-success) { color: var(--color-success); }
  .text-block :global(.theme-primary) { color: var(--color-text-primary); }
  .text-block :global(.theme-secondary) { color: var(--color-text-secondary); }
  .text-block :global(.theme-muted) { color: var(--color-text-muted); }

  .text-block :global(a) {
    color: var(--color-electric);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  .text-block :global(a:hover) {
    color: var(--color-accent);
  }
</style>
