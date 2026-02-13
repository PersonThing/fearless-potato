<script>
  import SlideRenderer from './SlideRenderer.svelte';
  import { deck } from '../lib/state/slides.svelte.js';

  let { direction = 0 } = $props();
  let slideKey = $derived(deck.currentSlide?.id ?? 'empty');
</script>

<div class="viewer">
  {#if deck.currentSlide}
    {#key slideKey}
      <div
        class="slide-container"
        class:enter-right={direction > 0}
        class:enter-left={direction < 0}
      >
        <SlideRenderer slide={deck.currentSlide} />
      </div>
    {/key}
  {/if}
</div>

<style>
  .viewer {
    width: 100%;
    max-width: var(--slide-max-width);
    aspect-ratio: var(--slide-aspect);
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .slide-container {
    position: absolute;
    inset: 0;
    animation: scaleIn var(--duration-slow) var(--ease-out-expo) forwards;
  }

  .slide-container.enter-right {
    animation: slideInFromRight var(--duration-slow) var(--ease-out-expo) forwards;
  }

  .slide-container.enter-left {
    animation: slideInFromLeft var(--duration-slow) var(--ease-out-expo) forwards;
  }
</style>
