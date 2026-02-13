<script>
  import HeadingBlock from './blocks/HeadingBlock.svelte';
  import TextBlock from './blocks/TextBlock.svelte';
  import ListBlock from './blocks/ListBlock.svelte';
  import CodeBlock from './blocks/CodeBlock.svelte';
  import ImageBlock from './blocks/ImageBlock.svelte';
  import QuoteBlock from './blocks/QuoteBlock.svelte';
  import SpacerBlock from './blocks/SpacerBlock.svelte';

  let { slide } = $props();

  const BLOCK_COMPONENTS = {
    heading: HeadingBlock,
    text: TextBlock,
    list: ListBlock,
    code: CodeBlock,
    image: ImageBlock,
    quote: QuoteBlock,
    spacer: SpacerBlock,
  };

  let isLegacy = $derived(!!slide.html && !slide.blocks);

  let leftBlocks = $derived(
    slide.layout === 'two-column'
      ? (slide.blocks || []).filter((b) => (b.column ?? 1) === 1)
      : slide.blocks || [],
  );

  let rightBlocks = $derived(
    slide.layout === 'two-column'
      ? (slide.blocks || []).filter((b) => b.column === 2)
      : [],
  );

  const bgClass = {
    default: 'bg-default',
    subtle: 'bg-subtle',
    accent: 'bg-accent',
    dark: 'bg-dark',
  };

  let frameEl = $state(null);

  // Legacy highlight.js support for old-format slides
  $effect(() => {
    if (isLegacy) {
      slide.html;
      if (frameEl && window.hljs) {
        requestAnimationFrame(() => {
          frameEl.querySelectorAll('pre code').forEach((block) => {
            if (!block.dataset.highlighted) {
              window.hljs.highlightElement(block);
            }
          });
        });
      }
    }
  });
</script>

<div
  class="slide-frame {bgClass[slide.background || 'default']}"
  bind:this={frameEl}
>
  {#if isLegacy}
    <!-- Legacy HTML/CSS slides -->
    <div class="slide-content">
      {@html slide.html}
    </div>
    {#if slide.css}
      {@html `<style>${slide.css}</style>`}
    {/if}
  {:else if slide.layout === 'two-column'}
    <div class="slide-content layout-two-column">
      <div class="column column-left">
        {#each leftBlocks as block (block)}
          {#if BLOCK_COMPONENTS[block.type]}
            {@const Component = BLOCK_COMPONENTS[block.type]}<Component {block} />
          {/if}
        {/each}
      </div>
      <div class="column column-right">
        {#each rightBlocks as block (block)}
          {#if BLOCK_COMPONENTS[block.type]}
            {@const Component = BLOCK_COMPONENTS[block.type]}<Component {block} />
          {/if}
        {/each}
      </div>
    </div>
  {:else}
    <div
      class="slide-content"
      class:layout-center={slide.layout === 'center'}
      class:layout-section={slide.layout === 'section'}
    >
      {#each slide.blocks || [] as block (block)}
        {#if BLOCK_COMPONENTS[block.type]}
          {@const Component = BLOCK_COMPONENTS[block.type]}<Component {block} />
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .slide-frame {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
  }

  .slide-frame::-webkit-scrollbar {
    width: 6px;
  }

  .slide-frame::-webkit-scrollbar-track {
    background: transparent;
  }

  .slide-frame::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }

  .slide-frame::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  /* Backgrounds */
  .bg-default { background: var(--color-bg); }
  .bg-subtle { background: var(--color-bg-elevated); }
  .bg-accent { background: linear-gradient(135deg, var(--color-bg) 60%, rgba(249, 115, 22, 0.08)); }
  .bg-dark { background: var(--color-bg-deep); }

  /* Base slide content */
  .slide-content {
    font-family: var(--font-body);
    color: var(--color-text-primary);
    padding: 4rem 5rem;
    min-height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  /* Layout: center */
  .layout-center {
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  /* Layout: section (centered, larger scale) */
  .layout-section {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 6rem 8rem;
  }

  /* Layout: two-column */
  .layout-two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .column {
    display: flex;
    flex-direction: column;
  }
</style>
