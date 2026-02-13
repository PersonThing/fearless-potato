<script>
  import { parseInlineMarkup } from '../../lib/utils/inline-markup.js';

  let { block } = $props();

  let html = $derived(parseInlineMarkup(block.text));

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

<blockquote
  class="quote-block"
  style:border-left-color={colorVar[block.color || 'accent']}
>
  <p class="quote-text">{@html html}</p>
  {#if block.attribution}
    <cite class="attribution">— {block.attribution}</cite>
  {/if}
</blockquote>

<style>
  .quote-block {
    border-left: 4px solid var(--color-accent);
    padding: 1rem 0 1rem 1.5rem;
    margin: 1rem 0;
  }

  .quote-text {
    font-family: var(--font-body);
    font-size: 1.6rem;
    font-style: italic;
    line-height: 1.5;
    color: var(--color-text-primary);
    margin: 0;
  }

  .quote-text :global(strong) {
    font-weight: 600;
  }

  .quote-text :global(code) {
    font-family: var(--font-mono);
    background: var(--color-bg-surface);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.85em;
    font-style: normal;
  }

  .quote-text :global(.theme-accent) { color: var(--color-accent); }
  .quote-text :global(.theme-electric) { color: var(--color-electric); }
  .quote-text :global(.theme-potato) { color: var(--color-potato); }
  .quote-text :global(.theme-success) { color: var(--color-success); }
  .quote-text :global(.theme-primary) { color: var(--color-text-primary); }
  .quote-text :global(.theme-secondary) { color: var(--color-text-secondary); }
  .quote-text :global(.theme-muted) { color: var(--color-text-muted); }

  .quote-text :global(a) {
    color: var(--color-electric);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  .quote-text :global(a:hover) {
    color: var(--color-accent);
  }

  .attribution {
    display: block;
    margin-top: 0.75rem;
    font-family: var(--font-body);
    font-size: 1rem;
    font-style: normal;
    color: var(--color-text-muted);
  }
</style>
