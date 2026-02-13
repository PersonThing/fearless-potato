<script>
  let { block } = $props();
  let codeEl = $state(null);
  let copied = $state(false);

  $effect(() => {
    block.code;
    if (codeEl && window.hljs) {
      requestAnimationFrame(() => {
        if (!codeEl.dataset.highlighted) {
          window.hljs.highlightElement(codeEl);
        }
      });
    }
  });

  let lines = $derived(block.code.split('\n'));
  let highlightSet = $derived(new Set(block.highlight || []));

  async function copyCode() {
    await navigator.clipboard.writeText(block.code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="code-block">
  {#if block.filename}
    <div class="filename-bar">
      <span class="filename">{block.filename}</span>
      <span class="lang-badge">{block.language}</span>
    </div>
  {/if}
  <button class="copy-btn" onclick={copyCode} aria-label="Copy code">
    {#if copied}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    {:else}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
    {/if}
  </button>
  <pre class:has-filename={!!block.filename}><code
    bind:this={codeEl}
    class="language-{block.language}"
  >{block.code}</code></pre>
  {#if block.highlight?.length}
    <div class="line-highlights" aria-hidden="true">
      {#each lines as _, i}
        {#if highlightSet.has(i + 1)}
          <div class="highlight-line" style:top="{i * 1.5}rem" style:height="1.5rem"></div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .code-block {
    position: relative;
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-bg-surface);
  }

  .filename-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: var(--color-bg-surface);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .filename {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  .lang-badge {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  .copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: all var(--duration-fast) ease;
    opacity: 0;
  }

  .code-block:hover .copy-btn {
    opacity: 1;
  }

  .copy-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--color-text-secondary);
  }

  .code-block:has(.filename-bar) .copy-btn {
    top: calc(0.5rem + 2.1rem);
  }

  pre {
    background: var(--color-bg-deep);
    padding: 1.5rem;
    overflow-x: auto;
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
  }

  pre.has-filename {
    border-radius: 0;
  }

  pre code {
    font-family: var(--font-mono);
    background: none;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
  }

  .line-highlights {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    padding-top: 1.5rem;
  }

  .code-block:has(.filename-bar) .line-highlights {
    padding-top: calc(1.5rem + 2.1rem);
  }

  .highlight-line {
    position: absolute;
    left: 0;
    right: 0;
    background: rgba(249, 115, 22, 0.08);
    border-left: 3px solid var(--color-accent);
  }
</style>
