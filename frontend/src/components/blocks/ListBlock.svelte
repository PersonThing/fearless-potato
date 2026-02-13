<script>
  import { parseInlineMarkup } from '../../lib/utils/inline-markup.js';

  let { block } = $props();
</script>

{#if block.style === 'icon'}
  <div class="icon-list">
    {#each block.items as item}
      <div class="icon-item">
        {#if item.icon}
          <span class="icon">{item.icon}</span>
        {/if}
        <span class="item-text">{@html parseInlineMarkup(item.text)}</span>
      </div>
    {/each}
  </div>
{:else if block.style === 'numbered'}
  <ol class="list">
    {#each block.items as item}
      <li>{@html parseInlineMarkup(item.text)}</li>
    {/each}
  </ol>
{:else}
  <ul class="list">
    {#each block.items as item}
      <li>{@html parseInlineMarkup(item.text)}</li>
    {/each}
  </ul>
{/if}

<style>
  .list {
    font-family: var(--font-body);
    font-size: 1.3rem;
    line-height: 1.8;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
    color: var(--color-text-secondary);
  }

  .list li {
    margin-bottom: 0.25rem;
  }

  .list :global(strong) {
    color: var(--color-text-primary);
    font-weight: 600;
  }

  .list :global(code) {
    font-family: var(--font-mono);
    background: var(--color-bg-surface);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.85em;
  }

  .list :global(.theme-accent) { color: var(--color-accent); }
  .list :global(.theme-electric) { color: var(--color-electric); }
  .list :global(.theme-potato) { color: var(--color-potato); }
  .list :global(.theme-success) { color: var(--color-success); }
  .list :global(.theme-primary) { color: var(--color-text-primary); }
  .list :global(.theme-secondary) { color: var(--color-text-secondary); }
  .list :global(.theme-muted) { color: var(--color-text-muted); }

  .list :global(a) {
    color: var(--color-electric);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  .list :global(a:hover) {
    color: var(--color-accent);
  }

  .icon-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 0.5rem 0;
  }

  .icon-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-family: var(--font-body);
    font-size: 1.3rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  .icon {
    flex-shrink: 0;
    font-size: 1.4rem;
    line-height: 1.6;
  }

  .item-text :global(strong) {
    color: var(--color-text-primary);
    font-weight: 600;
  }

  .item-text :global(code) {
    font-family: var(--font-mono);
    background: var(--color-bg-surface);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.85em;
  }

  .item-text :global(.theme-accent) { color: var(--color-accent); }
  .item-text :global(.theme-electric) { color: var(--color-electric); }
  .item-text :global(.theme-potato) { color: var(--color-potato); }
  .item-text :global(.theme-success) { color: var(--color-success); }
  .item-text :global(.theme-primary) { color: var(--color-text-primary); }
  .item-text :global(.theme-secondary) { color: var(--color-text-secondary); }
  .item-text :global(.theme-muted) { color: var(--color-text-muted); }

  .item-text :global(a) {
    color: var(--color-electric);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  .item-text :global(a:hover) {
    color: var(--color-accent);
  }
</style>
